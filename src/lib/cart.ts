import { useSyncExternalStore } from "react";

import { MAX_ITEM_QTY, getProduct, type CartExtra } from "@/lib/catalog";
import { track } from "@/lib/analytics";

/**
 * Rule: Dibedex is in the order only when the visitor clicked a Dibedex
 * order button (or added it back in checkout). If the cart is empty, the
 * checkout falls back to Dibedex, exactly like the old single-product page.
 *
 * Cart for the extra (non-Dibedex) products, plus a flag for whether the
 * Dibedex package chosen on the landing page is part of the order.
 * Shared across pages via a tiny external store, persisted in localStorage.
 */
type CartState = { extras: CartExtra[]; includeDibedex: boolean };

const KEY = "dibedex:cart-v1";
const EMPTY: CartState = { extras: [], includeDibedex: false };
let state: CartState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<CartState>;
    state = {
      includeDibedex: parsed.includeDibedex === true,
      extras: Array.isArray(parsed.extras)
        ? parsed.extras
            .filter((e) => e && getProduct(e.slug) && e.qty > 0)
            .map((e) => ({ slug: e.slug, qty: Math.min(MAX_ITEM_QTY, Math.floor(e.qty)) }))
        : [],
    };
  } catch {
    /* storage unavailable */
  }
}

function set(next: CartState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  hydrate();
  listeners.add(l);
  // notify once after hydration so the first client render picks up saved state
  queueMicrotask(l);
  return () => listeners.delete(l);
}

export function useCart(): CartState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY,
  );
}

export function cartQty(slug: string) {
  return state.extras.find((e) => e.slug === slug)?.qty ?? 0;
}

export function setExtraQty(slug: string, qty: number) {
  hydrate();
  const q = Math.max(0, Math.min(MAX_ITEM_QTY, Math.floor(qty)));
  const exists = state.extras.some((e) => e.slug === slug);
  const extras =
    q === 0
      ? state.extras.filter((e) => e.slug !== slug)
      : exists
        ? state.extras.map((e) => (e.slug === slug ? { ...e, qty: q } : e))
        : [...state.extras, { slug, qty: q }];
  set({ extras, includeDibedex: state.includeDibedex });
}

export function addExtra(slug: string, qty = 1) {
  hydrate();
  const item = getProduct(slug);
  if (!item) return;
  setExtraQty(slug, cartQty(slug) + qty);
  track("add_to_cart", { product: slug, price: item.price, quantity: qty });
}

export function setIncludeDibedex(v: boolean) {
  hydrate();
  if (!v && state.extras.length === 0) return;
  set({ ...state, includeDibedex: v });
}

export function clearCart() {
  set({ extras: [], includeDibedex: false });
}

export function cartCount(s: CartState) {
  return s.extras.reduce((n, e) => n + e.qty, 0);
}
