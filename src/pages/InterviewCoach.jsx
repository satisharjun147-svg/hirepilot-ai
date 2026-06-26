import { useState } from "react";
import ToolShell from "../components/ToolShell";
import FileUploadBox from "../components/FileUploadBox";
import TemplatePicker from "../components/TemplatePicker";
import { AITip, ErrBox, Spinner, panelStyle, primaryBtn, taStyle, labelStyle } from "../components/ToolPrimitives";
import { TEMPLATES } from "../shared/resumeConstants";
import { callGeminiJSON } from "../services/geminiService";

export default function InterviewCoach({ onBack }) {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [template, setTemplate] = useState("atsProfessional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [openIdx, setOpenIdx] = useState(null);

  const generate = async () => {
    if (!resumeText.trim() || !targetRole.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setOpenIdx(null);
    try {
      const prompt = `You are an interview coach. Based on the resume below and the target role "${targetRole}", generate likely interview questions with strong sample answers tailored to this candidate's real background.${jobDesc.trim() ? " A specific job description is also provided — base technical questions on the actual skills and responsibilities it lists." : ""}

RESUME:
"""
${resumeText.slice(0, 5000)}
"""
${jobDesc.trim() ? `\nTARGET JOB DESCRIPTION:\n"""\n${jobDesc.slice(0, 3000)}\n"""\n` : ""}
Respond with ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:
{
  "technical": [ { "question": "string", "sampleAnswer": "string, 2-4 sentences, grounded in the resume" } ],
  "behavioral": [ { "question": "string", "sampleAnswer": "string using STAR-style structure in 2-4 sentences" } ],
  "hr": [ { "question": "string", "sampleAnswer": "string, 2-3 sentences" } ]
}
Give 3 questions per category, 9 total. Sample answers should reference the candidate's actual resume content where relevant, never invent new companies or numbers. Do not wrap in backticks.`;
      const parsed = await callGeminiJSON(prompt);
      setResult(parsed);
    } catch (err) {
      setError("Couldn't generate interview questions. Please try again.");
    }
    setLoading(false);
  };

  const Section = ({ title, items, prefix, color }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{title}</div>
      {items?.map((qa, i) => {
        const key = `${prefix}${i}`;
        const open = openIdx === key;
        return (
          <div key={key} style={{ border: "1px solid #1e3a5f", borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
            <div onClick={() => setOpenIdx(open ? null : key)} style={{ padding: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
              <span style={{ fontSize: 13.5, color: "#f1f5f9", fontWeight: 500 }}>{qa.question}</span>
              <span style={{ color: "#64748b", fontSize: 12 }}>{open ? "▲" : "▼"}</span>
            </div>
            {open && <div style={{ padding: 14, background: "#0f172a", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{qa.sampleAnswer}</div>}
          </div>
        );
      })}
    </div>
  );

  return (
      <ToolShell title="Interview Coach" onBack={onBack}>
        <div style={panelStyle}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#f1f5f9" }}>Prepare for your interview</h2>

        <label style={labelStyle}>Your resume</label>
        <FileUploadBox onTextExtracted={setResumeText} />
        <textarea rows={7} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume text..." style={{ ...taStyle, marginBottom: 16 }} />

        <label style={labelStyle}>Target role</label>
        <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Senior Software Engineer at a fintech company" style={{ ...taStyle, marginBottom: 16 }} />

        <label style={labelStyle}>Job description (optional)</label>
        <textarea rows={5} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste the job posting for sharper, role-specific technical questions..." style={{ ...taStyle, marginBottom: 16 }} />

        <TemplatePicker template={template} setTemplate={setTemplate} />

        {error && <ErrBox msg={error} />}

        <button onClick={generate} disabled={loading || !resumeText.trim() || !targetRole.trim()} style={{ ...primaryBtn, opacity: (!resumeText.trim() || !targetRole.trim()) ? 0.5 : 1 }}>{loading ? "Preparing..." : "🎤 Generate Interview Questions"}</button>
        <AITip text="Practice answering out loud, not just reading the sample answers — recall under spoken pressure is a different skill than recognizing a good answer on screen." />

        {loading && <Spinner label="Preparing your interview questions..." />}

        {result && <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #1e3a5f" }}><p style={{ fontSize: 12.5, color: "#64748b", marginBottom: 20 }}>Tap a question to see a sample answer.</p><Section title="Technical Questions" items={result.technical} prefix="t" color={TEMPLATES[template].accent} /><Section title="Behavioral Questions" items={result.behavioral} prefix="b" color="#a78bfa" /><Section title="HR Questions" items={result.hr} prefix="h" color="#4ade80" /></div>}
        </div>
      </ToolShell>
  );
}


