import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  session_id: z.string().min(4).max(64),
  full_name: z.string().max(100).optional().nullable(),
  phone: z.string().min(10).max(20),
  address: z.string().max(500).optional().nullable(),
  package_name: z.string().max(100).optional().nullable(),
  quantity: z.number().int().min(1).max(50).optional(),
  total_amount: z.number().int().min(0).max(1000000).optional(),
  device: z.string().max(16).optional(),
  converted: z.boolean().optional(),
});

export const Route = createFileRoute("/api/public/abandoned")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const d = schema.parse(await request.json());
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "error" },
            { status: 400 },
          );
        }
      },
    },
  },
});
