import { Star, ShoppingBag, MessageCircle, Check } from "lucide-react";
import { DIBEDEX_IMG } from "@/lib/dibedex-image";
import { PACKAGES, selectPackage, useSelectedPackage } from "@/lib/packages";
import { buildWhatsAppLink } from "@/lib/site";
import { track } from "@/lib/analytics";
import { ACCENT, ACCENT_SOFT, HAIRLINE, INK, SANS, SUBTLE } from "./theme";

export function ProductHero({ whatsappNumber }: { whatsappNumber: string }) {
  const { pkg, id } = useSelectedPackage();
  const save = pkg.mrp - pkg.price;
  const off = Math.round((save / pkg.mrp) * 100);

  const waLink = buildWhatsAppLink(
    whatsappNumber,
    `আমি Dibedex 500 mg (${pkg.name}) সম্পর্কে জানতে চাই।`,
  );

  return (
    <section id="home" className="bg-white" style={{ fontFamily: SANS, color: INK }}>
      <div className="mx-auto max-w-5xl px-5 pt-6 pb-10 md:grid md:grid-cols-2 md:items-start md:gap-14 md:pt-14 md:pb-16">
        {/* Product image */}
        <div className="md:sticky md:top-24">
          <div
            className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-[28px]"
            style={{ backgroundColor: "#F5F5F7" }}
          >
            <img
              src={DIBEDEX_IMG}
              alt="Dibedex 500 mg ক্যাপসুল — বোতল ও বক্স"
              width={512}
              height={512}
              fetchPriority="high"
              decoding="async"
              loading="eager"
              className="h-full w-full object-contain p-5"
            />
            <span
              className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
              style={{ backgroundColor: "rgba(255,255,255,.9)", color: ACCENT }}
            >
              {off}% OFF
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="mt-7 md:mt-0">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: SUBTLE }}
          >
            Ayurvedic Diabetes Support
          </p>
          <h1 className="mt-2 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[42px]">
            Dibedex 500 mg
          </h1>

          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[13px] font-medium" style={{ color: SUBTLE }}>
              প্রস্তুতকারক: Index Laboratories Ltd. · আয়ুর্বেদিক ফর্মুলা
            </span>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
            প্রাকৃতিক জামুন বীজের নির্যাসে তৈরি আয়ুর্বেদিক ক্যাপসুল — স্বাস্থ্যকর ব্লাড সুগার
            ম্যানেজমেন্ট ও দৈনন্দিন এনার্জির সহায়ক।
          </p>

          {/* Price */}
          <div className="mt-6 flex items-end gap-3">
            <span className="text-[34px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
              ৳{pkg.price}
            </span>
            <span className="pb-1 text-[15px] line-through" style={{ color: "#9A9AA0" }}>
              ৳{pkg.mrp}
            </span>
            <span
              className="mb-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
              style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}
            >
              সেভ ৳{save}
            </span>
          </div>

          {/* Package selector */}
          <div className="mt-6">
            <p className="text-[13px] font-semibold" style={{ color: INK }}>
              প্যাকেজ নির্বাচন করুন
            </p>
            <div className="mt-3 space-y-2.5">
              {PACKAGES.map((p) => {
                const active = p.id === id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPackage(p.id)}
                    aria-pressed={active}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.995]"
                    style={{
                      border: `1.5px solid ${active ? ACCENT : HAIRLINE}`,
                      backgroundColor: active ? ACCENT_SOFT : "#fff",
                      boxShadow: active ? "0 6px 20px rgba(11,107,79,.10)" : "none",
                    }}
                  >
                    <span
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors"
                      style={{
                        border: `1.5px solid ${active ? ACCENT : "#C7C7CC"}`,
                        backgroundColor: active ? ACCENT : "transparent",
                      }}
                    >
                      {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold">{p.name}</span>
                      {p.badge && (
                        <span className="text-[12px] font-medium" style={{ color: ACCENT }}>
                          {p.badge}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-[15px] font-semibold tabular-nums">
                        ৳{p.price}
                      </span>
                      <span
                        className="block text-[12px] line-through tabular-nums"
                        style={{ color: "#9A9AA0" }}
                      >
                        ৳{p.mrp}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 space-y-2.5">
            <a
              href="#order"
              onClick={() => track("cta_click", { location: "hero", package_id: pkg.id })}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-[16px] font-semibold text-white transition-transform active:scale-[0.985]"
              style={{ backgroundColor: ACCENT, boxShadow: "0 10px 24px rgba(11,107,79,.22)" }}
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2.2} />
              অর্ডার করুন — ৳{pkg.price}
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("cta_click", { location: "hero_whatsapp" })}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-[16px] font-semibold transition-colors"
              style={{ border: `1.5px solid ${HAIRLINE}`, color: INK }}
            >
              <MessageCircle
                className="h-[18px] w-[18px]"
                strokeWidth={2.2}
                style={{ color: "#25D366" }}
              />
              WhatsApp-এ কথা বলুন
            </a>
          </div>

          <p className="mt-4 text-center text-[12.5px]" style={{ color: SUBTLE }}>
            ক্যাশ অন ডেলিভারি · সারা বাংলাদেশে ডেলিভারি · ১০০% অরিজিনাল
          </p>
        </div>
      </div>
    </section>
  );
}
