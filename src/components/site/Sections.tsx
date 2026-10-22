import {
  AlertCircle,
  Activity,
  Brain,
  Sprout,
  Leaf,
  Pill,
  HeartPulse,
  Clock,
  ShieldCheck,
  Truck,
  Phone,
  MessageCircle,
  Headphones,
  PackageCheck,
  Info,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  ShoppingCart,
  Stethoscope,
  Baby,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/site";

const CREAM = "#FDFCF0";
const CREAM_DEEP = "#F7F2DF";
const EMERALD = "#064E3B";
const EMERALD_SOFT = "#0d7a5f";
const GOLD = "#A16207";
const GOLD_SOFT = "#C7902A";
const BORDER = "#F1E9D2";
const INK = "#1A2E2A";

const problems = [
  { icon: AlertCircle, text: "খাবারে সামান্য অনিয়মেই সুগার বেড়ে যায়" },
  { icon: Activity, text: "অতিরিক্ত দুর্বলতা বা ক্লান্তি" },
  { icon: Brain, text: "বারবার সুগার নিয়ন্ত্রণের চিন্তা" },
  { icon: Sprout, text: "নিয়মিত স্বাস্থ্য রুটিনে হারবাল সাপোর্ট দরকার" },
];

const benefits = [
  { icon: Leaf, title: "Jamun Extract 500 mg", desc: "প্রতি ক্যাপসুলে জাম বীজের নির্যাস।" },
  { icon: Sprout, title: "Ayurvedic Formulation", desc: "প্রাচীন আয়ুর্বেদিক ঐতিহ্য অনুসরণে তৈরি।" },
  { icon: HeartPulse, title: "Diabetes Management Support", desc: "ডায়াবেটিস ম্যানেজমেন্টে সহায়ক হিসেবে।" },
  { icon: Pill, title: "Easy Capsule Format", desc: "সহজে সেবনযোগ্য ক্যাপসুল ফর্মে।" },
  { icon: Clock, title: "Daily Routine Friendly", desc: "প্রতিদিনের রুটিনে সহজে যোগ করুন।" },
  { icon: ShieldCheck, title: "Original Product", desc: "অরিজিনাল প্যাকেজিং, নিরাপদ ডেলিভারি।" },
];

const trust = [
  { icon: ShieldCheck, label: "Original Product" },
  { icon: PackageCheck, label: "Secure Order" },
  { icon: Truck, label: "Cash on Delivery" },
  { icon: Truck, label: "Fast Delivery" },
  { icon: MessageCircle, label: "WhatsApp Support" },
  { icon: Headphones, label: "Customer Care" },
];

const faqs = [
  {
    q: "Dibedex কী?",
    a: "Dibedex 500 mg একটি আয়ুর্বেদিক হারবাল সাপ্লিমেন্ট, যা স্বাস্থ্যকর খাদ্যাভ্যাস ও চিকিৎসকের পরামর্শের পাশাপাশি ডায়াবেটিস ম্যানেজমেন্টে সহায়ক সাপোর্ট হিসেবে ব্যবহৃত হয়।",
  },
  {
    q: "কারা Dibedex ব্যবহার করতে পারেন?",
    a: "প্রাপ্তবয়স্করা চিকিৎসকের পরামর্শ অনুযায়ী ব্যবহার করতে পারেন। গর্ভবতী, স্তন্যদানকারী বা দীর্ঘমেয়াদি শারীরিক সমস্যায় ভুগলে অবশ্যই চিকিৎসকের পরামর্শ নিন।",
  },
  {
    q: "Dibedex কীভাবে ব্যবহার করবেন?",
    a: "প্যাকেজের লেবেলে উল্লেখিত নির্দেশনা অনুসরণ করুন বা চিকিৎসকের পরামর্শ অনুযায়ী সেবন করুন। নিয়মিত সেবন সুবিধা বাড়াতে সহায়ক।",
  },
  {
    q: "সারা বাংলাদেশে হোম ডেলিভারি পাওয়া যাবে?",
    a: "হ্যাঁ। সারা বাংলাদেশে হোম ডেলিভারি সুবিধা রয়েছে। ডাকার ভেতর দ্রুত এবং ডাকার বাইরে কুরিয়ারের মাধ্যমে পণ্য পৌঁছে দেওয়া হয়।",
  },
  {
    q: "Cash on Delivery (COD) আছে?",
    a: "হ্যাঁ, অবশ্যই। আপনি পণ্য হাতে পেয়ে টাকা দিতে পারবেন — কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই। bKash ও Nagad পেমেন্টও গ্রহণযোগ্য।",
  },
  {
    q: "অর্ডার করতে কত সময় লাগবে?",
    a: "অর্ডার কনফার্ম হওয়ার পর সাধারণত ১-৩ কার্যদিবসের মধ্যে ডাকার এবং ৩-৫ কার্যদিবসের মধ্যে ডাকার বাইরে ডেলিভারি হয়।",
  },
  {
    q: "কোনো প্রশ্ন থাকলে কীভাবে যোগাযোগ করব?",
    a: "আমাদের Customer Support Team সবসময় আপনার জন্য প্রস্তুত।\n\n📞 Customer Support\n01306383938",
  },
];

export function ProblemSection() {
  return (
    <section
      className="section-pad font-['Inter',sans-serif]"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="আপনি কি এসব সমস্যার সম্মুখীন?"
          title="দৈনন্দিন জীবনে সুগার-জনিত দুশ্চিন্তা"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p) => (
            <div
              key={p.text}
              className="rounded-2xl bg-white p-5 transition-transform hover:-translate-y-0.5"
              style={{ borderColor: BORDER, borderWidth: 1, boxShadow: "0 6px 20px rgba(6,78,59,0.06)" }}
            >
              <div
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ backgroundColor: `${GOLD}1a`, color: GOLD }}
              >
                <p.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-medium" style={{ color: EMERALD }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="section-pad font-['Inter',sans-serif]"
      style={{ backgroundColor: CREAM_DEEP, color: INK }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: GOLD }}
          >
            কেন Dibedex
          </span>
          <h2
            className="text-3xl leading-tight font-bold md:text-4xl"
            style={{ fontFamily: "'Lora', serif", color: EMERALD }}
          >
            প্রিমিয়াম আয়ুর্বেদিক সাপোর্ট
          </h2>
          <p className="mt-3 text-base" style={{ color: `${EMERALD}cc` }}>
            প্রতিটি ক্যাপসুল তৈরি হয়েছে আধুনিক মান ও প্রাচীন আয়ুর্বেদিক ঐতিহ্যের সমন্বয়ে।
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: BORDER,
                borderWidth: 1,
                boxShadow: "0 8px 24px rgba(6,78,59,0.06)",
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-[3px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, ${GOLD}, ${EMERALD})` }}
              />

              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div
                    className="grid h-12 w-12 place-items-center rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: `${EMERALD}0d`,
                      color: EMERALD,
                      borderColor: BORDER,
                      borderWidth: 1,
                    }}
                  >
                    <b.icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <span
                    className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold shadow"
                    style={{ color: GOLD, borderColor: BORDER, borderWidth: 1 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex-1 pt-0.5">
                  <h3
                    className="text-base font-semibold leading-snug"
                    style={{ fontFamily: "'Lora', serif", color: EMERALD }}
                  >
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: `${INK}cc` }}>
                    {b.desc}
                  </p>
                </div>
              </div>

              <div
                className="mt-5 flex items-center gap-2 pt-3 text-xs font-medium"
                style={{ borderTopWidth: 1, borderTopColor: BORDER, color: GOLD }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Clinically-inspired formulation</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IngredientSection() {
  return (
    <section
      id="ingredient"
      className="section-pad font-['Inter',sans-serif]"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        <div
          className="order-2 relative overflow-hidden rounded-3xl p-8 md:order-1 md:p-10"
          style={{ backgroundColor: EMERALD, color: CREAM }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl"
            style={{ backgroundColor: GOLD, opacity: 0.18 }}
          />
          <div
            className="relative inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${GOLD}33`, color: GOLD_SOFT }}
          >
            <Leaf className="h-3.5 w-3.5" /> Key Ingredient
          </div>
          <h3
            className="relative mt-4 text-2xl font-bold md:text-3xl"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Syzygium <span className="italic" style={{ color: GOLD_SOFT }}>(জাম বীজ)</span>
          </h3>
          <p className="relative mt-4 text-base leading-relaxed" style={{ color: "rgba(253,252,240,0.9)" }}>
            Syzygium বা জাম বীজ আয়ুর্বেদিক চর্চায় দীর্ঘদিন ধরে ব্যবহৃত হয়ে আসছে।
            Dibedex-এ <strong style={{ color: GOLD_SOFT }}>Jamun Extract 500 mg</strong> রয়েছে, যা স্বাস্থ্যকর খাদ্যাভ্যাস,
            নিয়মিত হাঁটা/ব্যায়াম এবং চিকিৎসকের পরামর্শের পাশাপাশি ডায়াবেটিস
            ম্যানেজমেন্টে সহায়ক হিসেবে বিবেচিত হতে পারে।
          </p>
        </div>
        <div className="order-1 md:order-2">
          <SectionHeader
            eyebrow="প্রধান উপাদান"
            title="দীর্ঘ আয়ুর্বেদিক ঐতিহ্যের সাথে আধুনিক প্যাকেজিং"
            align="left"
          />
          <ul className="mt-6 space-y-3 text-sm md:text-base">
            <Bullet>প্রতিটি ক্যাপসুলে নির্ভরযোগ্য ডোজ</Bullet>
            <Bullet>স্বাস্থ্যকর রুটিন তৈরিতে সহায়ক</Bullet>
            <Bullet>চিকিৎসকের পরামর্শের পরিপূরক হিসেবে ব্যবহারযোগ্য</Bullet>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function HowToUseSection({ callNumber }: { callNumber: string }) {
  return (
    <section
      className="section-pad font-['Inter',sans-serif]"
      style={{ backgroundColor: CREAM_DEEP, color: INK }}
    >
      <div className="mx-auto max-w-4xl px-4">
        <SectionHeader eyebrow="ব্যবহারবিধি" title="ব্যবহারের আগে গুরুত্বপূর্ণ তথ্য" />

        <div
          className="mt-8 rounded-2xl bg-white p-6 md:p-8"
          style={{ borderColor: BORDER, borderWidth: 1, boxShadow: "0 10px 30px rgba(6,78,59,0.08)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: `${EMERALD}0d`, color: EMERALD }}
            >
              <Info className="h-5 w-5" />
            </div>
            <ul className="flex-1 space-y-3 text-sm md:text-base" style={{ color: `${INK}d9` }}>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GOLD }} />
                <span>লেবেলে উল্লেখিত নির্দেশনা অনুসরণ করে ব্যবহার করুন।</span>
              </li>
              <li className="flex items-start gap-2">
                <Stethoscope className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GOLD }} />
                <span>আপনি যদি ডায়াবেটিসের ওষুধ বা ইনসুলিন ব্যবহার করেন, নতুন কোনো সাপ্লিমেন্ট শুরু করার আগে চিকিৎসকের পরামর্শ নিন।</span>
              </li>
              <li className="flex items-start gap-2">
                <Baby className="mt-0.5 h-4 w-4 shrink-0" style={{ color: GOLD }} />
                <span>গর্ভবতী, স্তন্যদানকারী বা দীর্ঘমেয়াদি কোনো শারীরিক সমস্যায় ভুগলে চিকিৎসকের পরামর্শ অনুযায়ী ব্যবহার করুন।</span>
              </li>
            </ul>
          </div>

          <div
            className="mt-6 rounded-xl p-4 md:p-5"
            style={{ backgroundColor: CREAM, borderColor: BORDER, borderWidth: 1 }}
          >
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="grid h-10 w-10 place-items-center rounded-full"
                  style={{ backgroundColor: EMERALD, color: CREAM }}
                >
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: `${INK}99` }}>
                    সহায়তার জন্য কল করুন
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ fontFamily: "'Lora', serif", color: EMERALD }}
                  >
                    {callNumber}
                  </p>
                </div>
              </div>
              <div className="flex w-full gap-3 sm:w-auto">
                <Button
                  asChild
                  className="flex-1 sm:flex-initial text-white"
                  style={{ backgroundColor: EMERALD }}
                >
                  <a href="#order">
                    <ShoppingCart className="mr-2 h-4 w-4" /> এখনই অর্ডার করুন
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 sm:flex-initial bg-transparent"
                  style={{ borderColor: GOLD, color: GOLD }}
                >
                  <a href={`tel:${callNumber}`}>
                    <Phone className="mr-2 h-4 w-4" /> কল করুন
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section
      className="section-pad font-['Inter',sans-serif]"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader eyebrow="কেন আমাদের বিশ্বাস করবেন" title="নির্ভরযোগ্য কেনাকাটার নিশ্চয়তা" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {trust.map((t) => (
            <div
              key={t.label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-5 text-center"
              style={{ borderColor: BORDER, borderWidth: 1, boxShadow: "0 4px 14px rgba(6,78,59,0.05)" }}
            >
              <div
                className="grid h-11 w-11 place-items-center rounded-full"
                style={{ backgroundColor: `${GOLD}14`, color: GOLD }}
              >
                <t.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold md:text-sm" style={{ color: EMERALD }}>
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection({
  callNumber,
  whatsappNumber,
}: {
  callNumber: string;
  whatsappNumber: string;
}) {
  return (
    <section
      id="faq"
      className="section-pad font-['Inter',sans-serif]"
      style={{ backgroundColor: CREAM_DEEP, color: INK }}
    >
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeader eyebrow="FAQ" title="সাধারণ জিজ্ঞাসা" />
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="mb-3 rounded-xl bg-white px-4"
              style={{ borderColor: BORDER, borderWidth: 1, boxShadow: "0 4px 14px rgba(6,78,59,0.05)" }}
            >
              <AccordionTrigger
                className="text-left text-base font-semibold hover:no-underline"
                style={{ color: EMERALD }}
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" style={{ color: GOLD }} />
                  {f.q}
                </span>
              </AccordionTrigger>
              <AccordionContent
                className="whitespace-pre-line text-sm leading-relaxed"
                style={{ color: `${INK}b3` }}
              >
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div
          className="mt-8 rounded-2xl bg-white p-6 md:p-8"
          style={{ borderColor: GOLD, borderWidth: 1, boxShadow: "0 10px 30px rgba(161,98,7,0.1)" }}
        >
          <div className="text-center">
            <div
              className="mx-auto grid h-14 w-14 place-items-center rounded-full"
              style={{ backgroundColor: `${GOLD}1a`, color: GOLD }}
            >
              <MessageCircle className="h-7 w-7" />
            </div>
            <h3
              className="mt-4 text-xl font-bold"
              style={{ fontFamily: "'Lora', serif", color: EMERALD }}
            >
              এখনও কোনো প্রশ্ন আছে?
            </h3>
            <p className="mt-2 text-sm" style={{ color: `${INK}99` }}>
              আমাদের Customer Support Team-এর সাথে কথা বলুন।
            </p>
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-lg font-bold"
              style={{ backgroundColor: `${EMERALD}0d`, color: EMERALD, fontFamily: "'Lora', serif" }}
            >
              <Phone className="h-5 w-5" />
              {callNumber}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Button asChild className="w-full text-white" style={{ backgroundColor: EMERALD }}>
              <a href={`tel:${callNumber}`}>
                <PhoneCall className="mr-2 h-4 w-4" /> Call Now
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full bg-transparent"
              style={{ borderColor: "#25D366", color: "#128C4F" }}
            >
              <a
                href={buildWhatsAppLink(whatsappNumber, "আমি Dibedex সম্পর্কে জানতে চাই।")}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full bg-transparent"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              <a href="#order">
                <ShoppingCart className="mr-2 h-4 w-4" /> Order Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter({
  callNumber,
  whatsappNumber,
}: {
  callNumber: string;
  whatsappNumber: string;
}) {
  return (
    <footer
      className="font-['Inter',sans-serif]"
      style={{ backgroundColor: EMERALD, color: CREAM }}
    >
      <div
        aria-hidden
        className="h-[3px] w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="grid h-10 w-10 place-items-center rounded-xl font-bold"
                style={{ backgroundColor: CREAM, color: EMERALD, fontFamily: "'Lora', serif" }}
              >
                D
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "'Lora', serif" }}>
                Dibedex<span style={{ color: GOLD_SOFT }}>.com</span>
              </span>
            </div>
            <p className="mt-4 text-sm" style={{ color: "rgba(253,252,240,0.8)" }}>
              ডায়াবেটিস ম্যানেজমেন্টে আয়ুর্বেদিক সহায়ক সাপোর্ট।
            </p>
            <p className="mt-3 text-xs" style={{ color: "rgba(253,252,240,0.6)" }}>
              Faridpur, Dhaka, Bangladesh
            </p>
          </div>

          <div>
            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: GOLD_SOFT }}
            >
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm" style={{ color: "rgba(253,252,240,0.88)" }}>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" style={{ color: GOLD_SOFT }} />
                <a href={`tel:${callNumber}`} className="hover:underline">
                  {callNumber}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" style={{ color: GOLD_SOFT }} />
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  WhatsApp: {whatsappNumber}
                </a>
              </li>
              <li>Email: dibedex@gmail.com</li>
            </ul>
          </div>

          <div>
            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: GOLD_SOFT }}
            >
              Legal
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm" style={{ color: "rgba(253,252,240,0.88)" }}>
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
              <li><a href="/blog" className="hover:underline">স্বাস্থ্য ব্লগ</a></li>
              <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="hover:underline">Terms &amp; Conditions</a></li>
              <li><a href="/shipping-policy" className="hover:underline">Shipping Policy</a></li>
              <li><a href="/refund-policy" className="hover:underline">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-xs"
          style={{ borderTopWidth: 1, borderTopColor: "rgba(253,252,240,0.12)", color: "rgba(253,252,240,0.6)" }}
        >
          © {new Date().getFullYear()} Dibedex.com — All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <span
        className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: GOLD }}
      >
        {eyebrow}
      </span>
      <h2
        className="text-2xl leading-tight font-bold md:text-3xl"
        style={{ fontFamily: "'Lora', serif", color: EMERALD }}
      >
        {title}
      </h2>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs text-white"
        style={{ backgroundColor: GOLD }}
      >
        ✓
      </span>
      <span style={{ color: `${INK}d9` }}>{children}</span>
    </li>
  );
}
