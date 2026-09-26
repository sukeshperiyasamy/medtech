/**
 * Production content & link audit.
 *
 *   SITE_URL=http://localhost:3200 npm run build
 *   npx next start -p 3200
 *   node scripts/qa-audit.mjs http://localhost:3200 [report.md]
 *
 * Crawls every URL in sitemap.xml and checks: page status, title, description, canonical,
 * Open Graph / X images, JSON-LD validity, internal links, external links, images, video,
 * mailto links, placeholder / sample / development text and stale URLs.
 */
import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const devNull = process.platform === "win32" ? "NUL" : "/dev/null";

const BASE = (process.argv[2] ?? "http://localhost:3200").replace(/\/$/, "");
const OUT = process.argv[3];
const UA = { "user-agent": "Mozilla/5.0 (QA audit; Medical Technology Centre site)" };

const problems = [];
const warn = (page, kind, detail) => problems.push({ page, kind, detail });
const cache = new Map();

async function status(url, { method = "GET" } = {}) {
  if (cache.has(url)) return cache.get(url);
  const p = (async () => {
    try {
      const r = await fetch(url, { method, headers: UA, redirect: "follow", signal: AbortSignal.timeout(20000) });
      return { code: r.status, type: r.headers.get("content-type") ?? "" };
    } catch (e) {
      const reason = String(e.cause?.code ?? e.name);
      // iitj.ac.in sends an incomplete certificate chain: Node rejects it, browsers (and curl,
      // which uses the OS certificate store) complete the chain and load it fine.
      if (/CERT|SIGNATURE|ISSUER/.test(reason)) {
        try {
          const [code, type] = execFileSync("curl", ["-s", "-o", devNull, "-L", "--max-time", "25", "-A", UA["user-agent"], "-w", "%{http_code} %{content_type}", url], { encoding: "utf8" }).split(" ");
          return { code: Number(code), type: type ?? "", note: `Node TLS: ${reason}; checked with curl` };
        } catch {}
      }
      return { code: 0, type: reason };
    }
  })();
  cache.set(url, p);
  return p;
}

const attrs = (html, re) => [...html.matchAll(re)].map((m) => m[1].replace(/&amp;/g, "&"));
const meta = (html, key) =>
  attrs(html, new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`, "g"))[0];

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const pages = attrs(sitemap, /<loc>([^<]+)<\/loc>/g).map((u) => u.replace(/^https?:\/\/[^/]+/, BASE));
const external = new Map(); // url -> pages
const mailtos = new Set();
const internal = new Set();
const assets = new Set();
const summary = [];

for (const url of pages) {
  const path = url.replace(BASE, "") || "/";
  const res = await fetch(url, { headers: UA });
  const html = await res.text();
  if (res.status !== 200) warn(path, "page status", res.status);

  const title = attrs(html, /<title>([^<]*)<\/title>/g)[0];
  const desc = meta(html, "description");
  const canonical = attrs(html, /<link rel="canonical" href="([^"]+)"/g)[0];
  const ogImage = meta(html, "og:image");
  const twImage = meta(html, "twitter:image");
  if (!title) warn(path, "missing", "title");
  if (!desc) warn(path, "missing", "meta description");
  else if (desc.length > 170) warn(path, "long description", `${desc.length} chars`);
  if (!canonical) warn(path, "missing", "canonical");
  else if (canonical.replace(/\/$/, "") !== url.replace(/\/$/, "")) warn(path, "canonical mismatch", canonical);
  for (const [k, v] of [["og:image", ogImage], ["twitter:image", twImage]]) {
    if (!v) warn(path, "missing", k);
    else {
      const s = await status(v);
      if (s.code !== 200 || !s.type.startsWith("image/")) warn(path, `${k} not an image`, `${s.code} ${s.type} ${v}`);
    }
  }
  for (const k of ["og:title", "og:description", "og:url", "og:site_name", "twitter:card", "twitter:title"])
    if (!meta(html, k)) warn(path, "missing", k);

  // JSON-LD
  const ld = attrs(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  const types = [];
  for (const block of ld) {
    try {
      const j = JSON.parse(block.replace(/\\u003c/g, "<"));
      for (const o of Array.isArray(j) ? j : [j]) types.push(o["@type"]);
      if (/"email"\s*:/.test(block) && /"@type"\s*:\s*"Person"/.test(block) && !/ContactPoint/.test(block))
        warn(path, "privacy", "email inside Person JSON-LD");
    } catch (e) {
      warn(path, "invalid JSON-LD", e.message);
    }
  }

  // Links & assets
  for (const href of attrs(html, /<a [^>]*href="([^"]+)"/g)) {
    if (href.startsWith("mailto:")) mailtos.add(href.split("?")[0]);
    else if (href.startsWith("tel:") || href.startsWith("#")) continue;
    else if (/^https?:/.test(href) && !href.startsWith(BASE)) {
      if (!external.has(href)) external.set(href, new Set());
      external.get(href).add(path);
    } else internal.add(href.startsWith("http") ? href : BASE + href.split("#")[0]);
  }
  for (const src of [
    ...attrs(html, /<img [^>]*src="([^"]+)"/g),
    ...attrs(html, /<video [^>]*src="([^"]+)"/g),
    ...attrs(html, /<video [^>]*poster="([^"]+)"/g),
    ...attrs(html, /<link rel="(?:icon|apple-touch-icon|manifest)"[^>]*href="([^"]+)"/g),
  ])
    assets.add(src.startsWith("http") ? src : BASE + src);

  // Text checks (visible text only)
  const text = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
  for (const [re, label] of [
    [/\bDemo content\b|\bDEMO\b/, "demo marker"],
    [/Photograph pending/, "image placeholder"],
    [/\bLorem ipsum\b/i, "lorem ipsum"],
    [/\bTODO\b/, "TODO text"],
    [/Venture 0\d|Founder name|Grant \/ scheme name/, "sample data"],
    [/Awaiting verified data/, "empty metric wording"],
  ])
    if (re.test(text)) warn(path, "content", label);
  const withoutBase = html.split(BASE).join("");
  if (/localhost|127\.0\.0\.1/.test(withoutBase)) warn(path, "dev URL", "localhost reference");
  if (/old\.iitj\.ac\.in|iitj\.ac\.in\/[^"]*\.aspx/.test(html)) warn(path, "stale IITJ URL", "old.iitj / .aspx link");

  summary.push({ path, status: res.status, title, jsonld: [...new Set(types)].join(", ") });
}

for (const url of internal) {
  const s = await status(url);
  if (s.code !== 200) warn("(site)", "broken internal link", `${s.code} ${url}`);
}
for (const url of assets) {
  const s = await status(url);
  if (s.code !== 200) warn("(site)", "broken asset", `${s.code} ${s.type} ${url}`);
}
const extResults = [];
for (const [url, on] of external) {
  const s = await status(url);
  extResults.push({ url, code: s.code, note: s.note, on: [...on].slice(0, 3).join(" ") });
  if (s.code === 0 || s.code >= 400) warn([...on][0], "external link", `${s.code || s.type} ${url}`);
}

const lines = [
  `# QA audit — ${BASE}`,
  "",
  `Pages: ${pages.length} · internal links: ${internal.size} · assets: ${assets.size} · external links: ${external.size} · mailto: ${mailtos.size}`,
  "",
  "## Pages",
  "| Path | Status | JSON-LD | Title |",
  "|---|---|---|---|",
  ...summary.map((s) => `| ${s.path} | ${s.status} | ${s.jsonld} | ${s.title} |`),
  "",
  `## Problems (${problems.length})`,
  ...(problems.length ? problems.map((p) => `- **${p.page}** — ${p.kind}: ${p.detail}`) : ["None."]),
  "",
  "## External links",
  ...extResults.map((e) => `- ${e.code || "ERR"} ${e.url}${e.note ? ` _(${e.note})_` : ""}`),
  "",
  "## Mailto",
  ...[...mailtos].map((m) => `- ${m}`),
];
const report = lines.join("\n");
if (OUT) writeFileSync(OUT, report);
console.log(report);
