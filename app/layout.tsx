import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { site } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd, websiteLd } from "@/lib/structured-data";
import { revealScript } from "@/lib/reveal-script";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const title = `${site.name} — ${site.parent}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}, ${site.parent}` },
  description: site.description,
  alternates: { canonical: site.url },
  keywords: [
    "Medical Technologies",
    "MedTech",
    "IIT Jodhpur",
    "AIIMS Jodhpur",
    "biomedical engineering",
    "medical devices",
    "healthcare innovation",
  ],
  openGraph: {
    type: "website",
    title,
    description: site.description,
    siteName: site.name,
    locale: "en_IN",
    url: site.url,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  applicationName: site.name,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plexSans.variable} ${plexMono.variable}`}
      // The reveal script adds a class to <html> before React hydrates.
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow"
        >
          Skip to content
        </a>
        <AnnouncementBar announcement={site.announcement} />
        <SiteHeader site={site} />
        {children}
        <SiteFooter site={site} />
        <JsonLd data={[organizationLd(site), websiteLd(site)]} />
      </body>
    </html>
  );
}
