/**
 * Lightweight analytics abstraction. Forwards events to any of:
 * - window.dataLayer (GTM / GA4)
 * - window.gtag (GA4)
 * - window.fbq (Meta Pixel)
 * - window.posthog
 * plus console.debug in dev. Safe to call before any provider is loaded.
 */

import { useEffect } from "react";

type Props = Record<string, unknown>;

// Extend the Window type without polluting global scope.
type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  posthog?: { capture?: (name: string, props?: Props) => void };
};

const PERSIST_EVENTS = new Set([
  "view_checkout",
  "begin_checkout",
  "checkout_submit",
  "order_pending",
  "checkout_validation_error",
  "checkout_error",
  "purchase",
  "select_package",
]);

const SESSION_KEY = "dibedex:sid";
function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "anon";
  }
}

function getDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/**
 * Catalog SKUs — these MUST match `g:id` in /feed.xml and the product IDs in
 * the Meta / Google catalog, otherwise Pixel events can't be attributed.
 */
export const CATALOG_IDS: Record<string, string> = {
  p30: "dbx-syz-500-30",
  p60: "dbx-syz-500-60",
  p90: "dbx-syz-500-90",
};
export const DEFAULT_CATALOG_ID = "dbx-syz-500-30";

function num(v: unknown): number | undefined {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : undefined;
}

/** Build Meta Pixel standard parameters from our internal event props. */
function metaParams(props: Props): Record<string, unknown> {
  const pkgId = typeof props.package_id === "string" ? props.package_id : undefined;
  const contentId = (pkgId && CATALOG_IDS[pkgId]) || DEFAULT_CATALOG_ID;
  const quantity = num(props.quantity) ?? 1;
  const value =
    num(props.total) ??
    num(props.subtotal) ??
    (num(props.unit_price) ?? num(props.price) ?? 0) * quantity;

  return {
    ...props,
    content_type: "product",
    content_ids: [contentId],
    contents: [{ id: contentId, quantity, item_price: num(props.unit_price) ?? num(props.price) }],
    content_name:
      (typeof props.package_name === "string" ? `Dibedex 500 mg — ${props.package_name}` : "Dibedex 500 mg"),
    content_category: "Ayurvedic Diabetes Support",
    num_items: quantity,
    value: value || 0,
    currency: "BDT",
  };
}

function makeEventId(name: string): string {
  return `${name}.${getSessionId()}.${Date.now().toString(36)}.${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function persistEvent(event: string, props: Props) {

  if (typeof window === "undefined") return;
  if (!PERSIST_EVENTS.has(event)) return;
  try {
    const payload = JSON.stringify({
      event,
      device: getDevice(),
      session_id: getSessionId(),
      path: window.location.pathname,
      props,
    });
    const url = "/api/public/track";
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon && navigator.sendBeacon(url, blob)) return;
    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  const payload = { event, ...props, ts: Date.now() };

  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(payload);
  } catch {
    /* ignore */
  }

  try {
    w.gtag?.("event", event, props);
  } catch {
    /* ignore */
  }

  try {
    // Map common e-commerce events to Meta Pixel standard names.
    const fbMap: Record<string, string> = {
      select_package: "ViewContent",
      view_checkout: "AddToCart",
      begin_checkout: "InitiateCheckout",
      cta_click: "Lead",
      purchase: "Purchase",
      search: "Search",
    };
    let fbName = fbMap[event];
    // Call / WhatsApp clicks are contact attempts → Meta "Contact" event.
    if (event === "cta_click" && (props.type === "call" || props.type === "whatsapp")) {
      fbName = "Contact";
    }
    if (fbName && w.fbq) {
      w.fbq("track", fbName, metaParams(props), { eventID: makeEventId(fbName) });
    }
  } catch {
    /* ignore */
  }


  try {
    w.posthog?.capture?.(event, props);
  } catch {
    /* ignore */
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props);
  }

  persistEvent(event, props);
}

/**
 * Delegated click listener that automatically fires cta_click for:
 * - anchors to #order
 * - tel: links
 * - WhatsApp links (wa.me / api.whatsapp.com)
 * - any element with data-analytics-cta="..."
 */
export function useAnalyticsAutoTrack() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest<HTMLElement>("[data-analytics-cta], a[href]");
      if (!el) return;

      const explicit = el.getAttribute("data-analytics-cta");
      if (explicit) {
        track("cta_click", {
          type: explicit,
          location: el.getAttribute("data-analytics-location") || undefined,
        });
        return;
      }

      const href = el.getAttribute("href") || "";
      let type: string | null = null;
      if (href.startsWith("#order")) type = "order";
      else if (href.startsWith("tel:")) type = "call";
      else if (/wa\.me|api\.whatsapp\.com/i.test(href)) type = "whatsapp";
      if (!type) return;

      track("cta_click", {
        type,
        href,
        location: nearestSectionId(el),
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
}

function nearestSectionId(el: HTMLElement): string | undefined {
  let node: HTMLElement | null = el;
  while (node) {
    if (node.tagName === "SECTION" && node.id) return node.id;
    node = node.parentElement;
  }
  return undefined;
}
