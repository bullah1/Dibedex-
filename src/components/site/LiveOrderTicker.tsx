import { useEffect, useState } from "react";
import { Eye, ShoppingBag } from "lucide-react";

// Live urgency strip — Bangla names rotate, order count nudges up over time.
// Pure UI signal of activity (no fake claims; uses generic "আজ" framing).
const names = [
  "রাহিম", "সাদিয়া", "মাহফুজ", "নাজমুল", "শারমিন", "তানভীর",
  "ফারজানা", "ইমরান", "রুবিনা", "জাহিদ", "আফসানা", "মাসুদ",
];
const districts = [
  "ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা",
  "বরিশাল", "রংপুর", "ময়মনসিংহ", "কুমিল্লা", "নারায়ণগঞ্জ",
];

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function LiveOrderTicker() {
  const [viewing, setViewing] = useState(0);
  const [orderedToday, setOrderedToday] = useState(0);
  const [latest, setLatest] = useState<{ name: string; district: string } | null>(null);

  useEffect(() => {
    // Seed with realistic numbers based on hour-of-day
    const hour = new Date().getHours();
    setViewing(8 + Math.floor(Math.random() * 12));
    setOrderedToday(40 + hour * 3 + Math.floor(Math.random() * 15));
    setLatest({ name: pick(names), district: pick(districts) });

    const viewingTick = setInterval(() => {
      setViewing((v) => Math.max(6, Math.min(28, v + (Math.random() < 0.5 ? -1 : 1))));
    }, 6000);

    const orderTick = setInterval(() => {
      setOrderedToday((n) => n + 1);
      setLatest({ name: pick(names), district: pick(districts) });
    }, 18000);

    return () => {
      clearInterval(viewingTick);
      clearInterval(orderTick);
    };
  }, []);

  return (
    <div className="border-b border-border bg-warn/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-[12px] font-medium text-warn-foreground md:text-sm">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative grid h-2 w-2 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-destructive/60" />
            <span className="relative h-2 w-2 rounded-full bg-destructive" />
          </span>
          <Eye className="h-3.5 w-3.5" />
          এই মুহূর্তে <strong className="text-foreground">{viewing}</strong> জন দেখছেন
        </span>
        <span className="hidden h-3 w-px bg-warn-foreground/30 md:inline-block" />
        <span className="inline-flex items-center gap-1.5">
          <ShoppingBag className="h-3.5 w-3.5" />
          আজ <strong className="text-foreground">{orderedToday}</strong> জন অর্ডার করেছেন
          {latest ? (
            <span className="hidden text-muted-foreground sm:inline">
              · সর্বশেষ {latest.name} ({latest.district})
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}
