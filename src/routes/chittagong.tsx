import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { buildWhatsAppLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, ShoppingBag, Truck, Clock, MapPin } from "lucide-react";
import ogChittagong from "@/assets/og-chittagong.jpg";


const CITY = "Chittagong";
const CITY_BN = "চট্টগ্রাম";
const URL = "https://dibedex.com/chittagong";
const PHONE = "+8801306383938";
const WA = buildWhatsAppLink("8801306383938", "আমি চট্টগ্রাম থেকে Dibedex অর্ডার করতে চাই।");

export const Route = createFileRoute("/chittagong")({
  head: () => ({
    meta: [
      { title: "চট্টগ্রামে Dibedex ডেলিভারি — Fast COD | Dibedex Chittagong" },
      {
        name: "description",
        content:
          "চট্টগ্রাম শহরে Dibedex ৫০০ mg আয়ুর্বেদিক ক্যাপসুল — ক্যাশ অন ডেলিভারি, ৪৮–৭২ ঘণ্টায় হোম ডেলিভারি, অরিজিনাল প্রোডাক্ট গ্যারান্টি। চট্টগ্রামের সকল থানায় ডেলিভারি।",
      },
      { name: "robots", content: "index, follow" },
      { name: "geo.region", content: "BD-10" },
      { name: "geo.placename", content: "Chittagong" },
      { property: "og:title", content: "চট্টগ্রামে Dibedex ডেলিভারি — Fast COD, ৪৮–৭২ ঘণ্টা" },
      {
        property: "og:description",
        content:
          "আগ্রাবাদ, নাসিরাবাদ, খুলশী, পাঁচলাইশ সহ চট্টগ্রামের সকল থানায় Dibedex আয়ুর্বেদিক ক্যাপসুল — ক্যাশ অন ডেলিভারি, অরিজিনাল গ্যারান্টি।",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:image", content: `https://dibedex.com${ogChittagong}` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "চট্টগ্রামে Dibedex ডেলিভারি — Fast Cash on Delivery" },
      { property: "og:locale", content: "bn_BD" },
      { property: "og:site_name", content: "Dibedex" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "চট্টগ্রামে Dibedex ডেলিভারি — Fast COD" },
      {
        name: "twitter:description",
        content:
          "চট্টগ্রামের সকল থানায় ৪৮–৭২ ঘণ্টায় Dibedex ডেলিভারি — ক্যাশ অন ডেলিভারি, অরিজিনাল প্রোডাক্ট।",
      },
      { name: "twitter:image", content: `https://dibedex.com${ogChittagong}` },
      { name: "twitter:image:alt", content: "চট্টগ্রামে Dibedex ডেলিভারি" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${URL}#localbusiness`,
          name: `Dibedex — ${CITY}`,
          image: "https://dibedex.com/apple-touch-icon.png",
          url: URL,
          telephone: PHONE,
          email: "dibedex@gmail.com",
          priceRange: "৳350–৳950",
          address: {
            "@type": "PostalAddress",
            addressLocality: CITY,
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          areaServed: { "@type": "City", name: CITY },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "09:00",
              closes: "22:00",
            },
          ],
          sameAs: ["https://www.facebook.com/dibedex", "https://wa.me/8801306383938"],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://dibedex.com" },
            { "@type": "ListItem", position: 2, name: `${CITY_BN} ডেলিভারি`, item: URL },
          ],
        }),
      },
    ],
  }),
  component: ChittagongPage,
});

function ChittagongPage() {
  return (
    <LegalPage
      title={`${CITY_BN}ে Dibedex ডেলিভারি`}
      intro="চট্টগ্রামের সকল থানায় দ্রুত হোম ডেলিভারি — ক্যাশ অন ডেলিভারি, অরিজিনাল প্রোডাক্ট গ্যারান্টি।"
    >
      <div className="not-prose mt-6 grid gap-3 sm:grid-cols-3">
        <Feature icon={Truck} title="৪৮–৭২ ঘণ্টায় ডেলিভারি" desc="চট্টগ্রাম মেট্রো এরিয়ায়" />
        <Feature icon={Clock} title="ক্যাশ অন ডেলিভারি" desc="প্রোডাক্ট হাতে পেয়ে পেমেন্ট" />
        <Feature icon={MapPin} title="সকল থানায়" desc="চট্টগ্রামের সব প্রধান এলাকায়" />
      </div>

      <h2>চট্টগ্রামের যেসব এলাকায় ডেলিভারি হয়</h2>
      <p>
        আগ্রাবাদ, নাসিরাবাদ, খুলশী, পাঁচলাইশ, হালিশহর, চকবাজার, কোতোয়ালী, বায়েজিদ, পাহাড়তলী,
        ডবলমুরিং, বন্দর, পতেঙ্গা, ইপিজেড, সীতাকুণ্ড, হাটহাজারী সহ চট্টগ্রামের সব প্রধান এলাকায়
        Dibedex ডেলিভারি করা হয়।
      </p>

      <h2>ডেলিভারি চার্জ ও সময়</h2>
      <ul>
        <li>চট্টগ্রাম সিটি: ৳১০০ · ৪৮–৭২ ঘণ্টা</li>
        <li>চট্টগ্রাম উপজেলা: ৳১২০ · ৩–৫ দিন</li>
        <li>ক্যাশ অন ডেলিভারি — প্রোডাক্ট পেয়ে পেমেন্ট</li>
      </ul>

      <h2>কেন চট্টগ্রামের গ্রাহকরা Dibedex বেছে নেন</h2>
      <ul>
        <li>বন্দরনগরীর হাজারো সন্তুষ্ট গ্রাহক</li>
        <li>Steadfast Courier পার্টনারশিপে নিরাপদ ডেলিভারি</li>
        <li>প্রোডাক্ট চেক করে তারপর পেমেন্ট</li>
        <li>১০০% অরিজিনাল আয়ুর্বেদিক ফর্মুলা</li>
      </ul>

      <h2>চট্টগ্রাম থেকে অর্ডার করুন</h2>
      <p>নিচের যেকোনো উপায়ে অর্ডার করতে পারেন — মাত্র ২ মিনিটে।</p>

      <div className="not-prose mt-4 flex flex-wrap gap-2.5">
        <Button asChild size="lg" className="btn-cta">
          <Link to="/" hash="order">
            <ShoppingBag className="mr-2 h-5 w-5" /> অর্ডার করুন
          </Link>
        </Button>
        <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#1ebe5d]">
          <a href={WA} target="_blank" rel="noreferrer">
            <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={`tel:${PHONE}`}>
            <Phone className="mr-2 h-5 w-5" /> কল করুন
          </a>
        </Button>
      </div>
    </LegalPage>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Truck;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-mint text-primary-deep">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}
