import { createFileRoute } from "@tanstack/react-router";
import { BLOG_POSTS } from "@/lib/blog";
import { PRODUCTS } from "@/lib/catalog";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://dibedex.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/dhaka", changefreq: "monthly", priority: "0.8" },
          { path: "/chittagong", changefreq: "monthly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          ...BLOG_POSTS.map((p) => ({ path: `/blog/${p.slug}`, changefreq: "monthly" as const, priority: "0.6" })),
          { path: "/products", changefreq: "weekly", priority: "0.8" },
          ...PRODUCTS.map((p) => ({ path: `/product/${p.slug}`, changefreq: "weekly" as const, priority: "0.7" })),
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          { path: "/privacy-policy", changefreq: "yearly", priority: "0.4" },
          { path: "/terms-and-conditions", changefreq: "yearly", priority: "0.4" },
          { path: "/shipping-policy", changefreq: "yearly", priority: "0.5" },
          { path: "/refund-policy", changefreq: "yearly", priority: "0.5" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
