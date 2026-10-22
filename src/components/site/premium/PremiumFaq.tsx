import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/site";
import { Reveal } from "./Reveal";
import { CANVAS, HAIRLINE, INK, SANS, SUBTLE, ACCENT, ACCENT_SOFT } from "./theme";

const faqs = [
  {
    q: "Dibedex 500 mg কী?",
    a: "প্রাকৃতিক জামুন (Syzygium Jambolanum) বীজের নির্যাসে তৈরি একটি আয়ুর্বেদিক হারবাল ক্যাপসুল, যা স্বাস্থ্যকর ব্লাড সুগার ম্যানেজমেন্টে সহায়ক।",
  },
  {
    q: "দাম কত এবং কোন প্যাকেজ নেব?",
    a: "৩০ ক্যাপসুল ৳৩৫০, ৬০ ক্যাপসুল ৳৬৫০ এবং ৯০ ক্যাপসুল ৳৯৫০। সর্বোত্তম ফলাফলের জন্য ২–৩ মাসের কোর্স (৬০/৯০ ক্যাপসুল) নেওয়া বেশি সাশ্রয়ী।",
  },
  {
    q: "কোনো পার্শ্বপ্রতিক্রিয়া আছে?",
    a: "নির্দেশিত মাত্রায় সেবনে সাধারণত পার্শ্বপ্রতিক্রিয়া দেখা যায় না। গর্ভবতী, স্তন্যদানকারী মা বা দীর্ঘমেয়াদি ঔষধ চললে চিকিৎসকের পরামর্শ নিন।",
  },
  {
    q: "ডেলিভারি কতদিনে পাব?",
    a: "অর্ডার কনফার্মের পর ঢাকায় ১–২ কার্যদিবস এবং ঢাকার বাইরে ৩–৫ কার্যদিবসের মধ্যে ডেলিভারি হয়।",
  },
  {
    q: "পেমেন্ট কীভাবে করব?",
    a: "ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে পেমেন্ট করতে পারবেন। bKash ও Nagad পেমেন্টও গ্রহণযোগ্য।",
  },
  {
    q: "প্রোডাক্ট অরিজিনাল কিনা কীভাবে বুঝব?",
    a: "আমরা সরাসরি অথরাইজড সোর্স থেকে সরবরাহ করি। প্রতিটি প্যাকে সিল ও ব্যাচ নম্বর থাকে — না মিললে রিটার্ন করতে পারবেন।",
  },
];

export function PremiumFaq({
  callNumber,
  whatsappNumber,
}: {
  callNumber: string;
  whatsappNumber: string;
}) {
  return (
    <section id="faq" style={{ backgroundColor: CANVAS, fontFamily: SANS, color: INK }}>
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-20">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
            FAQ
          </p>
          <h2 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[36px]">
            সাধারণ জিজ্ঞাসা
          </h2>
        </Reveal>

        <Reveal delay={60}>
          <Accordion
            type="single"
            collapsible
            className="mt-7 rounded-3xl bg-white px-5"
            style={{ border: `1px solid ${HAIRLINE}` }}
          >
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`f-${i}`}
                className="border-b last:border-0"
                style={{ borderColor: HAIRLINE }}
              >
                <AccordionTrigger className="py-4 text-left text-[15px] font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-[14px] leading-relaxed" style={{ color: SUBTLE }}>
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={100}>
          <div
            className="mt-4 flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center sm:flex-row sm:justify-between sm:text-left"
            style={{ border: `1px solid ${HAIRLINE}` }}
          >
            <div>
              <p className="text-[15px] font-semibold">আরও কিছু জানার আছে?</p>
              <p className="mt-1 text-[13.5px]" style={{ color: SUBTLE }}>
                আমাদের সাপোর্ট টিম প্রতিদিন সকাল ৯টা – রাত ৯টা পর্যন্ত।
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${callNumber}`}
                className="flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold"
                style={{ backgroundColor: ACCENT_SOFT, color: ACCENT }}
              >
                <Phone className="h-4 w-4" /> কল
              </a>
              <a
                href={buildWhatsAppLink(whatsappNumber, "আমি Dibedex সম্পর্কে জানতে চাই।")}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold"
                style={{ border: `1.5px solid ${HAIRLINE}`, color: INK }}
              >
                <MessageCircle className="h-4 w-4" style={{ color: "#25D366" }} /> WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
