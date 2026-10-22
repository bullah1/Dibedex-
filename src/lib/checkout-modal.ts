import { useEffect, useState } from "react";

/** Global open/close bus for the popup checkout. */
export const CHECKOUT_MODAL_EVENT = "dibedex:checkout-modal";

let openState = false;

export function isCheckoutOpen() {
  return openState;
}

export function setCheckoutOpen(open: boolean) {
  openState = open;
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHECKOUT_MODAL_EVENT, { detail: open }));
}

export function openCheckout() {
  setCheckoutOpen(true);
}

export function closeCheckout() {
  setCheckoutOpen(false);
}

export function useCheckoutOpen(): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(openState);
    const h = (e: Event) => setOpen(Boolean((e as CustomEvent).detail));
    window.addEventListener(CHECKOUT_MODAL_EVENT, h);
    return () => window.removeEventListener(CHECKOUT_MODAL_EVENT, h);
  }, []);
  return open;
}
