import { useEffect, useState } from "react";
import { Phone, MessageCircle, ShoppingBag, Loader2 } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/site";
import { useSelectedPackage } from "@/lib/packages";
import { useCheckoutSubmitting } from "@/lib/checkout-state";
import { openCheckout, useCheckoutOpen } from "@/lib/checkout-modal";
import { setIncludeDibedex } from "@/lib/cart";

export function MobileStickyBar({
  callNumber,
  whatsappNumber,
}: {
  callNumber: string;
  whatsappNumber: string;
  price?: number;
}) {
  const { pkg } = useSelectedPackage();
  const submitting = useCheckoutSubmitting();
  const modalOpen = useCheckoutOpen();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waLink = buildWhatsAppLink(
    whatsappNumber,
    `আমি Dibedex 500 mg (${pkg.name}) অর্ডার করতে চাই।`,
  );

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 transition-all duration-300 md:hidden ${
        visible && !modalOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!visible || modalOpen}
    >
      <div className="mx-auto flex max-w-md items-stretch gap-2 rounded-[22px] border p-2 shadow-[0_8px_30px_rgba(6,78,59,0.18)] backdrop-blur-xl" style={{ backgroundColor: "rgba(255,255,255,0.92)", borderColor: "#E8E8ED" }}>
        <a
          href={`tel:${callNumber}`}
          aria-label="Call now"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border bg-white text-[#1D1D1F] transition-colors"
          style={{ borderColor: "#E8E8ED" }}
        >
          <Phone className="h-5 w-5" strokeWidth={2.2} />
        </a>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#25D366] text-white transition-transform active:scale-95"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
        </a>
        <button
          type="button"
          onClick={() => {
            setIncludeDibedex(true);
            openCheckout();
          }}
          disabled={submitting}
          className="group relative flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl px-3 text-sm font-bold text-white shadow-md transition-transform active:scale-[0.98] disabled:opacity-70"
          style={{ backgroundColor: "#0B6B4F", boxShadow: "0 8px 22px rgba(11,107,79,0.28)" }}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" strokeWidth={2.5} />
              <span className="truncate">সাবমিট হচ্ছে…</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              <span className="truncate">অর্ডার করুন</span>
              <span className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums" style={{ backgroundColor: "rgba(255,255,255,0.22)", color: "white" }}>
                ৳{pkg.price}
              </span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}


export function FloatingWhatsApp({ whatsappNumber }: { whatsappNumber: string }) {
  const waLink = buildWhatsAppLink(
    whatsappNumber,
    "আমি Dibedex 500 mg সম্পর্কে জানতে চাই।",
  );
  return (
    <a
      href={waLink}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-5 z-40 hidden h-14 w-14 place-items-center md:grid rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
