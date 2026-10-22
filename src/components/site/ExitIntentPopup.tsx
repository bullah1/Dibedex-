import { useEffect, useMemo, useState } from "react";
import { X, Gift, Clock } from "lucide-react";
import { track } from "@/lib/analytics";
import { useExperiment } from "@/lib/ab";

const STORAGE_KEY = "dibedex_exit_popup_shown";

/**
 * A/B test: exit-intent discount offer + button copy.
 * Slice `experiment_view`, `exit_intent_shown`, `exit_intent_claimed`,
 * `exit_intent_dismissed`, `cta_click`, and `purchase` by `variant` in
 * GA4 / PostHog to pick the winner.
 */
const EXPERIMENT_KEY = "exit_popup_offer_v1";

type Variant = "flat_100" | "percent_15" | "free_gift";

const VARIANTS: Record<
  Variant,
  {
    coupon: string;
    badge: string;
    headline: string;
    sub: string;
    button: string;
  }
> = {
  flat_100: {
    coupon: "SAVE100",
    badge: "শুধুমাত্র আপনার জন্য",
    headline: "যাবেন না! ৳১০০ ছাড় নিয়ে যান",
    sub: "আজই অর্ডার করলে অতিরিক্ত ৳১০০ ডিসকাউন্ট — সীমিত সময়ের অফার।",
    button: "এখনই অর্ডার করুন →",
  },
  percent_15: {
    coupon: "SAVE15",
    badge: "আজকের স্পেশাল অফার",
    headline: "১৫% এক্সট্রা ছাড় আনলক করুন",
    sub: "যেকোনো প্যাকেজে অতিরিক্ত ১৫% ডিসকাউন্ট — শুধু আজকের জন্য।",
    button: "ডিসকাউন্ট নিয়ে অর্ডার করুন →",
  },
  free_gift: {
    coupon: "GIFT",
    badge: "ফ্রি গিফট + ফ্রি ডেলিভারি",
    headline: "এখনই অর্ডার — ফ্রি গিফট পাবেন 🎁",
    sub: "আজ অর্ডার করলে ফ্রি হেলথ গাইড ও সারা বাংলাদেশে ফ্রি ডেলিভারি।",
    button: "ফ্রি গিফট নিন →",
  },
};

export function ExitIntentPopup() {
  const variant = useExperiment<Variant>({
    key: EXPERIMENT_KEY,
    variants: ["flat_100", "percent_15", "free_gift"] as const,
  });
  const cfg = useMemo(() => VARIANTS[variant], [variant]);

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(600); // 10 min

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let armed = false;
    const arm = setTimeout(() => {
      armed = true;
    }, 8000);

    const trigger = () => {
      if (!armed) return;
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
      track("exit_intent_shown", {
        experiment: EXPERIMENT_KEY,
        variant,
        coupon: cfg.coupon,
      });
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };

    let lastY = window.scrollY;
    let lastT = Date.now();
    const onScroll = () => {
      const y = window.scrollY;
      const t = Date.now();
      const dy = lastY - y;
      const dt = t - lastT;
      if (y > 400 && dy > 60 && dt < 250) trigger();
      lastY = y;
      lastT = t;
    };

    const fallback = setTimeout(trigger, 45000);

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(arm);
      clearTimeout(fallback);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [variant, cfg.coupon]);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const close = () => {
    setOpen(false);
    track("exit_intent_dismissed", { experiment: EXPERIMENT_KEY, variant });
  };

  const claim = () => {
    track("exit_intent_claimed", {
      experiment: EXPERIMENT_KEY,
      variant,
      coupon: cfg.coupon,
    });
    setOpen(false);
    const el = document.getElementById("order");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cfg.coupon);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 px-4 pb-6 pt-10 backdrop-blur-sm sm:items-center sm:pb-10"
      onClick={close}
      role="dialog"
      aria-modal="true"
      data-ab-variant={variant}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/5 text-slate-700 transition hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 px-6 pb-5 pt-7 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-50/90">
            <Gift className="h-4 w-4" /> {cfg.badge}
          </div>
          <h3 className="mt-2 text-2xl font-extrabold leading-tight">
            {cfg.headline}
          </h3>
          <p className="mt-1 text-sm text-emerald-50/90">{cfg.sub}</p>
        </div>

        <div className="space-y-4 px-6 pb-6 pt-5">
          <div className="flex items-center justify-between rounded-xl border-2 border-dashed border-emerald-500 bg-emerald-50 px-4 py-3">
            <div>
              <div className="text-[11px] font-semibold uppercase text-emerald-700">
                কুপন কোড
              </div>
              <div className="font-mono text-xl font-extrabold tracking-widest text-emerald-800">
                {cfg.coupon}
              </div>
            </div>
            <button
              onClick={copy}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg bg-rose-50 py-2 text-sm font-semibold text-rose-700">
            <Clock className="h-4 w-4" />
            অফার শেষ হবে: <span className="font-mono">{mm}:{ss}</span>
          </div>

          <button
            onClick={claim}
            data-analytics-cta="exit_popup_claim"
            data-analytics-location={variant}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-base font-extrabold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            {cfg.button}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            Cash on Delivery · সারা বাংলাদেশে ফ্রি ডেলিভারি
          </p>
        </div>
      </div>
    </div>
  );
}
