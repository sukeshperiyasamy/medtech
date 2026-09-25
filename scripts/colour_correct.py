"""
Per-photo colour correction for the gallery (phone / WhatsApp photos under mixed light).

Unlike the house grade in process-photos.py (tuned for well-exposed event photography),
this measures each image and corrects it:

  1. White balance from near-neutral pixels (walls, ceilings, white clothing);
     falls back to a gentle grey-world balance when a scene has few neutrals.
  2. Auto levels on luminance (0.5 / 99.7 percentiles) — restores true blacks and
     clean whites, removing the grey haze of flat indoor shots. Applied equally to all
     channels so colours are not shifted.
  3. Exposure: a gamma that moves the median luminance toward a natural mid-tone.
  4. A gentle S-curve for contrast.
  5. Adaptive saturation: lifts dull images, leaves already-colourful ones alone.
  6. Light unsharp mask after resizing.

Every step is clamped so no photo is pushed far from how it was taken.
Requires: pillow, numpy.
"""
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

LONG_EDGE = 1600

# White balance
WB_STRENGTH = 0.9
WB_FALLBACK = 0.45
WB_GAIN_LIMITS = (0.8, 1.25)
# Levels
BLACK_PCT, WHITE_PCT = 0.5, 99.7
MAX_BLACK = 0.12  # never clip more than this much shadow
MIN_WHITE = 0.78  # never stretch whites from below this
# Exposure
TARGET_MEDIAN = 0.46
GAMMA_LIMITS = (0.78, 1.28)
# Contrast / saturation
S_CURVE = 0.14
TARGET_SAT = 0.30
SAT_LIMITS = (1.0, 1.22)


def _luma(a: np.ndarray) -> np.ndarray:
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def white_balance(a: np.ndarray) -> np.ndarray:
    mx, mn = a.max(axis=-1), a.min(axis=-1)
    lum = _luma(a)
    chroma = (mx - mn) / np.maximum(mx, 1e-6)
    # Bright near-neutrals (walls, ceilings, screens) are the most reliable white reference
    # indoors; mid-tone neutrals are the fallback.
    bright = (chroma < 0.22) & (lum > 0.5) & (lum < 0.96)
    neutral = bright if bright.mean() > 0.04 else (chroma < 0.18) & (lum > 0.25) & (lum < 0.94)
    if neutral.mean() > 0.03:
        ref, strength = a[neutral].mean(axis=0), WB_STRENGTH
    else:
        ref, strength = a.reshape(-1, 3).mean(axis=0), WB_FALLBACK
    grey = ref.mean()
    gains = np.clip(1 + strength * (grey / np.maximum(ref, 1e-6) - 1), *WB_GAIN_LIMITS)
    return np.clip(a * gains, 0, 1)


def levels(a: np.ndarray) -> np.ndarray:
    lum = _luma(a)
    lo, hi = np.percentile(lum, [BLACK_PCT, WHITE_PCT])
    lo, hi = min(lo, MAX_BLACK), max(hi, MIN_WHITE)
    return np.clip((a - lo) / max(hi - lo, 1e-3), 0, 1)


def exposure(a: np.ndarray) -> np.ndarray:
    med = float(np.median(_luma(a)))
    if med <= 0.01:
        return a
    gamma = np.clip(np.log(TARGET_MEDIAN) / np.log(med), *GAMMA_LIMITS)
    return np.clip(a, 0, 1) ** gamma


def s_curve(a: np.ndarray) -> np.ndarray:
    return np.clip(a + S_CURVE * (a - 0.5) * (1 - np.abs(2 * a - 1)), 0, 1)


def correct(im: Image.Image, long_edge: int = LONG_EDGE) -> Image.Image:
    im = ImageOps.exif_transpose(im).convert("RGB")
    im.thumbnail((long_edge, long_edge), Image.LANCZOS)
    a = np.asarray(im, dtype=np.float32) / 255.0
    a = white_balance(a)
    a = levels(a)
    a = exposure(a)
    a = s_curve(a)
    out = Image.fromarray((a * 255 + 0.5).astype(np.uint8))

    hsv = np.asarray(out.convert("HSV"), dtype=np.float32) / 255.0
    sat = float(hsv[..., 1].mean())
    factor = float(np.clip(TARGET_SAT / max(sat, 1e-3), *SAT_LIMITS))
    if factor > 1.01:
        out = ImageEnhance.Color(out).enhance(factor)
    return out.filter(ImageFilter.UnsharpMask(radius=1.0, percent=40, threshold=3))


def passthrough(im: Image.Image, long_edge: int = LONG_EDGE) -> Image.Image:
    """For designed graphics (posters, announcements): resize only, keep their colours."""
    im = ImageOps.exif_transpose(im).convert("RGB")
    im.thumbnail((long_edge, long_edge), Image.LANCZOS)
    return im
