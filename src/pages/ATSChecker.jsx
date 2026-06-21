import { useState } from "react";
import ToolShell from "../components/ToolShell";
import FileUploadBox from "../components/FileUploadBox";
import { ErrBox, Spinner, panelStyle, primaryBtn, taStyle, labelStyle } from "../components/ToolPrimitives";
import { callGeminiJSON } from "../services/geminiService";

export default function ATSChecker({ onBack }) {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const runCheck = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const prompt = `You are an ATS (Applicant Tracking System) resume auditor. Analyze the resume text below and score it out of 100 based on real ATS factors: use of quantified achievements, strong action verbs, clear section structure, presence of contact info, skills section clarity, keyword density, section completeness, and overall formatting that would parse cleanly in an ATS.${jobDesc.trim() ? " A target job description is also provided — factor in how well the resume matches it, and prioritize missing keywords that come from this specific job description." : ""}

RESUME TEXT:
"""
${resumeText.slice(0, 6000)}
"""
${jobDesc.trim() ? `\nTARGET JOB DESCRIPTION:\n"""\n${jobDesc.slice(0, 3000)}\n"""\n` : ""}
Respond with ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:
{
  "score": number (0-100),
  "missingKeywords": ["keyword1", "keyword2"],
  "formattingIssues": ["short phrase", "short phrase"],
  "sectionCompleteness": ["short phrase", "short phrase"],
  "keywordDensity": ["short phrase", "short phrase"],
  "recommendations": ["short recommendation", "short recommendation"]
}
Give 3-6 missing keywords, 2-4 formatting issues, 2-4 section completeness notes, 2-4 keyword density notes, and 3-5 recommendations${jobDesc.trim() ? " drawn from the job description where the resume falls short" : " relevant to the resume's apparent field"}. Do not wrap in backticks.`;
      const parsed = await callGeminiJSON(prompt);
      setResult(parsed);
    } catch (err) {
      setError("Couldn't score this resume. Please try again.");
    }
    setLoading(false);
  };

  const scoreColor = result ? (result.score >= 75 ? "#4ade80" : result.score >= 50 ? "#facc15" : "#f87171") : "#60a5fa";

  const Section = ({ title, items, accent = "#60a5fa", emptyMessage = "No issues found." }) => (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{title}</div>
      {items?.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item, index) => (
            <div key={index} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e3a5f", borderRadius: 10, padding: 14, color: "#cbd5e1", fontSize: 13.5, lineHeight: 1.6 }}>
              {typeof item === "string" ? item : item.detail || item.title || JSON.stringify(item)}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "#64748b", fontSize: 13 }}>{emptyMessage}</div>
      )}
    </div>
  );

  return (
    <>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px 0" }}>
        <button onClick={() => window.location.reload()} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: 14, marginBottom: 20 }}>
          ← Back to Home
        </button>
      </div>
      <ToolShell title="ATS Checker" onBack={onBack}>
        <div style={panelStyle}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: "#f1f5f9" }}>ATS Score Checker</h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>Upload a resume or paste text below, then score it against an optional job description.</p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={labelStyle}>Resume Upload</div>
          <FileUploadBox onTextExtracted={setResumeText} />
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={labelStyle}>Paste Resume</div>
          <textarea rows={10} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your full resume text here..." style={{ ...taStyle, marginBottom: 0 }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Paste Job Description (optional)</label>
          <textarea rows={5} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste the job posting you're applying for — we'll score against it specifically..." style={{ ...taStyle, marginBottom: 0 }} />
        </div>

        {error && <ErrBox msg={error} />}
        <button onClick={runCheck} disabled={loading || !resumeText.trim()} style={{ ...primaryBtn, marginTop: 4, opacity: !resumeText.trim() ? 0.5 : 1 }}>{loading ? "Scoring..." : "🎯 Check My ATS Score"}</button>

        {loading && <Spinner label="Analyzing your resume..." />}

        {result && (
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #1e3a5f" }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>ATS Score</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 52, fontWeight: 900, color: scoreColor }}>{result.score}</span>
                <span style={{ fontSize: 18, color: "#64748b" }}>/ 100</span>
              </div>
            </div>

            <Section title="Missing Keywords" accent="#60a5fa" items={result.missingKeywords} emptyMessage="No obvious keyword gaps found." />
            <Section title="Formatting Issues" accent="#facc15" items={result.formattingIssues} emptyMessage="No major formatting issues detected." />
            <Section title="Section Completeness" accent="#a78bfa" items={result.sectionCompleteness} emptyMessage="All essential sections appear covered." />
            <Section title="Keyword Density" accent="#4ade80" items={result.keywordDensity} emptyMessage="Keyword density looks balanced." />
            <Section title="Recommendations" accent="#fb7185" items={result.recommendations} emptyMessage="No recommendations at this time." />
          </div>
        )}
        </div>
      </ToolShell>
    </>
  );
}