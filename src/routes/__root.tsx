import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ADSENSE_CLIENT, isAdsenseEnabled } from "../lib/adsense";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "ZwsjY1PTxaKZZ7EJnAvK60r5Ozaj5v2SAxmLc46modk" },
      { name: "theme-color", content: "#0F7B3B" },
      { property: "og:site_name", content: "Dibedex" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "bn_BD" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,500;0,600;0,700;1,600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://dibedex.com/#organization",
          name: "Dibedex",
          alternateName: ["Dibedex 500 mg", "Dibedex Bangladesh"],
          url: "https://dibedex.com",
          logo: {
            "@type": "ImageObject",
            url: "https://dibedex.com/apple-touch-icon.png",
            width: 180,
            height: 180,
          },
          image: "https://dibedex.com/apple-touch-icon.png",
          email: "dibedex@gmail.com",
          telephone: "+8801306383938",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Faridpur",
            addressRegion: "Dhaka",
            addressCountry: "BD",
          },
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+8801306383938",
              contactType: "customer service",
              areaServed: "BD",
              availableLanguage: ["Bengali", "English"],
              contactOption: "TollFree",
            },
            {
              "@type": "ContactPoint",
              telephone: "+8801306383938",
              contactType: "sales",
              areaServed: "BD",
              availableLanguage: ["Bengali", "English"],
            },
          ],
          sameAs: [
            "https://www.facebook.com/dibedex",
            "https://wa.me/8801306383938",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://dibedex.com/#localbusiness",
          name: "Dibedex",
          image: "https://dibedex.com/apple-touch-icon.png",
          url: "https://dibedex.com",
          telephone: "+8801306383938",
          email: "dibedex@gmail.com",
          priceRange: "৳350–৳950",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Faridpur",
            addressRegion: "Dhaka",
            addressCountry: "BD",
          },
          areaServed: { "@type": "Country", name: "Bangladesh" },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "09:00",
              closes: "22:00",
            },
          ],
          sameAs: [
            "https://www.facebook.com/dibedex",
            "https://wa.me/8801306383938",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://dibedex.com/#website",
          name: "Dibedex",
          url: "https://dibedex.com",
          publisher: { "@id": "https://dibedex.com/#organization" },
          inLanguage: "bn-BD",
        }),
      },
      {
        children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2037449040232494');fbq('track','PageView');`,
      },
      ...(isAdsenseEnabled()
        ? [
            {
              async: true,
              crossOrigin: "anonymous" as const,
              src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`,
            },
          ]
        : []),
    ],
  }),


  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});


function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
