import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { BLOG_POSTS } from "@/lib/blog";

const TITLE = "ডায়াবেটিস স্বাস্থ্য ব্লগ — টিপস ও গাইড | Dibedex";
const DESC = "ডায়াবেটিস নিয়ন্ত্রণ, খাবার তালিকা ও আয়ুর্বেদিক সাপ্লিমেন্ট নিয়ে সহজ বাংলায় স্বাস্থ্য বিষয়ক লেখা।";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dibedex.com/blog" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://dibedex.com/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <LegalPage title="স্বাস্থ্য ব্লগ" intro="ডায়াবেটিস নিয়ন্ত্রণে সহজ বাংলায় টিপস ও গাইড।">
      <div className="not-prose grid gap-4">
        {BLOG_POSTS.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="block rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
          >
            <h2 className="text-lg font-bold text-foreground">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-primary">
              পড়ুন ({p.readMin} মিনিট) →
            </span>
          </Link>
        ))}
      </div>
    </LegalPage>
  );
}
