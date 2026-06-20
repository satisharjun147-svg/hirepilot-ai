import ResumeTemplate from "./ResumeTemplate";
import { TEMPLATE_GROUPS, TEMPLATES, demoResume } from "../shared/resumeConstants";

const previewData = {
  atsProfessional: {
    ...demoResume,
    name: "Sathish Kumar",
    jobTitle: "Senior Data Engineer",
    summary: "Experienced data engineer with expertise in Databricks, Spark, Kafka, SQL, and Azure. Builds reliable pipelines, improves platform performance, and partners with product teams to ship measurable outcomes.",
    skills: ["Databricks", "Spark", "Kafka", "SQL", "Azure", "Python", "ETL", "Warehousing"],
  },
  atsMinimal: {
    ...demoResume,
    name: "Sathish Kumar",
    jobTitle: "Analytics Engineer",
    summary: "Focused analytics engineer with a strong ATS-friendly profile built for concise impact, reliable delivery, and clean presentation.",
    skills: ["SQL", "dbt", "BigQuery", "Looker", "Python", "Airflow"],
  },
  executivePro: {
    ...demoResume,
    name: "Sathish Kumar",
    jobTitle: "Director of Data Platforms",
    summary: "Business-focused leader who scales data organizations, modernizes platform strategy, and delivers cross-functional execution with clear commercial impact.",
  },
  corporateBlue: {
    ...demoResume,
    name: "Sathish Kumar",
    jobTitle: "Program Manager, Data & Analytics",
    summary: "Structured, corporate-ready resume emphasizing program delivery, stakeholder communication, and cross-team coordination.",
  },
  dataEngineer: {
    ...demoResume,
    name: "Sathish Kumar",
    jobTitle: "Data Engineer",
    summary: "Data engineer building event-driven pipelines, warehouse models, and monitoring systems that keep analytics fast and trustworthy.",
  },
  softwareEngineer: {
    ...demoResume,
    name: "Sathish Kumar",
    jobTitle: "Senior Software Engineer",
    summary: "Full-stack engineer shipping scalable services, automation, and product experiences across cloud-native systems.",
  },
  healthcare: {
    ...demoResume,
    name: "Sathish Kumar",
    jobTitle: "Healthcare Operations Manager",
    summary: "Patient-focused operations leader with an emphasis on process reliability, compliance, and clear communication across care teams.",
  },
  student: {
    ...demoResume,
    name: "Sathish Kumar",
    jobTitle: "Computer Science Student",
    summary: "Strong student profile with internship-ready projects, academic achievements, and a crisp one-page layout.",
    experience: [
      {
        role: "Software Engineering Intern",
        company: "Campus Labs",
        duration: "May 2025 – Jul 2025",
        bullets: ["Built internal dashboards and automated reporting for student services.", "Improved form submission workflows and reduced manual support effort."],
      },
    ],
    education: [{ degree: "B.Tech, Computer Science", institution: "NIT Trichy", year: "2022 – 2026" }],
    skills: ["Python", "JavaScript", "React", "SQL", "Git"],
    projects: [{ name: "Student Portfolio Tracker", summary: "A web app for managing coursework and internship applications.", bullets: ["Designed responsive UI for quick updates."] }],
    certifications: [],
    languages: ["English", "Hindi", "Tamil"],
    achievements: ["Dean's list for 4 semesters", "Won 1st place in college hackathon"],
  },
};

function getPreviewAsset(key) {
  switch (key) {
    case "atsProfessional":
      return "/templates/ats-professional.png";
    case "atsMinimal":
      return "/templates/ats-minimal.png";
    case "executivePro":
      return "/templates/executive-pro.png";
    case "corporateBlue":
      return "/templates/corporate-blue.png";
    case "dataEngineer":
      return "/templates/data-engineer.png";
    case "softwareEngineer":
      return "/templates/software-engineer.png";
    case "healthcare":
      return "/templates/healthcare.png";
    case "student":
      return "/templates/student.png";
    default:
      return null;
  }
}

function PreviewFrame({ children }) {
  return (
    <div
      style={{
        width: "100%",
        height: 450,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 10,
      }}
    >
      <div style={{ transform: "scale(0.34)", transformOrigin: "top center", width: 794, pointerEvents: "none" }}>{children}</div>
    </div>
  );
}

function TemplatePreview({ layout, accent, data }) {
  return (
    <PreviewFrame>
      <ResumeTemplate data={data} layout={layout} accent={accent} />
    </PreviewFrame>
  );
}

function ATSProfessionalPreview() {
  return <TemplatePreview layout="classic" accent="#2563eb" data={previewData.atsProfessional} />;
}

function ATSMinimalPreview() {
  return <TemplatePreview layout="minimal" accent="#475569" data={previewData.atsMinimal} />;
}

function ExecutiveProPreview() {
  return <TemplatePreview layout="band" accent="#7c3aed" data={previewData.executivePro} />;
}

function CorporateBluePreview() {
  return <TemplatePreview layout="sidebar" accent="#334155" data={previewData.corporateBlue} />;
}

function DataEngineerPreview() {
  return <TemplatePreview layout="timeline" accent="#0d9488" data={previewData.dataEngineer} />;
}

function SoftwareEngineerPreview() {
  return <TemplatePreview layout="dark" accent="#06b6d4" data={previewData.softwareEngineer} />;
}

function HealthcarePreview() {
  return <TemplatePreview layout="banner" accent="#0284c7" data={previewData.healthcare} />;
}

function StudentPreview() {
  return <TemplatePreview layout="compact" accent="#1d4ed8" data={previewData.student} />;
}

function renderTemplatePreview(key) {
  switch (key) {
    case "atsProfessional":
      return <ATSProfessionalPreview />;
    case "atsMinimal":
      return <ATSMinimalPreview />;
    case "executivePro":
      return <ExecutiveProPreview />;
    case "corporateBlue":
      return <CorporateBluePreview />;
    case "dataEngineer":
      return <DataEngineerPreview />;
    case "softwareEngineer":
      return <SoftwareEngineerPreview />;
    case "healthcare":
      return <HealthcarePreview />;
    case "student":
      return <StudentPreview />;
    default:
      return null;
  }
}

export default function TemplateGallery({ onSelect, onSkip, title = "Choose a resume template" }) {
  const handlePreview = (key) => {
    const image = getPreviewAsset(key);
    if (image) {
      window.open(image, "_blank", "noopener,noreferrer");
    }
  };

  const curatedTemplates = Object.entries(TEMPLATES).map(([key, template]) => ({
    key,
    name: template.name,
    category: template.category,
    tags: template.tags || [],
    accent: template.accent,
    helper:
      template.category === "ats"
        ? "Built for high volume screening and clean readability."
        : template.category === "tech"
          ? "Highlights systems work, projects, and measurable impact."
          : template.category === "executive"
            ? "A polished layout for managers, heads of function, and leaders."
            : "Designed to present experience clearly and professionally.",
  }));

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#020817,#0a1628,#020817)", color: "#fff", padding: "40px 24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{title}</h1>
          <p style={{ color: "#94a3b8", fontSize: 14.5 }}>8 curated templates for ATS, tech, executive, and special roles. Preview first, then choose.</p>
        </div>

        {TEMPLATE_GROUPS.map((group) => {
          const groupTemplates = curatedTemplates.filter((template) => template.category === group.layout);
          if (!groupTemplates.length) return null;

          return (
            <section key={group.layout} style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                {group.label}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 18 }}>
                {groupTemplates.map((template) => (
                  <div
                    key={template.key}
                    style={{
                      border: "1px solid #1e3a5f",
                      borderRadius: 16,
                      padding: 12,
                      background: "rgba(15,23,42,0.65)",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = template.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e3a5f")}
                  >
                    <div style={{ width: "100%", height: 450, borderRadius: 12, overflow: "hidden", position: "relative", background: "#fff" }}>
                      {renderTemplatePreview(template.key)}
                      <div style={{ position: "absolute", top: 10, right: 10, background: "#3b82f6", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 20 }}>
                        Recommended
                      </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, color: "#fff", fontWeight: 700, marginBottom: 8 }}>{template.name}</div>
                        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                          {(template.tags || []).map((tag) => (
                            <span key={tag} style={{ background: "#1e293b", color: "#94a3b8", padding: "3px 8px", borderRadius: 20, fontSize: 10 }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5, textAlign: "center", marginTop: 10 }}>{template.helper}</div>

                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button
                          type="button"
                          onClick={() => handlePreview(template.key)}
                          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelect(template.key)}
                          style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", background: template.accent, color: "#fff", fontWeight: 700 }}
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={onSkip} style={{ background: "none", border: "1px solid #1e3a5f", color: "#94a3b8", borderRadius: 8, padding: "10px 24px", fontSize: 13.5, cursor: "pointer" }}>
            Skip — I'll choose a style later
          </button>
        </div>
      </div>
    </div>
  );
}