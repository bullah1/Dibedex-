import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  ShoppingBag,
  MessageCircle,
  Check,
  Crown,
  Minus,
  Plus,
  Star,
  ShieldCheck,
  Truck,
  BadgeCheck,
  User,
  Phone as PhoneIcon,
  MapPin,
  StickyNote,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { buildWhatsAppLink, type SiteSettings } from "@/lib/site";
import {
  PACKAGES,
  DEFAULT_PACKAGE_ID,
  getPackage,
  selectPackage,
  useSelectedPackage,
  type PackageId,
} from "@/lib/packages";
import { track } from "@/lib/analytics";
import { setCheckoutSubmitting } from "@/lib/checkout-state";

const SANS_PREMIUM =
  "'Inter','Hind Siliguri','Noto Sans Bengali',system-ui,sans-serif";

const schema = z.object({
  full_name: z.string().trim().min(2, "নাম লিখুন").max(100),
  phone: z
    .string()
    .trim()
    .min(6, "সঠিক মোবাইল নম্বর দিন")
    .max(20, "নম্বরটি দীর্ঘ হয়ে গেছে")
    .transform((v) => v.replace(/[\s\-().]/g, ""))
    .refine(
      (v) =>
        /^(?:\+?8801|01)[0-9]{9}$/.test(v),
      "১১ ডিজিট মোবাইল নম্বর দিন (যেমন 01XXXXXXXXX)",
    ),
  address: z.string().trim().min(5, "সম্পূর্ণ ঠিকানা লিখুন").max(500),
  package_id: z.enum(["p30", "p60", "p90"]),
  quantity: z.number().int().min(1).max(20),
  payment_method: z.enum(["cod", "bkash", "nagad"]),
  order_note: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutSection({
  settings,
  embedded = false,
}: {
  settings: SiteSettings;
  embedded?: boolean;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showPayOptions, setShowPayOptions] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [orderSummary, setOrderSummary] = useState<{
    packageName: string;
    qty: number;
    mrp: number;
    price: number;
    savings: number;
    delivery: number;
    total: number;
  } | null>(null);

  const { pkg: globalPkg } = useSelectedPackage();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 1,
      payment_method: "cod",
      package_id: DEFAULT_PACKAGE_ID,
    },
  });

  const qty = watch("quantity") || 1;
  const payment = watch("payment_method");
  const packageId = (watch("package_id") || DEFAULT_PACKAGE_ID) as PackageId;

  const selectedPackage = useMemo(() => getPackage(packageId), [packageId]);

  const beganRef = useRef(false);
  const viewedRef = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Fire view_checkout once when the checkout section enters the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || viewedRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !viewedRef.current) {
            viewedRef.current = true;
            track("view_checkout", {
              package_id: packageId,
              package_name: selectedPackage.name,
              unit_price: selectedPackage.price,
            });
            io.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markBegan = () => {
    if (beganRef.current) return;
    beganRef.current = true;
    track("begin_checkout", {
      package_id: packageId,
      package_name: selectedPackage.name,
      quantity: qty,
      unit_price: selectedPackage.price,
      currency: "BDT",
    });
  };

  useEffect(() => {
    if (globalPkg.id !== packageId) {
      setValue("package_id", globalPkg.id, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalPkg.id]);

  const handlePackageClick = (id: PackageId) => {
    setValue("package_id", id, { shouldValidate: true });
    selectPackage(id);
  };

  const setQty = (n: number) => {
    const clamped = Math.max(1, Math.min(20, n));
    const prev = qty;
    setValue("quantity", clamped, { shouldValidate: true });
    if (clamped !== prev) {
      track("change_quantity", {
        package_id: packageId,
        quantity: clamped,
        previous: prev,
        direction: clamped > prev ? "increase" : "decrease",
      });
    }
  };

  const unitPrice = selectedPackage.price;
  const mrpUnit = selectedPackage.mrp;
  const subtotal = qty * unitPrice;
  const mrpTotal = qty * mrpUnit;
  const savings = (mrpUnit - unitPrice) * qty;
  const total = subtotal + settings.delivery_charge;

  // Abandoned checkout capture: save lead once a valid phone is typed.
  const wName = watch("full_name");
  const wPhone = watch("phone");
  const wAddress = watch("address");
  const doneRef = useRef(false);
  useEffect(() => {
    const digits = (wPhone || "").replace(/\D/g, "");
    if (doneRef.current || digits.length < 11) return;
    const t = setTimeout(() => {
      sendAbandoned({
        full_name: wName || null,
        phone: wPhone,
        address: wAddress || null,
        package_name: selectedPackage.name,
        quantity: qty,
        total_amount: total,
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [wName, wPhone, wAddress, selectedPackage.name, qty, total]);

  const onSubmit = async (values: FormValues) => {
    if (submitting) return;
    setSubmitting(true);
    setCheckoutSubmitting(true);
    const submitStart = Date.now();
    track("checkout_submit", {
      package_id: values.package_id,
      package_name: selectedPackage.name,
      quantity: values.quantity,
      unit_price: unitPrice,
      subtotal,
      delivery: settings.delivery_charge,
      total,
      payment_method: values.payment_method,
      currency: "BDT",
    });
    try {
      const productName = `Dibedex 500 mg — ${selectedPackage.name}`;
      const { error } = await supabase.from("orders").insert({
        full_name: values.full_name,
        phone: values.phone,
        district: "N/A",
        address: values.address,
        quantity: values.quantity,
        payment_method: values.payment_method,
        order_note: values.order_note || null,
        product_name: productName,
        product_price: unitPrice,
        delivery_charge: settings.delivery_charge,
        total_amount: total,
      });
      if (error) throw error;
      doneRef.current = true;
      sendAbandoned({
        full_name: values.full_name,
        phone: values.phone,
        address: values.address,
        package_name: selectedPackage.name,
        quantity: values.quantity,
        total_amount: total,
        converted: true,
      });

      // Order created in DB with status="pending" — awaiting admin confirmation.
      track("order_pending", {
        package_id: packageId,
        package_name: selectedPackage.name,
        quantity: values.quantity,
        unit_price: unitPrice,
        subtotal,
        delivery: settings.delivery_charge,
        savings,
        total,
        currency: "BDT",
        payment_method: values.payment_method,
        latency_ms: Date.now() - submitStart,
      });

      // Standard e-commerce purchase event (COD intake).
      track("purchase", {
        package_id: packageId,
        package_name: selectedPackage.name,
        quantity: values.quantity,
        unit_price: unitPrice,
        subtotal,
        delivery: settings.delivery_charge,
        savings,
        total,
        currency: "BDT",
        payment_method: values.payment_method,
      });

      toast.success("অর্ডারটি গ্রহণ করা হয়েছে! আমরা শীঘ্রই কনফার্ম করব।");
      setOrderSummary({
        packageName: selectedPackage.name,
        qty: values.quantity,
        mrp: mrpTotal,
        price: subtotal,
        savings,
        delivery: settings.delivery_charge,
        total,
      });
      setDone(true);
      reset({ quantity: 1, payment_method: "cod", package_id: DEFAULT_PACKAGE_ID });

      const waMsg = `আমি Dibedex অর্ডার করতে চাই।\nপ্যাকেজ: ${selectedPackage.name}\nনাম: ${values.full_name}\nমোবাইল: ${values.phone}\nঠিকানা: ${values.address}\nপরিমাণ: ${values.quantity}\nমোট: ৳${total}`;
      window.open(buildWhatsAppLink(settings.whatsapp_number, waMsg), "_blank");
    } catch (err) {
      console.error(err);
      track("checkout_error", {
        package_id: packageId,
        message: err instanceof Error ? err.message : String(err),
        latency_ms: Date.now() - submitStart,
      });
      toast.error("দুঃখিত! অর্ডার সাবমিট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
      setCheckoutSubmitting(false);
    }
  };

  const onInvalid = (errs: Record<string, { message?: string } | undefined>) => {
    const fields = Object.keys(errs);
    track("checkout_validation_error", {
      fields,
      package_id: packageId,
    });

    // Make the failure visible: toast + scroll the first bad field into view
    // (the mobile sticky bar covers inline errors at the bottom of the form).
    const order = ["full_name", "phone", "address"] as const;
    const first = order.find((f) => fields.includes(f)) ?? (fields[0] as keyof FormValues | undefined);
    const message = (first && errs[first as string]?.message) || "অনুগ্রহ করে তথ্যগুলো পূরণ করুন";
    toast.error(message, { description: "নাম, মোবাইল নম্বর ও ঠিকানা দিতে হবে।" });

    if (first) {
      const el = document.querySelector<HTMLElement>(`[name="${first}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => {
          try {
            setFocus(first as keyof FormValues);
          } catch {
            el.focus?.();
          }
        }, 350);
      }
    }
  };

  if (done && orderSummary) {
    return (
      <section
        id={embedded ? undefined : "order"}
        className={
          embedded
            ? "px-1 py-6 font-['Inter',sans-serif]"
            : "section-pad font-['Inter',sans-serif]"
        }
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div
            className="mx-auto grid h-16 w-16 place-items-center rounded-full text-white shadow-lg"
            style={{ backgroundColor: "#0B6B4F", boxShadow: "0 12px 30px rgba(6,78,59,0.35)" }}
          >
            <CheckCircle2 className="h-9 w-9" strokeWidth={2.2} />
          </div>
          <h2
            className="mt-5 text-2xl font-bold tracking-tight md:text-3xl"
            style={{ fontFamily: SANS_PREMIUM, color: "#0B6B4F" }}
          >
            ধন্যবাদ! অর্ডার গ্রহণ করা হয়েছে
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
          </p>

          <div
            className="mt-6 overflow-hidden rounded-2xl bg-white text-left shadow-sm"
            style={{ borderWidth: 1, borderColor: "#E8E8ED" }}
          >
            <div
              className="px-5 py-3"
              style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E8E8ED" }}
            >
              <h3 className="text-center text-sm font-semibold" style={{ color: "#0B6B4F" }}>
                অর্ডার সামারি
              </h3>
            </div>
            <div className="space-y-2.5 p-5 text-sm">
              <Row label="Product" value="Dibedex 500 mg" />
              <Row label="Package" value={orderSummary.packageName} />
              <Row label="Quantity" value={String(orderSummary.qty)} />
              <Divider />
              <Row label="MRP" value={`৳ ${orderSummary.mrp}`} />
              {orderSummary.savings > 0 && (
                <Row
                  label="Discount"
                  value={`- ৳ ${orderSummary.savings}`}
                  valueClass="font-semibold"
                  valueStyle={{ color: "#0B6B4F" }}
                />
              )}
              <Row label="Subtotal" value={`৳ ${orderSummary.price}`} />
              <Row label="Delivery" value={`৳ ${orderSummary.delivery}`} />
              <div
                className="mt-3 flex items-center justify-between border-t pt-3 text-lg font-bold"
                style={{ borderColor: "#E8E8ED", color: "#0B6B4F" }}
              >
                <span>Total</span>
                <span style={{ fontFamily: SANS_PREMIUM }}>৳ {orderSummary.total}</span>
              </div>
              {orderSummary.savings > 0 && (
                <p className="text-right text-xs font-medium" style={{ color: "#0B6B4F" }}>
                  You saved ৳ {orderSummary.savings} on this order
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => setDone(false)}
              variant="outline"
              style={{ borderColor: "#E8E8ED", color: "#0B6B4F" }}
            >
              আবার অর্ডার করুন
            </Button>
            <Button
              asChild
              className="text-white shadow-md"
              style={{ backgroundColor: "#0B6B4F", boxShadow: "0 6px 18px rgba(6,78,59,0.3)" }}
            >
              <a
                href={buildWhatsAppLink(
                  settings.whatsapp_number,
                  "আমি মাত্র অর্ডার করেছি, কনফার্ম করুন।",
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section
      id={embedded ? undefined : "order"}
      ref={sectionRef}
      className={
        embedded
          ? "px-1 py-5 font-['Inter',sans-serif]"
          : "section-pad font-['Inter',sans-serif]"
      }
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className={embedded ? "mx-auto hidden max-w-2xl text-center" : "mx-auto max-w-2xl text-center"}>
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#0B6B4F" }}
          >
            Secure Checkout
          </span>
          <h2
            className="mt-2 text-3xl font-bold tracking-tight md:text-4xl"
            style={{ fontFamily: SANS_PREMIUM, color: "#0B6B4F" }}
          >
            এখনই <span className="italic" style={{ color: "#0B6B4F" }}>অর্ডার</span> করুন
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            নিচের ফর্মটি পূরণ করুন — ক্যাশ অন ডেলিভারিতে সারা বাংলাদেশে পৌঁছে দেওয়া হবে।
          </p>

          {/* Trust strip */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium" style={{ color: "#0B6B4F" }}>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" style={{ color: "#0B6B4F" }} /> 100% Original
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4" style={{ color: "#0B6B4F" }} /> Cash on Delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4" style={{ color: "#0B6B4F" }} /> Money-back Guarantee
            </span>
          </div>
        </div>

        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          onFocus={markBegan}
          className={`grid gap-6 lg:grid-cols-[1fr_360px] ${embedded ? "mt-2 pb-6" : "mt-8 pb-24 md:pb-0"}`}
        >
          {/* Left */}
          <div
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
            style={{ borderWidth: 1, borderColor: "#E8E8ED" }}
          >
            <div className="p-4 md:p-5" style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E8E8ED" }}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#0B6B4F" }}>
                  প্যাকেজ নির্বাচন
                </p>
                <span className="text-[10px] font-medium" style={{ color: "#0B6B4F" }}>
                  ✓ সর্বোচ্চ মানের গ্যারান্টি
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PACKAGES.map((pkg) => {
                  const isActive = packageId === pkg.id;
                  const savings = pkg.mrp - pkg.price;
                  const savePct = Math.round((savings / pkg.mrp) * 100);
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handlePackageClick(pkg.id)}
                      className="group relative flex flex-col items-center rounded-xl p-2.5 text-center transition-all"
                      style={{
                        borderWidth: 2,
                        borderColor: isActive ? "#0B6B4F" : "#E8E8ED",
                        backgroundColor: isActive ? "#0B6B4F" : "white",
                        boxShadow: isActive ? "0 8px 22px rgba(6,78,59,0.2)" : undefined,
                      }}
                    >
                      {pkg.badge && (
                        <span
                          className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide shadow-sm text-white"
                          style={{ backgroundColor: "#0B6B4F" }}
                        >
                          {pkg.badge}
                        </span>
                      )}
                      <div
                        className="mt-1 text-[11px] font-semibold"
                        style={{ color: isActive ? "rgba(255,255,255,0.75)" : "#64748b" }}
                      >
                        {pkg.capsules} Capsules
                      </div>
                      <div
                        className="mt-0.5 text-lg font-extrabold leading-none tabular-nums"
                        style={{ fontFamily: SANS_PREMIUM, color: isActive ? "white" : "#0B6B4F" }}
                      >
                        ৳{pkg.price}
                      </div>
                      <div
                        className="mt-0.5 text-[10px] font-medium line-through tabular-nums"
                        style={{ color: isActive ? "rgba(255,255,255,0.55)" : "#cbd5e1" }}
                      >
                        ৳{pkg.mrp}
                      </div>
                      <div
                        className="mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                        style={{
                          backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "#FDF6E3",
                          color: isActive ? "#FDE68A" : "#0B6B4F",
                        }}
                      >
                        Save ৳{savings} · {savePct}%
                      </div>
                      {isActive && (
                        <span
                          className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full text-white shadow"
                          style={{ backgroundColor: "#0B6B4F" }}
                        >
                          <Check className="h-2.5 w-2.5" strokeWidth={4} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <span className="text-xs font-medium text-slate-600">পরিমাণ:</span>

                <div className="ml-auto inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setQty(qty - 1)}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                    className="grid h-7 w-7 place-items-center rounded-md text-slate-700 transition disabled:opacity-40 hover:text-emerald-600"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[1.75rem] text-center text-sm font-bold tabular-nums text-slate-900">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    disabled={qty >= 20}
                    aria-label="Increase quantity"
                    className="grid h-7 w-7 place-items-center rounded-md text-slate-700 transition disabled:opacity-40 hover:text-emerald-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3 essential fields — stacked, no step labels */}
            <div className="space-y-4 p-5 md:p-6">
              <Field
                label="পূর্ণ নাম"
                error={errors.full_name?.message}
                icon={<User className="h-4 w-4" />}
              >
                <Input
                  placeholder="আপনার নাম"
                  className="h-12 pl-9 text-base"
                  {...register("full_name")}
                />
              </Field>

              <Field
                label="মোবাইল নম্বর"
                error={errors.phone?.message}
                hint="যেমন: 01XXXXXXXXX বা +8801XXXXXXXXX"
                icon={<PhoneIcon className="h-4 w-4" />}
              >
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  className="h-12 pl-9 text-base"
                  {...register("phone", {
                    onChange: (e) => {
                      const cleaned = e.target.value.replace(/[^\d+]/g, "");
                      e.target.value = cleaned;
                    },
                  })}
                />
              </Field>

              <Field
                label="সম্পূর্ণ ঠিকানা"
                error={errors.address?.message}
                icon={<MapPin className="h-4 w-4" />}
              >
                <Textarea
                  rows={2}
                  placeholder="বাসা/হোল্ডিং, রোড, এলাকা, থানা, জেলা"
                  className="pl-9 pt-2.5 text-base"
                  {...register("address")}
                />
              </Field>

              {/* Payment — default COD, other options collapsed */}
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-slate-700">
                    পেমেন্ট মেথড
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowPayOptions((v) => !v)}
                    className="text-[11px] font-semibold hover:underline"
                    style={{ color: "#0B6B4F" }}
                  >
                    {showPayOptions ? "লুকান" : "অন্য অপশন"}
                  </button>
                </div>

                {!showPayOptions ? (
                  <div
                    className="mt-1.5 flex items-center gap-2 rounded-xl p-3"
                    style={{ borderWidth: 2, borderColor: "#0B6B4F", backgroundColor: "#FDF6E3" }}
                  >
                    <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} style={{ color: "#0B6B4F" }} />
                    <div className="text-sm font-semibold" style={{ color: "#0B6B4F" }}>
                      ক্যাশ অন ডেলিভারি
                    </div>
                    <span
                      className="ml-auto rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: "#0B6B4F" }}
                    >
                      Recommended
                    </span>
                  </div>
                ) : (
                  <RadioGroup
                    value={payment}
                    onValueChange={(v) =>
                      setValue("payment_method", v as FormValues["payment_method"])
                    }
                    className="mt-1.5 grid gap-2 sm:grid-cols-3"
                  >
                    {[
                      { v: "cod", label: "ক্যাশ অন ডেলিভারি" },
                      { v: "bkash", label: "bKash" },
                      { v: "nagad", label: "Nagad" },
                    ].map((opt) => (
                      <label
                        key={opt.v}
                        className="flex cursor-pointer items-center gap-2 rounded-xl p-3 text-sm transition-colors"
                        style={{
                          borderWidth: 2,
                          borderColor: payment === opt.v ? "#0B6B4F" : "#E8E8ED",
                          backgroundColor: payment === opt.v ? "#FDF6E3" : "white",
                        }}
                      >
                        <RadioGroupItem value={opt.v} />
                        <span className="font-medium" style={{ color: "#0B6B4F" }}>{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                )}

              </div>

              {/* Optional note — collapsed */}
              <div>
                {!showNote ? (
                  <button
                    type="button"
                    onClick={() => setShowNote(true)}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: "#0B6B4F" }}
                  >
                    + অর্ডার নোট যোগ করুন (অপশনাল)
                  </button>
                ) : (

                  <Field
                    label="অর্ডার নোট (অপশনাল)"
                    icon={<StickyNote className="h-4 w-4" />}
                  >
                    <Textarea
                      rows={2}
                      placeholder="ডেলিভারির সময় বা বিশেষ নির্দেশনা"
                      className="pl-9 pt-2"
                      {...register("order_note")}
                    />
                  </Field>
                )}
              </div>
            </div>
          </div>



          {/* Right: Order summary */}
          <aside
            className="h-fit overflow-hidden rounded-2xl bg-white shadow-sm lg:sticky lg:top-24"
            style={{ borderWidth: 1, borderColor: "#E8E8ED" }}
          >
            <div className="px-5 py-3" style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E8E8ED" }}>
              <h3 className="text-sm font-semibold" style={{ color: "#0B6B4F" }}>
                অর্ডার সামারি
              </h3>
            </div>

            <div className="space-y-2.5 p-5 text-sm">
              <Row label="Product" value="Dibedex 500 mg" />
              <Row label="Package" value={selectedPackage.name} />
              <Row label="Quantity" value={String(qty)} />
              <Divider />
              <Row label="MRP" value={`৳ ${mrpTotal}`} />
              {savings > 0 && (
                <Row
                  label="Discount"
                  value={`- ৳ ${savings}`}
                  valueClass="font-semibold"
                  valueStyle={{ color: "#0B6B4F" }}
                />
              )}
              <Row label="Subtotal" value={`৳ ${subtotal}`} />
              <Row label="Delivery" value={`৳ ${settings.delivery_charge}`} />
              <div
                className="mt-3 flex items-center justify-between border-t pt-3 text-lg font-bold"
                style={{ borderColor: "#E8E8ED", color: "#0B6B4F" }}
              >
                <span>Total</span>
                <span style={{ fontFamily: SANS_PREMIUM }}>৳ {total}</span>
              </div>
              {savings > 0 && (
                <div
                  className="rounded-lg px-3 py-2 text-center text-xs font-semibold"
                  style={{ backgroundColor: "#FDF6E3", color: "#0B6B4F" }}
                >
                  🎉 আপনি সাশ্রয় করছেন ৳ {savings}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="mt-3 w-full text-white shadow-lg transition-transform active:scale-[0.99]"
                style={{ backgroundColor: "#0B6B4F", boxShadow: "0 10px 24px rgba(6,78,59,0.35)" }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> অর্ডার সাবমিট হচ্ছে…
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" /> Confirm Order · ৳{total}
                  </>
                )}
              </Button>

              <div className="mt-3 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" style={{ color: "#0B6B4F" }} />
                  <span>Secure checkout, তথ্য সুরক্ষিত থাকবে</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PhoneIcon className="h-3.5 w-3.5" style={{ color: "#0B6B4F" }} />
                  <span>প্রতিনিধি কল দিয়ে অর্ডার কনফার্ম করবেন</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </section>

  );
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
        {n}
      </span>
      <Label className="text-sm font-semibold text-slate-900">{title}</Label>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  icon,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-3 text-slate-400">
            {icon}
          </span>
        )}
        {children}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[11px] text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
  valueStyle,
}: {
  label: string;
  value: string;
  valueClass?: string;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium text-slate-800 ${valueClass || ""}`} style={valueStyle}>
        {value}
      </span>
    </div>
  );
}


function Divider() {
  return <div className="border-t border-slate-100" />;
}

function sendAbandoned(data: Record<string, unknown>) {
  try {
    let sid = sessionStorage.getItem("dibedex:sid");
    if (!sid) {
      sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem("dibedex:sid", sid);
    }
    const w = window.innerWidth;
    fetch("/api/public/abandoned", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...data,
        session_id: sid,
        device: w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop",
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
