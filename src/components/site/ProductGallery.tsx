import { useEffect, useState } from "react";
import { BadgeCheck, Flame, ShieldCheck, Truck } from "lucide-react";
import { DIBEDEX_IMG } from "@/lib/dibedex-image";
import front from "@/assets/product-front.jpg";
import angle from "@/assets/product-angle.jpg";
import lifestyle from "@/assets/product-lifestyle.jpg";

// CRO order: real packshot first (builds instant trust & recognition),
// then front-of-bottle (clear label), capsules (what you actually get),
// lifestyle/ingredient (emotional + natural proof).
const images = [
  { src: DIBEDEX_IMG, alt: "Dibedex 500 mg বোতল ও বক্স", label: "প্যাকেজ" },
  { src: front, alt: "Dibedex 500 mg bottle front view", label: "বোতল" },
  { src: angle, alt: "Dibedex Syzygium capsules close-up", label: "ক্যাপসুল" },
  { src: lifestyle, alt: "Dibedex Syzygium with natural jamun herbs", label: "উপাদান" },
];

export function ProductGallery() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-rotate so visitors see all angles without effort — proven to lift engagement.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute -inset-4 rounded-[2.5rem] bg-mint blur-2xl opacity-70" />

      <div className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-[var(--shadow-soft)]">
        {/* Top-left urgency badge */}
        <div className="pointer-events-none absolute left-5 top-5 z-10 flex items-center gap-1.5 rounded-full bg-destructive px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
          <Flame className="h-3.5 w-3.5" />
          সীমিত স্টক
        </div>
        {/* Top-right verified badge */}
        <div className="pointer-events-none absolute right-5 top-5 z-10 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-md">
          <BadgeCheck className="h-3.5 w-3.5" />
          ১০০% অরিজিনাল
        </div>

        <img
          src={images[active].src}
          alt={images[active].alt}
          width={1024}
          height={1024}
          fetchPriority={active === 0 ? "high" : "auto"}
          decoding="async"
          loading="eager"
          className="h-auto w-full rounded-2xl object-cover transition-opacity duration-300"
        />

        {/* Progress dots */}
        <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? "w-6 bg-primary" : "w-1.5 bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Trust strip directly under the image — converts undecided visitors */}
      <div className="relative mt-3 grid grid-cols-3 gap-2 rounded-xl border border-border bg-white px-2 py-2 text-[11px] font-semibold text-foreground/80 shadow-sm">
        <div className="flex items-center justify-center gap-1.5">
          <Truck className="h-4 w-4 text-primary" /> ক্যাশ অন ডেলিভারি
        </div>
        <div className="flex items-center justify-center gap-1.5 border-x border-border">
          <ShieldCheck className="h-4 w-4 text-primary" /> অরিজিনাল গ্যারান্টি
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <BadgeCheck className="h-4 w-4 text-primary" /> দ্রুত ডেলিভারি
        </div>
      </div>

      {/* Labeled thumbnails — hidden on mobile to save space; desktop keeps full gallery */}
      <div className="mt-3 hidden grid-cols-4 gap-2 md:grid">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={img.label}
            className={`group overflow-hidden rounded-xl bg-white p-1.5 shadow-sm transition-all ${
              active === i ? "ring-2 ring-primary" : "ring-1 ring-border hover:ring-primary/40"
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              width={1024}
              height={1024}
              className="aspect-square h-auto w-full rounded-lg object-cover"
            />
            <span
              className={`mt-1 block text-center text-[10px] font-semibold ${
                active === i ? "text-primary-deep" : "text-muted-foreground"
              }`}
            >
              {img.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
