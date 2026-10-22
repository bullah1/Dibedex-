import { Activity, Leaf, HeartPulse, Battery, ShieldCheck, Moon } from "lucide-react";
import { Reveal } from "./Reveal";
import { HAIRLINE, INK, SANS, SUBTLE, ACCENT, ACCENT_SOFT } from "./theme";

const benefits = [
  { icon: Activity, title: "ব্লাড সুগার ব্যালান্স", text: "স্বাস্থ্যকর গ্লুকোজ মেটাবলিজম সাপোর্ট করে।" },
  { icon: Battery, title: "দিনভর এনার্জি", text: "ক্লান্তি ও দুর্বলতা কমাতে সহায়ক।" },
  { icon: HeartPulse, title: "হার্ট ও সার্কুলেশন", text: "সামগ্রিক কার্ডিও-ওয়েলনেসে সহায়ক।" },
  { icon: Leaf, title: "১০০% হারবাল", text: "জামুন বীজের প্রাকৃতিক নির্যাস, কোনো স্টেরয়েড নয়।" },
  { icon: ShieldCheck, title: "GMP সার্টিফায়েড", text: "নিয়ন্ত্রিত মান ও নিরাপদ উৎপাদন প্রক্রিয়া।" },
  { icon: Moon, title: "ভালো ঘুম ও স্বস্তি", text: "নিয়মিত রুটিনে সুস্থ অনুভূতিতে সহায়ক।" },
];

export function BenefitsGrid() {
  return (
    <section id="benefits" className="bg-white" style={{ fontFamily: SANS, color: INK }}>
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-20">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
            Benefits
          </p>
          <h2 className="mt-2 max-w-lg text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[36px]">
            প্রতিদিনের সুস্থতায় একটি ছোট অভ্যাস
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 60}>
              <div
                className="h-full rounded-3xl p-5 transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,.06)]"
                style={{ border: `1px solid ${HAIRLINE}` }}
              >
                <span
                  className="grid h-10 w-10 place-items-center rounded-2xl"
                  style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}
                >
                  <b.icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <h3 className="mt-4 text-[16px] font-semibold">{b.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: SUBTLE }}>
                  {b.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
