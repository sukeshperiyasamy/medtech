/**
 * Schema.org JSON-LD builders. Every value comes from the typed data layer — nothing is
 * inferred. Optional facts that the data does not hold are simply omitted.
 * Privacy: Person objects never include email or phone numbers.
 */
import type {
  Achievement,
  DigitalHealthContent,
  GalleryImage,
  NewsItem,
  Person,
  Program,
  SiteConfig,
  Startup,
} from "@/lib/types";
import { absoluteUrl } from "@/lib/seo";

type Json = Record<string, unknown>;
const CTX = "https://schema.org";

const IITJ = {
  "@type": "CollegeOrUniversity",
  name: "Indian Institute of Technology Jodhpur",
  url: "https://www.iitj.ac.in",
};
const AIIMS = {
  "@type": "MedicalOrganization",
  name: "All India Institute of Medical Sciences Jodhpur",
  url: "https://aiimsjodhpur.edu.in/",
};
const INSTITUTION: Record<string, Json> = { "IIT Jodhpur": IITJ, "AIIMS Jodhpur": AIIMS };

/** Reference to the Centre, for use inside other objects. */
export const centreRef = (site: SiteConfig): Json => ({
  "@type": "EducationalOrganization",
  "@id": absoluteUrl("/") + "#organization",
  name: site.name,
});

/** Site-wide organisation. */
export function organizationLd(site: SiteConfig): Json {
  return {
    "@context": CTX,
    "@type": "EducationalOrganization",
    "@id": absoluteUrl("/") + "#organization",
    name: site.name,
    alternateName: `MedTech Centre, ${site.parent}`,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/brand/iitj-logo.jpg"),
    image: absoluteUrl("/images/centre/medtech-centre-w16-berm.jpg"),
    description: site.description,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address[0]}, ${site.address[2]}`,
      addressLocality: "Jodhpur",
      postalCode: "342030",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    parentOrganization: IITJ,
    subOrganization: [
      {
        "@type": "EducationalOrganization",
        name: "Medical Technologies Program (IIT Jodhpur × AIIMS Jodhpur)",
        url: absoluteUrl("/medical-technologies"),
      },
      {
        "@type": "ResearchOrganization",
        name: "Centre for Digital Health, IIT Jodhpur",
        url: absoluteUrl("/digital-health"),
      },
    ],
    sameAs: [site.officialUrl],
  };
}

export function websiteLd(site: SiteConfig): Json {
  return {
    "@context": CTX,
    "@type": "WebSite",
    "@id": absoluteUrl("/") + "#website",
    name: `${site.name}, ${site.parent}`,
    url: absoluteUrl("/"),
    inLanguage: "en-IN",
    publisher: { "@id": absoluteUrl("/") + "#organization" },
  };
}

/** Person — name, title, affiliation and official profile URL only (no email/phone). */
export function personLd(p: Person, site: SiteConfig): Json {
  return {
    "@type": "Person",
    name: p.name,
    jobTitle: p.designation,
    affiliation: [INSTITUTION[p.institution] ?? IITJ, centreRef(site)],
    ...(p.profileUrl ? { url: p.profileUrl } : {}),
    ...(p.researchInterests.length ? { knowsAbout: p.researchInterests } : {}),
  };
}

export function peopleLd(people: Person[], site: SiteConfig): Json {
  return {
    "@context": CTX,
    "@type": "ItemList",
    name: `People — ${site.name}`,
    numberOfItems: people.length,
    itemListElement: people.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: personLd(p, site),
    })),
  };
}

/** Event — only for news items that are events (have a venue). */
export function eventLd(n: NewsItem): Json | null {
  if (!n.venue) return null;
  const mode = {
    offline: "OfflineEventAttendanceMode",
    online: "OnlineEventAttendanceMode",
    mixed: "MixedEventAttendanceMode",
  };
  return {
    "@context": CTX,
    "@type": "Event",
    name: n.title,
    description: n.summary,
    startDate: n.date,
    ...(n.endDate ? { endDate: n.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    ...(n.attendance ? { eventAttendanceMode: `https://schema.org/${mode[n.attendance]}` } : {}),
    location: {
      "@type": "Place",
      name: n.venue,
      address: { "@type": "PostalAddress", addressLocality: "Jodhpur", addressCountry: "IN" },
    },
    ...(n.organizers
      ? {
          organizer: n.organizers.map(
            (o) => INSTITUTION[o] ?? { "@type": "Organization", name: o },
          ),
        }
      : {}),
    ...(n.image ? { image: absoluteUrl(n.image.src) } : {}),
    ...(n.link ? { url: n.link.url } : {}),
  };
}

/** Course — offered programmes only. */
export function courseLd(p: Program): Json {
  return {
    "@context": CTX,
    "@type": "Course",
    name: p.title,
    description: p.overview,
    url: absoluteUrl(`/programs#${p.id}`),
    provider: [IITJ, AIIMS],
    educationalCredentialAwarded: p.degree,
    ...(p.eligibility ? { coursePrerequisites: p.eligibility } : {}),
    ...(p.duration ? { timeRequired: p.duration } : {}),
  };
}

export function digitalHealthLd(cdh: DigitalHealthContent, site: SiteConfig): Json {
  return {
    "@context": CTX,
    "@type": "ResearchOrganization",
    name: "Centre for Digital Health",
    alternateName: "Centre for Digital Health, IIT Jodhpur",
    slogan: cdh.tagline,
    description: cdh.intro[0],
    url: absoluteUrl("/digital-health"),
    sameAs: [cdh.officialUrl],
    parentOrganization: centreRef(site),
    knowsAbout: cdh.researchAreas,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Coordinator",
      email: cdh.coordinator.email,
      telephone: cdh.coordinator.phone,
    },
  };
}

export function galleryLd(images: GalleryImage[], site: SiteConfig): Json {
  return {
    "@context": CTX,
    "@type": "ImageGallery",
    name: `Gallery — ${site.name}`,
    url: absoluteUrl("/gallery"),
    publisher: centreRef(site),
    associatedMedia: images.map((g) => ({
      "@type": "ImageObject",
      contentUrl: absoluteUrl(g.src),
      width: g.width,
      height: g.height,
      description: g.alt,
      ...(g.caption ? { caption: g.caption } : {}),
      ...(g.date ? { dateCreated: g.date } : {}),
    })),
  };
}

export function videoLd(
  v: { src: string; poster: string; duration: string; width: number; height: number },
  site: SiteConfig,
): Json {
  const [m, s] = v.duration.split(":").map(Number);
  return {
    "@context": CTX,
    "@type": "VideoObject",
    name: `A walk through the ${site.name}`,
    description: `A short walk through the ${site.name} building at W16 Berm, IIT Jodhpur — the entrance, a meeting room and research poster presentations.`,
    contentUrl: absoluteUrl(v.src),
    thumbnailUrl: absoluteUrl(v.poster),
    duration: `PT${m}M${s}S`,
    width: v.width,
    height: v.height,
    publisher: centreRef(site),
  };
}

/** Achievements as a list of recipients with their awards. */
export function achievementsLd(items: Achievement[], site: SiteConfig): Json {
  const entries = items.flatMap((a) =>
    a.recipients.map((r) => ({
      "@type": "Person",
      name: r.name,
      award: [a.title, a.awardedBy, String(a.year)].filter(Boolean).join(" — "),
      affiliation: centreRef(site),
    })),
  );
  return {
    "@context": CTX,
    "@type": "ItemList",
    name: `Achievements — ${site.name}`,
    numberOfItems: entries.length,
    itemListElement: entries.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })),
  };
}

/** Venture — only verified ventures reach production (samples are filtered upstream). */
export function startupLd(s: Startup, site: SiteConfig): Json {
  return {
    "@context": CTX,
    "@type": "Organization",
    name: s.name,
    description: s.description,
    slogan: s.tagline,
    url: s.website ?? absoluteUrl(`/startups/${s.slug}`),
    ...(s.foundedYear ? { foundingDate: String(s.foundedYear) } : {}),
    ...(s.founders.length
      ? { founder: s.founders.map((f) => ({ "@type": "Person", name: f.name })) }
      : {}),
    parentOrganization: centreRef(site),
  };
}
