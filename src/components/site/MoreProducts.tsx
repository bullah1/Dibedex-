import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/site/ProductCard";
import { ACCENT, HAIRLINE, INK, SANS, SUBTLE } from "@/components/site/premium/theme";
import { FEATURED, MANUFACTURER_BN, PRODUCTS } from "@/lib/catalog";

/** Home page strip shown after the FAQ — keeps the Dibedex content above it untouched. */
export function MoreProducts() {
  return (
    <section
      id="more-products"
      className="scroll-mt-20"
      style={{
        fontFamily: SANS,
        color: INK,
        backgroundColor: "#FAFAFC",
        borderTop: `1px solid ${HAIRLINE}`,
      }}
    >
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: ACCENT }}
        >
          {MANUFACTURER_BN}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          আরও আয়ুর্বেদিক প্রোডাক্ট
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: SUBTLE }}>
          Dibedex-এর প্রস্তুতকারকের আরও প্রোডাক্ট। কার্টে যোগ করে একসাথে অর্ডার করুন — এক পার্সেলে,
          ক্যাশ অন ডেলিভারিতে।
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURED.map((item) => (
            <ProductCard key={item.slug} item={item} />
          ))}
        </ul>

        <div className="mt-6 flex justify-center">
          <Link
            to="/products"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold transition-transform active:scale-[0.98]"
            style={{ border: `1px solid ${HAIRLINE}`, color: INK }}
          >
            সব {PRODUCTS.length}টি প্রোডাক্ট দেখুন
            <ArrowRight className="h-4 w-4" style={{ color: ACCENT }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
