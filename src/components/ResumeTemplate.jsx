import { forwardRef } from "react";

const PAGE_BASE = { width: 794, minHeight: 1123, boxSizing: "border-box", fontFamily: "'Helvetica Neue', Arial, sans-serif" };
const sans = "'Helvetica Neue', Arial, sans-serif";

function SectionTitle({ children, accent }) {
  return <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10, paddingBottom: 4, borderBottom: "1px solid #e2e8f0" }}>{children}</div>;
}

function ExperienceBlock({ experience, accent, dark, dense }) {
  if (!experience?.length) return null;
  return <>{experience.map((exp, i) => <div key={i} style={{ marginBottom: dense ? 10 : 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}><span style={{ fontWeight: 700, fontSize: dense ? 12.5 : 14, color: dark ? "#f1f5f9" : "#0f172a" }}>{exp.role}{exp.company ? `, ${exp.company}` : ""}</span><span style={{ fontFamily: sans, fontSize: dense ? 11 : 12, color: dark ? "#94a3b8" : "#64748b" }}>{exp.duration}</span></div><ul style={{ margin: "5px 0 0", paddingLeft: 18 }}>{exp.bullets?.map((b, j) => <li key={j} style={{ fontSize: dense ? 11.5 : 12.5, lineHeight: 1.55, color: dark ? "#cbd5e1" : "#334155", marginBottom: 3 }}>{b}</li>)}</ul></div>)}</>;
}

function EducationBlock({ education, dark, dense }) {
  if (!education?.length) return null;
  return <>{education.map((edu, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, flexWrap: "wrap" }}><span style={{ fontSize: dense ? 12 : 13, color: dark ? "#f1f5f9" : "#0f172a" }}><strong>{edu.degree}</strong>{edu.institution ? `, ${edu.institution}` : ""}</span><span style={{ fontFamily: sans, fontSize: dense ? 11 : 12, color: dark ? "#94a3b8" : "#64748b" }}>{edu.year}</span></div>)}</>;
}

function SkillPills({ skills, accent, dark }) {
  if (!skills?.length) return null;
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{skills.map((s, i) => <span key={i} style={{ fontSize: 11.5, background: dark ? `${accent}33` : `${accent}15`, color: dark ? "#fff" : accent, padding: "4px 11px", borderRadius: 20, fontWeight: 600 }}>{s}</span>)}</div>;
}
function ProjectsBlock({ projects }) {
  if (!projects?.length) return null;
  return <div style={{ marginTop: 14, marginBottom: 14 }}>
    <SectionTitle accent="#6b7280">Projects</SectionTitle>
    {projects.map((p, i) => <div key={i} style={{ marginBottom: 10 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div><div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{p.summary}</div>{p.bullets?.length ? <ul style={{ margin: 0, paddingLeft: 18 }}>{p.bullets.map((b, j) => <li key={j} style={{ fontSize: 12, color: "#334155", marginBottom: 4 }}>{b}</li>)}</ul> : null}</div>)}</div>;
}
function CertificationsBlock({ certifications }) {
  if (!certifications?.length) return null;
  return <div style={{ marginTop: 12, marginBottom: 12 }}>
    <SectionTitle accent="#6b7280">Certifications</SectionTitle>
    {certifications.map((c, i) => <div key={i} style={{ marginBottom: 8 }}><strong style={{ fontSize: 12 }}>{c.name}</strong><div style={{ fontSize: 12, color: "#64748b" }}>{c.issuer} {c.year ? `· ${c.year}` : ""}</div></div>)}
  </div>;
}
function LanguagesBlock({ languages }) {
  if (!languages?.length) return null;
  return <div style={{ marginTop: 10, marginBottom: 10 }}>
    <SectionTitle accent="#6b7280">Languages</SectionTitle>
    <div style={{ fontSize: 12.5, color: "#334155" }}>{languages.join(" · ")}</div>
  </div>;
}
function AchievementsBlock({ achievements }) {
  if (!achievements?.length) return null;
  return <div style={{ marginTop: 12, marginBottom: 12 }}>
    <SectionTitle accent="#6b7280">Achievements</SectionTitle>
    <ul style={{ margin: 0, paddingLeft: 18 }}>{achievements.map((a, i) => <li key={i} style={{ fontSize: 12, color: "#334155", marginBottom: 4 }}>{a}</li>)}</ul>
  </div>;
}
function AdditionalSections({ data }) {
  if (!data) return null;
  const { projects, certifications, languages, achievements } = data;
  return <div>
    <ProjectsBlock projects={projects} />
    <CertificationsBlock certifications={certifications} />
    <LanguagesBlock languages={languages} />
    <AchievementsBlock achievements={achievements} />
  </div>;
}

function ClassicLayout({ data, accent, ref }) {
  const { name, jobTitle, contact, summary, experience, education, skills } = data;
  return <div ref={ref} style={{ ...PAGE_BASE, background: "#fff", color: "#1e293b", fontFamily: "'Georgia', 'Times New Roman', serif", padding: "56px 60px" }}><div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: 16, marginBottom: 24 }}><h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: "#0f172a" }}>{name || "Your Name"}</h1>{jobTitle && <div style={{ fontSize: 15, color: accent, fontWeight: 600, marginTop: 4 }}>{jobTitle}</div>}<div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10, fontFamily: sans, fontSize: 12, color: "#475569" }}>{contact?.email && <span>{contact.email}</span>}{contact?.phone && <span>· {contact.phone}</span>}{contact?.location && <span>· {contact.location}</span>}{contact?.linkedin && <span>· {contact.linkedin}</span>}</div></div>{summary && <div style={{ marginBottom: 22 }}><SectionTitle accent={accent}>Summary</SectionTitle><p style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.6, color: "#334155", margin: 0 }}>{summary}</p></div>}{experience?.length > 0 && <div style={{ marginBottom: 22 }}><SectionTitle accent={accent}>Experience</SectionTitle><ExperienceBlock experience={experience} accent={accent} /></div>}{education?.length > 0 && <div style={{ marginBottom: 22 }}><SectionTitle accent={accent}>Education</SectionTitle><EducationBlock education={education} /></div>}{skills?.length > 0 && <div><SectionTitle accent={accent}>Skills</SectionTitle><SkillPills skills={skills} accent={accent} /></div>}<AdditionalSections data={data} /></div>;
}

function SidebarLayout({ data, accent, ref, dark = false }) {
  const { name, jobTitle, contact, summary, experience, education, skills } = data;
  const bg = dark ? "#0f172a" : "#fff";
  const textMain = dark ? "#f1f5f9" : "#1e293b";
  return <div ref={ref} style={{ ...PAGE_BASE, background: bg, color: textMain, display: "flex" }}><div style={{ width: "32%", background: accent, padding: "44px 26px", color: "#fff", boxSizing: "border-box" }}><h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, lineHeight: 1.2 }}>{name || "Your Name"}</h1>{jobTitle && <div style={{ fontSize: 12.5, marginTop: 6, opacity: 0.9, fontWeight: 600 }}>{jobTitle}</div>}<div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 8, fontSize: 11.5, opacity: 0.95 }}>{contact?.email && <div>{contact.email}</div>}{contact?.phone && <div>{contact.phone}</div>}{contact?.location && <div>{contact.location}</div>}{contact?.linkedin && <div>{contact.linkedin}</div>}</div>{education?.length > 0 && <div style={{ marginTop: 28 }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10, opacity: 0.85 }}>Education</div>{education.map((edu, i) => <div key={i} style={{ marginBottom: 10, fontSize: 11.5 }}><div style={{ fontWeight: 700 }}>{edu.degree}</div><div style={{ opacity: 0.85 }}>{edu.institution}</div><div style={{ opacity: 0.7, fontSize: 10.5 }}>{edu.year}</div></div>)}</div>}{skills?.length > 0 && <div style={{ marginTop: 28 }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10, opacity: 0.85 }}>Skills</div>{skills.map((s, i) => <div key={i} style={{ fontSize: 11.5, marginBottom: 5, opacity: 0.95 }}>{s}</div>)}</div>}</div><div style={{ flex: 1, padding: "44px 32px", boxSizing: "border-box" }}>{summary && <div style={{ marginBottom: 22 }}><div style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Summary</div><p style={{ fontSize: 12.5, lineHeight: 1.6, color: dark ? "#cbd5e1" : "#334155", margin: 0 }}>{summary}</p></div>}{experience?.length > 0 && <div><div style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Experience</div><ExperienceBlock experience={experience} accent={accent} dark={dark} /></div>}</div></div>;
}

function BandLayout({ data, accent, ref, banner = false }) {
  const { name, jobTitle, contact, summary, experience, education, skills } = data;
  return <div ref={ref} style={{ ...PAGE_BASE, background: "#fff", color: "#1e293b" }}>
    <div style={{ background: accent, padding: banner ? "44px 60px 36px" : "32px 60px", color: "#fff", display: "flex", alignItems: "center", gap: 18 }}>
      {banner && <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.25)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800 }}>{(name || "Y")[0]}</div>}
      <div>
        <h1 style={{ margin: 0, fontSize: banner ? 28 : 26, fontWeight: 800 }}>{name || "Your Name"}</h1>
        {jobTitle && <div style={{ fontSize: 13.5, marginTop: 4, opacity: 0.92, fontWeight: 600 }}>{jobTitle}</div>}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8, fontSize: 11.5, opacity: 0.9 }}>{contact?.email && <span>{contact.email}</span>}{contact?.phone && <span>· {contact.phone}</span>}{contact?.location && <span>· {contact.location}</span>}</div>
      </div>
    </div>
    <div style={{ padding: "30px 60px" }}>
      {summary && <div style={{ marginBottom: 22 }}><SectionTitle accent={accent}>Summary</SectionTitle><p style={{ fontSize: 13, lineHeight: 1.6, color: "#334155", margin: 0 }}>{summary}</p></div>}
      {experience?.length > 0 && <div style={{ marginBottom: 22 }}><SectionTitle accent={accent}>Experience</SectionTitle><ExperienceBlock experience={experience} accent={accent} /></div>}
      {education?.length > 0 && <div style={{ marginBottom: 22 }}><SectionTitle accent={accent}>Education</SectionTitle><EducationBlock education={education} /></div>}
      {skills?.length > 0 && <div><SectionTitle accent={accent}>Skills</SectionTitle><SkillPills skills={skills} accent={accent} /></div>}
      <AdditionalSections data={data} />
    </div>
  </div>;
}

function TimelineLayout({ data, accent, ref }) {
  const { name, jobTitle, contact, summary, experience, education, skills } = data;
  return <div ref={ref} style={{ ...PAGE_BASE, background: "#fff", color: "#1e293b", padding: "50px 60px" }}>
    <div style={{ marginBottom: 26 }}>
      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{name || "Your Name"}</h1>
      {jobTitle && <div style={{ fontSize: 14, color: accent, fontWeight: 600, marginTop: 4 }}>{jobTitle}</div>}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8, fontSize: 11.5, color: "#64748b" }}>{contact?.email && <span>{contact.email}</span>}{contact?.phone && <span>· {contact.phone}</span>}{contact?.location && <span>· {contact.location}</span>}</div>
    </div>

    {summary && <p style={{ fontSize: 13, lineHeight: 1.6, color: "#334155", marginBottom: 24 }}>{summary}</p>}

    {experience?.length > 0 && <div style={{ marginBottom: 24 }}>
      <SectionTitle accent={accent}>Experience</SectionTitle>
      <div style={{ position: "relative", paddingLeft: 22, marginTop: 14 }}>
        <div style={{ position: "absolute", left: 4, top: 4, bottom: 4, width: 2, background: `${accent}33` }} />
        {experience.map((exp, i) => <div key={i} style={{ position: "relative", marginBottom: 18 }}>
          <div style={{ position: "absolute", left: -22, top: 3, width: 10, height: 10, borderRadius: "50%", background: accent, border: "2px solid #fff", boxShadow: `0 0 0 1px ${accent}` }} />
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{exp.role}{exp.company ? `, ${exp.company}` : ""}</span>
            <span style={{ fontSize: 11.5, color: "#64748b" }}>{exp.duration}</span>
          </div>
          <ul style={{ margin: "5px 0 0", paddingLeft: 18 }}>{exp.bullets?.map((b, j) => <li key={j} style={{ fontSize: 12.5, lineHeight: 1.55, color: "#334155", marginBottom: 3 }}>{b}</li>)}</ul>
        </div>)}
      </div>
    </div>}

    {education?.length > 0 && <div style={{ marginBottom: 22 }}><SectionTitle accent={accent}>Education</SectionTitle><EducationBlock education={education} /></div>}

    {skills?.length > 0 && <div><SectionTitle accent={accent}>Skills</SectionTitle><SkillPills skills={skills} accent={accent} /></div>}
    <AdditionalSections data={data} />
  </div>;
}

function CompactLayout({ data, accent, ref }) {
  const { name, jobTitle, contact, summary, experience, education, skills } = data;
  return <div ref={ref} style={{ ...PAGE_BASE, background: "#fff", color: "#1e293b", padding: "40px 48px" }}><div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 12, marginBottom: 18 }}><h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>{name || "Your Name"}</h1><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>{jobTitle && <span style={{ fontSize: 12.5, color: accent, fontWeight: 600 }}>{jobTitle}</span>}<div style={{ display: "flex", gap: 10, fontSize: 10.5, color: "#64748b" }}>{contact?.email && <span>{contact.email}</span>}{contact?.phone && <span>· {contact.phone}</span>}</div></div></div>{summary && <p style={{ fontSize: 11.5, lineHeight: 1.5, color: "#334155", marginBottom: 16 }}>{summary}</p>}<div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}><div>{experience?.length > 0 && <div><SectionTitle accent={accent}>Experience</SectionTitle><ExperienceBlock experience={experience} accent={accent} dense /></div>}<AdditionalSections data={data} /></div><div>{education?.length > 0 && <div style={{ marginBottom: 18 }}><SectionTitle accent={accent}>Education</SectionTitle><EducationBlock education={education} dense /></div>}{skills?.length > 0 && <div><SectionTitle accent={accent}>Skills</SectionTitle><SkillPills skills={skills} accent={accent} /></div>}</div></div></div>;
}

function MinimalLayout({ data, accent, ref }) {
  const { name, jobTitle, contact, summary, experience, education, skills } = data;
  return <div ref={ref} style={{ ...PAGE_BASE, background: "#fff", color: "#1e293b", padding: "60px 64px" }}><h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, letterSpacing: "1px", color: "#0f172a" }}>{(name || "Your Name").toUpperCase()}</h1>{jobTitle && <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, letterSpacing: "0.5px" }}>{jobTitle}</div>}<div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10, fontSize: 11, color: "#94a3b8" }}>{contact?.email && <span>{contact.email}</span>}{contact?.phone && <span>{contact.phone}</span>}{contact?.location && <span>{contact.location}</span>}</div><div style={{ height: 1, background: accent, width: 40, margin: "20px 0 26px" }} />{summary && <p style={{ fontSize: 13, lineHeight: 1.7, color: "#475569", marginBottom: 28, fontWeight: 300 }}>{summary}</p>}{experience?.length > 0 && <div style={{ marginBottom: 26 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14 }}>Experience</div><ExperienceBlock experience={experience} accent={accent} /></div>}{education?.length > 0 && <div style={{ marginBottom: 26 }}><div style={{ fontSize: 10.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14 }}>Education</div><EducationBlock education={education} /></div>}{skills?.length > 0 && <div><div style={{ fontSize: 10.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14 }}>Skills</div><div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.8 }}>{skills.join("   ·   ")}</div></div>}<AdditionalSections data={data} /></div>;
}

const ResumeTemplate = forwardRef(function ResumeTemplate({ data, accent, layout = "classic" }, ref) {
  const props = { data, accent, ref };
  if (layout === "sidebar") return <SidebarLayout {...props} />;
  if (layout === "dark") return <SidebarLayout {...props} dark />;
  if (layout === "band") return <BandLayout {...props} />;
  if (layout === "banner") return <BandLayout {...props} banner />;
  if (layout === "timeline") return <TimelineLayout {...props} />;
  if (layout === "compact") return <CompactLayout {...props} />;
  if (layout === "minimal") return <MinimalLayout {...props} />;
  return <ClassicLayout {...props} />;
});

export default ResumeTemplate;