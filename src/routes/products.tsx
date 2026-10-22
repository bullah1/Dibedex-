import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ProductCard } from "@/components/site/ProductCard";
import { ShopLayout } from "@/components/site/ShopLayout";
import { ACCENT, HAIRLINE, INK, SUBTLE } from "@/components/site/premium/theme";
import {
  FORM_LABEL,
  MANUFACTURER,
  MANUFACTURER_BN,
  PRODUCTS,
  type ProductForm,
} from "@/lib/catalog";

const URL = "https://dibedex.com/products";
const TITLE =
  "Index Laboratories Ayurvedic Products Price in Bangladesh | ইনডেক্স ল্যাবরেটরিজের আয়ুর্বেদিক প্রোডাক্ট";
const DESC = `${MANUFACTURER_BN}-এর ${PRODUCTS.length}টি আয়ুর্বেদিক ক্যাপসুল, সিরাপ ও পাউডার — Arjunarin, Nephro-Care, Hilivon, Basodex সহ। দাম দেখুন, কার্টে যোগ করুন, সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।`;

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${MANUFACTURER} products`,
          itemListElement: PRODUCTS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://dibedex.com/product/${p.slug}`,
            name: p.name,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://dibedex.com/" },
            { "@type": "ListItem", position: 2, name: "Products", item: URL },
          ],
        }),
      },
    ],
  }),
  component: ProductsPage,
});

const FILTERS: { id: ProductForm | "all"; label: string }[] = [
  { id: "all", label: "সব" },
  { id: "capsule", label: FORM_LABEL.capsule },
  { id: "syrup", label: FORM_LABEL.syrup },
  { id: "powder", label: FORM_LABEL.powder },
];

function ProductsPage() {
  const [filter, setFilter] = useState<ProductForm | "all">("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (filter === "all" || p.form === filter) &&
        (!q || p.name.toLowerCase().includes(q) || (p.generic ?? "").toLowerCase().includes(q)),
    );
  }, [filter, query]);

  return (
    <ShopLayout>
      {() => (
        <div className="mx-auto max-w-5xl px-5 py-8 md:py-12" style={{ color: INK }}>
          <nav className="text-[12px]" style={{ color: SUBTLE }} aria-label="Breadcrumb">
            <Link to="/" className="hover:underline">
              হোম
            </Link>{" "}
            / প্রোডাক্ট
          </nav>
          <p
            className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: ACCENT }}
          >
            {MANUFACTURER}
          </p>
          <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-tight md:text-4xl">
            ইনডেক্স ল্যাবরেটরিজের আয়ুর্বেদিক প্রোডাক্ট
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: SUBTLE }}>
            {DESC}
          </p>

          <div className="sticky top-[60px] z-30 -mx-5 mt-6 bg-white/90 px-5 py-3 backdrop-blur-xl">
            <label
              className="flex h-11 items-center gap-2 rounded-full bg-white px-4"
              style={{ border: `1px solid ${HAIRLINE}` }}
            >
              <Search className="h-4 w-4 shrink-0" style={{ color: SUBTLE }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="নাম বা উপাদান লিখে খুঁজুন (যেমন Arjunarin)"
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none"
              />
            </label>
            <div className="-mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none]">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className="h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold"
                  style={
                    filter === f.id
                      ? { backgroundColor: ACCENT, color: "white" }
                      : { border: `1px solid ${HAIRLINE}`, color: INK, backgroundColor: "white" }
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="py-16 text-center text-sm" style={{ color: SUBTLE }}>
              কোনো প্রোডাক্ট পাওয়া যায়নি।
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visible.map((item) => (
                <ProductCard key={item.slug} item={item} />
              ))}
            </ul>
          )}

          <p className="mt-10 text-[12px] leading-relaxed" style={{ color: SUBTLE }}>
            সব প্রোডাক্ট আয়ুর্বেদিক/হারবাল। সেবনের আগে প্যাকেটের নির্দেশনা পড়ুন এবং প্রয়োজনে
            চিকিৎসকের পরামর্শ নিন। এগুলো কোনো রোগ নিরাময়ের গ্যারান্টি দেয় না।
          </p>
        </div>
      )}
    </ShopLayout>
  );
}
