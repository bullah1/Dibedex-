import { MessageCircle, ShoppingBag, Sparkles, Star, Truck, Users, BadgeCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, type SiteStats, type Testimonial } from "@/lib/site";

const CREAM = "#FDFCF0";
const CREAM_DEEP = "#F7F2DF";
const EMERALD = "#064E3B";
const GOLD = "#A16207";
const GOLD_SOFT = "#C7902A";
const BORDER = "#F1E9D2";
const INK = "#1A2E2A";

export function UrgencyBar({ text }: { text: string }) {
  return (
    <div className="w-full" style={{ backgroundColor: EMERALD, color: CREAM }}>
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-[12px] font-medium md:text-sm">
        <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: GOLD_SOFT }} />
        <span className="truncate">{text}</span>
      </div>
    </div>
  );
}

export function StatsStrip({ stats }: { stats: SiteStats }) {
  const items = [
    { icon: Users, value: `${stats.happy_customers.toLocaleString()}+`, label: "সন্তুষ্ট গ্রাহক" },
    { icon: Star, value: `${stats.avg_rating.toFixed(1)}★`, label: "গড় রেটিং" },
    { icon: Truck, value: `${stats.delivered_orders.toLocaleString()}+`, label: "ডেলিভারি সম্পন্ন" },
    { icon: BadgeCheck, value: "100%", label: "অরিজিনাল প্রোডাক্ট" },
  ];
  return (
    <section
      className="font-['Inter',sans-serif]"
      style={{
        backgroundColor: CREAM,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: BORDER,
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-6 sm:grid-cols-4 md:py-7">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3">
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: `${GOLD}14`, color: GOLD }}
            >
              <it.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div
                className="text-lg font-bold leading-tight md:text-xl"
                style={{ fontFamily: "'Lora', serif", color: EMERALD }}
              >
                {it.value}
              </div>
              <div className="truncate text-xs md:text-sm" style={{ color: `${INK}99` }}>
                {it.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CtaBand({
  whatsappNumber,
  price,
  tagline = "আজই অর্ডার করুন — ক্যাশ অন ডেলিভারিতে সারা বাংলাদেশে",
}: {
  whatsappNumber: string;
  price: number;
  tagline?: string;
}) {
  const wa = buildWhatsAppLink(whatsappNumber, "আমি Dibedex 500 mg অর্ডার করতে চাই।");
  return (
    <section
      className="relative overflow-hidden py-10 font-['Inter',sans-serif] md:py-14"
      style={{ backgroundColor: EMERALD, color: CREAM }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: GOLD, opacity: 0.14 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: GOLD, opacity: 0.08 }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 md:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <span
            className="mb-2 inline-block text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: GOLD_SOFT }}
          >
            Limited Stock
          </span>
          <h3
            className="text-xl leading-tight font-bold md:text-3xl"
            style={{ fontFamily: "'Lora', serif" }}
          >
            {tagline}
          </h3>
          <p className="mt-2 text-sm md:text-base" style={{ color: "rgba(253,252,240,0.85)" }}>
            শুরু মাত্র{" "}
            <span className="font-bold" style={{ color: GOLD_SOFT }}>
              ৳{price} থেকে
            </span>{" "}
            · ক্যাশ অন ডেলিভারি · ফাস্ট সাপোর্ট
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            asChild
            size="lg"
            className="font-bold shadow-lg"
            style={{ backgroundColor: GOLD, color: CREAM }}
          >
            <a href="#order">
              <ShoppingBag className="mr-2 h-5 w-5" /> অর্ডার করুন
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent hover:bg-white/10"
            style={{ borderColor: "rgba(253,252,240,0.5)", color: CREAM }}
          >
            <a href={wa} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function SocialProofSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  return (
    <section
      className="section-pad font-['Inter',sans-serif]"
      style={{ backgroundColor: CREAM_DEEP, color: INK }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <span
            className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: GOLD }}
          >
            Customer Reviews
          </span>
          <h2
            className="text-2xl leading-tight font-bold md:text-3xl"
            style={{ fontFamily: "'Lora', serif", color: EMERALD }}
          >
            গ্রাহকেরা যা বলছেন
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="flex flex-col rounded-2xl bg-white p-5"
              style={{ borderColor: BORDER, borderWidth: 1, boxShadow: "0 8px 24px rgba(6,78,59,0.06)" }}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    style={{
                      color: i < t.rating ? GOLD : "#E5E1D0",
                      fill: i < t.rating ? GOLD : "transparent",
                    }}
                    strokeWidth={i < t.rating ? 0 : 1.5}
                  />
                ))}
              </div>
              <p className="mt-3 grow text-sm leading-relaxed" style={{ color: `${INK}e0` }}>
                “{t.text}”
              </p>
              <div
                className="mt-4 flex items-center gap-3 pt-3"
                style={{ borderTopWidth: 1, borderTopColor: BORDER }}
              >
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: EMERALD, fontFamily: "'Lora', serif" }}
                >
                  {t.name.trim().charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold" style={{ color: EMERALD }}>
                    {t.name}
                  </div>
                  {t.location && (
                    <div className="truncate text-xs" style={{ color: `${INK}80` }}>
                      {t.location}
                    </div>
                  )}
                </div>
                <BadgeCheck className="ml-auto h-4 w-4 shrink-0" style={{ color: GOLD }} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type InlineCtaVariant = "order" | "whatsapp" | "cod" | "phone";

export function InlineCta({
  label,
  variant = "order",
  whatsappNumber,
  callNumber,
  note,
}: {
  label: string;
  variant?: InlineCtaVariant;
  whatsappNumber?: string;
  callNumber?: string;
  note?: string;
}) {
  const wa = whatsappNumber
    ? buildWhatsAppLink(whatsappNumber, "আমি Dibedex 500 mg অর্ডার করতে চাই।")
    : "#order";

  const isWhatsApp = variant === "whatsapp";
  const isPhone = variant === "phone";
  const href = isWhatsApp ? wa : isPhone && callNumber ? `tel:${callNumber}` : "#order";
  const Icon = isWhatsApp ? MessageCircle : isPhone ? Phone : ShoppingBag;

  return (
    <div
      className="font-['Inter',sans-serif]"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center md:py-10">
        {note ? (
          <p className="text-sm md:text-base" style={{ color: `${INK}b3`, fontFamily: "'Lora', serif" }}>
            {note}
          </p>
        ) : null}
        <Button
          asChild
          size="lg"
          className="h-12 px-8 text-base font-bold shadow-lg"
          style={
            isWhatsApp
              ? { backgroundColor: "#25D366", color: "white" }
              : { backgroundColor: EMERALD, color: CREAM, boxShadow: `0 10px 24px ${EMERALD}40` }
          }
        >
          <a href={href} {...(isWhatsApp ? { target: "_blank", rel: "noreferrer" } : {})}>
            <Icon className="mr-2 h-5 w-5" /> {label}
          </a>
        </Button>
      </div>
    </div>
  );
}
