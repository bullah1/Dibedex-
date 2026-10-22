import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/Sections";
import { ProductHero } from "@/components/site/premium/ProductHero";
import { TrustStrip } from "@/components/site/premium/TrustStrip";
import { BenefitsGrid } from "@/components/site/premium/BenefitsGrid";
import { ProductDetails } from "@/components/site/premium/ProductDetails";
import { ReviewsGallery } from "@/components/site/premium/ReviewsGallery";
import { PremiumFaq } from "@/components/site/premium/PremiumFaq";
import { MoreProducts } from "@/components/site/MoreProducts";
import { DIBEDEX_IMG, DIBEDEX_IMG_ABS } from "@/lib/dibedex-image";
import { CheckoutModal } from "@/components/site/CheckoutModal";
import { MobileStickyBar, FloatingWhatsApp } from "@/components/site/StickyBars";
import {
  DEFAULT_SETTINGS,
  fetchSettings,
  fetchTestimonials,
  type SiteSettings,
  type Testimonial,
} from "@/lib/site";
import { useAnalyticsAutoTrack } from "@/lib/analytics";
import { AdSlot } from "@/components/site/AdSlot";
import { ADSENSE_SLOTS } from "@/lib/adsense";

const PRODUCT_TITLE =
  "Dibedex 500 — Price in Bangladesh, Review, Side Effects (Bangla) | ডিবেডেক্স ৫০০ ক্যাপসুল অর্ডার";
const PRODUCT_DESC =
  "Dibedex 500 mg Capsule — জামুন বীজের নির্যাসে তৈরি Ayurvedic ডায়াবেটিস সাপোর্ট। Dibedex 500 price in Bangladesh ৳৩৫০ থেকে শুরু। Review, side effects (bangla), সঠিক নিয়মে সেবন ও অর্ডার — সারা বাংলাদেশে Cash on Delivery।";
const PRODUCT_IMG = DIBEDEX_IMG_ABS;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: PRODUCT_TITLE },
      { name: "description", content: PRODUCT_DESC },
      {
        name: "keywords",
        content:
          "Dibedex, Dibedex 500, Dibedex 500mg, Dibedex 500 capsule, Dibedex 500 price in Bangladesh, Dibedex 500 price, Dibedex 500 review, Dibedex 500 side effects, Dibedex 500 side effects bangla, Dibedex 500 bangla, Dibedex 500 order, Dibedex Syzygium 500 mg, ডিবেডেক্স ৫০০, ডিবেডেক্স ক্যাপসুল, ডায়াবেটিস ক্যাপসুল, ডায়াবেটিসের ঔষধ, জামুন বীজ ক্যাপসুল, ayurvedic diabetes medicine bd, blood sugar control Bangladesh",
      },

      { name: "author", content: "Dibedex" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "geo.region", content: "BD" },
      { name: "geo.placename", content: "Bangladesh" },
      { name: "language", content: "Bengali, English" },
      { property: "og:title", content: PRODUCT_TITLE },
      { property: "og:description", content: PRODUCT_DESC },
      { property: "og:url", content: "https://dibedex.com/" },
      { property: "og:type", content: "product" },
      { property: "og:image", content: PRODUCT_IMG },
      { property: "og:image:alt", content: "Dibedex 500 mg — Ayurvedic Diabetes Support Capsule" },
      { property: "og:image:width", content: "1024" },
      { property: "og:image:height", content: "1024" },
      { property: "product:brand", content: "Dibedex" },
      { property: "product:availability", content: "in stock" },
      { property: "product:condition", content: "new" },
      { property: "product:price:amount", content: "350" },
      { property: "product:price:currency", content: "BDT" },
      { name: "twitter:title", content: PRODUCT_TITLE },
      { name: "twitter:description", content: PRODUCT_DESC },
      { name: "twitter:image", content: PRODUCT_IMG },
      { name: "twitter:image:alt", content: "Dibedex 500 mg Capsule" },
      { name: "twitter:label1", content: "Price" },
      { name: "twitter:data1", content: "৳350 - ৳950" },
      { name: "twitter:label2", content: "Delivery" },
      { name: "twitter:data2", content: "Cash on Delivery — All Bangladesh" },
    ],
    links: [
      { rel: "canonical", href: "https://dibedex.com/" },
      { rel: "alternate", hrefLang: "bn-BD", href: "https://dibedex.com/" },
      { rel: "alternate", hrefLang: "en", href: "https://dibedex.com/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://dibedex.com/" },
      {
        rel: "preload",
        as: "image",
        href: DIBEDEX_IMG,
        fetchPriority: "high",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "@id": "https://dibedex.com/#product",
          name: "Dibedex 500 mg",
          alternateName: [
            "Dibedex 500 mg Capsule",
            "Dibedex 500",
            "Dibedex 500mg",
            "Dibedex 500 Capsule",
            "Dibedex Syzygium 500 mg",
            "ডিবেডেক্স ৫০০ mg",
            "ডিবেডেক্স ৫০০",
            "ডিবেডেক্স ৫০০ ক্যাপসুল",
            "Syzygium Jambolanum 500 mg",
            "জামুন বীজ ক্যাপসুল",
          ],

          url: "https://dibedex.com/",
          image: [PRODUCT_IMG],
          brand: { "@type": "Brand", name: "Dibedex" },
          manufacturer: { "@type": "Organization", name: "Index Laboratories Ltd." },
          category: "Health & Beauty > Health Care > Ayurvedic Medicine",
          sku: "DBX-SYZ-500",
          mpn: "DBX-SYZ-500",
          description:
            "Ayurvedic ডায়াবেটিস সাপোর্ট ক্যাপসুল। প্রাকৃতিক জামুন (Syzygium Jambolanum) বীজের নির্যাসে তৈরি — ব্লাড সুগার ম্যানেজমেন্ট, স্বাস্থ্যকর জীবনযাপন ও ডাক্তারের নির্দেশিত রুটিনের সহায়ক।",
          audience: {
            "@type": "PeopleAudience",
            suggestedMinAge: 18,
            geographicArea: { "@type": "Country", name: "Bangladesh" },
          },
          productID: "dbx-syz-500-30",
          inProductGroupWithID: "dbx-syz-500",
          offers: [
            { id: "dbx-syz-500-30", name: "Dibedex 500 mg — 30 Capsules", price: "350" },
            { id: "dbx-syz-500-60", name: "Dibedex 500 mg — 60 Capsules", price: "650" },
            { id: "dbx-syz-500-90", name: "Dibedex 500 mg — 90 Capsules", price: "950" },
          ].map((o) => ({
            "@type": "Offer",
            "@id": `https://dibedex.com/#offer-${o.id}`,
            sku: o.id,
            mpn: o.id.toUpperCase(),
            name: o.name,
            price: o.price,
            priceCurrency: "BDT",
            priceValidUntil: "2027-12-31",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            url: "https://dibedex.com/",
            seller: { "@type": "Organization", name: "Dibedex" },
            areaServed: { "@type": "Country", name: "Bangladesh" },
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "BD",
              returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 7,
              returnMethod: "https://schema.org/ReturnByMail",
              returnFees: "https://schema.org/FreeReturn",
            },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: { "@type": "MonetaryAmount", value: "80", currency: "BDT" },
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "BD" },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: {
                  "@type": "QuantitativeValue",
                  minValue: 0,
                  maxValue: 1,
                  unitCode: "DAY",
                },
                transitTime: {
                  "@type": "QuantitativeValue",
                  minValue: 1,
                  maxValue: 5,
                  unitCode: "DAY",
                },
              },
            },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Dibedex 500 mg কী?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Dibedex 500 mg একটি আয়ুর্বেদিক হারবাল ক্যাপসুল, যা প্রাকৃতিক জামুন (Syzygium Jambolanum) বীজের নির্যাসে তৈরি এবং স্বাস্থ্যকর ব্লাড সুগার ম্যানেজমেন্টে সহায়ক।",
              },
            },
            {
              "@type": "Question",
              name: "Dibedex 500 mg price in Bangladesh কত?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Dibedex 500 mg এর দাম বাংলাদেশে ৳৩৫০ থেকে শুরু। ৩০ ক্যাপসুল ৳৩৫০, ৬০ ক্যাপসুল ৳৬৫০ এবং ৯০ ক্যাপসুল ৳৯৫০। সারা বাংলাদেশে Cash on Delivery সুবিধা রয়েছে।",
              },
            },
            {
              "@type": "Question",
              name: "Dibedex 500 mg side effects (bangla) কী কী?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Dibedex 500 mg প্রাকৃতিক আয়ুর্বেদিক উপাদান দিয়ে তৈরি, তাই নির্দেশিত মাত্রায় সেবনে সাধারণত পার্শ্বপ্রতিক্রিয়া দেখা যায় না। তবে গর্ভবতী, স্তন্যদানকারী মা বা কোনো দীর্ঘমেয়াদি ঔষধ চললে অবশ্যই চিকিৎসকের পরামর্শ নিয়ে সেবন করুন।",
              },
            },
            {
              "@type": "Question",
              name: "Dibedex 500 mg review কেমন?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "গ্রাহকদের মতামত আমাদের রিভিউ সেকশনে দেখতে পারেন। ফলাফল ব্যক্তিভেদে ভিন্ন হতে পারে — নিয়মিত সেবনের পাশাপাশি খাদ্যাভ্যাস, ব্যায়াম ও চিকিৎসকের পরামর্শ মেনে চলুন।",
              },
            },

            {
              "@type": "Question",
              name: "কারা Dibedex 500 mg ব্যবহার করতে পারেন?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "প্রাপ্তবয়স্করা চিকিৎসকের পরামর্শ অনুযায়ী ব্যবহার করতে পারেন। গর্ভবতী, স্তন্যদানকারী বা দীর্ঘমেয়াদি শারীরিক সমস্যায় ভুগলে অবশ্যই চিকিৎসকের পরামর্শ নিন।",
              },
            },
            {
              "@type": "Question",
              name: "Dibedex 500 mg কীভাবে ব্যবহার করবেন?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "প্যাকেজের লেবেলে উল্লেখিত নির্দেশনা অনুসরণ করুন বা চিকিৎসকের পরামর্শ অনুযায়ী সেবন করুন।",
              },
            },
            {
              "@type": "Question",
              name: "সারা বাংলাদেশে হোম ডেলিভারি পাওয়া যাবে?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "হ্যাঁ। সারা বাংলাদেশে হোম ডেলিভারি সুবিধা রয়েছে। ডাকার ভেতর দ্রুত এবং ডাকার বাইরে কুরিয়ারের মাধ্যমে পণ্য পৌঁছে দেওয়া হয়।",
              },
            },
            {
              "@type": "Question",
              name: "Cash on Delivery (COD) আছে?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "হ্যাঁ। আপনি পণ্য হাতে পেয়ে টাকা দিতে পারবেন — কোনো অগ্রিম পেমেন্ট লাগে না।",
              },
            },
            {
              "@type": "Question",
              name: "অর্ডার করতে কত সময় লাগবে?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "অর্ডার কনফার্ম হওয়ার পর সাধারণত ১-৩ কার্যদিবসের মধ্যে ডাকার এবং ৩-৫ কার্যদিবসের মধ্যে ডাকার বাইরে ডেলিভারি হয়।",
              },
            },
            {
              "@type": "Question",
              name: "কোনো প্রশ্ন থাকলে কীভাবে যোগাযোগ করব?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "আমাদের Customer Support Team সবসময় আপনার জন্য প্রস্তুত। ফোন: 01306383938",
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://dibedex.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Dibedex 500 mg",
              item: "https://dibedex.com/#product",
            },
          ],
        }),
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  useAnalyticsAutoTrack();

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => {});
    fetchTestimonials()
      .then(setTestimonials)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <SiteHeader />
      <main>
        <ProductHero whatsappNumber={settings.whatsapp_number} />
        <TrustStrip />
        <BenefitsGrid />
        <ProductDetails />
        <ReviewsGallery testimonials={testimonials} />
        <PremiumFaq callNumber={settings.call_number} whatsappNumber={settings.whatsapp_number} />
        <MoreProducts />
      </main>
      <AdSlot slot={ADSENSE_SLOTS.homeFooter} />
      <SiteFooter callNumber={settings.call_number} whatsappNumber={settings.whatsapp_number} />
      <MobileStickyBar
        callNumber={settings.call_number}
        whatsappNumber={settings.whatsapp_number}
        price={settings.product_price}
      />
      <CheckoutModal settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings.whatsapp_number} />
      <Toaster position="top-center" richColors />
    </div>
  );
}
