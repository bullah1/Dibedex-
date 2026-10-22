import { useEffect } from "react";
import { X } from "lucide-react";
import { CheckoutSection } from "@/components/site/Checkout";
import type { SiteSettings } from "@/lib/site";
import { closeCheckout, openCheckout, useCheckoutOpen } from "@/lib/checkout-modal";
import { setIncludeDibedex } from "@/lib/cart";

/**
 * Popup checkout. Any link to #order (or [data-checkout-open]) opens this
 * dialog instead of scrolling / navigating away.
 */
export function CheckoutModal({ settings }: { settings: SiteSettings }) {
  const open = useCheckoutOpen();

  // Intercept every "order" CTA on the page.
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey) return;
      const target = ev.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>('a[href="#order"], a[href$="/#order"], [data-checkout-open]');
      if (!el) return;
      ev.preventDefault();
      // Every #order link on the site is a Dibedex call-to-action.
      if (!el.hasAttribute("data-cart-checkout")) setIncludeDibedex(true);
      openCheckout();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Deep link support: /#order opens the popup.
  useEffect(() => {
    if (window.location.hash === "#order") {
      setIncludeDibedex(true);
      openCheckout();
    }
  }, []);

  // Lock background scroll + ESC to close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCheckout();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={closeCheckout}
      />
      <div
        className="relative z-10 flex h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-[88vh] sm:rounded-3xl"
        style={{ animation: "checkout-pop .28s cubic-bezier(.16,1,.3,1)" }}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{ borderColor: "#E8E8ED" }}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#0B6B4F" }}>
              Secure Checkout
            </p>
            <h2 className="text-base font-bold" style={{ color: "#1D1D1F" }}>
              অর্ডার সম্পন্ন করুন
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            aria-label="Close checkout"
            className="grid h-9 w-9 place-items-center rounded-full border bg-white text-[#1D1D1F]"
            style={{ borderColor: "#E8E8ED" }}
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <CheckoutSection settings={settings} embedded />
        </div>
      </div>
      <style>{`@keyframes checkout-pop{from{opacity:0;transform:translateY(24px) scale(.98)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
