import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const TRACKED_EVENTS = new Set([
  "view_checkout",
  "begin_checkout",
  "checkout_submit",
  "order_pending",
  "checkout_validation_error",
  "checkout_error",
  "purchase",
  "select_package",
  "cta_click",
]);

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  } as Record<string, string>;
}

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders() }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            event?: string;
            device?: string;
            session_id?: string;
            path?: string;
            props?: Record<string, unknown>;
          };
          const event = String(body.event ?? "").slice(0, 64);
          if (!TRACKED_EVENTS.has(event)) {
            return new Response(JSON.stringify({ ok: true, skipped: true }), {
              status: 200,
              headers: { "content-type": "application/json", ...corsHeaders() },
            });
          }
          const rawDevice = String(body.device ?? "unknown");
          const device = ["mobile", "tablet", "desktop"].includes(rawDevice)
            ? rawDevice
            : "unknown";

          const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
          const supabase = createClient<Database>(process.env.SUPABASE_URL!, key, {
            auth: { persistSession: false, autoRefreshToken: false },
            global: {
              fetch: (input, init) => {
                const h = new Headers(init?.headers);
                if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
                  h.delete("Authorization");
                }
                h.set("apikey", key);
                return fetch(input, { ...init, headers: h });
              },
            },
          });

          const { error } = await supabase.from("analytics_events").insert({
            event,
            device,
            session_id: body.session_id ? String(body.session_id).slice(0, 64) : null,
            path: body.path ? String(body.path).slice(0, 256) : null,
            props: (body.props ?? {}) as never,
          });
          if (error) throw error;
          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "content-type": "application/json", ...corsHeaders() },
          });
        } catch (e) {
          return new Response(
            JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "error" }),
            { status: 500, headers: { "content-type": "application/json", ...corsHeaders() } },
          );
        }
      },
    },
  },
});
