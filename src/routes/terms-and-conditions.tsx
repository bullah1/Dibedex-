import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Dibedex" },
      { name: "description", content: "Dibedex ব্যবহারের শর্তাবলী ও নিয়মাবলী।" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Terms & Conditions — Dibedex" },
      { property: "og:description", content: "Dibedex ব্যবহারের শর্তাবলী ও নিয়মাবলী।" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dibedex.com/terms-and-conditions" },
    ],
    links: [{ rel: "canonical", href: "https://dibedex.com/terms-and-conditions" }],
  }),
  component: () => (
    <LegalPage title="শর্তাবলী" intro="Dibedex ওয়েবসাইট ব্যবহার করার আগে নিম্নলিখিত শর্তাবলী পড়ুন।">
      <h2>পণ্যের ব্যবহার</h2>
      <p>Dibedex 500 mg একটি আয়ুর্বেদিক হারবাল সাপোর্ট প্রোডাক্ট। এটি কোনো রোগ নিরাময়ের গ্যারান্টি দেয় না।</p>
      <h2>চিকিৎসকের পরামর্শ</h2>
      <p>ব্যবহারের আগে রেজিস্টার্ড চিকিৎসকের পরামর্শ গ্রহণ করুন। বিশেষত গর্ভবতী মা, দুগ্ধদানকারী মা ও অন্য ওষুধ সেবনকারীদের জন্য।</p>
      <h2>অর্ডার ও পেমেন্ট</h2>
      <p>সব অর্ডার ক্যাশ অন ডেলিভারি (COD)। ভুল তথ্য দিলে অর্ডার বাতিল হতে পারে।</p>
      <h2>সীমাবদ্ধতা</h2>
      <p>ভুল তথ্য, প্যাকেজে নষ্ট পণ্য বা ভুল ব্যবহারের জন্য Dibedex দায়ী নয়।</p>
    </LegalPage>
  ),
});
