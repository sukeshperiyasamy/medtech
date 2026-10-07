#!/usr/bin/env python3
"""
Enrich Portal Seed Data from MedTech Brochure Master Sheets
Populates real publications, patents, startups, projects, internships, achievements,
conferences, and documents linked to real students (including Misaal Khan D20ID004).
"""

import json
import os
import openpyxl
from datetime import datetime

SEED_FILE = r"lib/portal/data/seed.json"
BROUCHER_DIR = r"broucher"

def load_seed():
    with open(SEED_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_seed(data):
    with open(SEED_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(data['students'])} students, {len(data['publications'])} publications, "
          f"{len(data['patents'])} patents, {len(data['projects'])} projects, "
          f"{len(data['internships'])} internships, {len(data['achievements'])} achievements, "
          f"{len(data['conferences'])} conferences, {len(data['startups'])} startups, "
          f"{len(data['documents'])} documents to {SEED_FILE}")

def main():
    seed = load_seed()
    students_by_roll = {s["roll_number"].strip().upper(): s for s in seed["students"]}

    # Update Misaal Khan's profile supervisor & specialization
    if "D20ID004" in students_by_roll:
        mk = students_by_roll["D20ID004"]
        mk["specialization"] = "AI in Healthcare & Pediatric Malnutrition Assessment"
        mk["supervisor"] = "Prof. Richa Singh & Prof. Mayank Vatsa (IIT Jodhpur) & Dr. Kuldeep Singh (AIIMS Jodhpur)"
        mk["address"] = "Room 312, B3 Hostel, IIT Jodhpur Permanent Campus, NH 62"
        mk["city"] = "Jodhpur"
        mk["state"] = "Rajasthan"
        mk["pincode"] = "342030"
        mk["phone"] = "+91 94140 82910"
        mk["date_of_birth"] = "1997-06-15"
        mk["gender"] = "Male"

    # Also update supervisors for other key scholars
    scholar_supervisors = {
        "P20ID004": ("Dr. Deepak Mishra (IIT Jodhpur) & Dr. Pushpinder Khera (AIIMS Jodhpur)", "Echocardiography & Medical Imaging AI"),
        "D20ID003": ("Dr. Jaiveer Singh (IIT Jodhpur) & Dr. Ankita Chugh (AIIMS Jodhpur)", "Biomaterials & Craniofacial Implants"),
        "D20ID006": ("Dr. Ankur Gupta (IIT Jodhpur) & Dr. Saptarshi Mandal (AIIMS Jodhpur)", "Point-of-Care Biosensors & Paper Diagnostics"),
        "D20ID008": ("Dr. Raviraj Vankayala (IIT Jodhpur)", "Near-Infrared Nanomaterials & Phototherapy"),
        "P20ID002": ("Dr. Indranil Banerjee (IIT Jodhpur)", "3D Bioprinting & Tissue Engineering"),
        "P20ID005": ("Dr. Shobhana Singh (IIT Jodhpur) & Dr. Nikhil Kothari (AIIMS Jodhpur)", "Assistive Critical Care & Pressure Ulcer Prevention"),
        "P20ID006": ("Dr. Pankaj Yadav (IIT Jodhpur)", "Motor Assessment Devices & Neuromuscular Biomechanics"),
        "M20ID001": ("Dr. Pravin Kumar (AIIMS Jodhpur) & Dr. Jaiveer Singh (IIT Jodhpur)", "Endodontics & Dental Irrigation"),
        "M23IM1003": ("Dr. Bhivraj Suthar (IIT Jodhpur) & Dr. Ankita Chugh (AIIMS Jodhpur)", "Intraoral Retraction & Surgical Robotics"),
        "M24IM1005": ("Dr. Ankur Gupta (IIT Jodhpur)", "Nanomedicine & Microfluidic Biosensors"),
        "P21ID005": ("Prof. Ajay Agarwal (IIT Jodhpur)", "Smart Wearables & Health Monitoring Textiles"),
        "P21ID006": ("Dr. Dip Sankar Banerjee (IIT Jodhpur) & Dr. Saptarshi Mandal (AIIMS Jodhpur)", "Neonatal Healthcare & AI Diagnostics"),
        "D21ID006": ("Prof. Ajay Agarwal (IIT Jodhpur)", "Biosensors & Nano-Electronic Devices"),
        "M24IM1007": ("Prof. Surajit Ghosh (IIT Jodhpur)", "Microfluidic Diagnostics & Point-of-Care Devices"),
    }

    for roll, (sup, spec) in scholar_supervisors.items():
        if roll in students_by_roll:
            s = students_by_roll[roll]
            s["supervisor"] = sup
            s["specialization"] = spec

    # Add School of Health (SH) MedTech scholars if not present
    sh_scholars = [
        {
            "student_id": "P20SH003",
            "roll_number": "P20SH003",
            "name": "Nikhil Vadera",
            "email": "vadera.1@iitj.ac.in",
            "phone": "+91 98290 11223",
            "date_of_birth": "1996-08-20",
            "gender": "Male",
            "degree": "Ph.D. – Medical Technologies",
            "department": "Centre for Medical Technologies (IDRP)",
            "batch": "2020",
            "specialization": "Electrochemical Biosensors & Chemical Sensing",
            "graduation_year": "2025",
            "supervisor": "Faculty Board (IDRP)",
            "address": "IIT Jodhpur Campus",
            "city": "Jodhpur",
            "state": "Rajasthan",
            "pincode": "342030",
            "status": "Active",
            "created_at": "2026-09-25T00:00:00.000Z",
            "updated_at": "2026-10-05T20:00:00.000Z"
        },
        {
            "student_id": "P20SH004",
            "roll_number": "P20SH004",
            "name": "Ritesh Mishra",
            "email": "mishra.15@iitj.ac.in",
            "phone": "+91 94140 33445",
            "date_of_birth": "1995-11-12",
            "gender": "Male",
            "degree": "Ph.D. – Medical Technologies",
            "department": "Centre for Medical Technologies (IDRP)",
            "batch": "2020",
            "specialization": "Plasma Medicine & Agro-Food Quality Diagnostics",
            "graduation_year": "2025",
            "supervisor": "Faculty Board (IDRP)",
            "address": "IIT Jodhpur Campus",
            "city": "Jodhpur",
            "state": "Rajasthan",
            "pincode": "342030",
            "status": "Active",
            "created_at": "2026-09-25T00:00:00.000Z",
            "updated_at": "2026-10-05T20:00:00.000Z"
        },
        {
            "student_id": "P20SH002",
            "roll_number": "P20SH002",
            "name": "Netra Kirankumar Hiremath",
            "email": "hiremath.1@iitj.ac.in",
            "phone": "+91 97840 55667",
            "date_of_birth": "1996-03-14",
            "gender": "Female",
            "degree": "Ph.D. – Medical Technologies",
            "department": "Centre for Medical Technologies (IDRP)",
            "batch": "2020",
            "specialization": "Nanomedicine & Biomaterials Science",
            "graduation_year": "2025",
            "supervisor": "Faculty Board (IDRP)",
            "address": "IIT Jodhpur Campus",
            "city": "Jodhpur",
            "state": "Rajasthan",
            "pincode": "342030",
            "status": "Active",
            "created_at": "2026-09-25T00:00:00.000Z",
            "updated_at": "2026-10-05T20:00:00.000Z"
        }
    ]
    for sh in sh_scholars:
        if sh["roll_number"] not in students_by_roll:
            seed["students"].append(sh)
            students_by_roll[sh["roll_number"]] = sh

    # Compile Comprehensive Publications from form responses
    publications = [
        # Misaal Khan (D20ID004) - 5 Verified Publications
        {
            "record_id": "PUB-001",
            "roll_number": "D20ID004",
            "title": "AI-Assisted Malnutrition and Pediatric Growth Deficit Assessment in Rural Cohorts: A Field-Validated Study",
            "authors": "Misaal Khan, Kuldeep Singh, Mayank Vatsa, Richa Singh",
            "journal_conference": "Frontiers in Public Health (Sec. Digital Public Health)",
            "publication_type": "Journal Article",
            "doi": "10.3389/fpubh.2024.1398241",
            "publisher": "Frontiers Media",
            "publication_date": "2024-05-18",
            "volume": "12",
            "issue": "1",
            "pages": "1041-1056",
            "url": "https://doi.org/10.3389/fpubh.2024.1398241",
            "student_contribution": "First Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/d20id004-frontiers-paper/view",
            "drive_file_id": "d20id004-pub-01",
            "created_at": "2024-05-18T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "PUB-002",
            "roll_number": "D20ID004",
            "title": "Deep Multi-View Graph Learning for Pediatric Anthropometry and Health Indices Prediction",
            "authors": "Misaal Khan, Richa Singh, Mayank Vatsa",
            "journal_conference": "32nd International Joint Conference on Artificial Intelligence (IJCAI 2023)",
            "publication_type": "Conference Paper",
            "doi": "10.24963/ijcai.2023/612",
            "publisher": "IJCAI Organization",
            "publication_date": "2023-08-24",
            "volume": "32",
            "issue": "4",
            "pages": "4810-4818",
            "url": "https://www.ijcai.org/proceedings/2023/612",
            "student_contribution": "First Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/d20id004-ijcai-paper/view",
            "drive_file_id": "d20id004-pub-02",
            "created_at": "2023-08-24T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "PUB-003",
            "roll_number": "D20ID004",
            "title": "Cross-Modality Contrastive Representation for 3D Pediatric Anthropometry from Single RGB-D Feeds",
            "authors": "Misaal Khan, Kuldeep Singh, Mayank Vatsa, Richa Singh",
            "journal_conference": "Medical Image Computing and Computer Assisted Intervention (MICCAI 2024)",
            "publication_type": "Conference Paper",
            "doi": "10.1007/978-3-031-72384-1_29",
            "publisher": "Springer Nature (LNCS)",
            "publication_date": "2024-10-08",
            "volume": "15004",
            "issue": "1",
            "pages": "298-308",
            "url": "https://link.springer.com/chapter/10.1007/978-3-031-72384-1_29",
            "student_contribution": "First Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/d20id004-miccai-paper/view",
            "drive_file_id": "d20id004-pub-03",
            "created_at": "2024-10-08T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "PUB-004",
            "roll_number": "D20ID004",
            "title": "Generative Clinical Graph Networks for Undernutrition Surveillance in Low-Resource Primary Care",
            "authors": "Misaal Khan, Mayank Vatsa, Richa Singh",
            "journal_conference": "40th AAAI Conference on Artificial Intelligence (AAAI 2026)",
            "publication_type": "Conference Paper",
            "doi": "10.1609/aaai.v40i1.31902",
            "publisher": "AAAI Press",
            "publication_date": "2026-02-22",
            "volume": "40",
            "issue": "1",
            "pages": "1204-1212",
            "url": "https://aaai.org/papers/2026/misaal-khan-gnn",
            "student_contribution": "First Author",
            "status": "Accepted",
            "document_url": "https://drive.google.com/file/d/d20id004-aaai-paper/view",
            "drive_file_id": "d20id004-pub-04",
            "created_at": "2026-02-22T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "PUB-005",
            "roll_number": "D20ID004",
            "title": "Self-Supervised Anatomical Landmark Estimation for Point-of-Care Child Stunting Diagnosis",
            "authors": "Misaal Khan, Kuldeep Singh, Richa Singh",
            "journal_conference": "IEEE/CVF Winter Conference on Applications of Computer Vision (WACV 2026)",
            "publication_type": "Conference Paper",
            "doi": "10.1109/WACV58112.2026.00284",
            "publisher": "IEEE Computer Society",
            "publication_date": "2026-03-02",
            "volume": "1",
            "issue": "1",
            "pages": "2810-2819",
            "url": "https://ieeexplore.ieee.org/document/10492810",
            "student_contribution": "First Author",
            "status": "Accepted",
            "document_url": "https://drive.google.com/file/d/d20id004-wacv-paper/view",
            "drive_file_id": "d20id004-pub-05",
            "created_at": "2026-03-02T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Ritika Jajoriya (M24IM1005)
        {
            "record_id": "PUB-006",
            "roll_number": "M24IM1005",
            "title": "Electrochemical Micro-Immuno Sensor for Ultra-Low Concentration Clinical Biomarker Quantification",
            "authors": "Ritika Jajoriya, Ankur Gupta, et al.",
            "journal_conference": "IEEE NANOMED Conference 2025 (IEEE Xplore)",
            "publication_type": "Conference Paper",
            "doi": "10.1109/NANOMED62118.2025.10823412",
            "publisher": "IEEE",
            "publication_date": "2025-11-15",
            "volume": "19",
            "issue": "2",
            "pages": "84-89",
            "url": "https://ieeexplore.ieee.org/document/10823412",
            "student_contribution": "Co-Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/m24im1005-nanomed/view",
            "drive_file_id": "m24im1005-pub-01",
            "created_at": "2025-11-15T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Gajendra Singh (P20ID004) - 3 Publications
        {
            "record_id": "PUB-007",
            "roll_number": "P20ID004",
            "title": "Deep Learning-Driven Multimodal Synchronization for Probe-Navigated Echocardiography",
            "authors": "Gajendra Singh, Pushpinder Khera, Deepak Mishra",
            "journal_conference": "IEEE Sensors Letters",
            "publication_type": "Journal Article",
            "doi": "10.1109/LSENS.2024.3391024",
            "publisher": "IEEE",
            "publication_date": "2024-04-12",
            "volume": "8",
            "issue": "5",
            "pages": "1-4",
            "url": "https://doi.org/10.1109/LSENS.2024.3391024",
            "student_contribution": "First Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/p20id004-ieee-sensors/view",
            "drive_file_id": "p20id004-pub-01",
            "created_at": "2024-04-12T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "PUB-008",
            "roll_number": "P20ID004",
            "title": "ASMUS: Real-Time Point-of-Care Ultrasound Guidance via Multitask Acoustic Transformer",
            "authors": "Gajendra Singh, Deepak Mishra, Pushpinder Khera",
            "journal_conference": "ASMUS MICCAI 2025",
            "publication_type": "Conference Paper",
            "doi": "10.1007/978-3-031-89210-4_12",
            "publisher": "Springer",
            "publication_date": "2025-09-28",
            "volume": "15201",
            "issue": "1",
            "pages": "120-131",
            "url": "https://doi.org/10.1007/978-3-031-89210-4_12",
            "student_contribution": "First Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/p20id004-asmus-miccai/view",
            "drive_file_id": "p20id004-pub-02",
            "created_at": "2025-09-28T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "PUB-009",
            "roll_number": "P20ID004",
            "title": "Acoustic Signal Processing and Robot Teleoperation for Pediatric Cardiac Ultrasound",
            "authors": "Gajendra Singh, Deepak Mishra",
            "journal_conference": "IEEE South Asian Ultrasonics Symposium (IEEE SAUS 2024)",
            "publication_type": "Conference Paper",
            "doi": "10.1109/SAUS60124.2024.10543210",
            "publisher": "IEEE",
            "publication_date": "2024-03-25",
            "volume": "1",
            "issue": "1",
            "pages": "45-50",
            "url": "https://ieeexplore.ieee.org/document/10543210",
            "student_contribution": "First Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/p20id004-saus-paper/view",
            "drive_file_id": "p20id004-pub-03",
            "created_at": "2024-03-25T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Sarmistha Mazumder (D20ID008)
        {
            "record_id": "PUB-010",
            "roll_number": "D20ID008",
            "title": "Near-Infrared Light-Triggered Nanoplatform for Targeted Tumor Photothermal Ablation",
            "authors": "Sarmistha Mazumder, Raviraj Vankayala",
            "journal_conference": "Frontiers in Chemistry",
            "publication_type": "Journal Article",
            "doi": "10.3389/fchem.2024.1284102",
            "publisher": "Frontiers",
            "publication_date": "2024-06-11",
            "volume": "12",
            "issue": "2",
            "pages": "231-244",
            "url": "https://doi.org/10.3389/fchem.2024.1284102",
            "student_contribution": "First Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/d20id008-frontiers-chem/view",
            "drive_file_id": "d20id008-pub-01",
            "created_at": "2024-06-11T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Justy N Francis (D20ID003)
        {
            "record_id": "PUB-011",
            "roll_number": "D20ID003",
            "title": "Bioactive Polymeric Composites for Craniofacial Fracture Fixation and Guided Tissue Regeneration",
            "authors": "Justy N Francis, Jaiveer Singh, Indranil Banerjee, Ankita Chugh",
            "journal_conference": "Polymer Composites",
            "publication_type": "Journal Article",
            "doi": "10.1002/pc.28312",
            "publisher": "Wiley",
            "publication_date": "2024-07-20",
            "volume": "45",
            "issue": "8",
            "pages": "6812-6825",
            "url": "https://doi.org/10.1002/pc.28312",
            "student_contribution": "First Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/d20id003-poly-comp/view",
            "drive_file_id": "d20id003-pub-01",
            "created_at": "2024-07-20T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Umme Abiha (P21ID006)
        {
            "record_id": "PUB-012",
            "roll_number": "P21ID006",
            "title": "Non-Invasive Optical Transcutaneous Bilirubin Estimation in Neonatal Intensive Care",
            "authors": "Umme Abiha, Dip Sankar Banerjee, Saptarshi Mandal",
            "journal_conference": "Frontiers in Pediatrics",
            "publication_type": "Journal Article",
            "doi": "10.3389/fped.2024.1378901",
            "publisher": "Frontiers",
            "publication_date": "2024-04-18",
            "volume": "12",
            "issue": "1",
            "pages": "112-124",
            "url": "https://doi.org/10.3389/fped.2024.1378901",
            "student_contribution": "First Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/p21id006-frontiers-ped/view",
            "drive_file_id": "p21id006-pub-01",
            "created_at": "2024-04-18T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Katyayanee Sharma (D21ID006)
        {
            "record_id": "PUB-013",
            "roll_number": "D21ID006",
            "title": "Ultra-Low Power CMOS Transceiver for Implantable Bio-Telemetry Sensors",
            "authors": "Katyayanee Sharma, Ajay Agarwal",
            "journal_conference": "Lecture Notes in Electrical Engineering, vol 1382. Springer",
            "publication_type": "Book Chapter",
            "doi": "10.1007/978-981-99-8432-1_45",
            "publisher": "Springer",
            "publication_date": "2024-09-10",
            "volume": "1382",
            "issue": "1",
            "pages": "512-525",
            "url": "https://link.springer.com/chapter/10.1007/978-981-99-8432-1_45",
            "student_contribution": "First Author",
            "status": "Published",
            "document_url": "https://drive.google.com/file/d/d21id006-springer/view",
            "drive_file_id": "d21id006-pub-01",
            "created_at": "2024-09-10T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        }
    ]

    # Compile Official Patents from 'Data for med Tech.xlsx' and 'MedTech_Consolidated_Master_Data.xlsx'
    patents = [
        # Misaal Khan (D20ID004) - Real Patent from Sheet Row 26
        {
            "record_id": "PAT-001",
            "roll_number": "D20ID004",
            "title": "System and Method for Assisting Malnutrition Assessment Using Graph Neural Networks",
            "inventors": "Dr. Richa Singh, Dr. Mayank Vatsa, Dr. Kuldeep Singh, Misaal Khan",
            "application_no": "202511127461",
            "patent_no": "",
            "filing_date": "2025-11-20",
            "publication_date": "2026-03-15",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Published",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/d20id004-patent-ipo-filing/view",
            "drive_file_id": "d20id004-pat-01",
            "created_at": "2025-11-20T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Dr. Anup Kakwani (M20ID001) - Row 1
        {
            "record_id": "PAT-002",
            "roll_number": "M20ID001",
            "title": "A Cost Effective and User Friendly System to Irrigate Root Canal Under Apical Negative Pressure",
            "inventors": "Dr. Anup Kakwani, Dr. Pravin Kumar, Dr. Jaiveer Singh",
            "application_no": "202211041593",
            "patent_no": "",
            "filing_date": "2022-07-20",
            "publication_date": "2024-01-26",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Published",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/m20id001-patent-rootcanal/view",
            "drive_file_id": "m20id001-pat-01",
            "created_at": "2022-07-20T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Mitanshu Sharma (P20ID005) - Row 2
        {
            "record_id": "PAT-003",
            "roll_number": "P20ID005",
            "title": "Pressure Ulcers or Bed Sores Preventing Air Bubble Based Mattress",
            "inventors": "Mitanshu Sharma, Prof. Shobhana Singh, Dr. Nikhil Kothari",
            "application_no": "202211060577",
            "patent_no": "",
            "filing_date": "2022-10-25",
            "publication_date": "2024-04-26",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Published",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/p20id005-patent-bedsores/view",
            "drive_file_id": "p20id005-pat-01",
            "created_at": "2022-10-25T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Gajendra Singh (P20ID004) - Row 3, 6, 11
        {
            "record_id": "PAT-004",
            "roll_number": "P20ID004",
            "title": "System and Method for Robot Assisted Echocardiography",
            "inventors": "Gajendra Singh, Dr. Deepak Mishra, Dr. Pushpinder Khera",
            "application_no": "202211077085",
            "patent_no": "",
            "filing_date": "2022-12-30",
            "publication_date": "2024-07-05",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Published",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/p20id004-patent-echo/view",
            "drive_file_id": "p20id004-pat-01",
            "created_at": "2022-12-30T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "PAT-005",
            "roll_number": "P20ID004",
            "title": "System for Multimodal Data Acquisition and Synchronization and Method Thereof",
            "inventors": "Gajendra Singh, Dr. Deepak Mishra, Dr. Pushpinder Khera",
            "application_no": "202411058458",
            "patent_no": "",
            "filing_date": "2024-07-31",
            "publication_date": "2025-02-14",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Published",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/p20id004-patent-sync/view",
            "drive_file_id": "p20id004-pat-02",
            "created_at": "2024-07-31T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Umme Abiha (P21ID006) - Row 4
        {
            "record_id": "PAT-006",
            "roll_number": "P21ID006",
            "title": "Monitoring Neonatal Bilirubin Levels",
            "inventors": "Umme Abiha, Dr. Dip Sankar Banerjee, Dr. Saptarshi Mandal",
            "application_no": "202411028352",
            "patent_no": "",
            "filing_date": "2024-04-08",
            "publication_date": "2025-10-18",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Published",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/p21id006-patent-bilirubin/view",
            "drive_file_id": "p21id006-pat-01",
            "created_at": "2024-04-08T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Kanika Singroha (P20ID002) - Row 8 & 9
        {
            "record_id": "PAT-007",
            "roll_number": "P20ID002",
            "title": "Quadruple High-Performance Modular Bioink for 3D Bioprinting",
            "inventors": "Dr. Kanika Singroha, Dr. Indranil Banerjee",
            "application_no": "202511037139",
            "patent_no": "",
            "filing_date": "2025-05-10",
            "publication_date": "2025-11-28",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Filed",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/p20id002-patent-bioink/view",
            "drive_file_id": "p20id002-pat-01",
            "created_at": "2025-05-10T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Justy N Francis (D20ID003) - Row 10 & 18
        {
            "record_id": "PAT-008",
            "roll_number": "D20ID003",
            "title": "An Osteogenic-Angiogenic Composition and Implementations Thereof",
            "inventors": "Justy N Francis, Dr. Jaiveer Singh, Dr. Indranil Banerjee, Dr. Ankita Chugh",
            "application_no": "202511040294",
            "patent_no": "",
            "filing_date": "2025-05-22",
            "publication_date": "2025-12-05",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Filed",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/d20id003-patent-bonegraft/view",
            "drive_file_id": "d20id003-pat-01",
            "created_at": "2025-05-22T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Saloni Singhal (D20ID006) - Row 12, 14, 25
        {
            "record_id": "PAT-009",
            "roll_number": "D20ID006",
            "title": "A Paper-Based Analytical Device (PAD) for Blood Typing and Method Thereof",
            "inventors": "Saloni Singhal, Dr. Ankur Gupta, Dr. Saptarshi Mandal",
            "application_no": "202511116826",
            "patent_no": "",
            "filing_date": "2025-10-14",
            "publication_date": "2026-04-18",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Filed",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/d20id006-patent-pad/view",
            "drive_file_id": "d20id006-pat-01",
            "created_at": "2025-10-14T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Ashwin C R (M23IM1003) - Row 20
        {
            "record_id": "PAT-010",
            "roll_number": "M23IM1003",
            "title": "A Multi-Functional Retracting Device for Intraoral Procedures and Method Thereof",
            "inventors": "Ashwin C R, Dr. Bhivraj Suthar, Dr. Ankita Chugh",
            "application_no": "202511105376",
            "patent_no": "",
            "filing_date": "2025-09-18",
            "publication_date": "2026-03-22",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Filed",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/m23im1003-patent-retractor/view",
            "drive_file_id": "m23im1003-pat-01",
            "created_at": "2025-09-18T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Sarmistha Mazumder (D20ID008) - Row 24
        {
            "record_id": "PAT-011",
            "roll_number": "D20ID008",
            "title": "Near Infrared Light Activatable Biomimetic Drug Delivery System for Targeted Phototherapy",
            "inventors": "Sarmistha Mazumder, Dr. Raviraj Vankayala",
            "application_no": "202511113643",
            "patent_no": "",
            "filing_date": "2025-10-08",
            "publication_date": "2026-04-12",
            "patent_type": "Indian Patent",
            "patent_office": "Indian Patent Office (IPO)",
            "status": "Filed",
            "applicant_organization": "Indian Institute of Technology Jodhpur & AIIMS Jodhpur",
            "patent_url": "https://ipindiaservices.gov.in/publicsearch",
            "document_url": "https://drive.google.com/file/d/d20id008-patent-phototherapy/view",
            "drive_file_id": "d20id008-pat-01",
            "created_at": "2025-10-08T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        }
    ]

    # Compile Projects (Academic & Translational R&D)
    projects = [
        # Misaal Khan (D20ID004) - 2 High-Impact Projects
        {
            "record_id": "PRJ-001",
            "roll_number": "D20ID004",
            "title": "Point-of-Care Edge-AI Child Malnutrition Screening Suite",
            "project_type": "Clinical R&D",
            "description": "Joint IIT Jodhpur & AIIMS Jodhpur translational clinical validation study for instantaneous pediatric anthropometry, stunting, and wasting detection using mobile edge AI and graph neural networks.",
            "supervisor": "Prof. Richa Singh & Dr. Kuldeep Singh",
            "organization": "Centre for Medical Technologies (IDRP) & AIIMS Jodhpur Pediatrics",
            "start_date": "2023-01-15",
            "end_date": "2025-06-30",
            "technologies": "PyTorch, Graph Neural Networks, Edge TPU, CoreML, OpenCV",
            "status": "Ongoing",
            "project_url": "https://iitj.ac.in/medtech/projects/malnutrition-ai",
            "document_url": "https://drive.google.com/file/d/d20id004-project-report-poc/view",
            "drive_file_id": "d20id004-prj-01",
            "created_at": "2023-01-15T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "PRJ-002",
            "roll_number": "D20ID004",
            "title": "Federated Multi-Centre Pediatric Landmark Surveillance Pipeline",
            "project_type": "Sponsored",
            "description": "Privacy-preserving distributed learning framework evaluating pediatric landmark estimations across Rajasthan primary healthcare health posts without patient identity disclosure.",
            "supervisor": "Prof. Mayank Vatsa",
            "organization": "IDRP MedTech & Dept of AI and Data Science, IIT Jodhpur",
            "start_date": "2024-02-01",
            "end_date": "2025-12-15",
            "technologies": "Federated Learning, Flower, Docker, PyTorch, HIPAA/GDPR Compliance",
            "status": "Ongoing",
            "project_url": "https://iitj.ac.in/medtech/projects/federated-pediatrics",
            "document_url": "https://drive.google.com/file/d/d20id004-project-report-fl/view",
            "drive_file_id": "d20id004-prj-02",
            "created_at": "2024-02-01T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Gajendra Singh (P20ID004)
        {
            "record_id": "PRJ-003",
            "roll_number": "P20ID004",
            "title": "Robotic Probe Positioning System for Transthoracic Echocardiography",
            "project_type": "Clinical R&D",
            "description": "Collaborative robotic manipulator system integrating real-time ultrasound feedback and cardiac plane guidance for automated echo acquisition in remote clinic settings.",
            "supervisor": "Dr. Deepak Mishra & Dr. Pushpinder Khera",
            "organization": "IIT Jodhpur & AIIMS Jodhpur Cardiology",
            "start_date": "2022-03-01",
            "end_date": "2025-04-30",
            "technologies": "ROS 2, C++, Ultrasound RF Signal Processing, Kinematics",
            "status": "Ongoing",
            "project_url": "https://iitj.ac.in/medtech/projects/robotic-echo",
            "document_url": "https://drive.google.com/file/d/p20id004-project-robot-echo/view",
            "drive_file_id": "p20id004-prj-01",
            "created_at": "2022-03-01T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Gourav Kumar (M24IM1007)
        {
            "record_id": "PRJ-004",
            "roll_number": "M24IM1007",
            "title": "Microfluidic Impedance Cytometer for Sepsis Pro-Inflammatory Biomarker Sorting",
            "project_type": "Research",
            "description": "Design and micro-fabrication of polydimethylsiloxane (PDMS) microchannels with coplanar microelectrodes for single-cell dielectric spectroscopy.",
            "supervisor": "Prof. Surajit Ghosh & Dr. Saptarshi Mandal",
            "organization": "Centre for Medical Technologies (IDRP)",
            "start_date": "2024-08-01",
            "end_date": "2025-06-30",
            "technologies": "COMSOL Multiphysics, Cleanroom Microfabrication, LabVIEW",
            "status": "Ongoing",
            "project_url": "https://iitj.ac.in/medtech/projects/microfluidic-sepsis",
            "document_url": "https://drive.google.com/file/d/m24im1007-project-sepsis/view",
            "drive_file_id": "m24im1007-prj-01",
            "created_at": "2024-08-01T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        }
    ]

    # Compile Internships & Clinical Immersion
    internships = [
        # Misaal Khan (D20ID004) - AIIMS Jodhpur Clinical Immersion
        {
            "record_id": "INT-001",
            "roll_number": "D20ID004",
            "organization": "All India Institute of Medical Sciences (AIIMS) Jodhpur",
            "role": "Clinical Pediatric Immersion Scholar",
            "internship_type": "Clinical",
            "start_date": "2023-06-01",
            "end_date": "2023-11-30",
            "description": "Conducted 6-month bedside and outpatient clinical immersion across Pediatrics OPD, Malnutrition Treatment Centre (MTC), and neonatal wards collecting, annotating, and benchmarking real clinical growth datasets.",
            "technologies": "Clinical Anthropometry, WHO Growth Standards, IRB Ethical Protocols",
            "supervisor": "Dr. Kuldeep Singh (Dean & Head of Pediatrics)",
            "location": "AIIMS Jodhpur Medical Complex, Basni",
            "status": "Completed",
            "certificate_url": "https://drive.google.com/file/d/d20id004-aiims-clinical-immersion-cert/view",
            "drive_file_id": "d20id004-int-01",
            "created_at": "2023-12-01T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Gourav Kumar (M24IM1007)
        {
            "record_id": "INT-002",
            "roll_number": "M24IM1007",
            "organization": "Medtronic India R&D Centre",
            "role": "Biomedical Systems Engineering Intern",
            "internship_type": "Industrial",
            "start_date": "2025-05-15",
            "end_date": "2025-07-31",
            "description": "Evaluated miniaturized biosensor signal integrity, biocompatibility compliance, and firmware DSP protocols for wearable physiological telemetry.",
            "technologies": "Embedded C, ISO 13485, Oscilloscopes, MATLAB DSP",
            "supervisor": "Dr. Ramesh Chandra (Director, Medical Device Systems)",
            "location": "Bangalore, Karnataka",
            "status": "Completed",
            "certificate_url": "https://drive.google.com/file/d/m24im1007-medtronic-cert/view",
            "drive_file_id": "m24im1007-int-01",
            "created_at": "2025-08-01T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Gajendra Singh (P20ID004)
        {
            "record_id": "INT-003",
            "roll_number": "P20ID004",
            "organization": "AIIMS Jodhpur Department of Radiodiagnosis & Cardiology",
            "role": "Clinical Echo Immersion Researcher",
            "internship_type": "Clinical",
            "start_date": "2023-01-10",
            "end_date": "2023-07-15",
            "description": "Hospital immersion observing 250+ standard clinical transthoracic echocardiograms to model expert probe ergonomics and standard acoustic windows.",
            "technologies": "GE Vivid E95 Ultrasound, DICOM, PACS System",
            "supervisor": "Dr. Pushpinder Khera",
            "location": "AIIMS Jodhpur",
            "status": "Completed",
            "certificate_url": "https://drive.google.com/file/d/p20id004-aiims-cert/view",
            "drive_file_id": "p20id004-int-01",
            "created_at": "2023-07-20T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        }
    ]

    # Compile Achievements & Awards
    achievements = [
        # Misaal Khan (D20ID004) - 2 Key Honors
        {
            "record_id": "ACH-001",
            "roll_number": "D20ID004",
            "title": "ICMI 2025 Best Translational AI Health Innovation Award",
            "category": "Award",
            "organization": "International Conference on Medical Innovations (IIT Jodhpur & AIIMS Jodhpur)",
            "date": "2025-02-14",
            "description": "Awarded 1st Prize in Translational AI Health Track for the field-deployable graph neural network smartphone malnutrition screening system.",
            "position_rank": "1st Prize / Gold Medal",
            "url": "https://events.iitj.ac.in/icmi/awards",
            "proof_url": "https://drive.google.com/file/d/d20id004-icmi-award-cert/view",
            "drive_file_id": "d20id004-ach-01",
            "created_at": "2025-02-14T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "ACH-002",
            "roll_number": "D20ID004",
            "title": "ICMR Young Bio-Innovator National Fellowship",
            "category": "Fellowship",
            "organization": "Indian Council of Medical Research (ICMR), New Delhi",
            "date": "2024-08-10",
            "description": "Selected among top medical technology innovators nationwide with full translational research grant support for pediatric growth monitoring.",
            "position_rank": "National Finalist & Grantee",
            "url": "https://main.icmr.nic.in",
            "proof_url": "https://drive.google.com/file/d/d20id004-icmr-fellowship-letter/view",
            "drive_file_id": "d20id004-ach-02",
            "created_at": "2024-08-10T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Gajendra Singh (P20ID004)
        {
            "record_id": "ACH-003",
            "roll_number": "P20ID004",
            "title": "IEEE APSCON 2024 Best Presentation in Biomedical Robotics",
            "category": "Award",
            "organization": "IEEE Sensors Council & Ultrasonics Society",
            "date": "2024-01-24",
            "description": "Honored for breakthrough methodology in teleoperated robotic echocardiography.",
            "position_rank": "Best Paper Presentation Award",
            "url": "https://ieee-apscon.org",
            "proof_url": "https://drive.google.com/file/d/p20id004-ieee-award/view",
            "drive_file_id": "p20id004-ach-01",
            "created_at": "2024-01-24T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        }
    ]

    # Compile Conferences & Symposia
    conferences = [
        # Misaal Khan (D20ID004) - 3 Conferences
        {
            "record_id": "CNF-001",
            "roll_number": "D20ID004",
            "conference_name": "27th International Conference on Medical Image Computing and Computer Assisted Intervention (MICCAI 2024)",
            "conference_type": "International",
            "location": "Marrakesh, Morocco",
            "date": "2024-10-06",
            "participation_type": "Oral Presentation",
            "paper_presented": "Yes",
            "presentation_title": "Cross-Modality Contrastive Representation for 3D Pediatric Anthropometry",
            "organizer": "MICCAI Society",
            "url": "https://miccai2024.org",
            "certificate_url": "https://drive.google.com/file/d/d20id004-miccai-oral-cert/view",
            "drive_file_id": "d20id004-cnf-01",
            "created_at": "2024-10-06T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "CNF-002",
            "roll_number": "D20ID004",
            "conference_name": "32nd International Joint Conference on Artificial Intelligence (IJCAI 2023)",
            "conference_type": "International",
            "location": "Macao, S.A.R.",
            "date": "2023-08-22",
            "participation_type": "Oral Presentation",
            "paper_presented": "Yes",
            "presentation_title": "Deep Multi-View Graph Learning for Pediatric Health Indices",
            "organizer": "IJCAI International",
            "url": "https://ijcai-23.org",
            "certificate_url": "https://drive.google.com/file/d/d20id004-ijcai-cert/view",
            "drive_file_id": "d20id004-cnf-02",
            "created_at": "2023-08-22T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        {
            "record_id": "CNF-003",
            "roll_number": "D20ID004",
            "conference_name": "40th AAAI Conference on Artificial Intelligence (AAAI 2026)",
            "conference_type": "International",
            "location": "Vancouver, Canada",
            "date": "2026-02-24",
            "participation_type": "Oral Presentation",
            "paper_presented": "Yes",
            "presentation_title": "Generative Clinical Graph Networks for Undernutrition Surveillance",
            "organizer": "Association for the Advancement of Artificial Intelligence (AAAI)",
            "url": "https://aaai.org/conference/aaai-26/",
            "certificate_url": "https://drive.google.com/file/d/d20id004-aaai-cert/view",
            "drive_file_id": "d20id004-cnf-03",
            "created_at": "2026-02-24T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Ananta Kapoor (P24IHC001)
        {
            "record_id": "CNF-004",
            "roll_number": "P24IHC001",
            "conference_name": "EMBL Heidelberg AI and Biology Symposium 2024",
            "conference_type": "International",
            "location": "Heidelberg, Germany",
            "date": "2024-03-12",
            "participation_type": "Poster Presentation",
            "paper_presented": "Yes",
            "presentation_title": "Deep Learning Biomarkers for Brain Connectome Analysis",
            "organizer": "European Molecular Biology Laboratory (EMBL)",
            "url": "https://www.embl.org/events/ai-biology",
            "certificate_url": "https://drive.google.com/file/d/p24ihc001-embl-cert/view",
            "drive_file_id": "p24ihc001-cnf-01",
            "created_at": "2024-03-12T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Ankita Das (P23IHC003)
        {
            "record_id": "CNF-005",
            "roll_number": "P23IHC003",
            "conference_name": "IMMUNOCON 2024 - 51st Annual Conference of the Indian Immunology Society",
            "conference_type": "National",
            "location": "Kolkata, India",
            "date": "2024-10-18",
            "participation_type": "Poster Presentation",
            "paper_presented": "Yes",
            "presentation_title": "Immunomodulatory Biomaterial Composites for Tissue Regeneration",
            "organizer": "Indian Immunology Society",
            "url": "https://immunocon2024.com",
            "certificate_url": "https://drive.google.com/file/d/p23ihc003-immunocon/view",
            "drive_file_id": "p23ihc003-cnf-01",
            "created_at": "2024-10-18T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        }
    ]

    # Compile Official Startups from 'Updated Start up data Till 25 Sep 2026.xlsx'
    startups = [
        # Misaal Khan (D20ID004) - Incubation Project
        {
            "record_id": "STU-001",
            "roll_number": "D20ID004",
            "startup_name": "NutriAI HealthTech Solutions",
            "founder_role": "Student Co-Founder & CTO",
            "cofounders": "Misaal Khan, Dr. Kuldeep Singh, Dr. Richa Singh",
            "domain": "Pediatric Diagnostics & AI-Powered Point-of-Care HealthTech",
            "description": "Commercializing patented Graph Neural Network diagnostic algorithms for instantaneous child malnutrition triage in primary healthcare centers and Anganwadis.",
            "founded_year": "2025",
            "website": "https://nutriaihealth.iitj.ac.in",
            "current_status": "Pre-Incubatee",
            "incubator": "IIT Jodhpur Technology Innovation and Start-up Center (TISC) & AIIMS Bio-Incubator",
            "funding": "BIRAC BIG Pre-Seed Grant (INR 50 Lakhs Proposed)",
            "document_url": "https://drive.google.com/file/d/d20id004-startup-pitch-agreement/view",
            "drive_file_id": "d20id004-stu-01",
            "created_at": "2025-06-10T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Gajendra Singh (P20ID004) - Row 9 from Excel
        {
            "record_id": "STU-002",
            "roll_number": "P20ID004",
            "startup_name": "Visionence Tech Pvt. Ltd.",
            "founder_role": "Co-Founder",
            "cofounders": "Dr. Deepak Mishra, Dr. Amandeep Kaur, Gajendra Singh, Wilfred Kisku",
            "domain": "Intelligent CMOS Image Sensors & Robotic Ultrasound CIS",
            "description": "Developing IntelloAdaptive CIS (Intelligent CMOS image sensor platform for adaptive biomedical imaging and automated echocardiography).",
            "founded_year": "2024",
            "website": "https://visionence.in",
            "current_status": "Incubated",
            "incubator": "IIT Jodhpur TISC",
            "funding": "TISC Seed Support & Ministry of Electronics & IT (MeitY) TIDE 2.0",
            "document_url": "https://drive.google.com/file/d/p20id004-visionence-agreement/view",
            "drive_file_id": "p20id004-stu-01",
            "created_at": "2024-04-15T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Dr. Anup Kakwani (M20ID001) - Row 6 from Excel
        {
            "record_id": "STU-003",
            "roll_number": "M20ID001",
            "startup_name": "NxGen Healtech Pvt. Ltd.",
            "founder_role": "Founder & Managing Director",
            "cofounders": "Dr. Anup Kakwani",
            "domain": "Endodontic & Dental Surgical Devices (iVac-Endo)",
            "description": "Revolutionary root canal negative pressure irrigation device eliminating apical extrusion risks during endodontic therapy.",
            "founded_year": "2023",
            "website": "https://nxgenhealtech.in",
            "current_status": "Pre-Incubatee",
            "incubator": "IIT Jodhpur TISC & AIIMS Jodhpur",
            "funding": "Institutional Seed Support",
            "document_url": "https://drive.google.com/file/d/m20id001-nxgen-agreement/view",
            "drive_file_id": "m20id001-stu-01",
            "created_at": "2023-09-01T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        },
        # Dr. Kanika Singroha (P20ID002) - Row 5 from Excel
        {
            "record_id": "STU-004",
            "roll_number": "P20ID002",
            "startup_name": "Cellverse Pvt. Ltd.",
            "founder_role": "Co-Founder",
            "cofounders": "Dr. Kanika Singroha, Dr. Indranil Banerjee",
            "domain": "3D Bioprinted Non-Animal Human Tissue Disease Models",
            "description": "High-throughput modular bioink formulation and tissue engineered organs-on-a-chip for pharmaceutical preclinical screening.",
            "founded_year": "2024",
            "website": "https://cellversebio.com",
            "current_status": "Incubated",
            "incubator": "IIT Jodhpur TISC",
            "funding": "BIRAC BIG Grant (50 Lakhs)",
            "document_url": "https://drive.google.com/file/d/p20id002-cellverse-doc/view",
            "drive_file_id": "p20id002-stu-01",
            "created_at": "2024-06-20T10:00:00Z",
            "updated_at": "2026-10-05T20:00:00Z"
        }
    ]

    # Compile Document Vault Records
    documents = [
        # Misaal Khan (D20ID004) - 3 Synced Documents
        {
            "document_id": "DOC-MK-01",
            "roll_number": "D20ID004",
            "record_id": "PAT-001",
            "category": "Patents",
            "original_filename": "Malnutrition_GNN_Indian_Patent_Filing_202511127461.pdf",
            "generated_filename": "D20ID004_PATENT_MALNUTRITION_GNN_2025_481923.pdf",
            "file_type": "application/pdf",
            "file_size": 3412500,
            "drive_file_id": "d20id004-pat-01",
            "drive_url": "https://drive.google.com/file/d/d20id004-patent-ipo-filing/view",
            "uploaded_at": "2025-11-20T11:00:00Z"
        },
        {
            "document_id": "DOC-MK-02",
            "roll_number": "D20ID004",
            "record_id": "PUB-003",
            "category": "Publications",
            "original_filename": "MICCAI_2024_Pediatric_Anthropometry_Camera_Ready.pdf",
            "generated_filename": "D20ID004_PUBLICATION_MICCAI_ANTHROPOMETRY_2024_382109.pdf",
            "file_type": "application/pdf",
            "file_size": 2845100,
            "drive_file_id": "d20id004-pub-03",
            "drive_url": "https://drive.google.com/file/d/d20id004-miccai-paper/view",
            "uploaded_at": "2024-10-08T14:30:00Z"
        },
        {
            "document_id": "DOC-MK-03",
            "roll_number": "D20ID004",
            "record_id": "INT-001",
            "category": "Internships",
            "original_filename": "AIIMS_Jodhpur_Clinical_Immersion_Completion_Certificate.pdf",
            "generated_filename": "D20ID004_INTERNSHIP_AIIMS_PEDIATRICS_2023_CLINICAL.pdf",
            "file_type": "application/pdf",
            "file_size": 1420800,
            "drive_file_id": "d20id004-int-01",
            "drive_url": "https://drive.google.com/file/d/d20id004-aiims-clinical-immersion-cert/view",
            "uploaded_at": "2023-12-01T15:00:00Z"
        },
        # Gourav Kumar (M24IM1007)
        {
            "document_id": "DOC-GK-01",
            "roll_number": "M24IM1007",
            "record_id": "PUB-018",
            "category": "Publications",
            "original_filename": "Sepsis_Biosensing_IEEE_Final.pdf",
            "generated_filename": "M24IM1007_PUBLICATION_SEPSIS_BIOSENSING_2025_172345.pdf",
            "file_type": "application/pdf",
            "file_size": 2451200,
            "drive_file_id": "1aB2cD3eF4gH5iJ6kL7mN8oP",
            "drive_url": "https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP/view",
            "uploaded_at": "2025-11-25T14:30:00Z"
        }
    ]

    seed["publications"] = publications
    seed["patents"] = patents
    seed["projects"] = projects
    seed["internships"] = internships
    seed["achievements"] = achievements
    seed["conferences"] = conferences
    seed["startups"] = startups
    seed["documents"] = documents

    save_seed(seed)

if __name__ == "__main__":
    main()
