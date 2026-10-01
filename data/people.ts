import type { Person } from "@/lib/types";

// Source: https://www.iitj.ac.in/People?dept=Medical-Technologies (retrieved 25 Sep 2026).
// Emails are published on the source page in obfuscated form ([at]/[dot]).
const SRC = "https://www.iitj.ac.in/People?dept=Medical-Technologies";
const IMG = "https://www.iitj.ac.in/PageImages/Peoples/";

type Row = [
  id: string,
  name: string,
  designation: string,
  email: string,
  phone: string | undefined,
  photo: string | undefined,
  education: string | undefined,
  interests: string[],
  department?: string,
];

function build(category: Person["category"], rows: Row[]): Person[] {
  return rows.map(([id, name, designation, email, phone, photo, education, interests, department]) => ({
    id,
    slug: id,
    status: "published",
    provenance: "verified",
    sourceUrl: SRC,
    name,
    designation,
    category,
    institution: "IIT Jodhpur",
    department,
    email,
    phone,
    photo: photo ? { src: IMG + photo, alt: `Portrait of ${name}` } : undefined,
    education,
    researchInterests: interests,
  }));
}

// Coordinator of the Centre for Digital Health — source: https://www.iitj.ac.in/cdh/en/contact
const cdhCoordinator: Person = {
  id: "cdh-coordinator",
  slug: "indranil-banerjee",
  status: "published",
  provenance: "verified",
  sourceUrl: "https://www.iitj.ac.in/cdh/en/contact",
  name: "Indranil Banerjee",
  designation: "Coordinator, Centre for Digital Health",
  category: "Leadership",
  institution: "IIT Jodhpur",
  email: "coordinator_cdh@iitj.ac.in",
  phone: "0291 280 1214",
  photo: { src: "/images/people/indranil-banerjee.jpg", alt: "Portrait of Indranil Banerjee" },
  researchInterests: [],
};

export const leadership: Person[] = [...build("Leadership", [
  [
    "head",
    "Raviraj Vankayala",
    "Head, Medical Technology Centre",
    "head_medtechcentre@iitj.ac.in",
    "0291 280 1110",
    "09-2026/Raviraj-Vankayla-639238779450517846.jpg",
    "PhD, National Tsing Hua University",
    ["Nanobiotechnology", "Biomaterials", "Drug Delivery", "Theranostics", "Photomedicine"],
    "Bioscience & Bioengineering",
  ],
]), cdhCoordinator];

// Approved affiliated faculty only (Centre list). Order matches that list.
export const faculty: Person[] = build("Faculty", [
  ["akshay-moudgil", "Akshay Moudgil", "Assistant Professor", "akshaymoudgil@iitj.ac.in", "0291 280 1383", "04-2025/Akshay-Moudgil-638808591688624709.jpg", "PhD, IIT Delhi", ["Nano/Microelectronics", "Hybrid Sensors", "Bioelectronics", "Flexible & Printed Electronics"], "Electronics Engineering"],
  ["alok-ranjan", "Alok Ranjan", "Associate Professor", "alok@iitj.ac.in", "0291 280 1414", "03-2026/Alok-Ranjan-639081481912859939.jpg", "PhD, Tata Institute of Social Sciences", ["Public Health", "Universal Health Coverage", "Health Systems", "Health Economics", "Health Equity", "Elderly Health", "Non-Communicable Diseases", "Disability & Rehabilitation"], "School of Liberal Arts"],
  ["ankur-gupta", "Ankur Gupta", "Associate Professor", "ankurgupta@iitj.ac.in", "0291 280 1517", "03-2026/Ankur-Gupta-639081484171634244.jpg", "PhD, IIT Kanpur", ["Microsystems Fabrication"], "Mechanical Engineering"],
  ["bhivraj-suthar", "Bhivraj Suthar", "Assistant Professor", "bhivraj@iitj.ac.in", "0291 280 1764", "04-2025/Dr-Bhivraj-Suthar-638808590445710219.png", "PhD, KOREATECH, South Korea", ["Bionic Prosthetics", "Assistive Robotics", "Rehabilitation Robotics", "Robotic Therapy Systems", "Human–Robot Interaction", "Healthcare Robotics"], "Electrical Engineering"],
  ["hardik-kothadia", "Hardik Kothadia", "Associate Professor", "hardikkothadia@iitj.ac.in", "0291 280 1512", "03-2026/Hardik-Kothadia-639081496335022772.jpg", "PhD, IIT Bombay", ["Multiphase Flow", "Heat Transfer", "Fluid Mechanics"], "Mechanical Engineering"],
  ["mrityunjay-doddamani", "Mrityunjay R. Doddamani", "Associate Professor", "mrityunjay@iitj.ac.in", "0291 280 1533", "03-2026/Mrityunjay-Doddamani-639081487782697158.jpg", "PhD, NITK Surathkal", ["Additive Manufacturing", "Composites", "Foams", "Secured Manufacturing"], "Mechanical Engineering"],
  ["nishant-kumar", "Nishant Kumar", "Associate Professor", "nishantkumar@iitj.ac.in", "0291 280 1382", "03-2026/Nishant-Kumar--639081495232231106.png", "PhD, IIT Delhi", ["Power Electronics", "Advanced Control", "Power System Optimisation"], "Electrical Engineering"],
  ["raviraj-vankayala", "Raviraj Vankayala", "Associate Professor", "rvankayala@iitj.ac.in", "0291 280 1215", "11-2025/Raviraj-Vankayala-638996652338908134.jpg", "PhD, National Tsing Hua University", ["Nanobiotechnology", "Biomaterials", "Drug Delivery", "Theranostics", "Photomedicine"], "Bioscience & Bioengineering"],
  ["saakshi-dhanekar", "Saakshi Dhanekar", "Associate Professor", "saakshi@iitj.ac.in", "0291 280 1373", "11-2025/Saakshi-Dhanekar-638996654495221869.jpg", "PhD, Jamia Millia Islamia", ["Medical Diagnostics", "Healthcare Devices", "Gas and Bio Sensors", "MEMS"], "Electronics Engineering"],
  ["shrutidhara-sarma", "Shrutidhara Sarma", "Associate Professor", "shrutidhara@iitj.ac.in", "0291 280 1515", "03-2026/Shrutidhara-Sarma-639081485525805087.jpg", "PhD, IIT Guwahati", ["Smart Respiration Systems", "Flexible and Stretchable Sensors", "Portable Assistive Devices", "Self-powered Sensors", "Electrospun Nanofibres"], "Mechanical Engineering"],
  ["sumit-kalra", "Sumit Kalra", "Associate Professor", "sumitk@iitj.ac.in", "0291 280 1259", "04-2025/Sumit-Kalra-638808594295262656.jpeg", "PhD, IIT Kanpur", ["Software System Design", "Internet of Things"], "Computer Science & Engineering"],
  ["ajay-agarwal", "Ajay Agarwal", "Professor", "ajayagarwal@iitj.ac.in", "0291 280 1378", "03-2026/Ajay-Agarwal-639081493814332828.jpg", "PhD, BITS Pilani", ["Microelectronics", "Micro- and Nano-technologies", "Sensors", "Microfluidics", "Point-of-care devices", "Early diagnostics"], "Electronics Engineering"],
  ["anil-kumar-tiwari", "Anil Kumar Tiwari", "Professor", "akt@iitj.ac.in", "0291 280 1353", "03-2026/Anil-Kumar-Tiwari--639081492377075141.jpg", "PhD, IIT Kharagpur", ["Image Processing", "Video Processing", "Biomedical Signal Processing"], "Electrical Engineering"],
  ["sushmita-jha", "Sushmita Jha", "Professor", "sushmitajha@iitj.ac.in", "0291 280 1204", "03-2026/Sushmita-Jha-639081499518398970.jpg", "PhD, University of North Carolina at Chapel Hill, USA", ["Cell and Molecular Physiology", "Immunology", "Neuroscience"], "Bioscience & Bioengineering"],
]);

export const visitingFaculty: Person[] = [];

export const staff: Person[] = build("Staff", [
  ["rakesh-kumar-saini", "Rakesh Kumar Saini", "Junior Technical Superintendent", "rakeshsaini@iitj.ac.in", "0291 280 1044", "11-2025/Rakesh-Kumar-Saini-638981307981388755.jpg", "PhD (Engineering Sciences), AcSIR", []],
  ["ram-raj-goliya", "Ram Raj Goliya", "Junior Assistant", "ramrajgoliya@iitj.ac.in", undefined, "03-2025/Ram-Raj-Goliya-638766955281840834.jpg", undefined, []],
]);

// TODO(content): AIIMS Jodhpur clinical faculty associated with the programme are not
// listed on the IIT Jodhpur page. Add them here with `institution: "AIIMS Jodhpur"`.
export const people: Person[] = [...leadership, ...faculty, ...visitingFaculty, ...staff];
