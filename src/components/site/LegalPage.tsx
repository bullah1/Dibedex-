import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AdSlot } from "@/components/site/AdSlot";
import { ADSENSE_SLOTS } from "@/lib/adsense";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-bold text-primary-deep">
            Dibedex
          </Link>
          <Link to="/" className="text-sm font-medium text-primary hover:underline">
            ← হোম
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <nav aria-label="breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{title}</span>
        </nav>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
        {intro ? <p className="mt-3 text-base text-muted-foreground">{intro}</p> : null}
        <article className="prose prose-neutral mt-8 max-w-none text-foreground/90 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1">
          {children}
        </article>
      </main>
      <AdSlot slot={ADSENSE_SLOTS.legalFooter} />
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dibedex. সমস্ত অধিকার সংরক্ষিত।
      </footer>
    </div>
  );
}
