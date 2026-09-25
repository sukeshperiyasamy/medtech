import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { site } from "@/data/site";
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

const title = `${site.name} — ${site.partners}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}, ${site.partners}` },
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  alternateName: "Medical Technology Centre, IIT Jodhpur",
  url: site.officialUrl,
  email: site.email,
  telephone: site.phone,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "NH 62, Nagaur Road, Karwar",
    addressLocality: "Jodhpur",
    postalCode: "342030",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  parentOrganization: { "@type": "CollegeOrUniversity", name: "Indian Institute of Technology Jodhpur", url: "https://www.iitj.ac.in" },
  memberOf: {
    "@type": "MedicalOrganization",
    name: "All India Institute of Medical Sciences Jodhpur",
    url: "https://aiimsjodhpur.edu.in/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow"
        >
          Skip to content
        </a>
        <MotionProvider>
          <AnnouncementBar announcement={site.announcement} />
          <SiteHeader site={site} />
          {children}
          <SiteFooter site={site} />
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
