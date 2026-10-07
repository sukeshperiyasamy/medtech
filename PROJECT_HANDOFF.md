# PROJECT_HANDOFF — Medical Technology Centre, IIT Jodhpur website

Written 2026-10-05 for the next coding agent. Everything below was checked against the working tree on that date
unless it is marked **(not re-verified)**. Where a fact comes from a commit message rather than from the code,
it says so.

---

## 1. Current architecture

**What the site is.** A static, content-driven marketing/institutional website for the *Medical Technology
Centre, IIT Jodhpur*. The Centre belongs to IIT Jodhpur. The only vertical currently shown publicly is the
*Medical Technologies Program*, run jointly with AIIMS Jodhpur. There is no backend, database, authentication or
CMS yet (Phase 1, frontend only).

**Request path.**

```text
UI component (server component by default)
   → lib/data/index.ts        the ONLY place components read content from (async getters)
      → data/*.ts             typed local content (the future DB / CMS)
```

Components never import from `data/` directly. A future admin/API replaces `lib/data/index.ts` and nothing
else.

**Layout.** `app/layout.tsx` wraps every page in: skip link → inline `revealScript` → `MotionProvider` →
`AnnouncementBar` → `SiteHeader` → page → `SiteFooter`, and emits site-wide JSON-LD (`organizationLd`,
`websiteLd`). All pages are statically pre-rendered; `/startups/[slug]` is SSG via `generateStaticParams`, and
its share images are rendered on demand.

**Folder map.**

```text
app/            routes (one folder per page), sitemap.ts, robots.ts, manifest.ts, icons, per-route
                opengraph-image / twitter-image files
components/     home/ hero/ verticals/ about/ research/ pipeline/ innovation/ startups/ funding/ impact/
                programs/ people/ students/ achievements/ news/ gallery/ digital-health/ collaboration/
                navigation/ footer/ layout/ seo/ ui/
data/           all content (see §12) + gallery-manifest.json (generated)
lib/            types.ts (all models) · data/index.ts (data layer) · seo.ts · structured-data.ts · og.tsx
                utils.ts · motion-features.ts · reveal-script.ts
public/         icons/ videos/ images/{brand,centre,people,achievements,gallery,icmi-2025}
scripts/        build-gallery.py · colour_correct.py · organise-media.py · process-photos.py · qa-audit.mjs
medtech-media/  raw photo/video archive (tracked in git except the video master and HEIC masters)
```

**Routes (14 pages + generated files).** `/`, `/about`, `/medical-technologies`, `/digital-health` (hidden, see
§8), `/research`, `/funding`, `/startups`, `/startups/[slug]`, `/programs`, `/people`, `/students`,
`/achievements`, `/news`, `/gallery`, `/contact`. Also `/sitemap.xml`,
`/robots.txt`, `/manifest.webmanifest`, `/icon.png`, `/apple-icon.png`, and one `opengraph-image` and
`twitter-image` per route.

**Homepage today** (`app/page.tsx`): `HomeAchievements` (image-only slider) → `Hero` → `VerticalsSection`
(photo variant) → `HomeAbout` (pipeline strip) → `HomeResearch` → `ImpactSection` → "From the gallery"
(`FromTheGallery`, rotating photo grid). Earlier versions also had Ventures, Funding, Programmes, News and
Collaborate sections; they were removed in commits `69c3d00` and `a71b4e2`.

**Navigation** (`data/site.ts` → `nav`): About · Verticals ▾ (Medical Technologies Program, Programmes &
admissions) · Research ▾ (Research areas, Innovation, Funding) · Startups · People ▾ (Faculty & staff,
Students & alumni, Achievements) · News ▾ (News & events, Talks, Gallery). A "Contact" button sits right of the nav.

---

## 2. Tech stack and versions

Declared in `package.json`, installed versions read from `node_modules`:

| Piece | Declared | Installed |
| --- | --- | --- |
| Next.js (App Router, Turbopack) | `^16.3.6` | 16.3.6 |
| React / React DOM | `^19.3.0` | 19.3.0 |
| TypeScript | `^5.9` | 5.9.3 |
| Tailwind CSS (+ `@tailwindcss/postcss`) | `^4.3.3` | 4.3.3 |
| Motion (`motion/react`) | `^13.4.4` | 13.4.4 |
| GSAP (+ ScrollTrigger) | `^3.15.0` | 3.15.0 |
| lucide-react | `^1.48.0` | 1.48.0 |
| ESLint / eslint-config-next | `^9` / `^16.3.6` | 9.39.5 |
| Prettier | `^3.9.9` | — |
| Node / npm (this machine) | — | v22.12.0 / 10.9.0 |

- Fonts: IBM Plex Sans + IBM Plex Mono through `next/font/google` (self-hosted at build time).
- `browserslist` is `chrome >= 111; edge >= 111; firefox >= 111; safari >= 16.4` (drops legacy polyfills).
- Python 3.13 is used only by the media scripts; it needs `pillow`, `pillow-heif` (HEIC) and `numpy`.
- Hosting: Vercel, auto-deploy from `main` (no `vercel.json`; framework detected automatically).
- Lighthouse is **not** a project dependency; it is run through `npx lighthouse@12`.

**Read this before writing Next.js code.** `AGENTS.md` (pulled in by `CLAUDE.md`) says this Next.js version has
breaking changes and tells you to read `node_modules/next/dist/docs/` (it exists: `01-app`, `02-pages`,
`03-architecture`, `04-community`). The block is re-created by `next dev`; leave it in place.

---

## 3. Current branch

`main`, tracking `origin/main` (`https://github.com/sukeshperiyasamy/medtech.git`). `git status -sb` shows no
ahead/behind. Total commits: 31. Latest: `482746a` (2026-10-01) *"Remove the Not a department line from the
Medical Technologies page."*

---

## 4. Current git status

Two tracked files are modified and nothing is staged. There are no untracked files and no deletions.

```text
 M components/home/AchievementsSlider.tsx
 M components/home/HomeAchievements.tsx
```

`git diff` also prints `LF will be replaced by CRLF` warnings: the repo has no `.gitattributes`, and the working
copy is on Windows.

---

## 5. All uncommitted changes

Only the homepage achievements slider. It turns a captioned slider into an image-only one.

`components/home/AchievementsSlider.tsx` (49 insertions, 80 deletions across both files):

- Removed the header row: the "Achievements" label, the "All achievements" link, and the per-slide caption block
  (title, category, year, recipients) that linked each slide to `/achievements#ach-title-<id>`.
- `AchievementSlide` is now just `{ id, image }`. The `Link` import is gone, so **slides are no longer links**.
- Slides are larger: `w-[min(88vw,34rem)]`, gap 20 px, wider side padding, 4:3 image crop, white background.
- The prev / next / pause controls are kept but moved into a small bordered overlay at the bottom-right of the
  strip. Autoplay (every 5 s) still pauses on hover/focus, via the pause button, and under
  `prefers-reduced-motion`.

`components/home/HomeAchievements.tsx`: now maps only `{ id, image }` for the first 12 achievements that have an
image (comment updated to "large image-only slider").

**Consequence to decide on:** the homepage no longer links to `/achievements`. The page is still reachable from
People ▾ → Achievements in the header, but nothing on the homepage points to it.

These edits are not mine. I did not author them in this session, so confirm with the owner before committing or
reverting.

---

## 6. Work completed (chronological summary)

**Foundation and design system.** Next.js project created by hand (the folder name has a space, so
`create-next-app` was not usable). Tailwind v4 tokens in `app/globals.css`: white/neutral surfaces, blue/cyan/teal
accents, IBM Plex type scale, hairline borders, no navy. Official IIT Jodhpur logo and AIIMS Jodhpur seal are used
unmodified (`public/images/brand/`).

**Content audit.** Official IIT Jodhpur Medical Technologies pages and the Centre for Digital Health pages were
read to build the data layer (programmes, people, cohorts, contact, CDH vision/mission/research areas).

**Structure.** Long single-page homepage (about 30 screens) was split into a short overview plus dedicated pages.
The Centre identity was changed to "Medical Technology Centre, IIT Jodhpur" with the AIIMS partnership tied to the
Medical Technologies Program (header shows IIT Jodhpur only).

**Features built.** Programmes tabs with discontinued programmes; people directory and student register
(99 students, all cohorts 2020–2026, filters and search); achievements page and register badges; funding explorer,
startups showcase with a TRL scale and individual venture pages, innovation showcase (all three currently demo
data); research explorer; news with Talks support; Centre for Digital Health page; Medical Technologies page with
the walkthrough video; gallery page (justified grid, year filters, lightbox with swipe and counter); homepage
gallery teaser that rotates photos every 5 s; achievements slider; pipeline story (GSAP, desktop) and timeline
(mobile).

**Media.** HEIC conversion, colour grading, a media organiser (rename by date into event folders), a gallery
builder with per-photo colour correction, video encode (117 MB 4K → 7.9 MB web file) with a WebP poster.

**SEO / performance (commit `b27ce37`).** Branded share cards for every route (text cards; static JPEG cards
with verified photos for `/about`, `/news`, `/gallery`), favicon, Apple icon, manifest and home-screen icons,
per-page Open Graph and X metadata, structured data from verified data only (§12), motion switched to
`LazyMotion` + `m.*`, a server-rendered `Reveal` driven by an inline script, prefetch disabled on secondary
links, a production content/link audit script.

**Later commits not authored in this session** (2026-09-26 → 2026-10-01, by the repo owner or another agent):
homepage simplification, rotating gallery grid, hero background changes, footer compaction, media reorganisation
(`public/images/brand`, `public/images/achievements`), 2022–2023 achievements with official posters, **limiting the
public site to approved faculty and the Medical Technologies vertical**, a Talks section, the part-time PhD
listed as discontinued, the new-workspace photos hidden. Read `git log` for detail.

---

## 7. Features currently implemented

| Area | State |
| --- | --- |
| Homepage | Achievements slider, hero, verticals (one card), pipeline strip, research list, impact numbers, gallery teaser |
| `/about` | Centre statement, building photo, verticals, walkthrough video, leadership (Head + Digital Health coordinator) |
| `/medical-technologies` | Intro, IITJ × AIIMS diagram, pipeline story, programmes, ICMI photo strip |
| `/programs` | Tabs for Master's and PhD (offered); discontinued Dual Degree and part-time PhD listed below |
| `/people`, `/students` | Directory with search/filter; student register with intake chart and award badges |
| `/achievements` | 31 entries, 2022–2026, filters by type and by people, official images open in the lightbox |
| `/news` | News list (3 items), Talks section (0 entries yet), ICMI 2025 gallery mosaic |
| `/gallery` | 135 photos, year filters, justified grid, lightbox (counter, arrows, swipe, Escape) |
| `/research`, `/funding`, `/startups` | Built; **show empty states in production** (all records are demo data) |
| `/contact` | Collaboration pathways, address with building photo |
| SEO | Titles, descriptions, canonicals, OG/X cards, sitemap, robots, manifest, icons, JSON-LD |
| Performance | AVIF/WebP via `next/image`, lazy loading, video `preload="none"` with poster, LazyMotion |
| Accessibility | Skip link, landmarks, focus styles, keyboard menus/tabs/lightbox, `aria-*` on controls, reduced-motion support, pause control on moving content |

Numbers verified in the data on 2026-10-05: 14 faculty rows + 2 staff rows + Head + CDH coordinator; 99 students;
31 achievements (19 with images); 135 gallery photos; 3 news items; 4 programmes (2 offered).

---

## 8. Known bugs

1. **`/digital-health` is hidden but not removed.** The page, its OG/X images and its data still exist and build.
   It is excluded from the nav, `VerticalsSection` (filters `id !== "digital-health"`), `sitemap.ts` and the
   organisation JSON-LD, but anyone with the URL can open it and robots.txt allows it. Per the commit message
   (`e4e73d1`) it should stay out until approved. Add `robots: { index: false }` or remove the route if it must not
   be reachable. Also, `data/people.ts` still lists the CDH coordinator under Leadership, so he appears on
   `/about` and `/people`.
2. **Production shows empty sections.** Startups, grants and projects are all `provenance: "sample"`, and sample
   records are filtered out in production. Startups, Funding and Research → Innovation remain in the navigation and
   lead to "being verified / compiled" empty states. The homepage Impact "Research output" row also links to those.
3. **README is stale.** `README.md` (508 lines) still describes two verticals, lists `/digital-health` in the
   navigation, shows an older nav, and omits `numpy` from the photo-script setup. Do not trust it for scope; use this
   file.
4. **The homepage no longer links to `/achievements`** (see §5).
5. **Metrics are partly hardcoded.** `data/metrics.ts` has `students: 99` and `cohorts: 7` typed in by hand, while
   `faculty` is derived (`faculty.length`). If `data/students.ts` changes, the "99" will go stale.
6. **QA script reports false failures on iitj.ac.in links.** Node cannot verify IIT Jodhpur's TLS chain
   (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`) although browsers can. See §9.
7. **The Impact "Research output" links `View innovation` (`/research#innovation`) and `Explore ventures`
   (`/startups`)** land on those empty states in production (same cause as item 2).

---

## 9. Known limitations

- **Faculty portraits are hot-linked** from `https://www.iitj.ac.in/PageImages/Peoples/...` and rendered
  `unoptimized` (`isIitjHosted()` in `lib/utils.ts`). Reason: the IITJ server sends an incomplete TLS certificate
  chain, so Next's server-side image optimiser fails (also on Vercel), while browsers load them fine. The files are
  large (33 portraits, about 15 MB in total, up to 3.5 MB each, many with 2000–5000 px sides). Whether IIT Jodhpur
  permits re-hosting them is **unanswered**; do not copy them into the repo until that is confirmed.
- On the IITJ campus network `www.iitj.ac.in` also resolves to a private IP; any server-side fetch of it can be
  blocked.
- The TISC link on `/digital-health` is `http://www.iitj-tisc.org/` because HTTPS fails on that domain (Sep 2026).
- **Lighthouse (mobile, simulated throttling) has not been re-run since the performance commits.** The last numbers I
  measured, before `LazyMotion` and the new `Reveal`, were Performance 80–83, Accessibility 100, Best Practices 100,
  SEO 100 on `/`, `/gallery`, `/about`, `/achievements`. LCP was 3.1–4.3 s, almost all "render delay" (about 2.6–3.8 s,
  i.e. JavaScript), CLS 0, TBT 240–410 ms. The target of Performance ≥ 90 was **not met at that point**. Local scores are
  unreliable on the owner's laptop (a background `llama-server` swings the CPU benchmark index 550–1500; see the memory note).
  Prefer PageSpeed Insights on a Vercel preview, or compare before/after back-to-back.
- No backend, auth, CMS, admin panel, form handling, analytics, search, or i18n. Contact is `mailto:` only.
- No AIIMS Jodhpur clinical faculty in the People data (`TODO(content)` in `data/people.ts`).
- No social links (`TODO(content)` in `data/site.ts`).
- Publications, patents-as-records, labs and events-as-records are modelled in `lib/types.ts` but have no data.
  Research-article structured data is not implemented for that reason.
- `medtech-media/` is tracked: 152 files, about 170 MB of tracked content in the repo overall. Vercel builds
  upload a large cache. The raw video master (> 100 MB) and HEIC masters are git-ignored.
- Photo captions and event names are only filled in where signage in the photo confirms them; the rest are date-only
  on purpose.
- The "final QA report" promised during the SEO/performance phase **was not delivered** by me. The content/link
  audit was run twice against a local production build (results in §13) and Lighthouse once; later commits changed
  the site.

---

## 10. Remaining tasks

**Needs the owner's decision**
- Publish or remove `/digital-health`; decide whether the coordinator stays in Leadership.
- Re-host faculty portraits (permission) or keep hot-linking.
- Replace demo startups / projects / grants with verified records, or remove those nav entries until then.
- Commit, revert or adjust the slider change (§5); restore a link from the homepage to `/achievements` if wanted.
- Confirm whether the Head's name is spelled "Vankayala" (used in `data/people.ts`) or "Vankayla" (appears in the
  official photo file name); photo filename `Raviraj-Vankayla-…` is on the official page.

**Engineering**
- Re-run the production audit (`scripts/qa-audit.mjs`) and Lighthouse on the current `main`, then fix what they report.
- Update `README.md` to match the current scope.
- Add `.gitattributes` (`* text=auto eol=lf`) to stop CRLF churn.
- Derive `students` and `cohorts` in `data/metrics.ts` from `data/students.ts`.
- Add real data: AIIMS clinical faculty, social links, publications, patents, labs, news and talks.
- When a backend arrives, re-implement `lib/data/index.ts` against the API and add `/admin` (robots already
  disallows `/admin`).
- Optional: re-run Lighthouse after the later hero and gallery changes; large LCP is JavaScript-bound.

---

## 11. Important design decisions

1. **Nothing is invented.** Every fact needs an official source. Unknown fields stay empty ("To be confirmed",
   `null`, omitted). Records carry `provenance: "verified" | "sample"`.
2. **Sample data never reaches production.** `lib/data/index.ts` filters `provenance: "sample"` unless
   `NODE_ENV !== "production"` or `SHOW_SAMPLE_CONTENT=true`. In development, sample records are visibly marked
   (hatched amber badge/ribbon from `components/ui/SampleNote.tsx`).
3. **Identity.** Header and footer show the IIT Jodhpur mark only. The IITJ × AIIMS pairing appears with the Medical
   Technologies Program. Name is "Medical Technology Centre" (Centre spelling, as on the official contact page).
4. **Verified-only metrics.** Impact figures come from official pages; unverified outputs are shown as navigation
   under "Research output", not as empty numbers.
5. **Discontinued programmes** stay in data (`availability: "discontinued"`) for their cohorts. The word
   "discontinued" is never shown next to a student's name; it lives with the programme and in one neutral note.
6. **Approved faculty only** on the public site, ordered as the Centre's list (commit `e4e73d1`).
7. **Gallery is one page**, no albums. Originals stay in `medtech-media/`. Web copies are 1600 px with per-photo
   colour correction; designed posters (listed in `GRAPHICS` in `scripts/build-gallery.py`) are only resized.
8. **URLs are flat** (`/programs`, `/students`, not nested under the vertical).
9. **Absolute URLs are built by hand** (`absoluteUrl()` in `lib/seo.ts`) from `site.url`, because the site may be
   served from the sub-path `/medical-technologies`. `site.url` resolves as `SITE_URL` → Vercel production URL →
   `https://www.iitj.ac.in/medical-technologies`.
10. **Motion strategy.** `LazyMotion` with `strict` and `m.*` in client components (features load in a separate chunk,
    `lib/motion-features.ts` = `domMax` because the funding table uses layout animations). `Reveal` is a server
    component driven by an inline script (`lib/reveal-script.ts`) so above-the-fold content never waits for
    JavaScript. GSAP is used only for the pipeline story.
11. **Prefetch is off for secondary links** (`MoreLink`, footer, directories); on only for primary navigation. The
    mobile menu is portalled to `document.body` (a `backdrop-filter` on the header otherwise collapses fixed children)
    and its links prefetch only while it is open.
12. **Moving content has a pause control** (WCAG 2.2.2) and stops under `prefers-reduced-motion`.
13. **Structured data from the data layer only**, and no email or phone in `Person` objects.
14. **Hero entrance is CSS-only** (`.anim-rise`, `.anim-fade-up` in `globals.css`).

---

## 12. Important API / data structures

All models live in `lib/types.ts` and are flat, ID-keyed, and map one-to-one to future DB tables.

```ts
BaseRecord { id; slug; status: "draft"|"review"|"published"; provenance: "verified"|"sample"; sourceUrl? }
Person        extends BaseRecord { name; designation; category: "Leadership"|"Faculty"|"Visiting Faculty"|
                                   "Researchers"|"Students"|"Staff"; institution; photo?; researchInterests[]; email?; phone?; profileUrl? }
Student       { id (roll number); rollNumber; name; programId; cohortYear; status?; photo?; startupId?; provenance; sourceUrl }
Program       extends BaseRecord { title; shortTitle; degree; availability: "offered"|"discontinued"; intakeYears?; overview;
                                   eligibility?; duration?; curriculum?; admission?: Link[]; cohortsUrl? }
Achievement   extends BaseRecord { title; shortTitle?; venture?; category; awardedBy?; date?; year; level?;
                                   audience: "Student"|"Faculty"|"Centre"; recipients: { name; studentId?; personId? }[];
                                   summary?; details?; image?: Media&{width;height}; sourceNote? }
GalleryImage  { id; src; alt; width; height; date?; category?; event?; caption?; color?; featured? }
NewsItem      extends BaseRecord { title; category (incl. "Talk"); date; endDate?; summary; venue?; organizers?; attendance?;
                                   talkKind?: "Invited talk"|"Discussion"; speaker?; image?; link?; featured? }
Startup       extends BaseRecord { name; tagline; description; product; trl: 1..9; trlEvidence?; founders[]; mentorIds[]; funding[]; … }
Metric        { id; label; value: number|null; note; sourceUrl?; link? }      // null = "not verified", rendered as a link
SiteConfig    { name; parent; description; url; email; phone; address[]; institutions[]; nav: NavItem[]; announcement? }
```

**Data modules** (`data/`): `site, people, students, programs, research, projects, grants, startups, achievements,
news, gallery (+ gallery-manifest.json), media, metrics, pipeline, verticals, digital-health, collaboration`.

**Data layer** (`lib/data/index.ts`): `getSite, getPeople(category?), getPeopleByIds, getPrograms` (offered only),
`getAllPrograms, getStudents(programId?), getAchievements` (published, newest first), `getGalleryImages,
getFeaturedGalleryImages(limit)` (ordered by `FEATURED_ORDER` in `data/gallery.ts`), `getGallery(event?)` (legacy
ICMI set in `data/media.ts`), `getNews` (newest first), `getStartups/getStartup, getProjects, getGrants` (samples
filtered), `getMetrics, getPipeline, getResearchAreas, getVerticals, getDigitalHealth, getCentrePhoto,
getCentreVideo, getCollaborationPathways`.

**Gallery pipeline.** `medtech-media/img/<date_event>/<timestamp>.jpg` → `scripts/build-gallery.py --apply` →
`public/images/gallery/*.jpg` + `data/gallery-manifest.json` → `data/gallery.ts` adds alt text (`ALT`), confirmed
events (`EVENT`), featured picks (`FEATURED_ORDER`) and hides folders listed in `HIDDEN_FOLDERS` (currently
`2025-05-20_new-workspace`). `EXCLUDE` in the script drops specific duplicates.

**SEO.** `pageMetadata(title, description, path)` in `lib/seo.ts`; JSON-LD builders in `lib/structured-data.ts`
(`organizationLd, websiteLd, personLd/peopleLd, eventLd, courseLd, galleryLd, videoLd, achievementsLd, startupLd,
digitalHealthLd`) rendered by `components/seo/JsonLd.tsx`; `<` is escaped in the output. Share cards are generated
by `lib/og.tsx` (`ogCard`) from per-route `opengraph-image.tsx` / `twitter-image.tsx`.

**Environment variables.** `SITE_URL` (public address), `VERCEL_PROJECT_PRODUCTION_URL` (set by Vercel),
`SHOW_SAMPLE_CONTENT=true` (show demo data in a production build). There is no `.env` file. The old
`ALLOW_LOCAL_IP_IMAGES` option was removed.

---

## 13. Testing / build status

Run on 2026-10-05 against the working tree (including the two uncommitted files):

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | passes (exit 0, 24 s) |
| `npx eslint .` | passes, no warnings (exit 0, 98 s) |
| `npx next build` | passes (exit 0, 60 s); pages are static, plus dynamic share images for `/startups/[slug]` |
| Automated tests | **none** (no unit/e2e test framework in the repo) |
| Lighthouse | last run before the performance commits: Perf 80–83, A11y/BP/SEO 100 **(not re-verified)** |
| `scripts/qa-audit.mjs` | last run before later commits **(not re-verified)**; after fixes the only open items were false failures from the IITJ TLS chain and one `ECONNRESET` on the TISC https URL |

What `qa-audit.mjs` checks: every URL in `sitemap.xml` for status, title, description, canonical, OG/X images,
JSON-LD validity, internal and external links, images, video, mailto links, demo/placeholder text, localhost URLs,
and stale IITJ URLs.

**Gotchas for testing in this environment**

- The preview launcher (`.claude/launch.json`, `autoPort: true`) can assign a random port that fails to start
  ("exited with code 1"). Start the server yourself on a fixed port (`3100` for dev, `3200` for prod).
- Browser screenshots time out when the app window is hidden or minimised; when that happens, verify through the
  DOM instead (the pane then stops painting and animation frames do not run).
- A few idle `node` processes from earlier sessions were still running on 2026-10-05 (none listening on 3100/3200).
  Do not kill them without checking with the owner.

---

## 14. Commands needed to run the project

```bash
npm install
```

```bash
npx next dev -p 3100
```

`npm run dev` also works (port 3000); use 3100 if 3000 is taken.

```bash
npx tsc --noEmit
```

```bash
npm run lint
```

```bash
npm run build
```

```bash
npx next start -p 3200
```

```bash
npm run format
```

**Production-like local audit** (the site URL must match the port so canonicals and share images resolve locally):

```bash
SITE_URL=http://localhost:3200 npm run build
```

```bash
SITE_URL=http://localhost:3200 npx next start -p 3200
```

```bash
node scripts/qa-audit.mjs http://localhost:3200 qa-report.md
```

Node cannot verify the IITJ certificate chain, so external `iitj.ac.in` links show as failures. Treat them as
false positives, or run the audit once with `NODE_TLS_REJECT_UNAUTHORIZED=0` (only for the audit).

**Lighthouse** (Chrome is at `C:\Program Files\Google\Chrome\Application\chrome.exe` on the owner's machine):

```bash
npx lighthouse@12 http://localhost:3200/ --form-factor=mobile --throttling-method=simulate --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=lh-home.json --chrome-flags="--headless=new --no-sandbox"
```

**Media scripts** (Python venv, kept out of git as `.venv-photos/`):

```bash
python -m venv .venv-photos
```

```bash
.venv-photos/Scripts/pip install pillow pillow-heif numpy
```

```bash
python scripts/organise-media.py medtech-media/img            # dry run; add --apply to move files
```

```bash
python scripts/build-gallery.py                               # dry run; add --apply to write images + manifest
```

```bash
python scripts/process-photos.py <input-folder> <event-slug>  # HEIC/JPEG → graded web JPEG
```

**Deploy:** push to `main`; Vercel builds automatically. If a deployment lists only a few routes, Vercel rebuilt an
old commit (a "Redeploy" of an older deployment); redeploy the latest commit.

---

## 15. What the next coding agent must NOT change

- **Do not invent or infer facts**, names, numbers, dates, awards, grants or captions. Keep `provenance` honest.
- **Do not publish sample data in production**: keep the `visible()` filter in `lib/data/index.ts` and
  `SHOW_SAMPLE_CONTENT` behaviour.
- **Do not make components import from `data/`**; all content access stays in `lib/data/index.ts`.
- **Do not modify the official logos** (`public/images/brand/`) or place the AIIMS seal in the header; the header
  identity is IIT Jodhpur only.
- **Do not re-add Digital Health to navigation, sitemap, `VerticalsSection` or structured data** without the owner's
  approval. Do not add unapproved faculty to the public people list.
- **Do not copy faculty portraits** into the repo until re-use permission is confirmed, and do not remove
  `unoptimized={isIitjHosted(...)}` (the optimiser cannot fetch them).
- **Do not put emails or phone numbers into `Person` JSON-LD.**
- **Do not hand-edit `data/gallery-manifest.json` or `public/images/gallery/`**; regenerate them with
  `scripts/build-gallery.py`. Keep the originals in `medtech-media/`, and do not commit the raw video master or HEIC
  masters (`.gitignore` blocks them; GitHub rejects files over 100 MB).
- **Do not replace `m.*` with `motion.*`** in client components (`LazyMotion strict` will throw), and do not move
  `Reveal` back to client-side Motion; it intentionally runs from the inline script.
- **Do not switch `absoluteUrl()` to `metadataBase`-relative URLs**; the site can live under a sub-path.
- **Do not turn prefetch back on** for footer links, directories or the secondary-link components.
- **Do not remove the pause control or reduced-motion handling** on the moving sliders and photo grids.
- **Do not hide the "Demo / Sample" markers** shown in development.
- **Do not delete the `AGENTS.md` block**, and read the Next.js docs in `node_modules/next/dist/docs/` before
  writing Next code; this is not the Next.js version most documentation covers.
- **Do not commit, push, or rewrite history on `main` without the owner's go-ahead**, and do not touch the two
  uncommitted slider files (§5) until the owner decides what to do with them.
