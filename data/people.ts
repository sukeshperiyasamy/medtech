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
];

function build(category: Person["category"], rows: Row[]): Person[] {
  return rows.map(([id, name, designation, email, phone, photo, education, interests]) => ({
    id,
    slug: id,
    status: "published",
    provenance: "verified",
    sourceUrl: SRC,
    name,
    designation,
    category,
    institution: "IIT Jodhpur",
    email,
    phone,
    photo: photo ? { src: IMG + photo, alt: `Portrait of ${name}` } : undefined,
    education,
    researchInterests: interests,
  }));
}

export const leadership: Person[] = build("Leadership", [
  [
    "head",
    "Raviraj Vankayala",
    "Head, Medical Technology Center",
    "head_medtechcentre@iitj.ac.in",
    "0291 280 1110",
    "09-2026/Raviraj-Vankayla-639238779450517846.jpg",
    "PhD, National Tsing Hua University",
    ["Nanobiotechnology", "Biomaterials", "Drug Delivery", "Theranostics", "Photomedicine"],
  ],
]);

export const faculty: Person[] = build("Faculty", [
  ["ajay-agarwal", "Ajay Agarwal", "Professor", "ajayagarwal@iitj.ac.in", "0291 280 1378", "03-2026/Ajay-Agarwal-639081493814332828.jpg", "PhD, BITS Pilani", ["Microelectronics", "Micro- and Nano-technologies", "Sensors", "Microfluidics", "Point-of-care devices", "Early diagnostics"]],
  ["akshay-moudgil", "Akshay Moudgil", "Assistant Professor", "akshaymoudgil@iitj.ac.in", "0291 280 1383", "04-2025/Akshay-Moudgil-638808591688624709.jpg", "PhD, IIT Delhi", ["Nano/Microelectronics", "Hybrid Sensors", "Bioelectronics", "Flexible & Printed Electronics"]],
  ["alok-ranjan", "Alok Ranjan", "Associate Professor", "alok@iitj.ac.in", "0291 280 1414", "03-2026/Alok-Ranjan-639081481912859939.jpg", "PhD, Tata Institute of Social Sciences", ["Public Health", "Universal Health Coverage", "Health Systems", "Health Economics", "Health Equity", "Elderly Health", "Non-Communicable Diseases", "Disability & Rehabilitation"]],
  ["anil-kumar-tiwari", "Anil Kumar Tiwari", "Professor", "akt@iitj.ac.in", "0291 280 1353", "03-2026/Anil-Kumar-Tiwari--639081492377075141.jpg", "PhD, IIT Kharagpur", ["Image Processing", "Video Processing", "Biomedical Signal Processing"]],
  ["ankur-gupta", "Ankur Gupta", "Associate Professor", "ankurgupta@iitj.ac.in", "0291 280 1517", "03-2026/Ankur-Gupta-639081484171634244.jpg", "PhD, IIT Kanpur", ["Microsystems Fabrication"]],
  ["bhivraj-suthar", "Bhivraj Suthar", "Assistant Professor", "bhivraj@iitj.ac.in", "0291 280 1764", "04-2025/Dr-Bhivraj-Suthar-638808590445710219.png", "PhD, KOREATECH, South Korea", ["Bionic Prosthetics", "Assistive Robotics", "Rehabilitation Robotics", "Robotic Therapy Systems", "Human–Robot Interaction", "Healthcare Robotics"]],
  ["deepak-mishra", "Deepak Mishra", "Associate Professor", "dmishra@iitj.ac.in", "0291 280 1262", "04-2025/Deepak-Mishra-638808593370546516.jpeg", undefined, ["Medical Imaging", "Responsible AI", "Deep Learning"]],
  ["gaurav-vinod-vaidya", "Gaurav Vinod Vaidya", "Assistant Professor", "gauravvaidya@iitj.ac.in", "0291 280 1787", "04-2025/Gaurav-Vaidya-638808592537809400.jpeg", "PhD, Department of Design, IIT Guwahati", ["Industrial Design", "Product Form and Aesthetics", "Emotional Design", "Product Styling and Perception"]],
  ["hardik-kothadia", "Hardik Kothadia", "Associate Professor", "hardikkothadia@iitj.ac.in", "0291 280 1512", "03-2026/Hardik-Kothadia-639081496335022772.jpg", "PhD, IIT Bombay", ["Multiphase Flow", "Heat Transfer", "Fluid Mechanics"]],
  ["jaiveer-singh", "Jaiveer Singh", "Associate Professor", "jaiveer@iitj.ac.in", "0291 280 1521", "11-2025/Jaiveer-Singh-638996650258025704.jpg", "PhD, IIT Bombay", ["Microstructural Characterisation", "Mechanical Behaviour of Materials", "Alloy Design", "Additive Manufacturing", "Biomaterials"]],
  ["jayant-kumar-mohanta", "Jayant Kumar Mohanta", "Assistant Professor", "jayant@iitj.ac.in", "0291 280 1524", "03-2026/Jayant-Kumar-Mohanta-639081489140244358.png", "PhD, IIT Indore", ["Lower-limb Rehabilitation Robots", "Medical Robotics", "Planar Parallel Manipulators", "Mechanism Design"]],
  ["kaushal-a-desai", "Kaushal A Desai", "Professor", "kadesai@iitj.ac.in", "0291 280 1509", "04-2025/Kaushal-A-Desai-638808588357854967.jpg", "PhD, IIT Delhi", []],
  ["mohit-kumar-jangid", "Mohit Kumar Jangid", "Assistant Professor", "mjangid@iitj.ac.in", "0291 280 1271", "08-2026/Mohit-Kumar-Jangid-639229016642039743.jpg", "The Ohio State University, USA", ["Automated Formal Verification", "System Security and Privacy", "Trusted Execution Environments", "Cryptography"]],
  ["mrityunjay-doddamani", "Mrityunjay Doddamani", "Associate Professor", "mrityunjay@iitj.ac.in", "0291 280 1533", "03-2026/Mrityunjay-Doddamani-639081487782697158.jpg", "PhD, NITK Surathkal", ["Additive Manufacturing", "Composites", "Foams", "Secured Manufacturing"]],
  ["navchetan-awasthi", "Navchetan Awasthi", "Assistant Professor", "navchetanawasthi@iitj.ac.in", "0291 280 1768", "08-2026/Navchetan-Awasthi-639214589667018182.jpg", undefined, []],
  ["naveen-kumar-tailor", "Naveen Kumar Tailor", "Assistant Professor", "nktailor@iitj.ac.in", "0291 280 1643", "08-2026/Naveen-Kumar-Tailor-639214601215418968.jpeg", "PhD, IIT Roorkee", []],
  ["nishant-kumar", "Nishant Kumar", "Assistant Professor", "nishantkumar@iitj.ac.in", "0291 280 1382", "03-2026/Nishant-Kumar--639081495232231106.png", "PhD, IIT Delhi", ["Power Electronics", "Advanced Control", "Power System Optimisation"]],
  ["pratyaksh-karan", "Pratyaksh Karan", "Assistant Professor", "pratyakshkaran@iitj.ac.in", "0291 280 1537", "08-2026/Pratyaksh-Karan-639214603452217048.jpeg", "PhD, IIT Kharagpur", []],
  ["ram-prakash", "Ram Prakash", "Professor", "ramprakash@iitj.ac.in", "0291 280 1615", "03-2026/Ram-Prakash-639081490350115918.jpg", "PhD, Centre of Plasma Physics – Institute for Plasma Research", ["Plasma Science & Technology", "Low-temperature Plasma Applications"]],
  ["raviraj-vankayala", "Raviraj Vankayala", "Associate Professor", "rvankayala@iitj.ac.in", "0291 280 1215", "11-2025/Raviraj-Vankayala-638996652338908134.jpg", "PhD, National Tsing Hua University", ["Nanobiotechnology", "Biomaterials", "Drug Delivery", "Theranostics", "Photomedicine"]],
  ["riby-abraham-boby", "Riby Abraham Boby", "Assistant Professor", "riby@iitj.ac.in", "0291 280 1504", "08-2026/Riby-Abraham-Boby-639214604539991819.jpg", "PhD, IIT Delhi", []],
  ["rohan-d-erande", "Rohan D Erande", "Associate Professor", "rd.erande@iitj.ac.in", "0291 280 1312", "08-2026/Rohan-D-Erande-639214606054968578.jpg", "PhD, IIT Kanpur", []],
  ["saakshi-dhanekar", "Saakshi Dhanekar", "Associate Professor", "saakshi@iitj.ac.in", "0291 280 1373", "11-2025/Saakshi-Dhanekar-638996654495221869.jpg", "PhD, Jamia Millia Islamia", ["Medical Diagnostics", "Healthcare Devices", "Gas and Bio Sensors", "MEMS"]],
  ["sagar-kumar-verma", "Sagar Kumar Verma", "Assistant Professor", "sagarkv@iitj.ac.in", "0291 280 1642", "03-2026/Sagar-Kumar-Verma-639081497428636305.jpg", "PhD, IIT Roorkee", ["Nanophotonics", "Plasmonics", "Metasurfaces", "Ultrafast Spectroscopy"]],
  ["sarath-chandra-reddy-nallala", "Sarath Chandra Reddy Nallala", "Assistant Professor", "scnallala@iitj.ac.in", "0291 280 1675", "09-2026/Sarath-Chandra-Reddy-Nallala-639239396552482492.png", "PhD, City University of Hong Kong", ["Multiscale Mechanics of Granular Materials", "Discrete Element Modelling"]],
  ["shobhana-singh", "Shobhana Singh", "Associate Professor", "shobhana@iitj.ac.in", "0291 280 1520", "03-2026/Shobhana-Singh-639081498401586262.jpg", "PhD, IIT Delhi", ["Thermal Energy Systems", "Heat and Mass Transfer", "Multiphysics Modelling", "Computational Fluid Dynamics"]],
  ["shrutidhara-sarma", "Shrutidhara Sarma", "Associate Professor", "shrutidhara@iitj.ac.in", "0291 280 1515", "03-2026/Shrutidhara-Sarma-639081485525805087.jpg", "PhD, IIT Guwahati", ["Smart Respiration Systems", "Flexible and Stretchable Sensors", "Portable Assistive Devices", "Self-powered Sensors", "Electrospun Nanofibres"]],
  ["sumit-kalra", "Sumit Kalra", "Associate Professor", "sumitk@iitj.ac.in", "0291 280 1259", "04-2025/Sumit-Kalra-638808594295262656.jpeg", "PhD, IIT Kanpur", ["Software System Design", "Internet of Things"]],
  ["sushmita-jha", "Sushmita Jha", "Professor", "sushmitajha@iitj.ac.in", "0291 280 1204", "03-2026/Sushmita-Jha-639081499518398970.jpg", "PhD, University of North Carolina at Chapel Hill, USA", ["Cell and Molecular Physiology", "Immunology", "Neuroscience"]],
]);

export const visitingFaculty: Person[] = build("Visiting Faculty", [
  ["siddharth-srivastava", "Siddharth Srivastava", "Professor of Practice", "siddharth.vastav@iitj.ac.in", "0291 280 2229", "04-2025/Siddharth-Srivastava-638808595306562528.jpg", undefined, ["Precision Oncology", "Medical Cell Image Analysis"]],
]);

export const staff: Person[] = build("Staff", [
  ["rakesh-kumar-saini", "Rakesh Kumar Saini", "Junior Technical Superintendent", "rakeshsaini@iitj.ac.in", "0291 280 1044", "11-2025/Rakesh-Kumar-Saini-638981307981388755.jpg", "PhD (Engineering Sciences), AcSIR", []],
  ["ram-raj-goliya", "Ram Raj Goliya", "Junior Assistant", "ramrajgoliya@iitj.ac.in", undefined, "03-2025/Ram-Raj-Goliya-638766955281840834.jpg", undefined, []],
]);

// TODO(content): AIIMS Jodhpur clinical faculty associated with the programme are not
// listed on the IIT Jodhpur page. Add them here with `institution: "AIIMS Jodhpur"`.
export const people: Person[] = [...leadership, ...faculty, ...visitingFaculty, ...staff];
