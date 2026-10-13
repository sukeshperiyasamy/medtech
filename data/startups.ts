import type { Startup, TRL } from "@/lib/types";

// Official MedTech Startups & Incubated Ventures — IIT Jodhpur & AIIMS Jodhpur
// Source: Centre for Medical Technologies Master Records & TISC Incubation Agreements (Sep 2026).
const TISC = "https://www.iitj.ac.in/tisc";

export const startups: Startup[] = [
  {
    id: "novealthy-innovations",
    slug: "novealthy-innovations",
    status: "published",
    provenance: "verified",
    sourceUrl: TISC,
    name: "Novealthy Innovations Pvt. Ltd.",
    tagline: "Pathology at Home Diagnostic Kit",
    incubationStage: "Incubated",
    agreementDate: "2022-06-13",
    foundedYear: 2022,
    domainSpotlight: "Digital Health & Diagnostics",
    researchAreaId: "sensors-diagnostics",
    studentLead: "Dr. Sumit Kalra (Faculty-Led Venture)",
    facultyInvolved: "Dr. Sumit Kalra",
    facultyPosition: "Director",
    description:
      "Comprehensive remote home-diagnostics kit and IoT health-monitoring infrastructure for distributed patient care, bringing rapid clinical pathology to the patient's doorstep.",
    clinicalProblem:
      "Conventional clinical laboratory pathology requires in-person clinic visits and long turnaround times, creating major barriers for chronic, elderly, and rural patients needing frequent diagnostic testing.",
    product: {
      name: "Pathology at Home Diagnostic Kit",
      description:
        "Portable, connected diagnostic kit enabling clinical sample processing and digital telemetry directly from residential and point-of-care settings.",
    },
    trl: 7,
    trlEvidence:
      "Pilot deployment and remote telemetry validated under IIT Jodhpur health-tech incubation.",
    founders: [
      {
        name: "Dr. Sumit Kalra",
        role: "Founder & Director",
        affiliation: "Associate Professor, CSE, IIT Jodhpur",
      },
    ],
    mentorIds: ["sumit-kalra"],
    incubator: "IIT Jodhpur TISC / Incubation Centre",
    funding: [
      {
        source: "IIT Jodhpur Incubation Programme",
        programme: "Incubation Agreement (13/06/2022)",
        kind: "Incubation",
        year: 2022,
      },
    ],
    associatedPatents: [],
  },
  {
    id: "healyantra-medical-technologies",
    slug: "healyantra-medical-technologies",
    status: "published",
    provenance: "verified",
    sourceUrl: TISC,
    name: "Healyantra Medical Technologies Pvt. Ltd.",
    tagline: "Single Operator Single Hand Syringe for Ultrasound Guided Procedures",
    incubationStage: "Incubated",
    agreementDate: "2024-03-23",
    foundedYear: 2024,
    domainSpotlight: "Interventional Radiology & Surgery",
    researchAreaId: "rehab-robotics",
    studentLead: "Mr. Divesh Kumar Awasthi & Dr. Varun Khandelwal",
    facultyInvolved: "Dr. Hardik Kothadia",
    facultyPosition: "Director",
    description:
      "Ergonomically engineered single-handed precision syringe allowing solo clinicians to simultaneously aspirate and inject during real-time ultrasound scanning without requiring assistance.",
    clinicalProblem:
      "Standard ultrasound-guided fine-needle aspirations and injections require two operators or clumsy multi-handed maneuvers, compromising needle precision, sterility, and procedural safety.",
    product: {
      name: "Single Operator Single Hand Syringe",
      description:
        "Precision mechanical syringe uncoupling aspiration and injection from probe stabilization, enabling millimeter-precise solo needle guidance.",
    },
    trl: 6,
    trlEvidence:
      "Clinically demonstrated in procedural simulation environments and interventional phantom models with AIIMS Jodhpur teams.",
    founders: [
      {
        name: "Mr. Divesh Kumar Awasthi",
        role: "Co-Founder & Scholar Lead",
        affiliation: "Research Scholar, IIT Jodhpur",
      },
      {
        name: "Dr. Varun Khandelwal",
        role: "Co-Founder & Clinical Lead",
        affiliation: "AIIMS Jodhpur",
      },
      {
        name: "Dr. Hardik Kothadia",
        role: "Founder & Director",
        affiliation: "Associate Professor, Mechanical Engineering, IIT Jodhpur",
      },
    ],
    mentorIds: ["hardik-kothadia"],
    incubator: "IIT Jodhpur TISC / Incubation Centre",
    funding: [
      {
        source: "TechEx Technology Transfer Hub",
        programme: "Commercialization & Prototyping Grant (DST / BIRAC)",
        kind: "Grant",
        year: 2022,
        grantId: "techex-transfer-hub",
      },
      {
        source: "MEDHA 2022 Hackathon",
        programme: "Medical Device Hackathon Top Winner",
        kind: "Prize",
        year: 2022,
      },
      {
        source: "IIT Jodhpur TISC Incubation Programme",
        programme: "Incubation Agreement (23/03/2024)",
        kind: "Incubation",
        year: 2024,
      },
    ],
    associatedPatents: [],
  },
  {
    id: "caldor-health-technologies",
    slug: "caldor-health-technologies",
    status: "published",
    provenance: "verified",
    sourceUrl: TISC,
    name: "Caldor Health Technologies Pvt. Ltd.",
    tagline: "Electromechanical Reshaping (Cartilage Reshaping Device)",
    incubationStage: "Pre-Incubatee",
    agreementDate: "2024-01-16",
    foundedYear: 2024,
    domainSpotlight: "ENT & Tissue Remodelling",
    researchAreaId: "manufacturing-design",
    studentLead: "Mr. Thilak Chakravarthy & Mr. Harisharan Ramesh",
    facultyInvolved: "Dr. Ajay Agarwal",
    facultyPosition: "Mentor",
    description:
      "Non-thermal electromechanical tissue remodelling platform for minimally invasive reconstructive rhinoplasty and ENT surgery, reshaping cartilaginous structures through controlled electrochemical modification.",
    clinicalProblem:
      "Traditional reconstructive septoplasty and rhinoplasty require invasive open incisions, surgical excision, and prolonged splinting, with risks of cartilage necrosis and long recovery periods.",
    product: {
      name: "Cartilage Reshaping Device (Patent App 202411033887)",
      description:
        "Precision electrode probe delivering controlled micro-currents to reshape cartilage in situ without thermal tissue necrosis.",
    },
    trl: 5,
    trlEvidence:
      "Validated on ex-vivo cartilage tissue models; patent filed under Application No. 202411033887.",
    founders: [
      {
        name: "Mr. Thilak Chakravarthy",
        role: "Co-Founder & Scholar Lead",
        affiliation: "IIT Jodhpur",
      },
      {
        name: "Mr. Harisharan Ramesh",
        role: "Co-Founder & Research Scholar",
        affiliation: "IIT Jodhpur",
      },
      {
        name: "Dr. Ajay Agarwal",
        role: "Mentor & Co-Founder",
        affiliation: "Professor, Electronics Engineering, IIT Jodhpur",
      },
    ],
    mentorIds: ["ajay-agarwal"],
    incubator: "IIT Jodhpur Incubation Centre",
    associatedPatents: ["Patent App 202411033887"],
    funding: [
      {
        source: "SWASAM Healthcare Syndicate",
        programme: "Seed Investment for Clinical Cartilage Reshaping Prototyping",
        kind: "Seed investment",
        amount: "US$ 100,000",
        year: 2024,
        grantId: "swasam-seed-capital",
      },
      {
        source: "Ministry of MSME, Govt. of India",
        programme: "MSME Idea Hackathon 4.0 Seed Grant",
        kind: "Grant",
        amount: "₹15 Lakhs",
        year: 2024,
        grantId: "msme-hackathon-cartilage",
      },
      {
        source: "IIT Jodhpur Pre-Incubation Programme",
        programme: "Pre-Incubation Agreement (16/01/2024)",
        kind: "Incubation",
        year: 2024,
      },
    ],
  },
  {
    id: "medvocare",
    slug: "medvocare",
    status: "published",
    provenance: "verified",
    sourceUrl: TISC,
    name: "Medvocare Pvt. Ltd.",
    tagline: "Endotracheal Tube with Oral Irrigator & Multichannel Infusion Delivery",
    incubationStage: "Incubated",
    agreementDate: "2024-08-01",
    foundedYear: 2024,
    domainSpotlight: "Critical Care, ICU & Drug Delivery",
    researchAreaId: "manufacturing-design",
    studentLead: "Dr. Ramkishore Jangid (PhD Scholar, IDRP)",
    facultyInvolved: "Dr. Shobhana Singh",
    facultyPosition: "Director",
    description:
      "Smart endotracheal medical device with built-in continuous oral irrigation and multichannel infusion delivery reducing ventilator-associated pneumonia (VAP) in ICU patients.",
    clinicalProblem:
      "Ventilator-associated pneumonia (VAP) is among the deadliest ICU hospital-acquired infections, primarily caused by micro-aspiration of unevacuated secretions pooling above standard endotracheal cuffs.",
    product: {
      name: "Anti-VAP Endotracheal Irrigation Tube",
      description:
        "Specialized endotracheal airway tube with integrated dual micro-channels for saline irrigation and automated suction above the tracheal cuff.",
    },
    trl: 6,
    trlEvidence:
      "Dual patent-backed technology (Apps 202211060577 & 202511108503); prototype verified across clinical ICU simulation protocols.",
    founders: [
      {
        name: "Dr. Ramkishore Jangid",
        role: "Founder & Scholar Lead",
        affiliation: "PhD Scholar, Joint IDRP MedTech, IIT Jodhpur",
      },
      {
        name: "Dr. Shobhana Singh",
        role: "Founder & Director",
        affiliation: "Assistant Professor, Mechanical Engineering, IIT Jodhpur",
      },
    ],
    mentorIds: [],
    incubator: "IIT Jodhpur TISC / Incubation Centre",
    associatedPatents: ["Patent App 202211060577", "Patent App 202511108503"],
    funding: [
      {
        source: "IIT Jodhpur Incubation Programme",
        programme: "Incubation Agreement (01/08/2024)",
        kind: "Incubation",
        year: 2024,
      },
    ],
  },
  {
    id: "cellverse",
    slug: "cellverse",
    status: "published",
    provenance: "verified",
    sourceUrl: TISC,
    name: "Cellverse Pvt. Ltd.",
    tagline: "3D Bioprinted Non-Animal Disease Models & Modular Bioink Platforms",
    incubationStage: "Incubated",
    agreementDate: "2023-04-05",
    foundedYear: 2023,
    domainSpotlight: "3D Bioprinting & Drug Discovery",
    researchAreaId: "nanomedicine-biomaterials",
    studentLead: "Dr. Kanika Singroha (PhD Scholar, MedTech)",
    facultyInvolved: "Dr. Indranil Banerjee",
    facultyPosition: "Director",
    description:
      "Engineered 3D bioprinted humanized tissue and organoid test systems utilizing proprietary modular bioinks, replacing animal testing for pharmaceutical toxicological evaluation and drug screening.",
    clinicalProblem:
      "Conventional 2D cell cultures fail to model native human micro-architecture, while cross-species physiological differences result in massive clinical trial attrition for preclinical animal models.",
    product: {
      name: "Quadruple Modular Bioink & 3D Tissue Systems",
      description:
        "Tunable cross-linking bioink formulation supporting primary human cell viability, mechanical integrity, and high-fidelity bioprinted tissue architecture.",
    },
    trl: 6,
    trlEvidence:
      "Modular bioinks demonstrated in functional 3D cell culture and drug testing assays; patent filed (Apps 202511037139 & 202511037986).",
    founders: [
      {
        name: "Dr. Kanika Singroha",
        role: "Co-Founder & Scholar Lead",
        affiliation: "PhD Scholar, Medical Technologies, IIT Jodhpur",
      },
      {
        name: "Dr. Indranil Banerjee",
        role: "Founder & Director",
        affiliation: "Coordinator CDH & Associate Professor, BSBE, IIT Jodhpur",
      },
    ],
    mentorIds: ["cdh-coordinator"],
    incubator: "IIT Jodhpur TISC / Incubation Centre",
    associatedPatents: ["Patent App 202511037139", "Patent App 202511037986"],
    funding: [
      {
        source: "IIT Jodhpur Incubation Programme",
        programme: "Incubation Agreement (05/04/2023)",
        kind: "Incubation",
        year: 2023,
      },
    ],
  },
  {
    id: "nxgen-healtech",
    slug: "nxgen-healtech",
    status: "published",
    provenance: "verified",
    sourceUrl: TISC,
    name: "NxGen Healtech Pvt. Ltd.",
    tagline: "iVac-Endo (Apical Negative Pressure Root Canal Irrigation System)",
    incubationStage: "Pre-Incubatee",
    agreementDate: "2023-09-15",
    foundedYear: 2023,
    domainSpotlight: "Dental Endodontics & Devices",
    researchAreaId: "manufacturing-design",
    studentLead: "Dr. Anup Kakwani (Masters MMT Alumnus)",
    facultyInvolved: "Mentored via AIIMS-IIT Joint Program (Prof. Pravin Kumar & Dr. Jaiveer Singh)",
    facultyPosition: "Lead Innovator",
    description:
      "Automated apical negative pressure irrigation instrument eliminating procedural chemical extrusion risks during root canal therapy, ensuring thorough bacterial debridement with complete apical safety.",
    clinicalProblem:
      "Standard positive pressure dental syringes frequently force dangerous cytotoxic irrigants (sodium hypochlorite) past the root tip into jawbone and soft tissues, risking acute chemical burns.",
    product: {
      name: "iVac-Endo Apical Negative Pressure System",
      description:
        "Cost-effective micro-cannula endodontic handpiece delivering continuous negative pressure irrigation and fluid evacuation at the root apex.",
    },
    trl: 5,
    trlEvidence:
      "Patent filed (Application No. 202211041593); validated through joint endodontic clinical protocols at AIIMS Jodhpur.",
    founders: [
      {
        name: "Dr. Anup Kakwani",
        role: "Founder & Lead Innovator",
        affiliation: "M.Tech in Medical Technologies (MMT Alumnus), Joint AIIMS-IIT Program",
      },
    ],
    mentorIds: [],
    incubator: "IIT Jodhpur Incubation Centre",
    associatedPatents: ["Patent App 202211041593"],
    funding: [
      {
        source: "IIT Jodhpur Pre-Incubation Programme",
        programme: "Pre-Incubation Agreement (15/09/2023)",
        kind: "Incubation",
        year: 2023,
      },
    ],
  },
  {
    id: "oncosphera",
    slug: "oncosphera",
    status: "published",
    provenance: "verified",
    sourceUrl: TISC,
    name: "Oncosphera Pvt. Ltd.",
    tagline: "Patient-Derived 3D Organoid Platform Integrated with AI/ML Genomics",
    incubationStage: "Incubated",
    agreementDate: "2023-12-12",
    foundedYear: 2023,
    domainSpotlight: "Precision Oncology & AI Therapeutics",
    researchAreaId: "nanomedicine-biomaterials",
    studentLead: "Dr. Vishakha Pareek",
    facultyInvolved: "Dr. Siddharth Srivatsava, Dr. Sushmita Jha",
    facultyPosition: "Director",
    description:
      "Integrates 3D patient-derived tumor organoid technology with genomics and AI/ML algorithms to suggest the most efficacious cancer therapy for each specific patient and enable novel drug discovery.",
    clinicalProblem:
      "High clinical failure rates in empirical cancer chemotherapy regimens due to inter-patient tumor heterogeneity, leading to severe toxic side-effects and critical delays in effective therapy.",
    product: {
      name: "Oncosphera Precision Oncology Profiling Platform",
      description:
        "Automated ex-vivo tumor micro-tissue culture coupled with deep learning algorithms matching tumor genetic signatures to personalized drug sensitivities.",
    },
    trl: 5,
    trlEvidence:
      "Tumor organoids successfully cultured from patient biopsies and validated in experimental chemo-profiling assays at IIT Jodhpur.",
    founders: [
      {
        name: "Dr. Vishakha Pareek",
        role: "Co-Founder & Research Lead",
        affiliation: "Postdoctoral Fellow / Scholar, BSBE, IIT Jodhpur",
      },
      {
        name: "Dr. Siddharth Srivatsava",
        role: "Founder & Director",
        affiliation: "IIT Jodhpur",
      },
      {
        name: "Dr. Sushmita Jha",
        role: "Founder & Director",
        affiliation: "Professor, BSBE, IIT Jodhpur",
      },
    ],
    mentorIds: ["sushmita-jha"],
    incubator: "IIT Jodhpur TISC / Incubation Centre",
    funding: [
      {
        source: "IIT Jodhpur Incubation Programme",
        programme: "Incubation Agreement (12/12/2023)",
        kind: "Incubation",
        year: 2023,
      },
    ],
    associatedPatents: [],
  },
  {
    id: "sarbit-innovations",
    slug: "sarbit-innovations",
    status: "published",
    provenance: "verified",
    sourceUrl: TISC,
    name: "Sarbit Innovations Pvt. Ltd.",
    tagline: "Kavak Sensorium (Wearable Bedside Sepsis Diagnostic Sensor)",
    incubationStage: "Incubated",
    agreementDate: "2023-09-10",
    foundedYear: 2023,
    domainSpotlight: "Wearable Diagnostics & Sepsis Sensors",
    researchAreaId: "sensors-diagnostics",
    studentLead: "Mr. Sambit Kumar Keshi & Mr. Sarvar Singh",
    facultyInvolved: "Dr. Ajay Agarwal",
    facultyPosition: "Director",
    description:
      "Rapid response micro-sensor array delivering automated continuous monitoring of physiological sepsis markers directly at patient bedside, catching systemic inflammatory response syndrome (SIRS) hours before septic shock.",
    clinicalProblem:
      "Sepsis mortality increases by 8% with every single hour of delayed antibiotic treatment, yet standard microbial blood cultures require 24 to 48 hours for definitive diagnosis.",
    product: {
      name: "Kavak Sensorium (Patent App 202511061615)",
      description:
        "Wearable bio-sensing array and edge readout monitor detecting trace sepsis biomarkers with real-time algorithmic alert triggers.",
    },
    trl: 5,
    trlEvidence:
      "Patent application filed (App No. 202511061615); micro-sensor functional sensitivity tested in microfluidic testbeds.",
    founders: [
      {
        name: "Mr. Sambit Kumar Keshi",
        role: "Co-Founder & Scholar Lead",
        affiliation: "IIT Jodhpur",
      },
      {
        name: "Mr. Sarvar Singh",
        role: "Co-Founder & Hardware Lead",
        affiliation: "IIT Jodhpur",
      },
      {
        name: "Dr. Ajay Agarwal",
        role: "Founder & Director",
        affiliation: "Professor, Electronics Engineering, IIT Jodhpur",
      },
    ],
    mentorIds: ["ajay-agarwal"],
    incubator: "IIT Jodhpur TISC / Incubation Centre",
    associatedPatents: ["Patent App 202511061615"],
    funding: [
      {
        source: "Ministry of MSME, Govt. of India",
        programme: "MSME Idea Hackathon 4.0 Seed Grant for Sepsis Detection",
        kind: "Grant",
        amount: "₹15 Lakhs",
        year: 2024,
        grantId: "msme-hackathon-sepsis",
      },
      {
        source: "Arohan 5.0 Seed Support Scheme",
        programme: "TISC / BioNEST Seed Fund for Sepsis Screening",
        kind: "Seed investment",
        year: 2023,
        grantId: "arohan-seed-sepsis",
      },
      {
        source: "IIT Jodhpur Incubation Programme",
        programme: "Incubation Agreement (10/09/2023)",
        kind: "Incubation",
        year: 2023,
      },
    ],
  },
  {
    id: "visionence-tech",
    slug: "visionence-tech",
    status: "published",
    provenance: "verified",
    sourceUrl: TISC,
    name: "Visionence Tech Pvt. Ltd.",
    tagline: "IntelloAdaptive CIS (Intelligent CMOS Image Sensors for Edge Computation)",
    incubationStage: "Incubated",
    agreementDate: "2024-02-02",
    foundedYear: 2024,
    domainSpotlight: "Edge AI Vision & Medical Imaging",
    researchAreaId: "imaging-ai",
    studentLead: "Gajendra Singh (PhD Scholar, IDRP) & Wilfred Kisku",
    facultyInvolved: "Dr. Deepak Mishra, Dr. Amandeep Kaur",
    facultyPosition: "Director",
    description:
      "Next-generation CMOS intelligent image sensors embedded with edge neural inference for medical computer vision, echocardiography, and robotic ultrasound probe guidance.",
    clinicalProblem:
      "Robotic echocardiography and mobile ultrasound require intense image data processing that causes latency, heavy bandwidth dependencies, and errors in cardiac probe positioning.",
    product: {
      name: "IntelloAdaptive CIS & Robot Echocardiography System",
      description:
        "Smart sensor hardware architecture performing near-sensor neural feature extraction for real-time cardiac boundary tracking and probe orientation.",
    },
    trl: 6,
    trlEvidence:
      "Triple patent portfolio (Apps 202211077085, 202411058458, 202511040403) and functional robotic echo validation.",
    founders: [
      {
        name: "Gajendra Singh",
        role: "Co-Founder & Scholar Lead",
        affiliation: "PhD Scholar, Joint IDRP MedTech, IIT Jodhpur",
      },
      {
        name: "Wilfred Kisku",
        role: "Co-Founder & Systems Lead",
        affiliation: "IIT Jodhpur",
      },
      {
        name: "Dr. Deepak Mishra",
        role: "Founder & Director",
        affiliation: "Assistant Professor, CSE, IIT Jodhpur",
      },
      {
        name: "Dr. Amandeep Kaur",
        role: "Founder & Director",
        affiliation: "IIT Jodhpur",
      },
    ],
    mentorIds: [],
    incubator: "IIT Jodhpur TISC / Incubation Centre",
    associatedPatents: [
      "Patent App 202211077085",
      "Patent App 202411058458",
      "Patent App 202511040403",
    ],
    funding: [
      {
        source: "IIT Jodhpur Incubation Programme",
        programme: "Incubation Agreement (02/02/2024)",
        kind: "Incubation",
        year: 2024,
      },
    ],
  },
  {
    id: "shilpinmed-technologies",
    slug: "shilpinmed-technologies",
    status: "published",
    provenance: "verified",
    sourceUrl: TISC,
    name: "ShilpinMed Technologies Pvt. Ltd.",
    tagline: "Mattress Based Hygiene Management System (Bed Sore Prevention)",
    incubationStage: "Pre-Incubatee",
    agreementDate: "2024-02-07",
    foundedYear: 2024,
    domainSpotlight: "Smart Hospital Furniture & Assistive Tech",
    researchAreaId: "rehab-robotics",
    studentLead: "Ajmal Jaleel & Ashifa A",
    facultyInvolved: "Dr. Jayant Kumar Mohanta",
    facultyPosition: "Mentor",
    description:
      "Smart sensor-actuated hospital mattress platform preventing decubitus ulcers and automating inpatient pressure redistribution, moisture evacuation, and hygiene monitoring.",
    clinicalProblem:
      "Hospitalized and bedridden patients rapidly develop severe pressure ulcers (bedsores), requiring intensive nursing labor and risking painful secondary infections.",
    product: {
      name: "Pressure Ulcers Preventing Mattress System (Patent App 202211060577)",
      description:
        "Automated pneumatic mattress with real-time pressure-map sensors and cycle-shifting air pockets preventing prolonged capillary occlusion.",
    },
    trl: 5,
    trlEvidence:
      "Patent application published (App No. 202211060577, Pub Date: 26/04/2024); pneumatic cell prototype tested with pressure sensor arrays.",
    founders: [
      {
        name: "Ajmal Jaleel",
        role: "Co-Founder & Scholar Lead",
        affiliation: "IIT Jodhpur",
      },
      {
        name: "Ashifa A",
        role: "Co-Founder & Design Lead",
        affiliation: "IIT Jodhpur",
      },
      {
        name: "Dr. Jayant Kumar Mohanta",
        role: "Mentor & Co-Founder",
        affiliation: "Assistant Professor, Mechanical Engineering, IIT Jodhpur",
      },
    ],
    mentorIds: [],
    incubator: "IIT Jodhpur Incubation Centre",
    associatedPatents: ["Patent App 202211060577"],
    funding: [
      {
        source: "IIT Jodhpur Pre-Incubation Programme",
        programme: "Pre-Incubation Agreement (07/02/2024)",
        kind: "Incubation",
        year: 2024,
      },
    ],
  },
];

/** Standard TRL scale, grouped into three phases for display. */
export const trlScale: { level: TRL; label: string; phase: "Research" | "Development" | "Deployment" }[] = [
  { level: 1, label: "Basic principles observed", phase: "Research" },
  { level: 2, label: "Technology concept formulated", phase: "Research" },
  { level: 3, label: "Proof of concept", phase: "Research" },
  { level: 4, label: "Validated in the lab", phase: "Development" },
  { level: 5, label: "Validated in a relevant environment", phase: "Development" },
  { level: 6, label: "Demonstrated in a relevant environment", phase: "Development" },
  { level: 7, label: "Demonstrated in an operational setting", phase: "Deployment" },
  { level: 8, label: "System complete and qualified", phase: "Deployment" },
  { level: 9, label: "Proven in operational use", phase: "Deployment" },
];
