/**
 * Index Laboratories Ltd. — other products sold alongside Dibedex.
 *
 * Price rule: MRP from the brand listing, selling price = MRP − 10%.
 * Edit `price` / `mrp` freely.
 *
 * PHOTOS: drop a file named after the product's slug into
 * src/assets/products/ (e.g. arjunarin-450ml.webp or .jpg/.png) and it shows
 * up automatically on the cards, the product page and in Google's product
 * data. No code change needed. Products without a photo show a styled tile.
 *
 * Add your own Bangla `description` whenever you can — unique text on each
 * product page helps SEO.
 */
import { PACKAGES, type PackageId } from "@/lib/packages";

export type ProductForm = "capsule" | "syrup" | "powder";

export type CatalogItem = {
  slug: string;
  name: string;
  /** Generic / classical Ayurvedic formulation name */
  generic?: string | undefined;
  form: ProductForm;
  /** e.g. "৪৫০ মি.লি.", "১০ ক্যাপসুল (১ স্ট্রিপ)" */
  pack: string;
  /** e.g. "২৫০ মি.গ্রা." */
  strength?: string | undefined;
  mrp?: number | undefined;
  price: number;
  image?: string | undefined;
  description?: string | undefined;
  /** Show on the home page "more products" strip */
  featured?: boolean | undefined;
};

export const MANUFACTURER = "Index Laboratories Ltd.";
export const MANUFACTURER_BN = "ইনডেক্স ল্যাবরেটরিজ লিমিটেড";

export const FORM_LABEL: Record<ProductForm, string> = {
  capsule: "ক্যাপসুল",
  syrup: "সিরাপ",
  powder: "পাউডার ও অন্যান্য",
};

const off = (mrp: number) => Math.round(mrp * 0.9);

// Every image in src/assets/products/, keyed by file name without extension (= slug).
const PHOTO_FILES = import.meta.glob("../assets/products/*.{webp,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const PHOTOS = new Map(
  Object.entries(PHOTO_FILES).map(([path, url]) => [
    (path.split("/").pop() ?? "").replace(/\.[^.]+$/, "").toLowerCase(),
    url,
  ]),
);

type Row = Omit<CatalogItem, "price"> & { price?: number };
const p = (r: Row): CatalogItem => ({
  ...r,
  price: r.price ?? off(r.mrp ?? 0),
  image: r.image ?? PHOTOS.get(r.slug),
});

export const PRODUCTS: CatalogItem[] = [
  // ── Capsules ──────────────────────────────────────────────
  p({
    slug: "arthodex-250",
    name: "Arthodex",
    generic: "Brihat Bate Gajangkush",
    form: "capsule",
    strength: "২৫০ মি.গ্রা.",
    pack: "১০ ক্যাপসুল (১ স্ট্রিপ)",
    mrp: 150,
    featured: true,
  }),
  p({
    slug: "digedex-250",
    name: "Digedex 250",
    generic: "Mahasankha Bati",
    form: "capsule",
    strength: "২৫০ মি.গ্রা.",
    pack: "১০ ক্যাপসুল (১ স্ট্রিপ)",
    mrp: 85,
    featured: true,
  }),
  p({
    slug: "bolent-250",
    name: "Bolent 250",
    form: "capsule",
    strength: "২৫০ মি.গ্রা.",
    pack: "১০ ক্যাপসুল (১ স্ট্রিপ)",
    mrp: 250,
  }),
  p({
    slug: "inginsen-500",
    name: "Inginsen 500",
    generic: "Ginseng",
    form: "capsule",
    strength: "৫০০ মি.গ্রা.",
    pack: "১৫ ক্যাপসুল (১ বক্স)",
    mrp: 1050,
  }),
  p({
    slug: "nephro-care-500",
    name: "Nephro-Care 500",
    generic: "Gokshura",
    form: "capsule",
    strength: "৫০০ মি.গ্রা.",
    pack: "৩০ ক্যাপসুল (১ বক্স)",
    mrp: 1090,
    featured: true,
  }),
  p({
    slug: "bone-in-500",
    name: "Bone-In",
    generic: "Manjistha",
    form: "capsule",
    strength: "৫০০ মি.গ্রা.",
    pack: "১০ ক্যাপসুল (১ স্ট্রিপ)",
    mrp: 160,
  }),
  p({
    slug: "in-bp-50",
    name: "In-Bp 50",
    generic: "Sarpagandha",
    form: "capsule",
    strength: "৫০ মি.গ্রা.",
    pack: "৩০ ক্যাপসুল (১ বক্স)",
    mrp: 440,
    featured: true,
  }),
  p({
    slug: "livally-300",
    name: "Livally",
    generic: "Lily of the Valley",
    form: "capsule",
    strength: "৩০০ মি.গ্রা.",
    pack: "৬০ ক্যাপসুল (১ বক্স)",
    mrp: 1080,
  }),
  p({
    slug: "zanthilina-450",
    name: "Zanthilina 450",
    generic: "Spirulina",
    form: "capsule",
    strength: "৪৫০ মি.গ্রা.",
    pack: "৩০ ক্যাপসুল (১ বক্স)",
    mrp: 585,
    featured: true,
  }),
  p({
    slug: "loberin-100",
    name: "Loberin 100",
    generic: "Lobelia",
    form: "capsule",
    strength: "১০০ মি.গ্রা.",
    pack: "৬ ক্যাপসুল (১ স্ট্রিপ)",
    mrp: 99,
  }),
  p({
    slug: "nemagen-475",
    name: "Nemagen 475",
    generic: "Neem",
    form: "capsule",
    strength: "৪৭৫ মি.গ্রা.",
    pack: "৩০ ক্যাপসুল (১ বক্স)",
    mrp: 450,
    featured: true,
  }),
  p({
    slug: "in-biloba-60",
    name: "In Biloba 60",
    generic: "Ginkgo Biloba",
    form: "capsule",
    strength: "৬০ মি.গ্রা.",
    pack: "৩০ ক্যাপসুল (১ বক্স)",
    mrp: 595,
  }),
  // ── Syrups ────────────────────────────────────────────────
  p({
    slug: "arjunarin-450ml",
    name: "Arjunarin",
    generic: "Arjunarista",
    form: "syrup",
    pack: "৪৫০ মি.লি.",
    mrp: 380,
    featured: true,
  }),
  p({
    slug: "hilivon-450ml",
    name: "Hilivon",
    generic: "Rohitakarista",
    form: "syrup",
    pack: "৪৫০ মি.লি.",
    mrp: 250,
    featured: true,
  }),
  p({
    slug: "carmidex-450ml",
    name: "Carmidex",
    generic: "Mustakarista",
    form: "syrup",
    pack: "৪৫০ মি.লি.",
    mrp: 250,
  }),
  p({
    slug: "puridex-450ml",
    name: "Puridex",
    generic: "Saribadyarista",
    form: "syrup",
    pack: "৪৫০ মি.লি.",
    mrp: 360,
  }),
  p({
    slug: "baladex-450ml",
    name: "Baladex",
    generic: "Balarista",
    form: "syrup",
    pack: "৪৫০ মি.লি.",
    mrp: 320,
  }),
  p({
    slug: "bolent-plus-450ml",
    name: "Bolent Plus",
    form: "syrup",
    pack: "৪৫০ মি.লি.",
    mrp: 1200,
  }),
  p({
    slug: "amladex-450ml",
    name: "Amladex",
    generic: "Amalaki Rasayana",
    form: "syrup",
    pack: "৪৫০ মি.লি.",
    mrp: 350,
  }),
  p({
    slug: "laxidex-450ml",
    name: "Laxidex",
    generic: "Abhayarista",
    form: "syrup",
    pack: "৪৫০ মি.লি.",
    mrp: 500,
  }),
  p({
    slug: "ledex-450ml",
    name: "Ledex",
    generic: "Patrangasav",
    form: "syrup",
    pack: "৪৫০ মি.লি.",
    mrp: 270,
  }),
  p({
    slug: "basodex-200ml",
    name: "Basodex",
    generic: "Vasakarista",
    form: "syrup",
    pack: "২০০ মি.লি.",
    mrp: 150,
    featured: true,
  }),
  p({
    slug: "basodex-100ml",
    name: "Basodex",
    generic: "Vasakarista",
    form: "syrup",
    pack: "১০০ মি.লি.",
    mrp: 75,
  }),
  p({
    slug: "bonylin-200ml",
    name: "Bonylin",
    generic: "Aravindasav",
    form: "syrup",
    pack: "২০০ মি.লি.",
    mrp: 200,
  }),
  p({
    slug: "tharmo-care-200ml",
    name: "Tharmo Care",
    generic: "Amritarista",
    form: "syrup",
    pack: "২০০ মি.লি.",
    mrp: 120,
  }),
  p({
    slug: "urofine-200ml",
    name: "Urofine",
    generic: "Chandanashab",
    form: "syrup",
    pack: "২০০ মি.লি.",
    price: 140,
  }),
  p({
    slug: "bacicure-200ml",
    name: "Bacicure",
    generic: "Kutajarista",
    form: "syrup",
    pack: "২০০ মি.লি.",
    mrp: 185,
  }),
  p({
    slug: "gynoton-200ml",
    name: "Gynoton",
    generic: "Ashokarista",
    form: "syrup",
    pack: "২০০ মি.লি.",
    mrp: 198,
  }),
  // ── Powder & others ───────────────────────────────────────
  p({ slug: "index-soya", name: "Index Soya", form: "powder", pack: "২০০ গ্রাম", mrp: 450 }),
  p({
    slug: "sp-gul-isobgul-spicy-100g",
    name: "SP-Gul Isobgul Spicy",
    generic: "Isabgol (Psyllium husk)",
    form: "powder",
    pack: "১০০ গ্রাম",
    mrp: 550,
  }),
];

const BY_SLUG = new Map(PRODUCTS.map((x) => [x.slug, x]));
export const getProduct = (slug: string) => BY_SLUG.get(slug);
export const FEATURED = PRODUCTS.filter((x) => x.featured);

export const productTitle = (x: CatalogItem) =>
  [x.name, x.strength, x.form === "powder" ? undefined : FORM_LABEL[x.form]]
    .filter(Boolean)
    .join(" ");

export const discountPct = (x: CatalogItem) =>
  x.mrp && x.mrp > x.price ? Math.round(((x.mrp - x.price) / x.mrp) * 100) : 0;

// ─── Pricing (used by the browser AND re-run on the server) ───────────────

export const MAX_ITEM_QTY = 20;

export type CartExtra = { slug: string; qty: number };
export type DibedexLine = { package_id: PackageId; quantity: number } | null;

export type QuoteLine = {
  key: string;
  name: string;
  detail: string;
  qty: number;
  unit: number;
  mrp: number;
  total: number;
};

export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  mrpTotal: number;
  savings: number;
  delivery: number;
  total: number;
  units: number;
};

export function quote(dibedex: DibedexLine, extras: CartExtra[], deliveryCharge: number): Quote {
  const lines: QuoteLine[] = [];
  if (dibedex) {
    const pkg = PACKAGES.find((x) => x.id === dibedex.package_id);
    if (pkg) {
      const qty = Math.min(MAX_ITEM_QTY, Math.max(1, Math.floor(dibedex.quantity)));
      lines.push({
        key: `dibedex-${pkg.id}`,
        name: "Dibedex 500 mg",
        detail: pkg.name,
        qty,
        unit: pkg.price,
        mrp: pkg.mrp,
        total: pkg.price * qty,
      });
    }
  }
  const seen = new Set<string>();
  for (const e of extras) {
    const item = getProduct(e.slug);
    if (!item || seen.has(item.slug)) continue;
    seen.add(item.slug);
    const qty = Math.min(MAX_ITEM_QTY, Math.max(1, Math.floor(e.qty)));
    lines.push({
      key: item.slug,
      name: item.name,
      detail: [item.strength, item.pack].filter(Boolean).join(" · "),
      qty,
      unit: item.price,
      mrp: item.mrp ?? item.price,
      total: item.price * qty,
    });
  }
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.mrp * l.qty, 0);
  const delivery = lines.length ? Math.max(0, Math.round(deliveryCharge)) : 0;
  return {
    lines,
    subtotal,
    mrpTotal,
    savings: mrpTotal - subtotal,
    delivery,
    total: subtotal + delivery,
    units: lines.reduce((s, l) => s + l.qty, 0),
  };
}
