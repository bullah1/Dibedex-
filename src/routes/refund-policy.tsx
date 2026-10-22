import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Dibedex" },
      { name: "description", content: "Dibedex প্রোডাক্ট রিফান্ড ও রিটার্ন নিয়মাবলী।" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Refund Policy — Dibedex" },
      { property: "og:description", content: "Dibedex প্রোডাক্ট রিফান্ড ও রিটার্ন নিয়মাবলী।" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dibedex.com/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "https://dibedex.com/refund-policy" }],
  }),
  component: () => (
    <LegalPage title="রিফান্ড পলিসি" intro="গ্রাহক সন্তুষ্টি আমাদের অগ্রাধিকার।">
      <h2>রিটার্নের শর্ত</h2>
      <ul>
        <li>প্রোডাক্ট ডেলিভারির সময় ক্ষতিগ্রস্ত বা সিল ভাঙা পাওয়া গেলে সাথে সাথে রিজেক্ট করুন।</li>
        <li>ভুল পণ্য ডেলিভারি হলে ২৪ ঘণ্টার মধ্যে জানান।</li>
      </ul>
      <h2>রিফান্ড প্রক্রিয়া</h2>
      <p>যাচাই-বাছাইয়ের পর ৭ কর্মদিবসের মধ্যে রিফান্ড প্রসেস করা হবে।</p>
      <h2>রিফান্ড অযোগ্য</h2>
      <p>ব্যবহৃত, সিল ভাঙা বা ব্যবহারকারীর ভুলে নষ্ট প্রোডাক্ট রিফান্ডের আওতাভুক্ত নয়।</p>
      <h2>যোগাযোগ</h2>
      <p>রিফান্ডের জন্য: dibedex@gmail.com / 01306383938</p>
    </LegalPage>
  ),
});
