import type { DigitalHealthContent } from "@/lib/types";

// Source: official Centre for Digital Health pages, IIT Jodhpur (retrieved 25 Sep 2026):
// home, capacity-building, research-innovation, open-source, partnership, contact.
// Wording is kept close to the original; programmes are listed as "upcoming", as published.
const BASE = "https://www.iitj.ac.in/cdh/en/";

export const digitalHealth: DigitalHealthContent = {
  tagline: "Health Equity through Digital Transformation",
  intro: [
    "Building on the strong inter-disciplinary academic ecosystem of IIT Jodhpur, the Centre for Digital Health is focused on health for all through the digital transformation of healthcare — involving cutting-edge research, state-of-the-art academic programmes, an open data ecosystem and disruptive innovations.",
    "The Centre works to make affordable digital healthcare reach people without a corresponding increase in the requirement of physical infrastructure and human resources.",
  ],
  vision:
    "To nurture, develop and produce manpower, processes and technology in the domain of Digital Health having a profound impact on the scale, quality and efficiency of healthcare delivery.",
  mission: [
    "Offering state-of-the-art academic and manpower development programmes in Digital Health technology and management.",
    "Cutting-edge research that re-imagines healthcare technology in the digital domain — exploiting AI, Big Data, IoT & wearables, imaging technology, AR-VR, robotics, computational biology, cloud computing and communication technologies.",
    "Creating a democratised health data and knowledge ecosystem that promotes open innovation.",
    "Nurturing a vibrant start-up culture in digital health through boot-camps, accelerator programmes, mentoring and funding for product and process development and delivery.",
    "Enabling national and international connectivity by partnering with industry, academia, government departments, medical institutions, UN agencies and NGOs working in this space.",
    "Seeding a powerful outreach programme to enable adoption of digital technology for better healthcare delivery at all levels of the Indian healthcare system.",
  ],
  alignedWith: [
    "Ayushman Bharat Digital Mission",
    "Ayushman Bharat Health and Wellness Centres",
    "Ayushman Bharat Health Infrastructure Mission",
    "PM-JAY UHC",
    "National Education Policy 2020",
    "NHA and IRDA InsureTech and FinTech initiatives",
    "National Innovation Unit of NHA",
    "NITI Aayog vision for healthcare, including Digital Health",
    "Atal Innovation Mission",
    "UN SDG 2030",
    "WHO Global Initiative for Digital Health",
  ],
  capacityBuilding: {
    intro:
      "A lack of competent human resources limits digital healthcare from reaching its full potential. The Centre offers flexible, multi-disciplinary, industry-ready, research-oriented and entrepreneurship-enabled programmes for skilling, reskilling and upskilling in Digital Health.",
    upcomingPrograms: [
      "Industry-oriented Certificate Courses in Digital Health",
      "Industry-oriented Diploma Courses in Digital Health",
      "MBA in Digital Health",
      "M.Tech in Digital Health",
      "Innovation-directed MS (Research) in Digital Health",
    ],
    audiences: [
      "Healthcare professionals at primary, secondary and tertiary facilities",
      "Mid- and higher-level managers of secondary and tertiary healthcare facilities",
      "Young professionals joining the digital healthcare industry",
      "Researchers and innovators in digital health",
      "Technologists in healthcare and allied industries",
      "Public health and healthcare policy professionals",
    ],
  },
  researchAreas: [
    "Secure connected health solutions",
    "Disease surveillance and epidemiological modelling",
    "Predictive and prescriptive digital interventions for healthcare to mitigate and adapt to climate change",
    "Digital medicine",
    "Dependable AI systems for improved diagnosis, therapeutics and prognosis",
    "Medical and health ontology: knowledge management",
    "Medical imaging",
    "Holistic healthcare solutions from multi-omic data, environmental parameters, phenomic read-outs and past health records using AI and big-data analytics",
    "Digital interventions for mental health",
    "Financial models and smart economics for sustainable digital healthcare",
  ],
  openSource: {
    goal: "Creating an open-source repository for democratised digital public goods in health, and a knowledge- and open-data-driven community that catalyses widespread innovation.",
    activities: [
      "IITJ Centre for Digital Health joins the LSRF Open HDIS open-source community.",
      "Sampoorna Swaraj Foundation has joined the open-source community.",
      "Initiatives encouraging academics, research institutes, hospitals and industries to contribute to the open-source platform through the Jodhpur City Knowledge and Innovation Foundation.",
    ],
  },
  partners: [
    {
      name: "Technology Innovation and Start-up Center (TISC), IIT Jodhpur",
      description:
        "A Section-8 company promoted by IIT Jodhpur and a recognised Technology Business Incubator, supporting start-ups, venture creation and technology commercialisation.",
      url: "https://www.iitj-tisc.org/",
    },
    {
      name: "iHub Drishti, IIT Jodhpur",
      description:
        "A Technology Innovation Hub focused on computer vision, augmented reality and virtual reality, under the National Mission on Interdisciplinary Cyber-Physical Systems.",
      url: "https://ihub-drishti.ai/",
    },
  ],
  knowledgePartner: {
    name: "Libra Social Research Foundation",
    description:
      "A not-for-profit working at the convergence of healthcare, education and technology for health equity — knowledge partner to IIT Jodhpur for capacity building in digital health, innovation ecosystems, digital public goods and research.",
  },
  coordinator: {
    name: "Indranil Banerjee",
    role: "Coordinator, Centre for Digital Health",
    email: "coordinator_cdh@iitj.ac.in",
    phone: "0291 280 1214",
  },
  officialUrl: "https://www.iitj.ac.in/cdh",
  sources: ["Centre-for-Digital-Health", "capacity-building", "research-innovation", "open-source", "partnership", "contact"].map(
    (p) => BASE + p,
  ),
};
