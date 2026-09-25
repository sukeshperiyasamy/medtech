"""
Build the website gallery from the media archive.

    python scripts/build-gallery.py                (dry run: report duplicates/broken files)
    python scripts/build-gallery.py --apply        (write images + manifest)

Reads every photo under medtech-media/img/ (organised by scripts/organise-media.py),
skips files that cannot be decoded and exact / pixel-identical duplicates, then writes:

  public/images/gallery/<name>.jpg   colour-corrected web copies, long edge 1600px
                                     (scripts/colour_correct.py; designed posters are only resized)
  data/gallery-manifest.json         [{ file, folder, width, height, date, color }]

Originals are never modified. Re-run after adding photos to the archive.
"""
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE = ROOT / "medtech-media" / "img"
OUT = ROOT / "public" / "images" / "gallery"
MANIFEST = ROOT / "data" / "gallery-manifest.json"
LONG_EDGE = 1600

# Per-photo colour correction (white balance, levels, exposure, contrast, saturation).
spec = importlib.util.spec_from_file_location("cc", ROOT / "scripts" / "colour_correct.py")
cc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cc)
QUALITY = 80

# Designed graphics (posters, announcements) keep their original colours.
GRAPHICS = {
    "2026-08-02_21-24-47",  # IIT Jodhpur Foundation Day 2026 announcement
    "2025-12-26_14-43-20",  # Genpact Master Student Fellowships poster
    "ibro-exchange-fellowship-2026",  # IBRO Exchange Fellowships 2026 poster
}


def pixel_hash(im: Image.Image) -> str:
    """Hash of a small greyscale rendition — identical for re-encoded copies of one photo."""
    return hashlib.md5(im.convert("L").resize((24, 24), Image.LANCZOS).tobytes()).hexdigest()


def dominant(im: Image.Image) -> str:
    r, g, b = im.convert("RGB").resize((1, 1), Image.LANCZOS).getpixel((0, 0))
    return f"#{r:02x}{g:02x}{b:02x}"


def main():
    apply = "--apply" in sys.argv
    files = sorted(p for p in ARCHIVE.rglob("*") if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
    seen_bytes, seen_pixels, keep, skipped = {}, {}, [], []

    for f in files:
        data = f.read_bytes()
        md5 = hashlib.md5(data).hexdigest()
        if md5 in seen_bytes:
            skipped.append((f, f"exact duplicate of {seen_bytes[md5].relative_to(ARCHIVE)}"))
            continue
        try:
            im = ImageOps.exif_transpose(Image.open(f))
            im.load()
        except Exception as e:  # genuinely undisplayable
            skipped.append((f, f"cannot be decoded: {e}"))
            continue
        ph = pixel_hash(im)
        if ph in seen_pixels:
            skipped.append((f, f"pixel-identical to {seen_pixels[ph].relative_to(ARCHIVE)}"))
            continue
        seen_bytes[md5] = f
        seen_pixels[ph] = f
        keep.append((f, im))

    print(f"{len(files)} files · {len(keep)} kept · {len(skipped)} skipped")
    for f, why in skipped:
        print(f"  SKIP {f.relative_to(ARCHIVE)} — {why}")
    if not apply:
        return

    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for f, im in keep:
        m = re.match(r"(\d{4}-\d\d-\d\d)", f.name)
        name = f"{f.stem}.jpg" if m else f"{f.parent.name}-{f.stem}.jpg"
        fix = cc.passthrough if f.stem in GRAPHICS else cc.correct
        graded = fix(im, LONG_EDGE)
        graded.save(OUT / name, quality=QUALITY, optimize=True, progressive=True)
        manifest.append(
            {
                "file": name,
                "folder": f.parent.name,
                "width": graded.width,
                "height": graded.height,
                "date": m.group(1) if m else None,
                "color": dominant(graded),
            }
        )
    manifest.sort(key=lambda x: (x["date"] or "0000", x["file"]), reverse=True)  # newest first
    MANIFEST.write_text(json.dumps(manifest, indent=1) + "\n", encoding="utf-8")
    total = sum((OUT / m["file"]).stat().st_size for m in manifest) / 1024 / 1024
    print(f"Wrote {len(manifest)} images ({total:.1f} MB) and {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
