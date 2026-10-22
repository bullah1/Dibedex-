import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Dibedex" },
      { name: "description", content: "সারা বাংলাদেশে Dibedex প্রোডাক্টের ডেলিভারি নিয়মাবলী।" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Shipping Policy — Dibedex" },
      { property: "og:description", content: "সারা বাংলাদেশে Dibedex প্রোডাক্টের ডেলিভারি নিয়মাবলী।" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dibedex.com/shipping-policy" },
    ],
    links: [{ rel: "canonical", href: "https://dibedex.com/shipping-policy" }],
  }),
  component: () => (
    <LegalPage title="শিপিং পলিসি" intro="সারা বাংলাদেশে দ্রুত ও নিরাপদ ডেলিভারি।">
      <h2>ডেলিভারি এলাকা</h2>
      <p>আমরা বাংলাদেশের সব জেলায় ডেলিভারি দিই।</p>
      <h2>ডেলিভারি সময়</h2>
      <ul>
        <li>ঢাকার ভেতরে: ১-২ কর্মদিবস</li>
        <li>ঢাকার বাইরে: ২-৪ কর্মদিবস</li>
      </ul>
      <h2>ডেলিভারি চার্জ</h2>
      <p>চেকআউট পেজে দেখানো ডেলিভারি চার্জ প্রযোজ্য। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।</p>
      <h2>অর্ডার ট্র্যাকিং</h2>
      <p>অর্ডার কনফার্ম হলে আপনাকে ফোন/SMS-এ আপডেট দেওয়া হবে।</p>
    </LegalPage>
  ),
});
