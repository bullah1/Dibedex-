import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Dibedex" },
      { name: "description", content: "Dibedex প্রাইভেসি পলিসি — আপনার তথ্য কীভাবে সংগ্রহ ও ব্যবহার করা হয়।" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Privacy Policy — Dibedex" },
      { property: "og:description", content: "Dibedex প্রাইভেসি পলিসি — আপনার তথ্য কীভাবে সংগ্রহ ও ব্যবহার করা হয়।" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dibedex.com/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "https://dibedex.com/privacy-policy" }],
  }),
  component: () => (
    <LegalPage title="প্রাইভেসি পলিসি" intro="আপনার ব্যক্তিগত তথ্যের গোপনীয়তা আমাদের কাছে সর্বোচ্চ অগ্রাধিকার।">
      <h2>তথ্য সংগ্রহ</h2>
      <p>অর্ডার প্রক্রিয়াকরণের জন্য আমরা শুধু নাম, ফোন নম্বর, ঠিকানা ও জেলার তথ্য সংগ্রহ করি।</p>
      <h2>তথ্য ব্যবহার</h2>
      <p>সংগৃহীত তথ্য শুধু পণ্য ডেলিভারি, অর্ডার নিশ্চিতকরণ এবং কাস্টমার সাপোর্টের জন্য ব্যবহার করা হয়।</p>
      <h2>তথ্য শেয়ারিং</h2>
      <p>আপনার তথ্য তৃতীয় পক্ষের সাথে কখনই বিক্রি বা শেয়ার করা হয় না, ডেলিভারি কুরিয়ার ছাড়া।</p>
      <h2>কুকিজ</h2>
      <p>ওয়েবসাইট অভিজ্ঞতা উন্নত করতে আমরা প্রয়োজনীয় কুকিজ ব্যবহার করি।</p>
      <h2>বিজ্ঞাপন ও থার্ড-পার্টি কুকিজ</h2>
      <p>
        এই ওয়েবসাইটে Google AdSense সহ থার্ড-পার্টি বিজ্ঞাপন প্রদর্শিত হতে পারে। Google
        এবং তার পার্টনাররা কুকিজ ব্যবহার করে ভিজিটরের এই সাইট ও অন্যান্য সাইটে ভিজিটের
        ভিত্তিতে প্রাসঙ্গিক বিজ্ঞাপন দেখায়।
      </p>
      <ul>
        <li>
          Google তার বিজ্ঞাপনে DoubleClick DART কুকি সহ বিভিন্ন কুকি ব্যবহার করে থাকে।
        </li>
        <li>
          ব্যক্তিগতকৃত বিজ্ঞাপন বন্ধ করতে ভিজিট করুন{" "}
          <a
            className="text-primary hover:underline"
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noreferrer nofollow"
          >
            Google Ads Settings
          </a>
          ।
        </li>
        <li>
          বিস্তারিত জানতে দেখুন{" "}
          <a
            className="text-primary hover:underline"
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noreferrer nofollow"
          >
            Google Advertising Policies
          </a>
          ।
        </li>
        <li>
          থার্ড-পার্টি বিজ্ঞাপনদাতাদের নিজস্ব প্রাইভেসি পলিসি রয়েছে; তাদের কুকি ব্যবহারের
          উপর Dibedex-এর কোনো নিয়ন্ত্রণ নেই।
        </li>
      </ul>
      <h2>যোগাযোগ</h2>
      <p>প্রাইভেসি সংক্রান্ত প্রশ্নের জন্য: dibedex@gmail.com</p>
    </LegalPage>
  ),
});
