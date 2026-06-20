export const STEPS = ["Personal Info", "Experience", "Education", "Skills", "Generate"];

export const initialForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  jobTitle: "",
  summary: "",
  experience: [{ company: "", role: "", duration: "", description: "" }],
  education: [{ institution: "", degree: "", year: "" }],
  skills: "",
};

export const TEMPLATES = {
  atsProfessional: { name: "ATS Professional", layout: "classic", category: "ats", accent: "#2563eb", tags: ["ATS", "1 Page", "Recruiter Favorite"] },
  atsMinimal: { name: "ATS Minimal", layout: "minimal", category: "ats", accent: "#475569", tags: ["ATS", "1 Page", "Recruiter Favorite"] },
  executivePro: { name: "Executive Pro", layout: "band", category: "executive", accent: "#7c3aed", tags: ["Leadership", "Management", "Senior Roles"] },
  corporateBlue: { name: "Corporate Blue", layout: "sidebar", category: "executive", accent: "#334155", tags: ["Professional", "Clean", "Interview Ready"] },
  dataEngineer: { name: "Data Engineer", layout: "timeline", category: "tech", accent: "#0d9488", tags: ["Tech", "Projects", "Skills Focused"] },
  softwareEngineer: { name: "Software Engineer", layout: "dark", category: "tech", accent: "#06b6d4", tags: ["Tech", "Code", "Experience First"] },
  healthcare: { name: "Healthcare", layout: "banner", category: "special", accent: "#0284c7", tags: ["Healthcare", "Trust", "Experience"] },
  student: { name: "Student", layout: "compact", category: "special", accent: "#1d4ed8", tags: ["Freshers", "Internships", "Campus Hiring"] },
};

export const TEMPLATE_GROUPS = [
  { layout: "ats", label: "ATS Templates" },
  { layout: "tech", label: "Tech Templates" },
  { layout: "executive", label: "Executive Templates" },
  { layout: "special", label: "Special Templates" },
];

export const RESUME_JSON_SHAPE = `{
  "name": "string",
  "jobTitle": "string",
  "contact": { "email": "string", "phone": "string", "location": "string", "linkedin": "string" },
  "summary": "string (2-3 sentences, no markdown)",
  "experience": [
    { "role": "string", "company": "string", "duration": "string", "bullets": ["string", "string"] }
  ],
  "education": [
    { "degree": "string", "institution": "string", "year": "string" }
  ],
  "skills": ["string", "string"],
  "projects": [ { "name": "string", "summary": "string", "bullets": ["string"] } ],
  "certifications": [ { "name": "string", "issuer": "string", "year": "string" } ],
  "languages": [ "string" ],
  "achievements": [ "string" ]
}`;

export const demoResume = {
  name: "Asha Kapoor",
  jobTitle: "Senior Software Engineer",
  contact: { email: "asha.kapoor@email.com", phone: "+91 98765 43210", location: "Bengaluru, India", linkedin: "linkedin.com/in/ashakapoor" },
  summary: "Full-stack engineer with 8+ years building scalable SaaS products. Strong background in backend services, data pipelines, and developer tooling. Passionate about mentoring and shipping quality software.",
  experience: [
    { role: "Senior Software Engineer", company: "Nimbus Labs", duration: "Jul 2021 – Present", bullets: ["Led a team of 4 engineers to deliver a multi-tenant microservice platform used by 200+ customers.", "Reduced API latency by 42% by redesigning the request pipeline and adding targeted caching.", "Introduced end-to-end testing which cut production incidents by 35%."] },
    { role: "Software Engineer II", company: "Apex Solutions", duration: "Jan 2018 – Jun 2021", bullets: ["Built data ingestion pipelines processing 10M+ events/day using Kafka and Spark.", "Implemented role-based access controls and auditing for sensitive workflows."] },
    { role: "Software Engineer", company: "ByteWorks", duration: "Jun 2015 – Dec 2017", bullets: ["Implemented REST APIs and background workers for core product features."] }
  ],
  projects: [
    { name: "Realtime Analytics Dashboard", summary: "Full-stack dashboard for monitoring customer metrics in real time.", bullets: ["Designed data model and streaming layer with <25ms end-to-end latency."] }
  ],
  education: [ { degree: "B.Tech, Computer Science", institution: "IIT Bombay", year: "2011 – 2015" } ],
  skills: ["JavaScript", "Node.js", "React", "Python", "AWS", "Kafka", "Spark", "SQL"],
  certifications: [ { name: "AWS Certified Solutions Architect", issuer: "Amazon", year: "2020" } ],
  languages: ["English", "Hindi"],
  achievements: ["Speaker at JSConf India 2022", "Mentored 6 engineers promoted to senior roles"]
};