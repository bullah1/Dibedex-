import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Dibedex" },
      { name: "description", content: "Dibedex সাপোর্ট টিমের সাথে যোগাযোগ করুন — ফোন, WhatsApp ও ইমেইলে।" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Contact Us — Dibedex" },
      { property: "og:description", content: "Dibedex সাপোর্ট টিমের সাথে যোগাযোগ করুন।" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dibedex.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://dibedex.com/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalPage title="যোগাযোগ করুন" intro="যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন।">
      <h2>সাপোর্ট তথ্য</h2>
      <ul>
        <li>📞 কল: <a className="text-primary hover:underline" href="tel:01306383938">01306383938</a></li>
        <li>💬 WhatsApp: <a className="text-primary hover:underline" href="https://wa.me/8801306383938" target="_blank" rel="noreferrer">+8801306383938</a></li>
        <li>✉️ ইমেইল: <a className="text-primary hover:underline" href="mailto:dibedex@gmail.com">dibedex@gmail.com</a></li>
        <li>📍 ঠিকানা: Faridpur, Dhaka, Bangladesh</li>
      </ul>
      <h2>অফিস টাইম</h2>
      <p>শনি – বৃহস্পতিবার: সকাল ৯টা – রাত ৯টা · শুক্রবার বন্ধ</p>
    </LegalPage>
  );
}
