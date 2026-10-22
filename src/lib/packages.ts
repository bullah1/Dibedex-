import { useEffect, useState } from "react";
import { track } from "./analytics";
import boxImg from "@/assets/packs/dibedex-60-box.webp";

export type PackageId = "p30" | "p60" | "p90";

export type Package = {
  id: PackageId;
  name: string;
  capsules: number;
  price: number;
  mrp: number;
  badge?: string;
  highlight?: boolean;
  tag?: string;
  /** What is physically in the parcel, shown under the package name */
  contents?: string;
  /** Very short version for tight spaces (checkout tiles) */
  short?: string;
  /** Photo for this package (falls back to the main Dibedex photo) */
  image?: string;
  /** Small label on the photo, e.g. "+ স্ট্রিপ" */
  imageNote?: string;
};

export const PACKAGES: Package[] = [
  { id: "p30", name: "৩০ Capsules", capsules: 30, price: 350, mrp: 450 },
  {
    id: "p60",
    name: "৬০ Capsules",
    capsules: 60,
    price: 650,
    mrp: 900,
    badge: "Best Value",
    tag: "সাশ্রয়ী",
    contents: "১টি বক্স (৬০ ক্যাপসুল)",
    short: "১ বক্স",
    image: boxImg,
  },
  {
    id: "p90",
    name: "৯০ Capsules",
    capsules: 90,
    price: 950,
    mrp: 1350,
    badge: "Most Popular",
    highlight: true,
    tag: "সর্বোচ্চ সাশ্রয়",
    contents: "১টি বক্স (৬০) + স্ট্রিপ (৩০ ক্যাপসুল)",
    short: "বক্স + স্ট্রিপ",
    image: boxImg,
    imageNote: "বক্স + স্ট্রিপ",
  },
];

export const DEFAULT_PACKAGE_ID: PackageId = "p30";
export const PACKAGE_EVENT = "dibedex:package-select";
const STORAGE_KEY = "dibedex:selected-package";

export function getPackage(id: PackageId): Package {
  return PACKAGES.find((p) => p.id === id) ?? PACKAGES[2];
}

export function selectPackage(id: PackageId) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
  const pkg = getPackage(id);
  track("select_package", {
    package_id: id,
    package_name: pkg.name,
    price: pkg.price,
    mrp: pkg.mrp,
    capsules: pkg.capsules,
  });
  window.dispatchEvent(new CustomEvent(PACKAGE_EVENT, { detail: id }));
}

export function useSelectedPackage(): { pkg: Package; id: PackageId } {
  const [id, setId] = useState<PackageId>(DEFAULT_PACKAGE_ID);

  // Hydrate from localStorage AFTER mount to avoid SSR hydration mismatch.
  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY) as PackageId | null;
      if (s === "p30" || s === "p60" || s === "p90") setId(s);
    } catch {
      /* ignore */
    }
    const h = (e: Event) => {
      const d = (e as CustomEvent).detail as PackageId;
      if (d === "p30" || d === "p60" || d === "p90") setId(d);
    };
    window.addEventListener(PACKAGE_EVENT, h);
    return () => window.removeEventListener(PACKAGE_EVENT, h);
  }, []);

  return { pkg: getPackage(id), id };
}
