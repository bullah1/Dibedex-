import { Link } from "@tanstack/react-router";
import { FlaskConical, Minus, Pill, Plus, ShoppingBag, Wheat } from "lucide-react";

import { ACCENT, ACCENT_SOFT, HAIRLINE, INK, SUBTLE } from "@/components/site/premium/theme";
import { addExtra, setExtraQty, useCart } from "@/lib/cart";
import { discountPct, type CatalogItem } from "@/lib/catalog";

export function ProductThumb({ item, className = "" }: { item: CatalogItem; className?: string }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={`${item.name} ${item.pack}`}
        loading="lazy"
        decoding="async"
        width={400}
        height={400}
        className={`aspect-square w-full bg-white object-contain ${className}`}
      />
    );
  }
  const Icon = item.form === "syrup" ? FlaskConical : item.form === "powder" ? Wheat : Pill;
  return (
    <div
      className={`grid aspect-square w-full place-items-center ${className}`}
      style={{ background: `linear-gradient(160deg, ${ACCENT_SOFT}, #FFFFFF)` }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-2 px-2 text-center">
        <Icon className="h-8 w-8" strokeWidth={1.3} style={{ color: ACCENT, opacity: 0.55 }} />
        <span
          className="text-[13px] font-semibold leading-tight"
          style={{ color: INK, opacity: 0.75 }}
        >
          {item.name}
        </span>
        <span className="text-[10px]" style={{ color: SUBTLE }}>
          {item.pack}
        </span>
      </div>
    </div>
  );
}

export function CartStepper({
  slug,
  name,
  compact,
}: {
  slug: string;
  name: string;
  compact?: boolean;
}) {
  const cart = useCart();
  const qty = cart.extras.find((e) => e.slug === slug)?.qty ?? 0;
  const h = compact ? "h-10" : "h-12";
  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => addExtra(slug)}
        className={`flex ${h} w-full items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold text-white transition-transform active:scale-[0.98]`}
        style={{ backgroundColor: ACCENT }}
      >
        <ShoppingBag className="h-4 w-4" /> কার্টে যোগ করুন
      </button>
    );
  }
  return (
    <div
      className={`flex ${h} w-full items-center justify-between rounded-xl px-1`}
      style={{ border: `2px solid ${ACCENT}` }}
    >
      <button
        type="button"
        onClick={() => setExtraQty(slug, qty - 1)}
        aria-label={`${name} কমান`}
        className="grid h-8 w-8 place-items-center rounded-lg"
        style={{ color: ACCENT }}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-sm font-bold tabular-nums" style={{ color: ACCENT }} aria-live="polite">
        {qty}টি কার্টে
      </span>
      <button
        type="button"
        onClick={() => setExtraQty(slug, qty + 1)}
        aria-label={`${name} বাড়ান`}
        className="grid h-8 w-8 place-items-center rounded-lg"
        style={{ color: ACCENT }}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ProductCard({ item }: { item: CatalogItem }) {
  const pct = discountPct(item);
  return (
    <li
      className="flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white"
      style={{ border: `1px solid ${HAIRLINE}` }}
    >
      <Link to="/product/$slug" params={{ slug: item.slug }} className="relative block">
        <ProductThumb item={item} />
        {pct > 0 && (
          <span
            className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
            style={{ backgroundColor: "#D92D20" }}
          >
            {pct}% ছাড়
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link
          to="/product/$slug"
          params={{ slug: item.slug }}
          className="truncate text-[14px] font-semibold hover:underline"
          style={{ color: INK }}
        >
          {item.name}
        </Link>
        <p className="truncate text-[11px]" style={{ color: SUBTLE }}>
          {[item.strength, item.pack].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-2 flex items-baseline gap-1.5 tabular-nums">
          <span className="text-[16px] font-bold" style={{ color: ACCENT }}>
            ৳{item.price}
          </span>
          {item.mrp && item.mrp > item.price && (
            <span className="text-[11px] line-through" style={{ color: "#A1A1A6" }}>
              ৳{item.mrp}
            </span>
          )}
        </p>
        <div className="mt-auto pt-3">
          <CartStepper slug={item.slug} name={item.name} compact />
        </div>
      </div>
    </li>
  );
}
