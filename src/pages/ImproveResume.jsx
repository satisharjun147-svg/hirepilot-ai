import { useRef, useState } from "react";
import ResumeTemplate from "../components/ResumeTemplate";
import TemplateGallery from "../components/TemplateGallery";
import FileUploadBox from "../components/FileUploadBox";
import TemplatePicker from "../components/TemplatePicker";
import { AITip, ErrBox, primaryBtn } from "../components/ToolPrimitives";
import { TEMPLATES, RESUME_JSON_SHAPE } from "../shared/resumeConstants";
import { callGeminiForResume } from "../services/geminiService";

export default function ImproveResume({ onBack }) {
  const [showGallery, setShowGallery] = useState(true);
  const [extractedText, setExtractedText] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [template, setTemplate] = useState("modern_blue");
  const printRef = useRef(null);

  if (showGallery) {
    return <TemplateGallery title="Choose a template for your improved resume" onSelect={(key) => { setTemplate(key); setShowGallery(false); }} onSkip={() => setShowGallery(false)} />;
  }

  const generateImproved = async () => {
    if (!extractedText.trim()) return;
    setLoading(true);
    setError("");
    setResumeData(null);
    try {
      const prompt = `You are a professional resume writer. Below is the raw extracted text of someone's existing resume (formatting may be messy from PDF/DOCX extraction — ignore layout artifacts and focus on the content).

RAW RESUME TEXT:
"""
${extractedText.slice(0, 6000)}
"""

Rewrite and improve this resume. Keep all real facts (names, companies, dates, degrees) exactly as given — never invent new ones. Improve wording: turn weak descriptions into sharp, achievement-focused bullet points with strong action verbs. Fix structure and clarity. If a section is missing or unclear, leave it empty rather than inventing content.

Respond with ONLY valid JSON, no markdown code fences, no commentary, matching exactly this shape:
${RESUME_JSON_SHAPE}

Do not wrap the JSON in backticks. Do not include any text before or after the JSON object.`;

      const parsed = await callGeminiForResume(prompt);
      setResumeData(parsed);
    } catch (err) {
      setError("Failed to generate improved resume. Please try again.");
    }
    setLoading(false);
  };

  const downloadPDF = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>${resumeData?.name || "Resume"}</title><style>@page{size:A4;margin:0;}body{margin:0;font-family:'Georgia','Times New Roman',serif;}*{box-sizing:border-box;}</style></head><body>${printContents}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  const accent = TEMPLATES[template].accent;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #020817 0%, #0a1628 50%, #020817 100%)", color: "#e2e8f0" }}>
      <div style={{ borderBottom: "1px solid #1e3a5f", padding: "20px 24px", background: "rgba(15,23,42,0.8)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 14, cursor: "pointer" }}>← Home</button>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Improve Existing Resume</div>
          <div style={{ width: 60 }} />
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        {!resumeData && (
          <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid #1e3a5f", borderRadius: 16, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#f1f5f9" }}>Step 1: Upload your resume</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>PDF, DOCX, or TXT. We read it right here in your browser — nothing is uploaded to a server.</p>
            <FileUploadBox onTextExtracted={(text) => { setExtractedText(text); }} />

            {extractedText && <div style={{ marginTop: 24 }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Extracted text — review and edit if needed</label><textarea value={extractedText} onChange={(e) => setExtractedText(e.target.value)} rows={10} style={{ width: "100%", background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: 14, color: "#e2e8f0", fontSize: 13, fontFamily: "monospace", outline: "none", resize: "vertical", boxSizing: "border-box" }} /><TemplatePicker template={template} setTemplate={setTemplate} />{error && <ErrBox msg={error} />}<button onClick={generateImproved} disabled={loading} style={{ ...primaryBtn, marginTop: 20, width: "100%", opacity: loading ? 0.7 : 1 }}>{loading ? "AI is rewriting your resume..." : "✦ Improve My Resume with AI"}</button><AITip text="Before generating, skim the extracted text above — PDF extraction sometimes merges lines oddly. Fixing obvious jumbled text here improves the AI's rewrite quality." /></div>}
          </div>
        )}

        {resumeData && <div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}><span style={{ fontSize: 14, fontWeight: 600, color: "#4ade80" }}>✓ Improved resume ready</span><div style={{ display: "flex", gap: 10 }}><button onClick={() => setResumeData(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1e3a5f", color: "#94a3b8", borderRadius: 8, padding: "9px 18px", fontSize: 13, cursor: "pointer" }}>← Start Over</button><button onClick={generateImproved} style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#a78bfa", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>↻ Regenerate</button><button onClick={downloadPDF} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "#fff", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>⬇ Download PDF</button></div></div><div style={{ background: "#0f172a", borderRadius: 16, padding: "32px 0", display: "flex", justifyContent: "center", border: "1px solid #1e3a5f" }}><div style={{ transform: "scale(0.95)", transformOrigin: "top center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}><ResumeTemplate ref={printRef} data={resumeData} layout={TEMPLATES[template].layout} accent={accent} /></div></div></div>}
      </div>
    </div>
  );
}