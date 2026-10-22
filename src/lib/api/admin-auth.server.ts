// Server-only admin authentication helpers.
// - Password stored as PBKDF2-SHA256 hash (WebCrypto, works on Cloudflare Workers)
// - Login returns a random session token; only its SHA-256 hash is stored
// - Failed logins are rate-limited per IP
import { getRequestHeader } from "@tanstack/react-start/server";

const ITERATIONS = 100_000;
const SESSION_DAYS = 7;
const MAX_FAILS = 5;
const FAIL_WINDOW_MIN = 15;
/** The old default password that was published in the code — never accepted. */
const BLOCKED_PASSWORDS = new Set(["dibedex2025"]);

const enc = new TextEncoder();

const toHex = (buf: ArrayBuffer | Uint8Array) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

const fromHex = (hex: string): Uint8Array<ArrayBuffer> =>
  new Uint8Array((hex.match(/.{2}/g) ?? []).map((h) => parseInt(h, 16)));

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256,
  );
  return toHex(bits);
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERATIONS}$${toHex(salt)}$${await pbkdf2(password, salt, ITERATIONS)}`;
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyHash(password: string, stored: string) {
  const [scheme, iter, saltHex, hashHex] = stored.split("$");
  if (scheme !== "pbkdf2" || !iter || !saltHex || !hashHex) return false;
  const got = await pbkdf2(password, fromHex(saltHex), Number(iter));
  return safeEqual(got, hashHex);
}

export async function sha256(text: string) {
  return toHex(await crypto.subtle.digest("SHA-256", enc.encode(text)));
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export function clientIp() {
  return (
    getRequestHeader("cf-connecting-ip") ||
    getRequestHeader("x-real-ip") ||
    (getRequestHeader("x-forwarded-for") ?? "").split(",")[0]?.trim() ||
    "unknown"
  );
}

export function isBlockedPassword(pw: string) {
  return BLOCKED_PASSWORDS.has(pw.trim().toLowerCase());
}

/** Checks the password; upgrades a legacy plain-text password to a hash on success. */
export async function checkPassword(password: string): Promise<boolean> {
  const db = await admin();
  const { data, error } = await db
    .from("admin_config")
    .select("admin_password, password_hash")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) throw new Error("Admin config unavailable");

  if (data.password_hash) return verifyHash(password, data.password_hash);

  const legacy = data.admin_password ?? "";
  if (!legacy || isBlockedPassword(legacy)) return false;
  if (!safeEqual(password, legacy)) return false;

  await db
    .from("admin_config")
    .update({ password_hash: await hashPassword(password), admin_password: "" })
    .eq("id", 1);
  return true;
}

export async function assertLoginAllowed(ip: string) {
  const db = await admin();
  const since = new Date(Date.now() - FAIL_WINDOW_MIN * 60_000).toISOString();
  const { count } = await db
    .from("admin_login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_FAILS) {
    throw new Error("অনেকবার ভুল পাসওয়ার্ড দেওয়া হয়েছে। ১৫ মিনিট পর আবার চেষ্টা করুন।");
  }
}

export async function recordFailedLogin(ip: string) {
  const db = await admin();
  await db.from("admin_login_attempts").insert({ ip });
}

export async function createSession() {
  const db = await admin();
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000).toISOString();
  const { error } = await db
    .from("admin_sessions")
    .insert({ token_hash: await sha256(token), expires_at: expires });
  if (error) throw new Error("Could not create session");
  // housekeeping
  await db.from("admin_sessions").delete().lt("expires_at", new Date().toISOString());
  return token;
}

export async function assertAdmin(token: string) {
  if (!token || token.length !== 64) throw new Error("Unauthorized");
  const db = await admin();
  const { data } = await db
    .from("admin_sessions")
    .select("expires_at")
    .eq("token_hash", await sha256(token))
    .maybeSingle();
  if (!data || new Date(data.expires_at).getTime() < Date.now()) throw new Error("Unauthorized");
}

export async function revokeAllSessions() {
  const db = await admin();
  await db.from("admin_sessions").delete().neq("token_hash", "");
}

export async function revokeSession(token: string) {
  const db = await admin();
  await db
    .from("admin_sessions")
    .delete()
    .eq("token_hash", await sha256(token));
}
