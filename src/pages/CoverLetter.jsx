import { useState } from "react";
import ToolShell from "../components/ToolShell";
import FileUploadBox from "../components/FileUploadBox";
import TemplatePicker from "../components/TemplatePicker";
import { AITip, ErrBox, Spinner, panelStyle, primaryBtn, taStyle, labelStyle } from "../components/ToolPrimitives";
import { TEMPLATES } from "../shared/resumeConstants";
import { callGeminiRaw } from "../services/geminiService";

export default function CoverLetter({ onBack }) {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tone, setTone] = useState("professional");
  const [template, setTemplate] = useState("modern_blue");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) return;
    setLoading(true);
    setError("");
    setLetter("");
    try {
      const prompt = `You are a professional career writer. Write a compelling, ${tone} cover letter based on the resume and job description below.

RESUME:
"""
${resumeText.slice(0, 4000)}
"""

JOB DESCRIPTION${companyName ? ` (Company: ${companyName})` : ""}:
"""
${jobDesc.slice(0, 3000)}
"""

Write a complete cover letter, 3-4 paragraphs, that connects the candidate's real experience to this specific role. Do not invent achievements not present in the resume. Use plain text only, no markdown formatting, ready to copy into an email or document. Include a greeting and sign-off.`;
      const text = await callGeminiRaw(prompt);
      setLetter(text);
    } catch (err) {
      setError("Couldn't generate the cover letter. Please try again.");
    }
    setLoading(false);
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell title="Cover Letter Generator" onBack={onBack}>
      <div style={panelStyle}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#f1f5f9" }}>Generate a tailored cover letter</h2>

        <label style={labelStyle}>Your resume</label>
        <FileUploadBox onTextExtracted={setResumeText} />
        <textarea rows={6} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume text..." style={{ ...taStyle, marginBottom: 16 }} />

        <label style={labelStyle}>Company name (optional)</label>
        <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Corp" style={{ ...taStyle, marginBottom: 16 }} />

        <label style={labelStyle}>Job description</label>
        <textarea rows={6} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste the job posting text..." style={{ ...taStyle, marginBottom: 16 }} />

        <TemplatePicker template={template} setTemplate={setTemplate} />

        <label style={labelStyle}>Tone</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {["professional", "enthusiastic", "concise"].map((t) => (
            <div key={t} onClick={() => setTone(t)} style={{ cursor: "pointer", border: tone === t ? "2px solid #3b82f6" : "1px solid #1e3a5f", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: tone === t ? "#f1f5f9" : "#94a3b8", textTransform: "capitalize" }}>{t}</div>
          ))}
        </div>

        {error && <ErrBox msg={error} />}

        <button onClick={generate} disabled={loading || !resumeText.trim() || !jobDesc.trim()} style={{ ...primaryBtn, opacity: (!resumeText.trim() || !jobDesc.trim()) ? 0.5 : 1 }}>{loading ? "Writing..." : "✉️ Generate Cover Letter"}</button>
        <AITip text="Mention one specific detail from the company or role in your own follow-up edit — AI-written letters read stronger when you add one line only you would know to write." />

        {loading && <Spinner label="Writing your cover letter..." />}

        {letter && <div style={{ marginTop: 24 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>✓ Cover letter ready</span><button onClick={copyLetter} style={{ background: copied ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)", border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(59,130,246,0.4)"}`, color: copied ? "#4ade80" : "#60a5fa", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{copied ? "✓ Copied!" : "Copy"}</button></div><pre style={{ background: "#0f172a", border: `1px solid ${TEMPLATES[template].accent}40`, borderRadius: 10, padding: 20, whiteSpace: "pre-wrap", fontFamily: "'Inter', sans-serif", fontSize: 13.5, lineHeight: 1.7, color: "#cbd5e1" }}>{letter}</pre></div>}
      </div>
    </ToolShell>
  );
}