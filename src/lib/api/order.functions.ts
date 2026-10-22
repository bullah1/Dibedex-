import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { MAX_ITEM_QTY, quote } from "@/lib/catalog";

const RATE_WINDOW_MIN = 15;
const RATE_MAX_ORDERS = 3;

const OrderInput = z
  .object({
    full_name: z.string().trim().min(2).max(100),
    phone: z
      .string()
      .trim()
      .max(20)
      .transform((v) => v.replace(/[\s\-().]/g, "").replace(/^\+?88/, ""))
      .pipe(z.string().regex(/^01[3-9]\d{8}$/)),
    address: z.string().trim().min(5).max(500),
    order_note: z.string().trim().max(500).optional(),
    dibedex: z
      .object({
        package_id: z.enum(["p30", "p60", "p90"]),
        quantity: z.number().int().min(1).max(MAX_ITEM_QTY),
      })
      .nullable(),
    items: z
      .array(z.object({ slug: z.string().max(80), qty: z.number().int().min(1).max(MAX_ITEM_QTY) }))
      .max(40),
    // Honeypot — real visitors never fill this.
    website: z.string().max(200).optional(),
  })
  .refine((d) => d.dibedex || d.items.length > 0, "Empty order");

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => OrderInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Delivery charge always comes from the database, never from the browser.
    const { data: settings } = await supabaseAdmin
      .from("settings")
      .select("delivery_charge")
      .eq("id", 1)
      .maybeSingle();
    const deliveryCharge = settings?.delivery_charge ?? 80;

    const q = quote(data.dibedex, data.items, deliveryCharge);
    if (q.lines.length === 0) throw new Error("EMPTY_ORDER");

    // Bot filled the hidden field → pretend success, save nothing.
    if (data.website) return { ok: true as const, total: q.total };

    const since = new Date(Date.now() - RATE_WINDOW_MIN * 60_000).toISOString();
    const { count } = await supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("phone", data.phone)
      .gte("created_at", since);
    if ((count ?? 0) >= RATE_MAX_ORDERS) throw new Error("RATE_LIMITED");

    const items = q.lines.map((l) => ({
      key: l.key,
      name: l.name,
      detail: l.detail,
      qty: l.qty,
      unit_price: l.unit,
      total: l.total,
    }));
    const onlyDibedex = q.lines.length === 1 && q.lines[0]!.key.startsWith("dibedex-");
    const productName = onlyDibedex
      ? `Dibedex 500 mg — ${q.lines[0]!.detail}`
      : q.lines.map((l) => `${l.name} (${l.detail}) ×${l.qty}`).join(", ");

    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .insert({
        full_name: data.full_name,
        phone: data.phone,
        district: "N/A",
        address: data.address,
        quantity: q.units,
        payment_method: "cod",
        order_note: data.order_note || null,
        product_name: productName.slice(0, 500),
        product_price: onlyDibedex ? q.lines[0]!.unit : q.subtotal,
        delivery_charge: q.delivery,
        total_amount: q.total,
        items,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[placeOrder]", error.message);
      throw new Error("ORDER_FAILED");
    }
    return { ok: true as const, id: row.id, total: q.total };
  });
