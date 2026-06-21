import { useState } from "react";
import ToolShell from "../components/ToolShell";
import FileUploadBox from "../components/FileUploadBox";
import TemplatePicker from "../components/TemplatePicker";
import { AITip, ErrBox, Spinner, panelStyle, primaryBtn, taStyle, labelStyle } from "../components/ToolPrimitives";
import { callGeminiJSON } from "../services/geminiService";

export default function LinkedInOptimizer({ onBack }) {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [template, setTemplate] = useState("modern_blue");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copiedField, setCopiedField] = useState("");

  const generate = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const prompt = `You are a LinkedIn profile optimization expert. Based on the resume below${targetRole ? ` and target role "${targetRole}"` : ""}, write optimized LinkedIn profile content.${jobDesc.trim() ? " A specific job description is also provided — weave in relevant keywords from it naturally where they genuinely fit the candidate's real experience." : ""}

RESUME:
"""
${resumeText.slice(0, 5000)}
"""
${jobDesc.trim() ? `\nTARGET JOB DESCRIPTION:\n"""\n${jobDesc.slice(0, 3000)}\n"""\n` : ""}
Respond with ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:
{
  "headline": "string, under 220 characters, keyword-rich, compelling",
  "about": "string, 3-4 paragraphs, first-person, plain text no markdown",
  "experienceBullets": [
    { "role": "string matching a role from the resume", "bullets": ["string", "string", "string"] }
  ]
}
Keep all facts accurate to the resume — do not invent companies or achievements. Do not wrap in backticks.`;
      const parsed = await callGeminiJSON(prompt);
      setResult(parsed);
    } catch (err) {
      setError("Couldn't generate LinkedIn content. Please try again.");
    }
    setLoading(false);
  };

  const copyField = (text, field) => { navigator.clipboard.writeText(text); setCopiedField(field); setTimeout(() => setCopiedField(""), 2000); };
  const CopyBtn = ({ text, field }) => <button onClick={() => copyField(text, field)} style={{ background: copiedField === field ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)", border: `1px solid ${copiedField === field ? "rgba(34,197,94,0.4)" : "rgba(59,130,246,0.4)"}`, color: copiedField === field ? "#4ade80" : "#60a5fa", borderRadius: 6, padding: "5px 12px", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>{copiedField === field ? "✓ Copied" : "Copy"}</button>;

  return (
    <>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px 0" }}>
        <button onClick={() => window.location.reload()} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: 14, marginBottom: 20 }}>
          ← Back to Home
        </button>
      </div>
      <ToolShell title="LinkedIn Optimizer" onBack={onBack}>
        <div style={panelStyle}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#f1f5f9" }}>Optimize your LinkedIn profile</h2>

        <label style={labelStyle}>Your resume</label>
        <FileUploadBox onTextExtracted={setResumeText} />
        <textarea rows={8} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume text..." style={{ ...taStyle, marginBottom: 16 }} />

        <label style={labelStyle}>Target role (optional)</label>
        <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Senior Product Manager" style={{ ...taStyle, marginBottom: 16 }} />

        <label style={labelStyle}>Job description (optional)</label>
        <textarea rows={5} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste a job posting to align your profile keywords with it..." style={{ ...taStyle, marginBottom: 16 }} />

        <TemplatePicker template={template} setTemplate={setTemplate} />

        {error && <ErrBox msg={error} />}

        <button onClick={generate} disabled={loading || !resumeText.trim()} style={{ ...primaryBtn, opacity: !resumeText.trim() ? 0.5 : 1 }}>{loading ? "Optimizing..." : "💼 Generate LinkedIn Content"}</button>
        <AITip text="Recruiters search LinkedIn by keyword before they ever read a profile. Pasting a target job description here helps your headline and About section surface in those searches." />

        {loading && <Spinner label="Crafting your profile content..." />}

        {result && <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #1e3a5f", display: "flex", flexDirection: "column", gap: 24 }}><div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={labelStyle}>Headline</span><CopyBtn text={result.headline} field="headline" /></div><div style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: 14, fontSize: 14, color: "#f1f5f9", fontWeight: 600 }}>{result.headline}</div></div><div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={labelStyle}>About section</span><CopyBtn text={result.about} field="about" /></div><pre style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: 14, whiteSpace: "pre-wrap", fontFamily: "'Inter', sans-serif", fontSize: 13.5, lineHeight: 1.7, color: "#cbd5e1", margin: 0 }}>{result.about}</pre></div>{result.experienceBullets?.map((exp, i) => <div key={i}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={labelStyle}>{exp.role}</span><CopyBtn text={exp.bullets.join("\n")} field={`exp${i}`} /></div><ul style={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "14px 14px 14px 30px", margin: 0 }}>{exp.bullets.map((b, j) => <li key={j} style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 6, lineHeight: 1.6 }}>{b}</li>)}</ul></div>)}</div>}
        </div>
      </ToolShell>
    </>
  );
}