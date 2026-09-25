import type { Student } from "@/lib/types";

// Source: official cohort lists on the IIT Jodhpur Medical Technologies website
// (retrieved 25 Sep 2026). Names and roll numbers are reproduced exactly as published.
// Graduation status is not published, so `status` is left unset.
const BASE = "https://www.iitj.ac.in/medical-technologies/en/";
const SOURCES: Record<string, string> = {
  masters: BASE + "master-medical-technologies",
  phd: BASE + "phd-medical-technologies",
  "dual-degree": BASE + "dual-degree-medical-technologies",
};

/** programId → cohort year → "ROLL|Name" rows. */
const register: Record<string, Record<number, string[]>> = {
  masters: {
    2026: ["M26IM1001|Ankit Sharma", "M26IM1002|Anushka Sharma", "M26IM1003|Ayush Kumar Mishra", "M26IM1004|Chaudhari Pratik Deepak", "M26IM1005|Eshitaa Panwar", "M26IM1006|Kishore V", "M26IM1007|Mahendra Bishnoi", "M26IM1008|Maheshiv Prajapat", "M26IM1009|Megha Bharadwaj", "M26IM10010|Mrunal Sonawale", "M26IM10011|Paras J Keyravan", "M26IM10012|Siddhant Dinesh Shenvi", "M26IM10013|Swajal Jain", "M26IM10014|Taqsh Singh Chopra"],
    2025: ["M25IM1001|Patangiyawala Aafreen Mo Javed", "M25IM1002|Chavan Prathamesh Prakash", "M25IM1003|Deepika Sharma", "M25IM1004|Jadav Ravi Mansukhbhai", "M25IM1005|Jibin Varghese", "M25IM1006|Kadiya Arth Pareshkumar", "M25IM1007|Neil Lohit Bose", "M25IM1008|Rahul Parmar", "M25IM1009|Komal Meena", "M25IM1010|Vijay Kumar"],
    2024: ["M24IM1001|Mahadevan", "M24IM1002|Mohamed Zaki Hafeez", "M24IM1003|Pranav Kumar Tak", "M24IM1004|Prashansha Agarwal", "M24IM1005|Ritika Jajoriya", "M24IM1006|Shibashish Samantaray", "M24IM1007|Sukesh P"],
    2023: ["M23IM1001|Sivasurya PM", "M23IM1003|Ashwin C R"],
    2022: ["M22ID001|Aakshi Sharma", "M22ID002|Anjali Rajeev", "M22ID003|Debasish Panda", "M22ID004|Tanvi Chawla", "M22ID005|Yuvraj Ishwar Telrandhe", "M22ID006|Garima Nath", "M22ID008|Abu Sanny Mottalib"],
    2021: ["M21ID001|Ajisha Ck", "M21ID002|Ajmal Jaleel", "M21ID003|Divesh Kumar Awasthi", "M21ID004|Gaurav Sawriya", "M21ID005|Harisharan R", "M21ID007|Varun Raman Khandelwal"],
    2020: ["M20ID001|Anup Kamal Kakwani", "M20ID002|Anushri Bhardwaj", "M20ID004|Mridul Sharma", "M20ID005|Shradha Suman Panda", "M20ID008|Thilak Chakaravarthi E", "M20ID009|Rajshree"],
  },
  phd: {
    2026: ["P26IM0001|Bhanu Pratap Singh Chauhan", "P26IM0002|Chahat Bawa", "P26IM0003|Pooja", "P26IM0004|Saurabh Yadav"],
    2025: ["P25IM0001|Deepika Yadav", "P25IM0002|Prachi Chaudhary", "P25IM0003|Rakshit Vyas", "P25IM0005|Shweta Yadav", "P25IM0006|Swati Yadav"],
    2024: ["P24IM0002|Parul Kumawat"],
    2023: ["P23IM0001|Dhruv Khokhriya"],
    2022: ["P22ID002|Sukanya Pandey", "P22ID003|Sangeeta Didel", "P22ID004|Rohit Gupta"],
    2021: ["P21ID002|Harsh Saxena", "P21ID003|Naveen Kumar", "P21ID004|Shailesh Kumar Mousalpuriya", "P21ID005|Shivangi Madhavi Harsha", "P21ID006|Umme Abiha"],
    2020: ["P20ID002|Kanika Singroha", "P20ID003|Dushyant Agrawal", "P20ID004|Gajendra Singh", "P20ID005|Mitanshu Sharma", "P20ID006|Monika Sharma", "P20ID007|Om Lata Bhagat", "P20ID009|Sakshi Malik", "P20ID010|Sudesh Pachar"],
  },
  "dual-degree": {
    2025: ["D25IM1001|Ankur Bhardwaj", "D25IM1002|Jestin Joseph", "D25IM1005|Mohammed Fahim C"],
    2024: ["D24IM1001|Md Tauqueer Alam"],
    2023: ["D23IM1001|Divya Prakash Pandey"],
    2022: ["D22ID001|Jyoti Yadav", "D22ID002|Prateek Mishra", "D22ID003|Abhijeet Rajak"],
    2021: ["D21ID003|Manik Sejwal", "D21ID004|Ravi Singhal", "D21ID005|Sayak Sarkar", "D21ID006|Katyayanee Sharma"],
    2020: ["D20ID001|Ramkishore Jangid", "D20ID003|Justy N Francis", "D20ID004|Misaal Khan", "D20ID005|Neha Nagarkoti", "D20ID006|Saloni Singhal", "D20ID007|Sambit Kumar Keshi", "D20ID008|Sarmistha Mazumder", "D20ID009|Yashraj Singh"],
  },
};

export const students: Student[] = Object.entries(register).flatMap(([programId, years]) =>
  Object.entries(years).flatMap(([year, rows]) =>
    rows.map((row) => {
      const [rollNumber, name] = row.split("|");
      return {
        id: rollNumber,
        rollNumber,
        name,
        programId,
        cohortYear: Number(year),
        provenance: "verified" as const,
        sourceUrl: SOURCES[programId],
      };
    }),
  ),
);
