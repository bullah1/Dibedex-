/**
 * Google AdSense configuration.
 *
 * Nothing renders and no script loads until ADSENSE_CLIENT is a real
 * publisher ID (`ca-pub-...`). Set it here (or via VITE_ADSENSE_CLIENT)
 * once AdSense approves dibedex.com, then fill in the slot IDs below.
 */

export const ADSENSE_CLIENT: string =
  (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined) ?? "";

/** Individual ad unit slot IDs created in the AdSense dashboard. */
export const ADSENSE_SLOTS = {
  /** Bottom of the legal / info pages (privacy, terms, shipping, refund, contact). */
  legalFooter: (import.meta.env.VITE_ADSENSE_SLOT_LEGAL as string | undefined) ?? "",
  /** Homepage, after the FAQ section and above the footer. */
  homeFooter: (import.meta.env.VITE_ADSENSE_SLOT_HOME as string | undefined) ?? "",
} as const;

export function isAdsenseEnabled(): boolean {
  return /^ca-pub-\d+$/.test(ADSENSE_CLIENT);
}
