import { Truck, BadgeCheck, Timer, Lock } from "lucide-react";
import { Reveal } from "./Reveal";
import { CANVAS, HAIRLINE, INK, SANS, SUBTLE, ACCENT } from "./theme";

const items = [
  { icon: Truck, title: "ক্যাশ অন ডেলিভারি", note: "পণ্য হাতে পেয়ে পেমেন্ট" },
  { icon: BadgeCheck, title: "১০০% অরিজিনাল", note: "অথেনটিক প্রোডাক্ট গ্যারান্টি" },
  { icon: Timer, title: "ফাস্ট ডেলিভারি", note: "ঢাকায় ১–২ দিন, বাইরে ৩–৫ দিন" },
  { icon: Lock, title: "সিকিউর চেকআউট", note: "তথ্য সম্পূর্ণ গোপনীয়" },
];

export function TrustStrip() {
  return (
    <section style={{ backgroundColor: CANVAS, fontFamily: SANS, color: INK }}>
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        <Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {items.map((it) => (
              <div
                key={it.title}
                className="rounded-2xl bg-white p-4"
                style={{ border: `1px solid ${HAIRLINE}` }}
              >
                <it.icon className="h-5 w-5" strokeWidth={1.9} style={{ color: ACCENT }} />
                <p className="mt-3 text-[13.5px] font-semibold leading-snug">{it.title}</p>
                <p className="mt-1 text-[12px] leading-snug" style={{ color: SUBTLE }}>
                  {it.note}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
