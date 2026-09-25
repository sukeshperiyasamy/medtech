# Medical Technology Centre — IIT Jodhpur

The website of the **Medical Technology Centre, IIT Jodhpur**. The Centre belongs to IIT Jodhpur and brings the institute's medical technology work under one umbrella, with two verticals:

| Vertical | Run by | Page |
| --- | --- | --- |
| **Medical Technologies Program**: Master's and PhD in Medical Technologies, ICMI | IIT Jodhpur × **AIIMS Jodhpur** (joint) | `/medical-technologies` |
| **Centre for Digital Health**: "Health Equity through Digital Transformation" | IIT Jodhpur | `/digital-health` |

The AIIMS Jodhpur collaboration belongs to the Medical Technologies Program, so the header carries the IIT Jodhpur identity only, and the IITJ × AIIMS lockup appears with the program.

The program is built around one translational model:

```text
Clinical Need → Research → Ideation → Engineering → Prototype → Validation → Funding → Translation → Impact
```

> **Status:** Phase 1 (frontend). All content is stored as typed local data, arranged so that a future admin panel / CMS / PostgreSQL backend can replace it **without changing any UI component**.

---

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Site map](#site-map)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Editing content](#editing-content)
- [Content integrity rules](#content-integrity-rules)
- [Images and photography](#images-and-photography)
- [Design system](#design-system)
- [Motion](#motion)
- [Accessibility](#accessibility)
- [SEO](#seo)
- [Deployment](#deployment)
- [Environment variables](#environment-variables)
- [Roadmap: admin and CMS](#roadmap-admin-and-cms)
- [Outstanding content](#outstanding-content)
- [Troubleshooting](#troubleshooting)

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, static pre-rendering) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (design tokens in `app/globals.css`) |
| Animation | [Motion](https://motion.dev) for reveals, transitions and micro-interactions |
| Scroll storytelling | GSAP + ScrollTrigger, used **only** for the pinned pipeline story on `/about` |
| Icons | lucide-react |
| Images | `next/image` (AVIF/WebP, responsive sizes, lazy loading) |
| Fonts | IBM Plex Sans + IBM Plex Mono via `next/font` (self-hosted, no layout shift) |
| Quality | ESLint (`eslint-config-next`), Prettier, `tsc --noEmit` |

## Getting started

Requirements: **Node.js ≥ 22.13** (or ≥ 20.19) and npm.

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000>. If port 3000 is taken, run `npx next dev -p 3100` instead.

Production build:

```bash
npm run build
```

```bash
npm run start
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload. **Sample/demo content is visible.** |
| `npm run build` | Production build. Every route is pre-rendered as static HTML. **Sample content is hidden.** |
| `npm run start` | Serves the production build. |
| `npm run lint` | ESLint over the whole project. |
| `npm run format` | Prettier over the whole project. |
| `npx tsc --noEmit` | Type-check without building. |
| `python scripts/process-photos.py <folder> <event-slug>` | Converts and colour-grades event photos. See [Images and photography](#images-and-photography). |
| `python scripts/organise-media.py medtech-media/img [--apply]` | Renames exported photos by capture date and sorts them into event folders (dry run without `--apply`). |

Before pushing, run `npx tsc --noEmit`, `npm run lint` and `npm run build`. All three should pass cleanly.

## Site map

The homepage shows **who** the Centre is, **what** it does, **how** it works, **what comes out of it** and **how to engage**. Full collections live on their own pages.

```text
/                     Home — hero, the two verticals, program + pipeline strip, research, ventures,
                      funding callout, impact, programmes, news + ICMI photo strip, collaboration
├── /about            The Centre · its verticals · leadership
├── /medical-technologies   Vertical 01 (IITJ × AIIMS): the programme, IITJ × AIIMS diagram,
│                           full scroll-driven pipeline, programmes, ICMI
├── /digital-health   Vertical 02: Centre for Digital Health (vision, mission, research,
│                     capacity building, open source, partnerships, contact)
├── /research         Research themes (#<theme-id> deep links) · innovation projects (#innovation)
│   └── /funding      Funding & grants explorer
├── /startups         Student & Faculty Ventures
│   └── /startups/[slug]   Individual venture profile
├── /programs         Master's and PhD (#masters, #phd) · discontinued programmes  (flat URL, part of vertical 01)
├── /people           Leadership, affiliated faculty, visiting faculty, staff
│   ├── /students     Student & alumni register (every cohort since 2020)
│   └── /achievements Medals, fellowships and awards (linked to the student register)
├── /news             News & events · ICMI 2025 gallery (#icmi-2025)
│   └── /gallery      All Centre photographs (justified grid, year filters, viewer)
├── /contact          Collaboration pathways, contact details, address
├── /sitemap.xml
└── /robots.txt
```

Navigation: **About · Verticals ▾ (Medical Technologies Program, Programmes & admissions, Centre for Digital Health) · Research ▾ (Research areas, Innovation, Funding) · Startups · People ▾ (Faculty & staff, Students & alumni) · News · [Contact]**. It is defined in `data/site.ts`. URLs are intentionally flat (e.g. `/programs`, not `/medical-technologies/programs`).

## Project structure

```text
app/                        Routes (App Router). One folder per page.
  layout.tsx                Fonts, global metadata, JSON-LD, header/footer shell
  page.tsx                  Homepage
  globals.css               Design tokens, base styles, utilities, keyframes
  sitemap.ts, robots.ts     Generated SEO files
  <route>/page.tsx          Inner pages (about, research, funding, startups, …)

components/
  home/                     Homepage-only sections (compact previews of each area)
  hero/                     Homepage hero
  verticals/                The Centre's two verticals, side by side (homepage, /about)
  digital-health/           Centre for Digital Health page sections
  about/                    Introduction, IIT Jodhpur × AIIMS Jodhpur diagram
  pipeline/                 Clinical Need → Impact story (GSAP sticky + mobile timeline)
  research/                 Research explorer
  innovation/               Project showcase + stage tracker
  startups/                 Venture showcase, profile, scientific TRL scale
  funding/                  Filterable funding table
  impact/                   Verified metrics + counters
  programs/                 Programme tabs, discontinued programmes
  people/                   Leadership + faculty directory
  students/                 Student register with intake chart
  news/                     News listing + event gallery
  gallery/                  PhotoMarquee (continuous strip), PhotoMosaic, Lightbox
  collaboration/            Collaboration pathways
  navigation/               Header, dropdowns, mobile menu, brand lockup, announcement bar
  footer/                   Footer, closing call to action
  layout/                   PageHeader (breadcrumbs + JSON-LD), MotionProvider
  ui/                       Shared primitives: SectionHeading, Reveal, ButtonLink, MoreLink,
                            EmptyState, ImagePlaceholder, SampleBadge/SampleNote/DemoRibbon

data/                       ALL site content (see "Editing content")
lib/
  types.ts                  Content models (the future database schema)
  data/index.ts             Data access layer — the only way components get content
  seo.ts                    Absolute URLs + per-page metadata helper
  utils.ts                  Small helpers (cn, dates, remote-image check)

public/
  logos/                    Official IIT Jodhpur logo and AIIMS Jodhpur seal (unmodified)
  images/<event>/           Graded, web-ready event photographs

scripts/
  process-photos.py         HEIC/JPEG → graded web JPEG pipeline
```

## Architecture

### Content never lives inside components

```text
UI component  →  lib/data/index.ts (data access layer)  →  data/*.ts (local, typed)
```

Components call async getters such as `getPeople()`, `getStartups()` or `getGallery("icmi-2025")`. They never import from `data/` directly. When a backend arrives, only `lib/data/index.ts` changes:

```text
UI component  →  lib/data/index.ts  →  API / CMS  →  PostgreSQL
```

### Content models

`lib/types.ts` defines every model: `ResearchArea`, `Project`, `Person`, `Student`, `Program`, `Grant`, `Publication`, `Patent`, `Lab`, `NewsItem`, `GalleryImage`, `Startup` (with `Founder`, `FundingAward`, `StartupProduct`, `TRL`), `CollaborationPathway`, `Metric`, `PipelineStage` and `SiteConfig`.

Most records extend `BaseRecord`:

| Field | Purpose |
| --- | --- |
| `id`, `slug` | Stable identity and URL segment |
| `status` | `draft` → `review` → `published`: the future editorial workflow |
| `provenance` | `verified` (from an official source) or `sample` (demo only) |
| `sourceUrl` | Where the fact came from, for audit |

### Reusable sections

Page sections accept `SectionProps`:

- `index` sets the editorial number, e.g. `"02"`.
- `heading={false}` hides the section's own heading when the page header already titles it.

The same component therefore works on the homepage and on its dedicated page.

### Server-first

Pages and most sections are React Server Components. Client components (`"use client"`) are limited to interactive pieces: the header, explorers, tabs, filters, the marquee, the lightbox and animation wrappers.

## Editing content

Every edit below happens in `data/`. No component changes are needed.

| To change… | Edit | Notes |
| --- | --- | --- |
| Name, parent institution, contact, address, nav, announcement bar, institution links | `data/site.ts` | The announcement bar reads `announcement`; remove it to hide the bar. |
| The two verticals (homepage and `/about`) | `data/verticals.ts` | Name, official tagline, summary, institutions (logos), highlights, link. |
| Centre for Digital Health page | `data/digital-health.ts` | Official CDH content: vision, mission, research areas, upcoming programmes, open source, partners, coordinator. |
| Head, faculty, visiting faculty, staff | `data/people.ts` | One row per person. Photos are loaded from iitj.ac.in URLs. |
| Students (per programme, per cohort year) | `data/students.ts` | Add a line `"ROLLNO|Name"` under the right programme and year. Counts, chart and the Impact figure update automatically. |
| Programmes | `data/programs.ts` | `availability: "offered" \| "discontinued"`. Discontinued programmes disappear from current listings but keep their cohorts. |
| Research themes | `data/research.ts` | `facultyIds` must match ids in `people.ts`. |
| Projects (Innovation) | `data/projects.ts` | Set `provenance: "verified"` once confirmed. |
| Startups / ventures | `data/startups.ts` | Profile, product, `trl` (1–9), `trlEvidence`, founders, `mentorIds`, `funding` awards, links. |
| Funding opportunities | `data/grants.ts` | Add real, dated calls with `grantStatus` and `officialUrl`. |
| News and events | `data/news.ts` | `featured: true` puts an item first. `image` sets its photo. |
| Achievements (medals, fellowships, awards) | `data/achievements.ts` | One entry per achievement, from an official source (certificate, convocation screen, announcement). Link recipients by roll number (`studentId`) or people id (`personId`); the page shows their programme/cohort and the register shows a badge. |
| Event photos | `data/media.ts` | One `GalleryImage` per photo, linked by `eventId` to a news item `id`. |
| Impact numbers | `data/metrics.ts` | `value: null` shows "Awaiting verified data". Never enter an estimate. |
| Pipeline copy | `data/pipeline.ts` | Nine stages, each with a question, description, "who" and accent colour. |
| Collaboration pathways | `data/collaboration.ts` | Audience, title, description and a mailto call to action. |

### Common tasks

**Add a startup.** Copy an entry in `data/startups.ts`, give it a unique `id`/`slug`, fill in the details, set `provenance: "verified"` and `status: "published"`. It appears on `/startups`, on the homepage (first three) and at `/startups/<slug>`, and is added to the sitemap.

**Add a new cohort.** Append the new year under each programme in `data/students.ts`, e.g. `2027: ["M27IM1001|Name", …]`.

**Close or reopen a programme.** Flip `availability` in `data/programs.ts`.

**Add an event gallery.** Follow [Images and photography](#images-and-photography), add a `NewsItem` in `data/news.ts`, and register the photos in `data/media.ts` with the same `eventId` as that news item's `id`.

## Content integrity rules

This is an institutional website. **Nothing is invented.**

- Faculty, students, programmes, contact details and ICMI facts come from official IIT Jodhpur pages. Each record keeps a `sourceUrl`.
- Numbers in Impact are shown only when they can be counted from an official source. Everything else reads "Awaiting verified data".
- Research themes are **editorial groupings** of the faculty's published research interests, not an official taxonomy.
- Photo captions describe what is visible. They do not name people or assert venues unless confirmed.
- **Sample content** (`provenance: "sample"`) exists only to demonstrate layouts:
  - In development it is visibly marked with a hatched amber **Demo** badge and ribbon.
  - In production it is **filtered out** by `lib/data/index.ts`, and sections show an empty state instead ("Venture profiles are being verified", "Funding listings are being compiled").
  - To preview demo content on a review deployment, set `SHOW_SAMPLE_CONTENT=true`.

## Images and photography

### Event photos

Phones produce HEIC files, which browsers cannot display. `scripts/process-photos.py` converts them and applies the site's **house grade**:

- partial white balance, which tames warm stage lighting
- exposure normalisation
- a gentle contrast curve
- a faint cool tint in the shadows
- about 14% desaturation

This keeps every event visually consistent.

1. One-time setup: a Python virtual environment (ignored by git).

   ```bash
   python -m venv .venv-photos
   ```

   ```bash
   .venv-photos/Scripts/pip install pillow pillow-heif
   ```

   (On macOS/Linux, use `.venv-photos/bin/pip`.)

2. Process a folder of originals:

   ```bash
   .venv-photos/Scripts/python scripts/process-photos.py icmi2026 icmi-2026
   ```

   Output lands in `public/images/icmi-2026/` as 2000px JPEGs, roughly 250–700 KB each.

3. Rename the files descriptively, e.g. `icmi-2026-03-poster-session.jpg`, and register them in `data/media.ts` with a caption and descriptive alt text.

4. Keep the originals out of git. Add the folder to `.gitignore`, as was done for `icmi2025/`.

`next/image` then serves AVIF/WebP at the right size for each device.

### Media library

Raw photos and video live in `medtech-media/` (ignored by git):

- **Photos** are in `medtech-media/img/`, one folder per event, named `YYYY-MM-DD_event-name/` (e.g. `2024-08-03_orientation-batch-2024/`). Each file is named by capture time: `YYYY-MM-DD_HH-MM-SS.jpg`.
- **Dates** come from the WhatsApp export name or the camera EXIF data. Photos with no date go to `undated/`.
- **`_rename-log.csv`** records every original → new name.
- **To file new exports**, drop them into `medtech-media/img/`, add their dates to `EVENTS` in `scripts/organise-media.py`, then run it.
- **Before publishing a photo on the site**, grade it with `process-photos.py` and register it in `data/media.ts`.

### Gallery (`/gallery`)

One page with every photo from the archive in a justified grid, filterable by year, with the full-screen viewer.

To add photos:

1. Put the new files in `medtech-media/img/` and run `scripts/organise-media.py --apply`.
2. Run `python scripts/build-gallery.py` for a dry run that reports duplicates and broken files, then add `--apply`. This colour-corrects every photo, writes 1600px web copies to `public/images/gallery/`, and regenerates `data/gallery-manifest.json`.

   The correction (`scripts/colour_correct.py`) works photo by photo, because most gallery photos are phone shots under mixed indoor light:

   - white balance from bright neutral surfaces (walls, ceilings, screens)
   - auto-levels, to restore blacks and whites
   - exposure normalisation
   - gentle contrast
   - extra saturation only for dull shots

   Designed posters listed in `GRAPHICS` in `build-gallery.py` are only resized.
   Add new posters to that list.
3. Optionally, in `data/gallery.ts`:
   - set alt text for the new folder in `ALT`
   - add a confirmed event name in `EVENT`
   - change the homepage picks in `FEATURED_ORDER`

On the page:

- Only photos near the viewport load; the rest lazy-load while scrolling.
- The homepage "From the gallery" section loads just its 5 featured photos.
- Event names and captions appear only where confirmed.

### Video

The Centre walkthrough (`public/videos/medtech-centre-walkthrough.mp4`) is a web encode of the original 4K file:

- 720×1280, 30 fps, H.264, about 8 MB, with fast-start streaming.
- A poster frame sits next to it.
- It is shown on `/about` with `preload="none"`, so nothing downloads until someone presses play, and it never autoplays with sound.

To encode another video the same way:

```bash
ffmpeg -i input.mp4 -vf "scale=720:1280:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 31 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart public/videos/name.mp4
```

(For landscape videos, use `scale=1280:720`.)

### Where photos appear

| Component | Used for |
| --- | --- |
| `PhotoMarquee` | Continuous, slowly scrolling strip (homepage News). Pauses on hover/focus, has a Pause/Play button, and becomes a scrollable row under reduced motion. |
| `PhotoMosaic` | Ordered 4:3 grid with captions (`/news#icmi-2025`). |
| `Lightbox` | Full-screen viewer on native `<dialog>`: ← → keys, Escape, focus trapped. |

### Faculty photos and logos

- Faculty portraits are loaded directly from `www.iitj.ac.in`. On the campus network that host resolves to a private IP, which Next's image optimiser rejects as a security measure. Those images are therefore rendered `unoptimized`. Long term, copy them into `public/` or object storage.
- The IIT Jodhpur logo and AIIMS Jodhpur seal in `public/logos/` are official assets. Use them unmodified and at equal size.
- Where a real photograph is not yet available, `ImagePlaceholder` keeps the final aspect ratio and states what the photo should show.

## Design system

Defined as Tailwind v4 tokens in `app/globals.css`.

**Character:** editorial, scientific, institutional, contemporary, precise. White and neutral first; blue, cyan and teal as controlled accents. No navy, no neon, no heavy gradients or glass effects.

| Token | Value | Use |
| --- | --- | --- |
| `white` / `paper` / `mist` | `#FFFFFF` / `#F8FAFC` / `#F1F5F9` | Surfaces |
| `ink` / `ink-2` / `muted` | `#111827` / `#334155` / `#64748B` | Text |
| `line` / `line-strong` | `#E2E8F0` / `#CBD5E1` | Hairlines and dividers |
| `blue` | `#2563EB` | Primary accent, links, active states |
| `cyan` · `cyan-ink` | `#06B6D4` · `#0E7490` | Diagrams · AA-contrast text |
| `teal` · `teal-ink` | `#14B8A6` · `#0F766E` | Diagrams · AA-contrast text |

- **Typography:**
  - IBM Plex Sans for text.
  - IBM Plex Mono for technical labels (the `eyebrow` utility).
  - Fluid scale tokens: `text-display`, `text-h2`, `text-h3`, `text-lead`.
- **Shape:** 2–6px radii, hairline borders, minimal shadows.
- **Utilities:**
  - `container-x`: page width and gutters.
  - `section-y`: section spacing.
  - `bg-grid` / `bg-grid-fine`: scientific grid backgrounds.
  - `link-line`: animated underline.
- **Signature elements:**
  - numbered section labels (`01 — About the Centre`)
  - the IIT Jodhpur → Centre ← AIIMS Jodhpur lockup
  - the nine-stage pipeline
  - the TRL measurement scale (a ruled axis with a marker and phase brackets rather than a progress bar)

## Motion

- **Purposeful only:** motion explains a process or reveals content. There are no floating or looping decorative animations.
- **Hero entrance** is pure CSS (`anim-rise`, `anim-fade-up`), so the headline never waits for JavaScript. This is good for LCP.
- **Motion** handles scroll reveals, tab and panel transitions, the drawn lines in the diagrams, counters and menus.
- **GSAP ScrollTrigger** handles only the pinned pipeline story on `/about`. On smaller screens it becomes a scroll-drawn timeline.
- **Reduced motion:**
  - `MotionConfig reducedMotion="user"` plus a global CSS override honour `prefers-reduced-motion`.
  - The photo marquee stops and becomes scrollable.

## Accessibility

Target: WCAG 2.2 AA.

- Semantic landmarks, one `h1` per page, logical heading order, skip link, breadcrumbs.
- Visible focus states everywhere (`:focus-visible` in blue).
- Keyboard support: dropdown menus (Escape and outside-click close them), arrow keys on tabs, the lightbox (← →, Escape) and the mobile menu (Escape, scroll lock).
- `aria-pressed`, `aria-expanded`, `aria-current` and `aria-live` on interactive controls and filtered results.
- Auto-moving content has a pause control, and duplicated marquee items are hidden from assistive technology.
- Text colours meet AA contrast. Cyan and teal use dedicated darker `-ink` variants for text.
- Descriptive alt text on every photograph. Decorative images use `alt=""`.

## SEO

- Per-page `title`, `description`, canonical URL, Open Graph and Twitter cards via `pageMetadata()` in `lib/seo.ts`.
- JSON-LD:
  - `EducationalOrganization` (site-wide, in `app/layout.tsx`)
  - `BreadcrumbList` (every inner page, from `PageHeader`)
- `sitemap.xml` includes every route plus each published venture. `robots.txt` disallows `/admin`.
- **Base URL:** `site.url` in `data/site.ts` is `https://www.iitj.ac.in/medical-technologies`. Because it contains a sub-path, canonical URLs are built as absolute URLs by `absoluteUrl()`. If the site moves to its own domain, change `site.url` and everything follows.

## Deployment

The project deploys to **Vercel** with zero configuration:

1. Import the GitHub repository into Vercel. The framework is detected as Next.js.
2. Set **Production Branch** to `main` (Settings → Git).
3. Every push to `main` deploys. The build log should list about 14 routes, including `/about`, `/students` and `/startups/[slug]`.

> If a deployment shows only `/`, `/robots.txt` and `/sitemap.xml`, Vercel rebuilt an **old commit**. This usually happens after clicking *Redeploy* on an older deployment. Redeploy the latest commit on `main` instead.

Any Node host works too: `npm run build`, then `npm run start`. All routes are static, so the output can also be served from a CDN.

## Environment variables

| Variable | Default | Effect |
| --- | --- | --- |
| `SHOW_SAMPLE_CONTENT` | unset | `true` shows sample/demo startups, projects and grants in a production build, for review deployments only. |

No other secrets or variables are required in Phase 1.

## Roadmap: admin and CMS

Phase 1 intentionally has **no** authentication, database, CMS or backend. The architecture is ready for them:

```text
Next.js  →  API  →  PostgreSQL  →  Admin panel (/admin)
                          └── media in S3 / Cloudflare R2
```

- **Schema:** `lib/types.ts` maps one-to-one onto tables. Records are flat and ID-keyed, and relations use id arrays (`facultyIds`, `mentorIds`, `researcherIds`, `eventId`).
- **Workflow:** `status` (`draft` / `review` / `published`) and `provenance` are already on every record, for the admin's draft → review → publish flow.
- **Swap point:** re-implement the getters in `lib/data/index.ts` against the API. No component changes are needed.
- **Planned admin collections:** projects, research areas, people, students, programmes, grants, publications, patents, labs, news, events, galleries, startups, collaborations, media.

## Outstanding content

Needed from the Centre before launch:

- [ ] Verified **startup** profiles: product, TRL with evidence, founders and photos, mentors, grants and funding received
- [ ] Verified **projects** for the Innovation section
- [ ] Current, dated **funding calls**
- [ ] **AIIMS Jodhpur** clinical faculty for the People directory
- [ ] Programme **duration** and **brochures** (Master's and PhD)
- [ ] Verified counts for **research projects, publications, patents, start-ups**
- [ ] **Lab / clinical** photography for the research and about pages
- [ ] Official **social media** links (`data/site.ts → social`)
- [ ] **Alumni** status and current roles (`data/students.ts → status`, `currentRole`)
- [ ] Confirmation of the research-theme names
- [ ] Spelling of the Head's surname: the official Head listing says "Vankayla", the faculty listing says "Vankayala" (the site uses the latter)

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Faculty photos broken, log says *"hostname resolved to private IP"* | You are on the campus network. Remote photos are already rendered `unoptimized`; if you add new remote images, use `unoptimized={isRemote(src)}`. |
| Port 3000 in use | Run `npx next dev -p 3100`. |
| Startups / funding show "being verified" or "being compiled" in production | Expected: only verified records are published. Add verified data, or set `SHOW_SAMPLE_CONTENT=true` for review. |
| `process-photos.py` says HEIC needs `pillow-heif` | Install it in the photo venv (see [Images and photography](#images-and-photography)). |
| Warning about multiple lockfiles / workspace root | `turbopack.root` is pinned in `next.config.ts`; a stray `package-lock.json` in a parent folder causes this warning. |

---

Institutional information is sourced from official IIT Jodhpur pages. The IIT Jodhpur logo and the AIIMS Jodhpur seal are the property of their respective institutions.
