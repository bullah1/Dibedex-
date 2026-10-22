import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  session_id: z.string().regex(/^[a-z0-9-]{8,64}$/i),
  full_name: z.string().max(100).optional().nullable(),
  phone: z
    .string()
    .max(20)
    .transform((v) => v.replace(/[\s\-().]/g, "").replace(/^\+?88/, ""))
    .pipe(z.string().regex(/^01[3-9]\d{8}$/)),
  address: z.string().max(500).optional().nullable(),
  package_name: z.string().max(300).optional().nullable(),
  quantity: z.number().int().min(1).max(50).optional(),
  total_amount: z.number().int().min(0).max(1000000).optional(),
  device: z.enum(["mobile", "tablet", "desktop", "unknown"]).optional(),
  converted: z.boolean().optional(),
});

const MAX_BODY = 4000;

export const Route = createFileRoute("/api/public/abandoned")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const text = await request.text();
          if (text.length > MAX_BODY) return Response.json({ ok: false }, { status: 413 });
          const d = schema.parse(JSON.parse(text));
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Never let anyone overwrite a lead that already became an order,
          // or a lead that belongs to a different phone number.
          const { data: existing } = await supabaseAdmin
            .from("abandoned_checkouts")
            .select("phone, converted")
            .eq("session_id", d.session_id)
            .maybeSingle();
          if (existing && (existing.converted || existing.phone !== d.phone)) {
            return Response.json({ ok: true });
          }

          const row: Record<string, unknown> = {
            session_id: d.session_id,
            phone: d.phone,
            full_name: d.full_name ?? null,
            address: d.address ?? null,
            package_name: d.package_name ?? null,
            quantity: d.quantity ?? 1,
            total_amount: d.total_amount ?? null,
            device: d.device ?? null,
            updated_at: new Date().toISOString(),
          };
          if (d.converted) {
            row.converted = true;
            row.status = "converted";
          }
          const { error } = await supabaseAdmin
            .from("abandoned_checkouts")
            .upsert(row as never, { onConflict: "session_id" });
          if (error) throw error;
          return Response.json({ ok: true });
        } catch {
          return Response.json({ ok: false }, { status: 400 });
        }
      },
    },
  },
});
