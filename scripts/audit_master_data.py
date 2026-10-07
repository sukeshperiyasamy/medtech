import json
import os
import openpyxl

def run_audit():
    seed_path = r"lib/portal/data/seed.json"
    with open(seed_path, "r", encoding="utf-8") as f:
        seed = json.load(f)

    students = seed.get("students", [])
    pubs = seed.get("publications", [])
    pats = seed.get("patents", [])
    prjs = seed.get("projects", [])
    ints = seed.get("internships", [])
    achs = seed.get("achievements", [])
    cnfs = seed.get("conferences", [])
    stus = seed.get("startups", [])
    docs = seed.get("documents", [])

    print(f"=== SEED DATA OVERVIEW ===")
    print(f"Total Student Entries: {len(students)}")
    print(f"Total Publications: {len(pubs)}")
    print(f"Total Patents: {len(pats)}")
    print(f"Total Projects: {len(prjs)}")
    print(f"Total Internships: {len(ints)}")
    print(f"Total Achievements: {len(achs)}")
    print(f"Total Conferences: {len(cnfs)}")
    print(f"Total Startups: {len(stus)}")
    print(f"Total Documents: {len(docs)}")

    # 1. Duplicate roll numbers & names
    roll_counts = {}
    name_counts = {}
    for s in students:
        r = s.get("roll_number", "").strip().upper()
        n = s.get("name", "").strip().lower()
        roll_counts[r] = roll_counts.get(r, 0) + 1
        name_counts[n] = name_counts.get(n, 0) + 1

    dup_rolls = {r: c for r, c in roll_counts.items() if c > 1}
    dup_names = {n: c for n, c in name_counts.items() if c > 1}

    print(f"\n--- DUPLICATES ---")
    print(f"Duplicate Roll Numbers: {len(dup_rolls)} -> {dup_rolls}")
    print(f"Duplicate Names: {len(dup_names)} -> {dup_names}")

    # 2. Missing Fields in Students
    missing_name = [s["roll_number"] for s in students if not s.get("name", "").strip()]
    missing_dob = [s["roll_number"] for s in students if not s.get("date_of_birth", "").strip()]
    missing_degree = [s["roll_number"] for s in students if not s.get("degree", "").strip()]
    missing_batch = [s["roll_number"] for s in students if not s.get("batch", "").strip()]
    missing_dept = [s["roll_number"] for s in students if not s.get("department", "").strip()]
    missing_supervisor = [s["roll_number"] for s in students if not s.get("supervisor", "").strip() or s.get("supervisor") == "To be allocated" or s.get("supervisor") == "Faculty Board (IDRP)"]
    no_supervisor_at_all = [s["roll_number"] for s in students if not s.get("supervisor", "").strip()]
    missing_email = [s["roll_number"] for s in students if not s.get("email", "").strip()]
    missing_phone = [s["roll_number"] for s in students if not s.get("phone", "").strip()]
    missing_address = [s["roll_number"] for s in students if not s.get("address", "").strip()]
    missing_city = [s["roll_number"] for s in students if not s.get("city", "").strip()]
    missing_state = [s["roll_number"] for s in students if not s.get("state", "").strip()]
    missing_pincode = [s["roll_number"] for s in students if not s.get("pincode", "").strip()]

    print(f"\n--- MISSING BASIC PROFILE FIELDS ---")
    print(f"Missing Name: {len(missing_name)} ({missing_name})")
    print(f"Missing Date of Birth: {len(missing_dob)} / {len(students)}")
    print(f"Missing Degree/Program: {len(missing_degree)}")
    print(f"Missing Batch/Admission Year: {len(missing_batch)}")
    print(f"Missing Department/Centre: {len(missing_dept)}")
    print(f"Completely Empty Supervisor: {len(no_supervisor_at_all)}")
    print(f"Unassigned / Generic Supervisor ('To be allocated' or generic): {len(missing_supervisor)}")
    print(f"Missing Email: {len(missing_email)}")
    print(f"Missing Phone: {len(missing_phone)}")
    print(f"Missing Address: {len(missing_address)}")
    print(f"Missing City/State/Pincode: {len(missing_city)}")

    # 3. Related Records Coverage
    pub_rolls = set(p.get("roll_number", "").strip().upper() for p in pubs)
    pat_rolls = set(p.get("roll_number", "").strip().upper() for p in pats)
    prj_rolls = set(p.get("roll_number", "").strip().upper() for p in prjs)
    int_rolls = set(p.get("roll_number", "").strip().upper() for p in ints)
    ach_rolls = set(p.get("roll_number", "").strip().upper() for p in achs)
    cnf_rolls = set(p.get("roll_number", "").strip().upper() for p in cnfs)
    stu_rolls = set(p.get("roll_number", "").strip().upper() for p in stus)
    doc_rolls = set(p.get("roll_number", "").strip().upper() for p in docs)

    all_rolls = set(s.get("roll_number", "").strip().upper() for s in students)

    no_pubs = all_rolls - pub_rolls
    no_pats = all_rolls - pat_rolls
    no_prjs = all_rolls - prj_rolls
    no_ints = all_rolls - int_rolls
    no_achs = all_rolls - ach_rolls
    no_cnfs = all_rolls - cnf_rolls
    no_stus = all_rolls - stu_rolls
    no_docs = all_rolls - doc_rolls

    print(f"\n--- MODULE RECORD COVERAGE ---")
    print(f"Students with Publications: {len(pub_rolls)} | Students with NO Publications: {len(no_pubs)}")
    print(f"Students with Patents: {len(pat_rolls)} | Students with NO Patents: {len(no_pats)}")
    print(f"Students with Projects: {len(prj_rolls)} | Students with NO Projects: {len(no_prjs)}")
    print(f"Students with Internships: {len(int_rolls)} | Students with NO Internships: {len(no_ints)}")
    print(f"Students with Achievements: {len(ach_rolls)} | Students with NO Achievements: {len(no_achs)}")
    print(f"Students with Conferences: {len(cnf_rolls)} | Students with NO Conferences: {len(no_cnfs)}")
    print(f"Students with Startups: {len(stu_rolls)} | Students with NO Startups: {len(no_stus)}")
    print(f"Students with Documents in Vault: {len(doc_rolls)} | Students with NO Documents: {len(no_docs)}")

    completely_empty = all_rolls - (pub_rolls | pat_rolls | prj_rolls | int_rolls | ach_rolls | cnf_rolls | stu_rolls | doc_rolls)
    print(f"Students with ZERO records across all 8 modules: {len(completely_empty)}")

    # 4. Inspect Excel Files
    excel_dir = r"broucher"
    excel_files = [
        "Data for med Tech.xlsx",
        "MedTech_Consolidated_Master_Data.xlsx",
        "Publication details of Medtech Students till April 2026 (Responses)(1).xlsx",
        "Updated Start up data Till 25 Sep 2026.xlsx",
    ]

    print(f"\n=== INSPECTING EXCEL SOURCE FILES ===")
    for ef in excel_files:
        p = os.path.join(excel_dir, ef)
        if not os.path.exists(p):
            print(f"File not found: {p}")
            continue
        wb = openpyxl.load_workbook(p, data_only=True)
        print(f"\nWorkbook: {ef} | Sheets: {wb.sheetnames}")
        for sname in wb.sheetnames:
            ws = wb[sname]
            rows = list(ws.iter_rows(values_only=True))
            if not rows:
                print(f"  Sheet '{sname}' is empty")
                continue
            headers = [str(c) if c is not None else "" for c in rows[0]]
            data_rows = [r for r in rows[1:] if any(c is not None and str(c).strip() for c in r)]
            print(f"  Sheet '{sname}': {len(data_rows)} data rows. Headers: {headers[:8]}...")

if __name__ == "__main__":
    run_audit()
