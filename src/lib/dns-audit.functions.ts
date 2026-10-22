import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EXPECTED_A = "185.158.133.1";
const EXPECTED_TXT_PREFIX = "lovable_verify=";

type DohAnswer = { name: string; type: number; TTL: number; data: string };
type DohResponse = { Status: number; Answer?: DohAnswer[]; Comment?: string };

async function doh(name: string, type: "A" | "TXT" | "CNAME"): Promise<DohResponse> {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`;
  const res = await fetch(url, { headers: { accept: "application/dns-json" } });
  if (!res.ok) throw new Error(`DoH ${type} ${name} failed: ${res.status}`);
  return (await res.json()) as DohResponse;
}

export type DnsCheck = {
  label: string;
  host: string;
  type: "A" | "TXT" | "CNAME";
  expected: string;
  found: string[];
  status: "pass" | "fail" | "warn";
  message: string;
};

export type DnsAuditResult = {
  domain: string;
  checkedAt: string;
  overall: "pass" | "fail" | "warn";
  checks: DnsCheck[];
};

export const runDnsAudit = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ domain: z.string().min(3).max(253) }).parse(data),
  )
  .handler(async ({ data }): Promise<DnsAuditResult> => {
    const domain = data.domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const wwwHost = `www.${domain}`;
    const txtHost = `_lovable.${domain}`;

    const [rootA, wwwA, wwwCname, txt] = await Promise.all([
      doh(domain, "A").catch((e) => ({ Status: -1, Comment: String(e) }) as DohResponse),
      doh(wwwHost, "A").catch((e) => ({ Status: -1, Comment: String(e) }) as DohResponse),
      doh(wwwHost, "CNAME").catch((e) => ({ Status: -1, Comment: String(e) }) as DohResponse),
      doh(txtHost, "TXT").catch((e) => ({ Status: -1, Comment: String(e) }) as DohResponse),
    ]);

    const aValues = (r: DohResponse) => (r.Answer ?? []).filter((a) => a.type === 1).map((a) => a.data);
    const cnameValues = (r: DohResponse) => (r.Answer ?? []).filter((a) => a.type === 5).map((a) => a.data);
    const txtValues = (r: DohResponse) =>
      (r.Answer ?? []).filter((a) => a.type === 16).map((a) => a.data.replace(/^"|"$/g, "").replace(/""/g, ""));

    const rootIps = aValues(rootA);
    const wwwIps = aValues(wwwA);
    const wwwCnames = cnameValues(wwwCname);
    const txts = txtValues(txt);

    const rootCheck: DnsCheck = {
      label: "Root domain A record",
      host: domain,
      type: "A",
      expected: EXPECTED_A,
      found: rootIps,
      status: rootIps.includes(EXPECTED_A)
        ? rootIps.length === 1 ? "pass" : "warn"
        : rootIps.length === 0 ? "fail" : "fail",
      message: rootIps.length === 0
        ? "কোনো A record পাওয়া যায়নি। রেজিস্ট্রারে A @ → 185.158.133.1 যোগ করুন।"
        : rootIps.includes(EXPECTED_A)
          ? rootIps.length === 1
            ? "সঠিকভাবে Lovable-এ point করছে।"
            : `Lovable IP পাওয়া গেছে, তবে অন্য IP-ও আছে (${rootIps.filter(i => i !== EXPECTED_A).join(", ")}) — সেগুলো মুছে ফেলুন।`
          : `ভুল IP-তে point করছে (${rootIps.join(", ")}). Lovable IP 185.158.133.1 হওয়া দরকার।`,
    };

    const wwwHasCorrectA = wwwIps.includes(EXPECTED_A);
    const wwwHasCname = wwwCnames.length > 0;
    const wwwCheck: DnsCheck = {
      label: "www subdomain",
      host: wwwHost,
      type: wwwHasCname && !wwwHasCorrectA ? "CNAME" : "A",
      expected: EXPECTED_A,
      found: wwwHasCname && !wwwHasCorrectA ? wwwCnames : wwwIps,
      status: wwwHasCorrectA
        ? wwwIps.length === 1 ? "pass" : "warn"
        : wwwHasCname ? "warn"
        : wwwIps.length === 0 ? "fail" : "fail",
      message: wwwHasCorrectA
        ? wwwIps.length === 1
          ? "www সঠিকভাবে Lovable-এ point করছে।"
          : `www Lovable IP-তে যাচ্ছে, তবে অতিরিক্ত IP আছে (${wwwIps.filter(i => i !== EXPECTED_A).join(", ")})।`
        : wwwHasCname
          ? `www একটি CNAME (${wwwCnames.join(", ")}) হিসেবে সেট আছে — Lovable-এর জন্য A record www → 185.158.133.1 প্রয়োজন (proxy mode হলে alternative CNAME setup ব্যবহার করুন)।`
          : wwwIps.length === 0
            ? "www-এর জন্য কোনো record নেই। A www → 185.158.133.1 যোগ করুন।"
            : `www ভুল IP-তে (${wwwIps.join(", ")})।`,
    };

    const matchingTxt = txts.find((t) => t.startsWith(EXPECTED_TXT_PREFIX));
    const txtCheck: DnsCheck = {
      label: "Lovable verification TXT",
      host: txtHost,
      type: "TXT",
      expected: "lovable_verify=…",
      found: txts,
      status: matchingTxt ? "pass" : txts.length === 0 ? "fail" : "fail",
      message: matchingTxt
        ? `Verification TXT পাওয়া গেছে (${matchingTxt}).`
        : txts.length === 0
          ? "_lovable TXT record পাওয়া যায়নি। Lovable dashboard-এ যে value দেখানো হয়েছে সেটি TXT _lovable → lovable_verify=… হিসেবে যোগ করুন।"
          : `TXT আছে, তবে কোনোটা lovable_verify= দিয়ে শুরু হয়নি: ${txts.join(" | ")}`,
    };

    const checks = [rootCheck, wwwCheck, txtCheck];
    const overall: "pass" | "fail" | "warn" = checks.some((c) => c.status === "fail")
      ? "fail"
      : checks.some((c) => c.status === "warn")
        ? "warn"
        : "pass";

    return {
      domain,
      checkedAt: new Date().toISOString(),
      overall,
      checks,
    };
  });
