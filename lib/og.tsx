import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Branded share cards (Open Graph / X), rendered at build time by Next.js.
 * Default: text card. `photo` (a path under /public) adds a verified photograph on the
 * right — used only where a strong, verified image exists for the page.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#111827";
const MUTED = "#64748b";
const LINE = "#e2e8f0";
const BLUE = "#2563eb";

async function dataUrl(publicPath: string, mime: string) {
  const buf = await readFile(join(process.cwd(), "public", publicPath));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

interface Card {
  /** Small label above the title, e.g. "Vertical 01 · IIT Jodhpur × AIIMS Jodhpur". */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Path under /public of a verified photograph, e.g. "/images/gallery/…jpg". */
  photo?: string;
}

export async function ogCard({ eyebrow, title, subtitle, photo }: Card) {
  const logo = await dataUrl("/logos/iitj-logo.jpg", "image/jpeg");
  const image = photo ? await dataUrl(photo, "image/jpeg") : null;
  const textWidth = image ? 640 : 1040;
  const titleSize = title.length > 34 ? (image ? 50 : 60) : image ? 60 : 76;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#ffffff", position: "relative" }}>
        {/* Blue accent rule */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 8, background: BLUE, display: "flex" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: image ? 700 : "100%",
            padding: "64px 72px 56px",
          }}
        >
          {/* Identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={64} height={71} alt="" />
            <div style={{ width: 1, height: 52, background: LINE, display: "flex" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 28, fontWeight: 600, color: INK, letterSpacing: -0.5 }}>Medical Technology Centre</div>
              <div style={{ fontSize: 18, color: MUTED, letterSpacing: 3, marginTop: 4 }}>IIT JODHPUR</div>
            </div>
          </div>

          {/* Title block */}
          <div style={{ display: "flex", flexDirection: "column", width: textWidth }}>
            <div style={{ fontSize: 20, color: BLUE, letterSpacing: 3, textTransform: "uppercase", marginBottom: 18 }}>
              {eyebrow}
            </div>
            <div style={{ fontSize: titleSize, fontWeight: 600, color: INK, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
            {subtitle && (
              <div style={{ fontSize: 28, color: MUTED, lineHeight: 1.35, marginTop: 20 }}>{subtitle}</div>
            )}
          </div>

          {/* Footer rule */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 2, background: INK, display: "flex" }} />
            <div style={{ fontSize: 18, color: MUTED, letterSpacing: 2 }}>ENGINEERING THE FUTURE OF MEDICINE</div>
          </div>
        </div>

        {image && (
          <div style={{ display: "flex", width: 500, height: "100%", borderLeft: `1px solid ${LINE}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} width={500} height={630} alt="" style={{ objectFit: "cover", width: 500, height: 630 }} />
          </div>
        )}
      </div>
    ),
    OG_SIZE,
  );
}
