import { useLayoutEffect, useRef, useState } from "react";
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

// Note: image-based preview assets (/templates/*.png) are no longer used —
// the "Preview" button now opens a live full-size modal of ResumeTemplate instead,
// which stays accurate automatically and needs no separate image files to maintain.

function PreviewFrame({ children }) {
  // The actual resume page is a fixed-width A4-ratio document (794px wide) whose height
  // varies a lot depending on layout and content (a sidebar layout with 2 jobs + projects +
  // certifications can run well past 1400px). Previously this frame used a fixed 450px height
  // with overflow:hidden, which silently cropped the bottom of every preview. Instead, we
  // measure the real rendered height after mount and scale the frame to fit it exactly, so
  // the full page — header through the last section — is always visible.
  const innerRef = useRef(null);
  const [scale, setScale] = useState(0.34);
  const FRAME_HEIGHT = 480;
  const PAGE_WIDTH = 794;

  useLayoutEffect(() => {
    if (!innerRef.current) return;
    const measure = () => {
      const realHeight = innerRef.current?.scrollHeight || 1123;
      // Fit by whichever dimension is the tighter constraint, so wide layouts (sidebar/band)
      // and tall layouts (timeline with many bullets) both fit fully within the card.
      const scaleByHeight = FRAME_HEIGHT / realHeight;
      const scaleByWidth = 1; // width already matches PAGE_WIDTH container below
      setScale(Math.min(scaleByHeight, scaleByWidth, 0.4));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: FRAME_HEIGHT,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 14,
        boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: PAGE_WIDTH,
          pointerEvents: "none",
          boxShadow: "0 12px 28px rgba(15,23,42,0.18)",
          borderRadius: 4,
        }}
      >
        <div ref={innerRef}>{children}</div>
      </div>
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
  // Previously this opened a static PNG from /public/templates/*.png — those image files
  // don't exist in the project, so "Preview" silently did nothing. Replaced with a real
  // full-size modal rendering the same live ResumeTemplate component, so it always matches
  // the actual generated resume and needs no extra image assets.
  const [previewKey, setPreviewKey] = useState(null);
  const handlePreview = (key) => setPreviewKey(key);
  const closePreview = () => setPreviewKey(null);

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
                      borderRadius: 18,
                      padding: 14,
                      background: "linear-gradient(180deg, rgba(15,23,42,0.75), rgba(15,23,42,0.55))",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset",
                      transition: "border-color 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = template.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e3a5f"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ width: "100%", height: 480, borderRadius: 14, position: "relative", background: "#fff" }}>
                      {renderTemplatePreview(template.key)}
                      {(template.key === "atsProfessional" || template.key === "softwareEngineer") && (
                        <div style={{ position: "absolute", top: 12, right: 12, background: template.accent, color: "#fff", fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.02em", boxShadow: "0 4px 12px rgba(0,0,0,0.25)" }}>
                          ★ Recommended
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, color: "#fff", fontWeight: 700, marginBottom: 8 }}>{template.name}</div>
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

      {previewKey && (() => {
        const t = TEMPLATES[previewKey];
        return (
          <div
            onClick={closePreview}
            style={{ position: "fixed", inset: 0, background: "rgba(2,8,23,0.85)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ background: "#0f172a", borderRadius: 18, border: "1px solid #1e3a5f", maxWidth: 900, width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #1e3a5f" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Full preview with sample content</div>
                </div>
                <button onClick={closePreview} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid #1e3a5f", color: "#cbd5e1", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", background: "#1e293b", display: "flex", justifyContent: "center", padding: "28px 0" }}>
                <div style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
                  <ResumeTemplate data={previewData[previewKey] || demoResume} layout={t.layout} accent={t.accent} />
                </div>
              </div>
              <div style={{ padding: "16px 24px", borderTop: "1px solid #1e3a5f", display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={closePreview} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#cbd5e1", cursor: "pointer", fontSize: 13.5 }}>Close</button>
                <button onClick={() => { onSelect(previewKey); closePreview(); }} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: t.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13.5 }}>Use This Template</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}