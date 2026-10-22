import { createFileRoute } from "@tanstack/react-router";
import { DIBEDEX_IMG_ABS } from "@/lib/dibedex-image";

// Google Merchant Center product feed (RSS 2.0 + g: namespace).
// Submit this URL in Merchant Center → Products → Feeds → Add Feed.
export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const BASE = "https://dibedex.com";
        const IMG = DIBEDEX_IMG_ABS;
        const BRAND = "Dibedex";

        type Item = {
          id: string;
          title: string;
          price: number;
          mpn: string;
          capsules: number;
        };
        const items: Item[] = [
          {
            id: "dbx-syz-500-30",
            title: "Dibedex 500 mg — 30 Capsules",
            price: 350,
            mpn: "DBX-SYZ-500-30",
            capsules: 30,
          },
          {
            id: "dbx-syz-500-60",
            title: "Dibedex 500 mg — 60 Capsules (Best Value)",
            price: 650,
            mpn: "DBX-SYZ-500-60",
            capsules: 60,
          },
          {
            id: "dbx-syz-500-90",
            title: "Dibedex 500 mg — 90 Capsules (Most Popular)",
            price: 950,
            mpn: "DBX-SYZ-500-90",
            capsules: 90,
          },
        ];

        const esc = (s: string) =>
          s.replace(
            /[&<>"']/g,
            (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
          );

        const desc =
          "Ayurvedic diabetes support by Index Laboratories Ltd. Syzygium Jambolanum (jamun seed) 500 mg capsules — helps complement blood sugar management, healthy lifestyle and doctor-guided routine. Cash on Delivery all over Bangladesh.";

        const entries = items
          .map(
            (it) => `
    <item>
      <g:id>${esc(it.id)}</g:id>
      <g:title>${esc(it.title)}</g:title>
      <g:description>${esc(desc)} Pack of ${it.capsules} capsules.</g:description>
      <g:link>${BASE}/#order</g:link>
      <g:image_link>${IMG}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${it.price}.00 BDT</g:price>
      <g:condition>new</g:condition>
      <g:brand>${BRAND}</g:brand>
      <g:mpn>${esc(it.mpn)}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Health &amp; Beauty &gt; Health Care &gt; Medicine &amp; Drugs</g:google_product_category>
      <g:product_type>Health &amp; Beauty &gt; Ayurvedic Medicine &gt; Diabetes Support</g:product_type>
      <g:adult>no</g:adult>
      <g:age_group>adult</g:age_group>
      <g:gender>unisex</g:gender>
      <g:shipping>
        <g:country>BD</g:country>
        <g:service>Cash on Delivery</g:service>
        <g:price>80.00 BDT</g:price>
      </g:shipping>
    </item>`,
          )
          .join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Dibedex Product Feed</title>
    <link>${BASE}</link>
    <description>Dibedex 500 mg — Ayurvedic Diabetes Support Capsules</description>${entries}
  </channel>
</rss>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
