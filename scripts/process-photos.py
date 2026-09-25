"""
Convert and colour-grade event photos for the website.

Reads HEIC / JPEG / PNG files, fixes orientation, grades them into the site's house
look and writes web-ready JPEGs (long edge 2000px) to public/images/<event>/.

    python -m venv .venv-photos
    .venv-photos/Scripts/pip install pillow pillow-heif      (Windows)
    .venv-photos/bin/pip install pillow pillow-heif          (macOS / Linux)

    python scripts/process-photos.py <input-folder> <event-slug>
    e.g.  python scripts/process-photos.py icmi2026 icmi-2026

Output files are named <event-slug>-01.jpg, -02.jpg … in filename order; rename them
to something descriptive and register each one in data/media.ts.

The grade: partial grey-world white balance (tames warm stage lighting without going
clinical) -> exposure normalisation -> gentle S-curve with lifted blacks and rolled
highlights -> faint cool split-tone in the shadows -> ~14% desaturation -> light
unsharp mask. Keep these constants unchanged so every event matches.
"""
import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageStat

try:
    import pillow_heif

    pillow_heif.register_heif_opener()
except ImportError:  # JPEG/PNG still work without it
    pillow_heif = None

LONG_EDGE = 2000
WB_STRENGTH = 0.7
TARGET_LUMA = 118  # 0-255
SATURATION = 0.86
QUALITY = 78
EXTENSIONS = {".heic", ".heif", ".jpg", ".jpeg", ".png"}


def clamp(v, lo, hi):
    return max(lo, min(hi, v))


def curve(x):
    """Gentle S-curve with lifted black (0.03) and rolled white (0.975)."""
    s = x + 0.06 * (x - 0.5) * (1 - abs(2 * x - 1))
    return 0.03 + s * (0.975 - 0.03)


def grade(im: Image.Image) -> Image.Image:
    im = ImageOps.exif_transpose(im).convert("RGB")
    im.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)

    r, g, b = ImageStat.Stat(im.resize((200, 200))).mean
    grey = (r + g + b) / 3
    gains = [clamp(1 + WB_STRENGTH * (grey / c - 1), 0.82, 1.22) for c in (r, g, b)]
    luma = 0.2126 * r * gains[0] + 0.7152 * g * gains[1] + 0.0722 * b * gains[2]
    exposure = clamp(TARGET_LUMA / luma, 0.9, 1.22)

    luts = []
    for ch, gain in enumerate(gains):
        for i in range(256):
            y = curve(clamp(i / 255 * gain * exposure, 0, 1))
            shadow = (1 - y) ** 2
            if ch == 0:
                y -= 0.012 * shadow  # cool shadows: pull red
            elif ch == 2:
                y += 0.022 * shadow  # ...and lift blue
            luts.append(int(round(clamp(y, 0, 1) * 255)))
    im = im.point(luts)
    im = ImageEnhance.Color(im).enhance(SATURATION)
    return im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=35, threshold=3))


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, slug = Path(sys.argv[1]), sys.argv[2]
    out = Path("public/images") / slug
    out.mkdir(parents=True, exist_ok=True)

    files = sorted(p for p in src.iterdir() if p.suffix.lower() in EXTENSIONS)
    if not files:
        sys.exit(f"No images found in {src}")
    if pillow_heif is None and any(p.suffix.lower() in {".heic", ".heif"} for p in files):
        sys.exit("HEIC files found: install pillow-heif first (see the docstring).")

    for n, path in enumerate(files, start=1):
        dest = out / f"{slug}-{n:02d}.jpg"
        img = grade(Image.open(path))
        img.save(dest, quality=QUALITY, optimize=True, progressive=True)
        print(f"{path.name} -> {dest}  {img.size[0]}x{img.size[1]}  {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
