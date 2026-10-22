import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { BLOG_POSTS, getPost } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const url = `https://dibedex.com/blog/${post.slug}`;
    return {
      meta: [
        { title: `${post.title} | Dibedex` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: "bn",
            mainEntityOfPage: url,
            author: { "@type": "Organization", name: "Dibedex" },
            publisher: {
              "@type": "Organization",
              name: "Dibedex",
              logo: { "@type": "ImageObject", url: "https://dibedex.com/apple-touch-icon.png" },
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPostPage,
});

function PostNotFound() {
  return (
    <LegalPage title="লেখাটি পাওয়া যায়নি">
      <p>
        <Link to="/blog">সব লেখা দেখুন →</Link>
      </p>
    </LegalPage>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug);
  return (
    <LegalPage title={post.title} intro={post.description}>
      {post.sections.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          {s.p.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
          {s.list ? (
            <ul>
              {s.list.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <div className="not-prose mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
        <p className="text-lg font-bold text-foreground">Dibedex আয়ুর্বেদিক ক্যাপসুল</p>
        <p className="mt-1 text-sm text-muted-foreground">
          ক্যাশ অন ডেলিভারি · সারা বাংলাদেশে হোম ডেলিভারি · মাত্র ৳৩৫০ থেকে
        </p>
        <Link
          to="/"
          hash="order"
          className="mt-4 inline-block rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground"
        >
          এখনই অর্ডার করুন
        </Link>
      </div>

      {others.length ? (
        <div className="not-prose mt-10">
          <p className="font-bold text-foreground">আরও পড়ুন</p>
          <ul className="mt-2 space-y-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link to="/blog/$slug" params={{ slug: o.slug }} className="text-primary hover:underline">
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </LegalPage>
  );
}
