import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Auth helpers live in a .server.ts file so they never ship to the browser.
async function assertAdmin(token: string) {
  const { assertAdmin: check } = await import("./admin-auth.server");
  await check(token);
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    const auth = await import("./admin-auth.server");
    const ip = auth.clientIp();
    await auth.assertLoginAllowed(ip);
    const ok = await auth.checkPassword(data.password);
    if (!ok) {
      await auth.recordFailedLogin(ip);
      throw new Error("Invalid password");
    }
    return { token: await auth.createSession() };
  });

export const adminLogout = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string().max(200) }))
  .handler(async ({ data }) => {
    const { revokeSession } = await import("./admin-auth.server");
    await revokeSession(data.token);
    return { ok: true };
  });

export const adminListOrders = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), limit: z.number().int().min(1).max(5000).optional() }))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 500);
    if (error) throw new Error(error.message);
    return { orders: orders ?? [] };
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      id: z.string().uuid(),
      status: z.enum(["pending", "confirmed", "delivered", "cancelled"]),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    // Auto-push to Steadfast when order is confirmed (only once)
    let courier: { ok: boolean; consignment_id?: string; tracking_code?: string; error?: string } | null = null;
    if (data.status === "confirmed") {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("id, full_name, phone, address, district, total_amount, order_note, consignment_id")
        .eq("id", data.id)
        .maybeSingle();
      if (order && !order.consignment_id) {
        try {
          const { steadfastCreateOrder, normalizeBdPhone } = await import("./steadfast.server");
          const address = [order.address, order.district].filter((s) => s && s !== "N/A").join(", ");
          const resp = await steadfastCreateOrder({
            invoice: `DBX-${String(order.id).slice(0, 8).toUpperCase()}`,
            recipient_name: order.full_name,
            recipient_phone: normalizeBdPhone(order.phone),
            recipient_address: address || order.address,
            cod_amount: Number(order.total_amount) || 0,
            note: order.order_note || undefined,
          });
          const cid = String(resp.consignment.consignment_id);
          const tcode = resp.consignment.tracking_code;
          await supabaseAdmin
            .from("orders")
            .update({
              consignment_id: cid,
              tracking_code: tcode,
              courier_status: resp.consignment.status,
              courier_pushed_at: new Date().toISOString(),
              courier_error: null,
            })
            .eq("id", data.id);
          courier = { ok: true, consignment_id: cid, tracking_code: tcode };
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Unknown error";
          await supabaseAdmin
            .from("orders")
            .update({ courier_error: msg })
            .eq("id", data.id);
          courier = { ok: false, error: msg };
        }
      } else if (order?.consignment_id) {
        courier = { ok: true, consignment_id: order.consignment_id };
      }
    }
    return { ok: true, courier };
  });

export const adminPushToCourier = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, full_name, phone, address, district, total_amount, order_note, consignment_id")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Order not found");
    if (order.consignment_id) {
      return { ok: true, consignment_id: order.consignment_id, already: true };
    }
    const { steadfastCreateOrder, normalizeBdPhone } = await import("./steadfast.server");
    const address = [order.address, order.district].filter((s) => s && s !== "N/A").join(", ");
    try {
      const resp = await steadfastCreateOrder({
        invoice: `DBX-${String(order.id).slice(0, 8).toUpperCase()}`,
        recipient_name: order.full_name,
        recipient_phone: normalizeBdPhone(order.phone),
        recipient_address: address || order.address,
        cod_amount: Number(order.total_amount) || 0,
        note: order.order_note || undefined,
      });
      const cid = String(resp.consignment.consignment_id);
      await supabaseAdmin
        .from("orders")
        .update({
          consignment_id: cid,
          tracking_code: resp.consignment.tracking_code,
          courier_status: resp.consignment.status,
          courier_pushed_at: new Date().toISOString(),
          courier_error: null,
        })
        .eq("id", data.id);
      return { ok: true, consignment_id: cid, tracking_code: resp.consignment.tracking_code };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      await supabaseAdmin.from("orders").update({ courier_error: msg }).eq("id", data.id);
      throw new Error(msg);
    }
  });


export const adminUpdateSettings = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      product_price: z.number().int().min(0).max(1_000_000),
      delivery_charge: z.number().int().min(0).max(100_000),
      whatsapp_number: z.string().min(6).max(30),
      call_number: z.string().min(6).max(30),
      disclaimer_text: z.string().min(1).max(2000),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("settings")
      .update({
        product_price: data.product_price,
        delivery_charge: data.delivery_charge,
        whatsapp_number: data.whatsapp_number,
        call_number: data.call_number,
        disclaimer_text: data.disclaimer_text,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateStats = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      happy_customers: z.number().int().min(0).max(10_000_000),
      delivered_orders: z.number().int().min(0).max(10_000_000),
      avg_rating: z.number().min(0).max(5),
      urgency_text: z.string().min(1).max(300),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("stats")
      .update({
        happy_customers: data.happy_customers,
        delivered_orders: data.delivered_orders,
        avg_rating: data.avg_rating,
        urgency_text: data.urgency_text,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListTestimonials = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { testimonials: rows ?? [] };
  });

export const adminCreateTestimonial = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      name: z.string().trim().min(1).max(100),
      location: z.string().trim().max(100).optional(),
      rating: z.number().int().min(1).max(5),
      text: z.string().trim().min(1).max(1000),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("testimonials").insert({
      name: data.name,
      location: data.location || null,
      rating: data.rating,
      text: data.text,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateTestimonial = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      id: z.string().uuid(),
      is_active: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("testimonials")
      .update({ is_active: data.is_active })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteTestimonial = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminChangePassword = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      currentPassword: z.string().min(1).max(200),
      newPassword: z.string().min(8).max(200),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const auth = await import("./admin-auth.server");
    if (!(await auth.checkPassword(data.currentPassword))) {
      throw new Error("Current password ভুল");
    }
    if (auth.isBlockedPassword(data.newPassword)) {
      throw new Error("এই পাসওয়ার্ড ব্যবহার করা যাবে না");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("admin_config")
      .update({
        password_hash: await auth.hashPassword(data.newPassword),
        admin_password: "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    // Log out every other device, then start a fresh session here.
    await auth.revokeAllSessions();
    return { ok: true, token: await auth.createSession() };
  });

export const adminFunnelReport = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      days: z.number().int().min(1).max(90).default(14),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();
    const FUNNEL = ["view_checkout", "begin_checkout", "checkout_submit"] as const;

    const { data: rows, error } = await supabaseAdmin
      .from("analytics_events")
      .select("event, device, session_id, created_at")
      .in("event", FUNNEL as unknown as string[])
      .gte("created_at", since);
    if (error) throw new Error(error.message);

    type Bucket = Record<(typeof FUNNEL)[number], Set<string>>;
    const mkBucket = (): Bucket => ({
      view_checkout: new Set(),
      begin_checkout: new Set(),
      checkout_submit: new Set(),
    });

    const byDate = new Map<string, Bucket>();
    const byDevice = new Map<string, Bucket>();
    const overall = mkBucket();

    for (const r of rows ?? []) {
      const ev = r.event as (typeof FUNNEL)[number];
      if (!FUNNEL.includes(ev)) continue;
      const sid = r.session_id ?? `row:${r.created_at}`;
      const date = String(r.created_at).slice(0, 10);
      const device = r.device ?? "unknown";

      if (!byDate.has(date)) byDate.set(date, mkBucket());
      if (!byDevice.has(device)) byDevice.set(device, mkBucket());

      byDate.get(date)![ev].add(sid);
      byDevice.get(device)![ev].add(sid);
      overall[ev].add(sid);
    }

    const toRow = (label: string, b: Bucket) => {
      const view = b.view_checkout.size;
      const begin = b.begin_checkout.size;
      const submit = b.checkout_submit.size;
      const pct = (n: number, d: number) => (d > 0 ? +((n / d) * 100).toFixed(1) : 0);
      return {
        label,
        view_checkout: view,
        begin_checkout: begin,
        checkout_submit: submit,
        view_to_begin_pct: pct(begin, view),
        begin_to_submit_pct: pct(submit, begin),
        view_to_submit_pct: pct(submit, view),
        drop_view_to_begin_pct: view > 0 ? +(100 - pct(begin, view)).toFixed(1) : 0,
        drop_begin_to_submit_pct: begin > 0 ? +(100 - pct(submit, begin)).toFixed(1) : 0,
      };
    };

    return {
      overall: toRow("Overall", overall),
      byDate: [...byDate.entries()]
        .sort(([a], [b]) => (a < b ? 1 : -1))
        .map(([d, b]) => toRow(d, b)),
      byDevice: [...byDevice.entries()]
        .sort(([, a], [, b]) => b.view_checkout.size - a.view_checkout.size)
        .map(([d, b]) => toRow(d, b)),
    };
  });

export const adminListAbandoned = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("abandoned_checkouts")
      .select("*")
      .eq("converted", false)
      .order("updated_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const adminUpdateAbandoned = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      id: z.string().uuid(),
      status: z.enum(["abandoned", "contacted", "not_interested"]),
    }),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("abandoned_checkouts")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
