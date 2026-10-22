import { ShieldCheck, Truck, Star } from "lucide-react";
import realAsset from "@/assets/dibedex-real.webp.asset.json";
import { useSelectedPackage } from "@/lib/packages";

const CREAM = "#FDFCF0";
const EMERALD = "#064E3B";
const GOLD = "#A16207";
const BORDER = "#F1E9D2";

export function Hero(_props: { whatsappNumber: string; price?: number }) {
  const { pkg } = useSelectedPackage();
  const save = pkg.mrp - pkg.price;

  return (
    <section
      id="home"
      className="relative overflow-hidden font-['Inter',sans-serif]"
      style={{ backgroundColor: CREAM, color: "#1A2E2A" }}
    >
      {/* decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: EMERALD, opacity: 0.06 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: GOLD, opacity: 0.05 }}
      />

      <div className="mx-auto max-w-6xl px-5 pt-8 pb-8 md:pt-14 md:pb-16">
        {/* Eyebrow + Headline */}
        <div className="relative z-10 text-center">
          <span
            className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: GOLD }}
          >
            প্রাকৃতিক আয়ুর্বেদিক সমাধান
          </span>
          <h1
            className="mx-auto max-w-xl text-3xl leading-tight font-bold md:text-5xl"
            style={{ fontFamily: "'Lora', serif", color: EMERALD }}
          >
            ডায়াবেটিস নিয়ন্ত্রণে
            <br />
            ডাইবেডেক্স <span className="italic" style={{ color: GOLD }}>৫০০মিগ্রা</span>
          </h1>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <div className="flex" style={{ color: GOLD }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
              ))}
            </div>
            <span className="ml-1 text-xs font-medium" style={{ color: EMERALD }}>
              ৪.৮/৫ (১০,০০০+ রিভিউ)
            </span>
          </div>
        </div>

        {/* Split: product plaque + price/trust */}
        <div className="relative z-10 mx-auto mt-6 grid max-w-md grid-cols-2 items-center gap-4 md:mt-10 md:max-w-3xl md:gap-8">
          {/* Product plaque */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 scale-125 rounded-full blur-2xl"
              style={{ backgroundColor: EMERALD, opacity: 0.1 }}
            />
            <div
              className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-xl shadow-emerald-900/10 md:p-4"
              style={{ borderColor: BORDER, borderWidth: 1 }}
            >
              <img
                src={realAsset.url}
                alt="Dibedex 500 mg বোতল ও বক্স"
                width={512}
                height={512}
                fetchPriority="high"
                decoding="async"
                loading="eager"
                className="h-auto w-full object-contain"
              />
              <p
                className="mt-1 text-center text-[10px] font-bold md:text-xs"
                style={{ color: EMERALD }}
              >
                ১০০% অর্গানিক · GMP সার্টিফায়েড
              </p>
            </div>
          </div>

          {/* Price + trust */}
          <div className="space-y-3">
            <div
              className="rounded-xl bg-white/70 p-3 backdrop-blur-sm md:p-4"
              style={{ borderColor: BORDER, borderWidth: 1 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 md:text-xs">
                {pkg.name} · শুরু মাত্র
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span
                  className="text-2xl font-bold md:text-4xl"
                  style={{ fontFamily: "'Lora', serif", color: EMERALD }}
                >
                  ৳{pkg.price}
                </span>
                <span className="text-xs text-slate-400 line-through md:text-sm">
                  ৳{pkg.mrp}
                </span>
              </div>
              <span
                className="mt-1.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
                style={{ backgroundColor: `${GOLD}1a`, color: GOLD }}
              >
                সেভ ৳{save}
              </span>
            </div>

            <ul className="space-y-1.5 text-[11px] md:text-sm" style={{ color: EMERALD }}>
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
                <Truck className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
                <span className="font-medium">ক্যাশ অন ডেলিভারি</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
                <span className="font-medium">১০০% অরিজিনাল</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
                <Truck className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
                <span className="font-medium">দ্রুত ডেলিভারি</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
