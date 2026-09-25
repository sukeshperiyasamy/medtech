"""
Rename and arrange exported event photos by date.

    python scripts/organise-media.py medtech-media/img            (dry run: prints the plan)
    python scripts/organise-media.py medtech-media/img --apply    (moves the files)

Each photo becomes <event-folder>/<YYYY-MM-DD_HH-MM-SS>.jpg, where the timestamp comes
from the WhatsApp export name (PHOTO-YYYY-MM-DD-HH-MM-SS) or, failing that, the EXIF
DateTimeOriginal. Photos with no date go to "undated/". Every move is written to
_rename-log.csv (old,new) so it can be audited or reversed.

EVENTS maps a date to a folder slug. Slugs describe what is visible in the photos;
confirm names with the Centre before publishing them anywhere.
"""
import csv
import re
import sys
from pathlib import Path

from PIL import Image

EVENTS = {
    "2024-08-03": "orientation-batch-2024",
    "2024-08-06": "certificate-ceremony",
    "2024-08-28": "invited-seminar",
    "2024-09-12": "startup-exhibition",
    "2024-09-21": "lab-visit",
    "2024-10-26": "iitj-convocation-2024",
    "2024-11-16": "auditorium-event",
    "2024-12-05": "awards",
    "2025-02-06": "group-and-workspace",
    "2025-02-13": "icmi-2025",
    "2025-02-14": "icmi-2025",
    "2025-02-15": "icmi-2025",
    "2025-02-16": "icmi-2025",
    "2025-04-01": "award",
    "2025-05-20": "new-workspace",
    "2025-06-26": "iitj-convocation-2025",
    "2025-08-02": "iitj-foundation-day-2025",
    "2025-10-10": "tie-rajasthan-recognition",
    "2025-11-28": "meeting-session",
    "2025-12-14": "ceremony",
    "2025-12-26": "genpact-master-student-fellowships",
    "2026-01-08": "exhibition",
    "2026-02-18": "ai-exhibition",
    "2026-05-19": "workshop-session",
    "2026-05-23": "certificate-distribution",
    "2026-06-06": "iitj-convocation-2026",
    "2026-07-26": "5th-convocation",
    "2026-08-02": "iitj-foundation-day-2026",
    "2026-08-08": "event-hall",
    "2026-09-08": "group-event",
    "2026-09-13": "startup-meet-and-greet-11",
}
# Multi-day events share the folder dated by their first day.
FOLDER_DATE = {"icmi-2025": "2025-02-13"}
# Undated files that can still be named descriptively.
UNDATED_NAMES = {"IBRO_MS": "ibro-exchange-fellowship-2026"}

WHATSAPP = re.compile(r"PHOTO-(\d{4}-\d\d-\d\d)-(\d\d-\d\d-\d\d)")


def timestamp(path: Path):
    m = WHATSAPP.search(path.name)
    if m:
        return m.group(1), m.group(2)
    exif = Image.open(path).getexif().get_ifd(0x8769).get(36867)  # DateTimeOriginal
    if exif:
        date, time = exif.split(" ")
        return date.replace(":", "-"), time.replace(":", "-")
    return None, None


def main():
    root = Path(sys.argv[1])
    apply = "--apply" in sys.argv
    plan, used = [], set()
    for f in sorted(p for p in root.glob("*") if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png"}):
        date, time = timestamp(f)
        if date is None:
            key = next((v for k, v in UNDATED_NAMES.items() if k in f.stem), f.stem)
            dest = root / "undated" / f"{key}{f.suffix.lower()}"
        else:
            slug = EVENTS.get(date, "other")
            folder = f"{FOLDER_DATE.get(slug, date)}_{slug}"
            dest = root / folder / f"{date}_{time}{f.suffix.lower()}"
        n = 2
        base = dest
        while dest in used:  # several photos exported in the same second
            dest = base.with_name(f"{base.stem}_{n}{base.suffix}")
            n += 1
        used.add(dest)
        plan.append((f, dest))

    for old, new in plan:
        print(f"{old.name}  ->  {new.relative_to(root)}")
    folders = sorted({new.parent.name for _, new in plan})
    print(f"\n{len(plan)} files into {len(folders)} folders")

    if apply:
        with open(root / "_rename-log.csv", "a", newline="", encoding="utf-8") as log:
            w = csv.writer(log)
            for old, new in plan:
                new.parent.mkdir(parents=True, exist_ok=True)
                old.rename(new)
                w.writerow([old.name, str(new.relative_to(root)).replace("\\", "/")])
        print("Applied. Log: _rename-log.csv")


if __name__ == "__main__":
    main()
