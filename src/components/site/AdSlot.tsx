import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT, isAdsenseEnabled } from "@/lib/adsense";

type AdsWindow = Window & { adsbygoogle?: unknown[] };

/**
 * A single responsive AdSense display unit.
 *
 * Renders nothing at all until a real publisher ID and slot ID exist, so the
 * site stays clean while AdSense approval is pending. Reserves its height up
 * front to avoid layout shift, and only mounts on the client to keep SSR
 * markup and hydration in sync.
 */
export function AdSlot({
  slot,
  className = "",
  minHeight = 280,
}: {
  slot: string;
  className?: string;
  minHeight?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const pushed = useRef(false);
  const enabled = isAdsenseEnabled() && Boolean(slot);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !enabled || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as AdsWindow;
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* ad blocker or script not loaded — ignore */
    }
  }, [mounted, enabled]);

  if (!enabled || !mounted) return null;

  return (
    <aside
      className={`mx-auto w-full max-w-4xl px-4 py-6 ${className}`}
      aria-label="Advertisement"
    >
      <div className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        বিজ্ঞাপন
      </div>
      <div style={{ minHeight }} className="overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
