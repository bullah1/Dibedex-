import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, MessageCircle, Phone, ShieldCheck, Truck, Wallet } from "lucide-react";

import { CartStepper, ProductCard, ProductThumb } from "@/components/site/ProductCard";
import { ShopLayout } from "@/components/site/ShopLayout";
import { ACCENT, ACCENT_SOFT, HAIRLINE, INK, SUBTLE } from "@/components/site/premium/theme";
import { addExtra, cartQty } from "@/lib/cart";
import {
  FORM_LABEL,
  MANUFACTURER,
  MANUFACTURER_BN,
  PRODUCTS,
  discountPct,
  getProduct,
  productTitle,
} from "@/lib/catalog";
import { openCheckout } from "@/lib/checkout-modal";
import { buildWhatsAppLink } from "@/lib/site";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Product not found" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    const url = `https://dibedex.com/product/${p.slug}`;
    const img = p.image?.startsWith("/")
      ? `https://dibedex.com${p.image}`
      : p.image?.startsWith("https://")
        ? p.image
        : undefined;
    const title = `${productTitle(p)} ${p.pack} — Price in Bangladesh | ${p.name} দাম ও অর্ডার`;
    const desc = `${p.name}${p.generic ? ` (${p.generic})` : ""} — ${MANUFACTURER_BN}-এর আয়ুর্বেদিক ${FORM_LABEL[p.form]}, ${p.pack}। দাম ৳${p.price}${p.mrp && p.mrp > p.price ? ` (MRP ৳${p.mrp})` : ""}। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        ...(img ? [{ property: "og:image", content: img }] : []),
        { property: "product:price:amount", content: String(p.price) },
        { property: "product:price:currency", content: "BDT" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": `${url}#product`,
            name: `${p.name} ${p.pack}`,
            ...(img ? { image: [img] } : {}),
            description: desc,
            sku: p.slug,
            brand: { "@type": "Brand", name: p.name },
            manufacturer: { "@type": "Organization", name: MANUFACTURER },
            category: "Health & Beauty > Health Care > Ayurvedic Medicine",
            offers: {
              "@type": "Offer",
              url,
              price: String(p.price),
              priceCurrency: "BDT",
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: { "@type": "Organization", name: "Dibedex" },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://dibedex.com/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Products",
                item: "https://dibedex.com/products",
              },
              { "@type": "ListItem", position: 3, name: p.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const pct = discountPct(p);
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && x.form === p.form).slice(0, 4);

  const buyNow = () => {
    if (cartQty(p.slug) === 0) addExtra(p.slug);
    openCheckout();
  };

  const facts: [string, string | undefined][] = [
    ["ব্র্যান্ড", p.name],
    ["জেনেরিক / উপাদান", p.generic],
    ["ধরন", FORM_LABEL[p.form]],
    ["শক্তিমাত্রা", p.strength],
    ["প্যাক সাইজ", p.pack],
    ["প্রস্তুতকারক", `${MANUFACTURER_BN} (${MANUFACTURER})`],
  ];

  return (
    <ShopLayout>
      {(settings) => (
        <div className="mx-auto max-w-5xl px-5 py-6 md:py-10" style={{ color: INK }}>
          <nav className="text-[12px]" style={{ color: SUBTLE }} aria-label="Breadcrumb">
            <Link to="/" className="hover:underline">
              হোম
            </Link>{" "}
            /{" "}
            <Link to="/products" className="hover:underline">
              প্রোডাক্ট
            </Link>{" "}
            / {p.name}
          </nav>

          <div className="mt-4 grid gap-6 md:grid-cols-2 md:gap-10">
            <div
              className="overflow-hidden rounded-3xl"
              style={{ border: `1px solid ${HAIRLINE}` }}
            >
              <ProductThumb item={p} />
            </div>

            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: ACCENT }}
              >
                {MANUFACTURER}
              </p>
              <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight md:text-[34px]">
                {productTitle(p)}
              </h1>
              <p className="mt-1 text-sm" style={{ color: SUBTLE }}>
                {p.generic ? `${p.generic} · ` : ""}
                {p.pack}
              </p>

              <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-4xl font-bold tabular-nums" style={{ color: ACCENT }}>
                  ৳{p.price}
                </span>
                {p.mrp && p.mrp > p.price && (
                  <span
                    className="pb-1 text-base line-through tabular-nums"
                    style={{ color: "#A1A1A6" }}
                  >
                    ৳{p.mrp}
                  </span>
                )}
                {pct > 0 && (
                  <span
                    className="mb-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                    style={{ backgroundColor: "#D92D20" }}
                  >
                    {pct}% ছাড়
                  </span>
                )}
              </div>
              <p className="mt-1 text-[12px]" style={{ color: SUBTLE }}>
                ডেলিভারি চার্জ ৳{settings.delivery_charge} · একাধিক প্রোডাক্ট এক পার্সেলে
              </p>

              <div className="mt-5 grid gap-2.5">
                <button
                  type="button"
                  onClick={buyNow}
                  className="flex h-12 items-center justify-center rounded-xl text-[15px] font-bold text-white transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: "#D92D20" }}
                >
                  এখনই অর্ডার করুন
                </button>
                <CartStepper slug={p.slug} name={p.name} />
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={buildWhatsAppLink(
                      settings.whatsapp_number,
                      `আমি ${p.name} (${p.pack}) অর্ডার করতে চাই।`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a
                    href={`tel:${settings.call_number}`}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold"
                    style={{ border: `1px solid ${HAIRLINE}` }}
                  >
                    <Phone className="h-4 w-4" /> কল করুন
                  </a>
                </div>
              </div>

              <ul className="mt-5 grid grid-cols-2 gap-2 text-[12px]">
                {[
                  { icon: Wallet, t: "ক্যাশ অন ডেলিভারি" },
                  { icon: Truck, t: "সারা বাংলাদেশে ডেলিভারি" },
                  { icon: BadgeCheck, t: "সিল করা প্যাক" },
                  { icon: ShieldCheck, t: "পার্সেল দেখে পেমেন্ট" },
                ].map(({ icon: Icon, t }) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{ backgroundColor: ACCENT_SOFT }}
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">প্রোডাক্টের তথ্য</h2>
              <dl
                className="mt-3 divide-y rounded-2xl"
                style={{ border: `1px solid ${HAIRLINE}`, borderColor: HAIRLINE }}
              >
                {facts
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 px-4 py-3 text-sm">
                      <dt style={{ color: SUBTLE }}>{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>
            <div>
              <h2 className="text-xl font-bold">{p.name} সম্পর্কে</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed" style={{ color: SUBTLE }}>
                {p.description ? (
                  <p>{p.description}</p>
                ) : (
                  <p>
                    {p.name} {MANUFACTURER_BN}-এর তৈরি একটি আয়ুর্বেদিক {FORM_LABEL[p.form]}
                    {p.generic ? `, যার জেনেরিক নাম ${p.generic}` : ""}। প্রতিটি প্যাকে {p.pack}।
                  </p>
                )}
                <p>
                  সেবনবিধি ও মাত্রা প্যাকেটের লেবেলে দেওয়া থাকে। গর্ভবতী বা স্তন্যদানকারী হলে, অথবা
                  অন্য কোনো ওষুধ চললে সেবনের আগে চিকিৎসকের পরামর্শ নিন। এটি কোনো রোগ নিরাময়ের
                  গ্যারান্টি দেয় না।
                </p>
                <p>
                  অর্ডার করলে আমাদের প্রতিনিধি ফোনে কনফার্ম করবেন, তারপর কুরিয়ারে পাঠানো হবে।
                  পার্সেল হাতে পেয়ে টাকা দেবেন।
                </p>
              </div>
            </div>
          </section>

          <section
            className="mt-10 flex flex-col items-start gap-4 rounded-3xl p-6 md:flex-row md:items-center md:justify-between"
            style={{ backgroundColor: ACCENT_SOFT }}
          >
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: ACCENT }}
              >
                একই প্রস্তুতকারক
              </p>
              <p className="mt-1 text-lg font-bold">
                Dibedex 500 mg — জামুন বীজের আয়ুর্বেদিক ক্যাপসুল
              </p>
              <p className="text-sm" style={{ color: SUBTLE }}>
                ৳৩৫০ থেকে · একই পার্সেলে যোগ করতে পারেন
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex h-11 shrink-0 items-center rounded-xl px-5 text-sm font-bold text-white"
              style={{ backgroundColor: ACCENT }}
            >
              Dibedex দেখুন
            </Link>
          </section>

          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold">আরও {FORM_LABEL[p.form]}</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {related.map((item) => (
                  <ProductCard key={item.slug} item={item} />
                ))}
              </ul>
              <div className="mt-5">
                <Link
                  to="/products"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: ACCENT }}
                >
                  সব প্রোডাক্ট দেখুন →
                </Link>
              </div>
            </section>
          )}
        </div>
      )}
    </ShopLayout>
  );
}
