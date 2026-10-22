import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./Reveal";
import { CANVAS, HAIRLINE, INK, SANS, SUBTLE, ACCENT } from "./theme";

const specs = [
  { label: "প্রোডাক্ট", value: "Dibedex 500 mg Capsule" },
  { label: "মূল উপাদান", value: "Syzygium Jambolanum (জামুন বীজ) 500 mg" },
  { label: "ধরন", value: "আয়ুর্বেদিক হারবাল সাপ্লিমেন্ট" },
  { label: "প্যাক সাইজ", value: "৩০ / ৬০ / ৯০ ক্যাপসুল" },
  { label: "সার্টিফিকেশন", value: "GMP সার্টিফায়েড ম্যানুফ্যাকচারিং" },
];

const details = [
  {
    q: "সেবনবিধি",
    a: "প্রাপ্তবয়স্কদের জন্য দিনে ২ বার, খাবারের ৩০ মিনিট আগে ১টি করে ক্যাপসুল — অথবা চিকিৎসকের পরামর্শ অনুযায়ী। পর্যাপ্ত পানি পান করুন।",
  },
  {
    q: "কতদিনে ফল বোঝা যায়",
    a: "নিয়মিত সেবনে সাধারণত ২–৪ সপ্তাহের মধ্যে অনেকে পার্থক্য বুঝতে শুরু করেন। সর্বোত্তম ফলাফলের জন্য ২–৩ মাস কোর্স পরামর্শ দেওয়া হয়।",
  },
  {
    q: "সতর্কতা",
    a: "গর্ভবতী, স্তন্যদানকারী মা ও দীর্ঘমেয়াদি ঔষধ সেবনকারীরা চিকিৎসকের পরামর্শ নিয়ে ব্যবহার করুন। এটি কোনো রোগ নিরাময়ের গ্যারান্টি দেয় না।",
  },
  {
    q: "সংরক্ষণ",
    a: "ঠান্ডা ও শুকনো জায়গায়, সরাসরি সূর্যালোক থেকে দূরে রাখুন। শিশুদের নাগালের বাইরে রাখুন।",
  },
];

export function ProductDetails() {
  return (
    <section id="details" style={{ backgroundColor: CANVAS, fontFamily: SANS, color: INK }}>
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-20">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
            Product details
          </p>
          <h2 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[36px]">
            যা জানা দরকার
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl bg-white p-5" style={{ border: `1px solid ${HAIRLINE}` }}>
              <dl className="divide-y" style={{ borderColor: HAIRLINE }}>
                {specs.map((s) => (
                  <div key={s.label} className="flex items-start justify-between gap-4 py-3">
                    <dt className="text-[13.5px]" style={{ color: SUBTLE }}>
                      {s.label}
                    </dt>
                    <dd className="text-right text-[14px] font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <Accordion type="single" collapsible className="rounded-3xl bg-white px-5" style={{ border: `1px solid ${HAIRLINE}` }}>
              {details.map((d, i) => (
                <AccordionItem key={d.q} value={`d-${i}`} className="border-b last:border-0" style={{ borderColor: HAIRLINE }}>
                  <AccordionTrigger className="py-4 text-left text-[15px] font-semibold hover:no-underline">
                    {d.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-[14px] leading-relaxed" style={{ color: SUBTLE }}>
                    {d.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
