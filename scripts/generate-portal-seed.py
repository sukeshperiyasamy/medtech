import json
import os
import re

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    students_ts_path = os.path.join(root, "data", "students.ts")
    broucher_seed_path = os.path.join(root, "broucher", "medtech-portal", "src", "lib", "data", "seed.json")

    # Load existing seed data
    existing_seed = {}
    if os.path.exists(broucher_seed_path):
        with open(broucher_seed_path, "r", encoding="utf-8") as f:
            existing_seed = json.load(f)

    existing_students = {s["roll_number"].strip().upper(): s for s in existing_seed.get("students", [])}

    degree_map = {
        "masters": "M.Tech – Medical Technology",
        "phd": "Ph.D. – Medical Technologies",
        "dual-degree": "M.Tech-Ph.D. Dual Degree",
    }

    # Parse data/students.ts
    students = []
    with open(students_ts_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    current_prog = ""
    current_year = 0

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("masters:"):
            current_prog = "masters"
        elif stripped.startswith("phd:"):
            current_prog = "phd"
        elif stripped.startswith('"dual-degree":') or stripped.startswith("dual-degree:"):
            current_prog = "dual-degree"

        year_match = re.search(r"(\d{4}):\s*\[", stripped)
        if year_match:
            current_year = int(year_match.group(1))

        # Matches "ROLL|Name"
        items = re.findall(r'"([A-Za-z0-9]+)\|([^"]+)"', stripped)
        for roll, name in items:
            clean_roll = roll.strip().upper()
            clean_name = name.strip()

            grad_year = current_year + 2 if current_prog == "masters" else (current_year + 5 if current_prog == "phd" else current_year + 5)
            status = "Active" if current_year >= 2024 else "Alumni"

            student_record = {
                "student_id": clean_roll,
                "roll_number": clean_roll,
                "name": clean_name,
                "email": f"{clean_roll.lower()}@iitj.ac.in",
                "phone": "",
                "date_of_birth": "",
                "gender": "Other",
                "degree": degree_map.get(current_prog, "M.Tech – Medical Technology"),
                "department": "Centre for Medical Technologies (IDRP)",
                "batch": str(current_year),
                "specialization": "Medical Technology",
                "graduation_year": str(grad_year),
                "supervisor": "",
                "address": "IIT Jodhpur Campus",
                "city": "Jodhpur",
                "state": "Rajasthan",
                "pincode": "342030",
                "status": status,
                "created_at": "2026-09-25T00:00:00.000Z",
                "updated_at": "2026-10-05T20:00:00.000Z",
            }

            # Overlay rich existing seed data if present
            if clean_roll in existing_students:
                existing = existing_students[clean_roll]
                for key, val in existing.items():
                    if val:
                        student_record[key] = val

            students.append(student_record)

    # Add any existing students that weren't in students.ts
    seen_rolls = {s["roll_number"].strip().upper() for s in students}
    for roll, s in existing_students.items():
        if roll not in seen_rolls:
            students.append(s)

    print(f"Total students compiled: {len(students)}")

    # Assemble complete seed
    complete_seed = {
        "students": students,
        "publications": existing_seed.get("publications", []),
        "patents": existing_seed.get("patents", []),
        "projects": existing_seed.get("projects", []),
        "internships": existing_seed.get("internships", []),
        "achievements": existing_seed.get("achievements", []),
        "conferences": existing_seed.get("conferences", []),
        "startups": existing_seed.get("startups", []),
        "documents": existing_seed.get("documents", []),
        "audit_logs": existing_seed.get("audit_logs", []),
    }

    out_dir = os.path.join(root, "lib", "portal", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "seed.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(complete_seed, f, indent=2)

    print(f"Written complete seed data to {out_file}")

if __name__ == "__main__":
    main()
