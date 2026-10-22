import { useEffect, useState, type ReactNode } from "react";
import { ShoppingBag } from "lucide-react";
import { Toaster } from "sonner";

import { CheckoutModal } from "@/components/site/CheckoutModal";
import { SiteFooter } from "@/components/site/Sections";
import { SiteHeader } from "@/components/site/SiteHeader";
import { FloatingWhatsApp } from "@/components/site/StickyBars";
import { ACCENT, SANS } from "@/components/site/premium/theme";
import { useAnalyticsAutoTrack } from "@/lib/analytics";
import { cartCount, useCart } from "@/lib/cart";
import { quote } from "@/lib/catalog";
import { openCheckout, useCheckoutOpen } from "@/lib/checkout-modal";
import { DEFAULT_SETTINGS, fetchSettings, type SiteSettings } from "@/lib/site";

/** Header + footer + checkout for the product pages. */
export function ShopLayout({ children }: { children: (settings: SiteSettings) => ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  useAnalyticsAutoTrack();

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0" style={{ fontFamily: SANS }}>
      <SiteHeader />
      <main>{children(settings)}</main>
      <SiteFooter callNumber={settings.call_number} whatsappNumber={settings.whatsapp_number} />
      <CartBar />
      <CheckoutModal settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings.whatsapp_number} />
      <Toaster position="top-center" richColors />
    </div>
  );
}

function CartBar() {
  const cart = useCart();
  const modalOpen = useCheckoutOpen();
  const count = cartCount(cart);
  const q = quote(null, cart.extras, 0);
  if (count === 0 || modalOpen) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
      <div
        className="mx-auto flex max-w-md items-center gap-3 rounded-[22px] border p-2 pl-4 shadow-[0_8px_30px_rgba(6,78,59,0.18)] backdrop-blur-xl"
        style={{ backgroundColor: "rgba(255,255,255,0.94)", borderColor: "#E8E8ED" }}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] text-slate-500">কার্টে {count}টি প্রোডাক্ট</p>
          <p className="text-[15px] font-bold tabular-nums" style={{ color: ACCENT }}>
            ৳{q.subtotal}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCheckout()}
          className="flex h-12 shrink-0 items-center gap-2 rounded-2xl px-5 text-sm font-bold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          <ShoppingBag className="h-4 w-4" /> চেকআউট
        </button>
      </div>
    </div>
  );
}
