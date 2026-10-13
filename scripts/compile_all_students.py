import json
import re
import openpyxl
import os

def compile_data():
    # 1. Parse data/students.ts
    with open('data/students.ts', 'r', encoding='utf-8') as f:
        ts_text = f.read()

    lines = ts_text.splitlines()
    cur_prog = ''
    cur_year = None
    ts_list = []

    for l in lines:
        s = l.strip()
        if s.startswith('masters:'): cur_prog = 'Masters'
        elif s.startswith('phd:'): cur_prog = 'PhD'
        elif 'dual-degree' in s: cur_prog = 'Dual Degree'

        if s.startswith('//') or s.startswith('/*') or s.startswith('*'):
            continue

        ym = re.search(r'(\d{4}):\s*\[', s)
        if ym: cur_year = int(ym.group(1))

        if cur_year is None:
            continue

        matches = re.findall(r'"([A-Za-z0-9]+)\|([^"]+)"', s)
        for roll, name in matches:
            if roll.upper() == 'ROLL':
                continue
            ts_list.append({
                'roll': roll.strip().upper(),
                'name': name.strip(),
                'prog': cur_prog,
                'year': cur_year
            })

    # 2. Parse lib/portal/data/seed.json
    with open('lib/portal/data/seed.json', 'r', encoding='utf-8') as f:
        seed = json.load(f)

    seed_students = {s['roll_number'].strip().upper(): s for s in seed.get('students', []) if s.get('roll_number') != 'ROLL'}
    seed_pubs = seed.get('publications', [])
    seed_pats = seed.get('patents', [])
    seed_stus = seed.get('startups', [])
    seed_prjs = seed.get('projects', [])
    seed_achs = seed.get('achievements', [])

    # 3. Parse Publication Responses xlsx
    wb_pub = openpyxl.load_workbook('broucher/Publication details of Medtech Students till April 2026 (Responses)(1).xlsx')
    sh_pub = wb_pub.active
    form_pubs = {}
    for row in list(sh_pub.iter_rows(values_only=True))[1:]:
        ts, email, name, roll, j_cnt, c_cnt, b_cnt, venue, auth = row[:9]
        if roll:
            r = str(roll).strip().upper()
            if r not in form_pubs: form_pubs[r] = []
            form_pubs[r].append({
                'email': email,
                'name': name,
                'journals': int(j_cnt or 0),
                'conferences': int(c_cnt or 0),
                'books': int(b_cnt or 0),
                'venues': venue or '',
                'authorship': auth or ''
            })

    # 4. Parse achievements.ts
    with open('data/achievements.ts', 'r', encoding='utf-8') as f:
        ach_text = f.read()

    # Find achievements linked to students
    # Search for studentId: "..."
    ach_matches = re.findall(r'title:\s*"([^"]+)".*?recipients:\s*\[(.*?)\]', ach_text, re.DOTALL)
    ach_by_roll = {}
    for title, rec_block in ach_matches:
        rec_rolls = re.findall(r'studentId:\s*"([A-Za-z0-9]+)"', rec_block)
        for r in rec_rolls:
            r_clean = r.strip().upper()
            if r_clean not in ach_by_roll: ach_by_roll[r_clean] = []
            ach_by_roll[r_clean].append(title.strip())

    # Build Master Student Dictionary
    all_students = {}

    # Add from students.ts
    for item in ts_list:
        r = item['roll']
        all_students[r] = {
            'roll_number': r,
            'name': item['name'],
            'program_level': item['prog'],
            'degree': 'M.Tech in Medical Technology' if item['prog'] == 'Masters' else ('Ph.D. in Medical Technology' if item['prog'] == 'PhD' else 'M.Tech-Ph.D. Dual Degree in Medical Technology'),
            'cohort_year': item['year'],
            'graduation_year': item['year'] + 2 if item['prog'] == 'Masters' else item['year'] + 5,
            'status': 'Active' if item['year'] >= 2024 else 'Alumni',
            'department': 'Centre for Medical Technologies (IDRP)',
            'specialization': 'Medical Technology',
            'supervisor': 'Faculty Board (IDRP / AIIMS-IIT Joint)',
            'email': f"{r.lower()}@iitj.ac.in",
            'phone': '',
            'date_of_birth': '',
            'gender': '',
            'address': 'IIT Jodhpur Permanent Campus, NH 62, Karwar',
            'city': 'Jodhpur',
            'state': 'Rajasthan',
            'pincode': '342030',
            'publications_count': 0,
            'publications_details': '',
            'patents_count': 0,
            'patents_details': '',
            'startups_count': 0,
            'startups_details': '',
            'achievements_count': 0,
            'achievements_details': '',
            'provenance': 'Official Cohort Registry (IIT Jodhpur MedTech Portal)'
        }

    # Overlay & augment from seed.json
    for r, s in seed_students.items():
        if r not in all_students:
            # Determine prog from roll or degree
            deg = s.get('degree', '')
            prog = 'Masters' if 'M.Tech  Medical Technology' in deg or 'Masters' in deg or r.startswith('M') else ('Dual Degree' if 'Dual Degree' in deg or r.startswith('D') else 'PhD')
            yr_str = s.get('batch', '')
            cohort_yr = int(yr_str) if yr_str and yr_str.isdigit() and int(yr_str) > 2000 else 2020
            # If roll starts with e.g. P24, cohort is 2024
            m_yr = re.search(r'^[MPD](\d{2})', r)
            if m_yr:
                cohort_yr = 2000 + int(m_yr.group(1))

            all_students[r] = {
                'roll_number': r,
                'name': s.get('name', ''),
                'program_level': prog,
                'degree': 'M.Tech in Medical Technology' if prog == 'Masters' else ('Ph.D. in Medical Technology' if prog == 'PhD' else 'M.Tech-Ph.D. Dual Degree in Medical Technology'),
                'cohort_year': cohort_yr,
                'graduation_year': int(s.get('graduation_year')) if str(s.get('graduation_year', '')).isdigit() and int(s.get('graduation_year')) > 2000 else cohort_yr + (2 if prog == 'Masters' else 5),
                'status': s.get('status', 'Active' if cohort_yr >= 2024 else 'Alumni'),
                'department': s.get('department', 'Centre for Medical Technologies (IDRP)'),
                'specialization': s.get('specialization', 'Medical Technology'),
                'supervisor': s.get('supervisor') or 'Faculty Board (IDRP / AIIMS-IIT Joint)',
                'email': s.get('email', f"{r.lower()}@iitj.ac.in"),
                'phone': s.get('phone', ''),
                'date_of_birth': s.get('date_of_birth', ''),
                'gender': s.get('gender', ''),
                'address': s.get('address', 'IIT Jodhpur Permanent Campus, NH 62, Karwar'),
                'city': s.get('city', 'Jodhpur'),
                'state': s.get('state', 'Rajasthan'),
                'pincode': s.get('pincode', '342030'),
                'publications_count': 0,
                'publications_details': '',
                'patents_count': 0,
                'patents_details': '',
                'startups_count': 0,
                'startups_details': '',
                'achievements_count': 0,
                'achievements_details': '',
                'provenance': 'Centre for Medical Technologies Seed Registry'
            }
        else:
            # Enrich existing student record
            cur = all_students[r]
            if s.get('name') and len(s.get('name')) > len(cur['name']): cur['name'] = s.get('name')
            if s.get('supervisor'): cur['supervisor'] = s.get('supervisor')
            if s.get('specialization') and s.get('specialization') != 'Medical Technology': cur['specialization'] = s.get('specialization')
            if s.get('phone'): cur['phone'] = s.get('phone')
            if s.get('date_of_birth'): cur['date_of_birth'] = s.get('date_of_birth')
            if s.get('gender') and s.get('gender') != 'Other': cur['gender'] = s.get('gender')
            if s.get('email'): cur['email'] = s.get('email')
            if s.get('address') and 'Room' in s.get('address'): cur['address'] = s.get('address')
            if s.get('status'): cur['status'] = s.get('status')

    # Add extra scholars from Publication form responses if not already present
    for r, p_entries in form_pubs.items():
        if r not in all_students:
            sample = p_entries[0]
            # Infer program & cohort from roll
            prog = 'PhD'
            m_yr = re.search(r'^[MPD](\d{2})', r)
            cohort_yr = 2021
            if m_yr:
                cohort_yr = 2000 + int(m_yr.group(1))
            elif '21' in r: cohort_yr = 2021
            elif '20' in r: cohort_yr = 2020

            all_students[r] = {
                'roll_number': r,
                'name': sample['name'],
                'program_level': prog,
                'degree': 'Ph.D. in Medical Technology',
                'cohort_year': cohort_yr,
                'graduation_year': cohort_yr + 5,
                'status': 'Active' if cohort_yr >= 2024 else 'Alumni',
                'department': 'Centre for Medical Technologies (IDRP / School of Health)',
                'specialization': 'Medical Technology & Health Sciences',
                'supervisor': 'Faculty Board (IDRP / AIIMS-IIT Joint)',
                'email': sample['email'] or f"{r.lower()}@iitj.ac.in",
                'phone': '',
                'date_of_birth': '',
                'gender': '',
                'address': 'IIT Jodhpur Permanent Campus, NH 62, Karwar',
                'city': 'Jodhpur',
                'state': 'Rajasthan',
                'pincode': '342030',
                'publications_count': 0,
                'publications_details': '',
                'patents_count': 0,
                'patents_details': '',
                'startups_count': 0,
                'startups_details': '',
                'achievements_count': 0,
                'achievements_details': '',
                'provenance': 'Centre Verified Research Publication Submission'
            }

    # Overlay Form Publications
    for r, p_list in form_pubs.items():
        if r in all_students:
            tot_j = sum(p['journals'] for p in p_list)
            tot_c = sum(p['conferences'] for p in p_list)
            tot_b = sum(p['books'] for p in p_list)
            tot = tot_j + tot_c + tot_b
            venues = "; ".join(filter(None, [p['venues'] for p in p_list]))
            auth = "; ".join(set(filter(None, [p['authorship'] for p in p_list])))
            all_students[r]['publications_count'] = max(all_students[r]['publications_count'], tot)
            det = f"{tot_j} Journals, {tot_c} Conferences, {tot_b} Books. Venues: {venues} ({auth})"
            all_students[r]['publications_details'] = det
            if p_list[0]['email'] and '@' in p_list[0]['email']:
                all_students[r]['email'] = p_list[0]['email']

    # Overlay Seed Publications
    for p in seed_pubs:
        r = p.get('roll_number', '').strip().upper()
        if r in all_students:
            cur_cnt = all_students[r]['publications_count']
            all_students[r]['publications_count'] = cur_cnt + 1 if cur_cnt == 0 else cur_cnt
            if not all_students[r]['publications_details']:
                all_students[r]['publications_details'] = f"1 Paper: \"{p.get('title')}\" ({p.get('journal_conference')}, {p.get('publication_type')})"
            else:
                if p.get('title') not in all_students[r]['publications_details']:
                    all_students[r]['publications_details'] += f" | Paper: \"{p.get('title')}\""

    # Overlay Seed Patents
    for pat in seed_pats:
        r = pat.get('roll_number', '').strip().upper()
        if r in all_students:
            all_students[r]['patents_count'] += 1
            p_desc = f"App #{pat.get('application_no')}: {pat.get('title')} ({pat.get('status')})"
            if all_students[r]['patents_details']:
                all_students[r]['patents_details'] += f" | {p_desc}"
            else:
                all_students[r]['patents_details'] = p_desc

    # Overlay Seed Startups
    for st in seed_stus:
        r = st.get('roll_number', '').strip().upper()
        if r in all_students:
            all_students[r]['startups_count'] += 1
            st_desc = f"{st.get('startup_name')} ({st.get('founder_role')}, {st.get('current_status')})"
            if all_students[r]['startups_details']:
                all_students[r]['startups_details'] += f" | {st_desc}"
            else:
                all_students[r]['startups_details'] = st_desc

    # Comprehensive supervisor mappings
    scholar_supervisors = {
        'M24IM1007': ('Prof. Surajit Ghosh (IIT Jodhpur)', 'Microfluidic Diagnostics & Point-of-Care Devices'),
        'M24IM1005': ('Dr. Ankur Gupta (IIT Jodhpur)', 'Nanomedicine & Microfluidic Biosensors'),
        'M23IM1003': ('Dr. Bhivraj Suthar (IIT Jodhpur) & Dr. Ankita Chugh (AIIMS Jodhpur)', 'Intraoral Retraction & Surgical Robotics'),
        'M20ID001': ('Dr. Pravin Kumar (AIIMS Jodhpur) & Dr. Jaiveer Singh (IIT Jodhpur)', 'Endodontics & Dental Irrigation Systems'),
        'M21ID003': ('Dr. Hardik Kothadia (IIT Jodhpur)', 'Ultrasound-Guided Interventional Syringe Systems'),
        'M21ID007': ('Dr. Hardik Kothadia (IIT Jodhpur)', 'Ultrasound-Guided Surgical Procedures & Clinical Devices'),
        'M20ID008': ('Prof. Ajay Agarwal (IIT Jodhpur)', 'Electromechanical Cartilage Reshaping & Bio-MEMS'),
        'M21ID005': ('Prof. Ajay Agarwal (IIT Jodhpur) & Dr. Amit Goyal (AIIMS Jodhpur)', 'ENT Devices & Cartilage Reshaping Instrumentation'),
        'M21ID002': ('Dr. Jayant Kumar Mohanta (IIT Jodhpur)', 'Surgical Ergonomics & Mattress Hygiene Management Systems'),
        'P20ID002': ('Dr. Indranil Banerjee (IIT Jodhpur) & Dr. Shilpi Gupta Dixit (AIIMS Jodhpur)', '3D Bioprinting, Modular Bioinks & Regenerative Medicine'),
        'P20ID004': ('Dr. Deepak Mishra (IIT Jodhpur) & Dr. Pushpinder Khera (AIIMS Jodhpur)', 'Medical Robotics, AI Echocardiography & Multimodal Data Sync'),
        'P20ID005': ('Dr. Shobhana Singh (IIT Jodhpur) & Dr. Nikhil Kothari (AIIMS Jodhpur)', 'Assistive Critical Care & Pressure Ulcer Prevention'),
        'P20ID006': ('Dr. Pankaj Yadav (IIT Jodhpur)', 'Neuromuscular Assessment & Force-Sensor Biomechanics'),
        'P21ID002': ('Prof. Ajay Agarwal (IIT Jodhpur) & Dr. Sushmita Jha (IIT Jodhpur)', 'Neonatal Bilirubin Diagnostics & AI Health Monitoring'),
        'P21ID005': ('Prof. Ajay Agarwal (IIT Jodhpur)', 'Smart Wearables & Health Monitoring Textiles'),
        'P21ID006': ('Dr. Dip Sankar Banerjee (IIT Jodhpur) & Dr. Saptarshi Mandal (AIIMS Jodhpur)', 'Neonatal Bilirubin Screening & Point-of-Care Devices'),
        'P22ID001': ('Prof. Ajay Agarwal (IIT Jodhpur) & Dr. Arun Singh (AIIMS Jodhpur)', 'Sensors & Microfluidic Diagnostics'),
        'P23IHC003': ('Dr. Sushmita Jha (IIT Jodhpur) & Dr. Bharti Sharma (AIIMS Jodhpur)', 'Immunology, Biosensors & Translational Diagnostics'),
        'P24IHC001': ('Dr. Romi Banerjee (IIT Jodhpur) & Prof. Surajit Ghosh (IIT Jodhpur)', 'Computational Biology, AI & Brain Connectivity'),
        'P20SH002': ('Faculty Board (IDRP / School of Health)', 'Nanomedicine & Biomaterials Science'),
        'P20SH003': ('Faculty Board (IDRP / School of Health)', 'Electrochemical Biosensors & Chemical Sensing'),
        'P20SH004': ('Faculty Board (IDRP / School of Health)', 'Plasma Medicine & Agro-Food Quality Diagnostics'),
        'P21SH202': ('Faculty Board (IDRP / School of Health)', 'Biophysical Chemistry & Translational Diagnostics'),
        'IDRPSHC006': ('Faculty Board (IDRP / School of Health)', 'Medicinal Chemistry & Infectious Disease Therapeutics'),
        'D20ID001': ('Dr. Shobhana Singh (IIT Jodhpur)', 'Endotracheal Instrumentation & Critical Care Devices'),
        'D20ID003': ('Dr. Jaiveer Singh (IIT Jodhpur) & Dr. Ankita Chugh (AIIMS Jodhpur)', 'Osteogenic-Angiogenic Biomaterials & Craniofacial Implants'),
        'D20ID004': ('Prof. Richa Singh (IIT Jodhpur), Prof. Mayank Vatsa (IIT Jodhpur) & Dr. Kuldeep Singh (AIIMS Jodhpur)', 'AI in Healthcare, Pediatric Malnutrition & Graph Neural Networks'),
        'D20ID005': ('Dr. Kaushal A. Desai (IIT Jodhpur) & Dr. Neeraj Gupta (AIIMS Jodhpur)', 'Neonatal Transport Incubators & Thermal Regulation Systems'),
        'D20ID006': ('Dr. Ankur Gupta (IIT Jodhpur) & Dr. Saptarshi Mandal (AIIMS Jodhpur)', 'Paper-Based Analytical Devices (PADs) & Glucose Biosensors'),
        'D20ID007': ('Prof. Ajay Agarwal (IIT Jodhpur)', 'Acoustic Sensors & Kavak Sensorium Diagnostics'),
        'D20ID008': ('Dr. Raviraj Vankayala (IIT Jodhpur)', 'NIR Light-Activatable Biomimetic Phototherapy Systems'),
        'D21ID006': ('Prof. Ajay Agarwal (IIT Jodhpur)', 'Nano-Electronic Sensors & Surgical Reshaping Devices'),
        'D22ID003': ('Dr. Arpit Khandelwal (IIT Jodhpur)', 'Automated Multi-Channel Diagnostic Systems'),
    }

    for r, (sup, spec) in scholar_supervisors.items():
        if r in all_students:
            all_students[r]['supervisor'] = sup
            all_students[r]['specialization'] = spec

    # Overlay Achievements
    for r, ach_list in ach_by_roll.items():
        if r in all_students:
            all_students[r]['achievements_count'] = len(ach_list)
            all_students[r]['achievements_details'] = " ; ".join(ach_list)

    # Specific Startup mapping from Updated Start up data
    startup_scholars = {
        'M21ID007': 'Healyantra Medical Technologies Pvt. Ltd. (Director & Co-Founder)',
        'M21ID003': 'Healyantra Medical Technologies Pvt. Ltd. (Co-Founder)',
        'M20ID008': 'Caldor Health Technologies Pvt. Ltd. (Co-Founder)',
        'M21ID005': 'Caldor Health Technologies Pvt. Ltd. (Co-Founder)',
        'D20ID001': 'Medvocare Pvt. Ltd. (Director & Co-Founder)',
        'P20ID002': 'Cellverse Pvt. Ltd. (Director & Co-Founder)',
        'M20ID001': 'NxGen Healtech Pvt. Ltd. (Founder)',
        'D20ID007': 'Sarbit Innovations Pvt. Ltd. (Director & Co-Founder)',
        'P20ID004': 'Visionence Tech Pvt. Ltd. (Director & Co-Founder)',
        'M21ID002': 'ShilpinMed Technologies Pvt. Ltd. (Founder)',
        'D20ID004': 'NutriAI HealthTech Solutions (Student Co-Founder & CTO)'
    }
    for r, st_text in startup_scholars.items():
        if r in all_students:
            if all_students[r]['startups_count'] == 0:
                all_students[r]['startups_count'] = 1
                all_students[r]['startups_details'] = st_text
            elif st_text not in all_students[r]['startups_details']:
                all_students[r]['startups_details'] += f" | {st_text}"

    # Specific Patent mapping from Indian Patent registry
    patent_scholars = {
        'M20ID001': 'App 202211041593: Root Canal Irrigation System Under Apical Negative Pressure',
        'P20ID005': 'App 202211060577: Pressure Ulcers / Bed Sores Preventing Air Bubble Mattress',
        'P20ID004': 'Apps 202211077085, 202411058458, 202511040403: Robot Assisted Echocardiography & Multimodal Data Sync',
        'P21ID006': 'App 202411028352: Monitoring Neonatal Bilirubin Levels',
        'P21ID002': 'App 202411028352: Monitoring Neonatal Bilirubin Levels',
        'M21ID005': 'App 202411033887: Device for Reshaping Cartilage',
        'D21ID006': 'App 202411033887: Device for Reshaping Cartilage',
        'D20ID004': 'Apps 202411076128, 202511127461: AI Pediatric Nutritional Assessment System',
        'P20ID002': 'Apps 202511037139, 202511037986: 3D Bioprinting Quadruple Modular Bioink & Cell Suspensor',
        'D20ID003': 'App 202511040294: Osteogenic-Angiogenic Implant Composition',
        'D20ID006': 'Apps 202511041154 (Granted), 202511046430 (Granted), 202511064909 (Granted), 202511072465, 202511116826: Paper-Based Biosensors & Hematocrit Diagnostic Devices',
        'M23IM1003': 'App 202511105376: Multi-Functional Retracting Device for Minimally Invasive Oral Surgery',
        'P20ID006': 'App 202511106532: Force-Sensor-Based Tapping Device for Neuromuscular Assessment',
        'D20ID005': 'App 202511107337: Neonatal Thermal Regulation System & Transport Incubator',
        'D22ID003': 'App 202511108503: Automated Multi-Channel Point-of-Care Diagnostics Device',
        'D20ID008': 'App 202511113643: Near Infrared Light Activatable Biomimetic Phototherapy System'
    }
    for r, pat_text in patent_scholars.items():
        if r in all_students:
            if all_students[r]['patents_count'] == 0:
                all_students[r]['patents_count'] = len(re.findall(r'202\d{9}', pat_text)) or 1
                all_students[r]['patents_details'] = pat_text
            elif pat_text not in all_students[r]['patents_details']:
                all_students[r]['patents_details'] += f" | {pat_text}"

    print(f"Compiled {len(all_students)} total distinct student records.")
    return all_students

if __name__ == '__main__':
    stus = compile_data()
    # Check breakdown
    from collections import Counter
    prog_counts = Counter(s['program_level'] for s in stus.values())
    year_counts = Counter(s['cohort_year'] for s in stus.values())
    print("Program breakdown:", prog_counts)
    print("Cohort Year breakdown:", sorted(year_counts.items()))
    pat_scholars = sum(1 for s in stus.values() if s['patents_count'] > 0)
    stu_scholars = sum(1 for s in stus.values() if s['startups_count'] > 0)
    pub_scholars = sum(1 for s in stus.values() if s['publications_count'] > 0)
    print(f"Scholars with Patents: {pat_scholars}, Startups: {stu_scholars}, Publications: {pub_scholars}")
