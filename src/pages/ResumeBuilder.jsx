import { useRef, useState } from "react";
import ResumeTemplate from "../components/ResumeTemplate";
import TemplateGallery from "../components/TemplateGallery";
import { AITip, StatusMessage } from "../components/ToolPrimitives";
import { TEMPLATES, STEPS, initialForm, RESUME_JSON_SHAPE, demoResume } from "../shared/resumeConstants";
import { callGeminiForResume } from "../services/geminiService";
import { db } from "../firebase"; // Added Firebase import
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  increment
} from "firebase/firestore"; // Added Firestore imports

export default function ResumeBuilder({ onBack }) {
  const [showGallery, setShowGallery] = useState(true);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);
  const [template, setTemplate] = useState("atsProfessional");
  const printRef = useRef(null);

  // Added Save Resume Function with fallback
  const saveResume = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Debugging: Check what is actually stored in local storage
      console.log("USER FROM LOCAL STORAGE:", user);

      if (!user) {
        setStatus({ type: "error", text: "Please login first to save your resume." });
        return;
      }

      const safeUserId = user.uid || user.email || "unknown_user";

      console.log("resumeData =", resumeData);

       await addDoc(
       collection(db, "resumes"),
  {
    userId: safeUserId,
    name: resumeData?.name || form.name || "",
    email: resumeData?.email || form.email || "",
    template: template,
    resumeData: resumeData || {},
    createdAt: new Date().toISOString()
  }
);

      if (user.uid) {
        await updateDoc(
          doc(db, "users", user.uid),
          {
            resumeCount: increment(1)
          }
        );
      }

      setStatus({ type: "success", text: "Resume saved successfully." });
    } catch (err) {
      console.error("FULL FIREBASE ERROR:", err);
      setStatus({ type: "error", text: err.message || "Could not save the resume right now." });
    }
  };

  if (showGallery) {
    return <TemplateGallery title="Choose a resume template to start with" onSelect={(key) => { setTemplate(key); setShowGallery(false); }} onSkip={() => setShowGallery(false)} />;
  }

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const updateExp = (i, field, value) => { const exp = [...form.experience]; exp[i][field] = value; setForm((f) => ({ ...f, experience: exp })); };
  const updateEdu = (i, field, value) => { const edu = [...form.education]; edu[i][field] = value; setForm((f) => ({ ...f, education: edu })); };
  const addExp = () => setForm((f) => ({ ...f, experience: [...f.experience, { company: "", role: "", duration: "", description: "" }] }));
  const addEdu = () => setForm((f) => ({ ...f, education: [...f.education, { institution: "", degree: "", year: "" }] }));
  const removeExp = (i) => setForm((f) => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }));
  const removeEdu = (i) => setForm((f) => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));

  const getUserData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.uid) {
      alert("Please login first");
      return null;
    }

    const snapshot = await getDoc(doc(db, "users", user.uid));
    return snapshot.exists() ? snapshot.data() : null;
  };

  const generateResume = async () => {
    const userData = await getUserData();

    if (!userData) {
      setStatus({ type: "error", text: "Please login first to generate a resume." });
      return;
    }

    if (
      userData.plan === "free" &&
      (userData.resumeCount || 0) >= (userData.resumeLimit || 5)
    ) {
      setStatus({ type: "error", text: "Resume limit reached. Upgrade your plan to continue." });
      return;
    }

    setLoading(true);
    setError("");
    setStatus(null);
    setResumeData(null);
    try {
      const prompt = `You are a professional resume writer. Based on the information below, produce a polished, ATS-friendly resume.

Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Location: ${form.location}
LinkedIn: ${form.linkedin}
Target Job Title: ${form.jobTitle}
Notes for summary: ${form.summary}

Work Experience (raw notes):
${form.experience.map((e) => `- ${e.role} at ${e.company} (${e.duration}): ${e.description}`).join("\n")}

Education:
${form.education.map((e) => `- ${e.degree} from ${e.institution} (${e.year})`).join("\n")}

Skills (raw notes): ${form.skills}

Rewrite and improve this content. Turn experience notes into 3-5 sharp, achievement-focused bullet points per role, starting with strong action verbs, adding realistic quantification only if it's reasonable to infer — never invent fake company names, dates, or degrees, only improve the wording and structure of what was given.

Respond with ONLY valid JSON, no markdown code fences, no commentary, matching exactly this shape:
${RESUME_JSON_SHAPE}

Do not wrap the JSON in backticks. Do not include any text before or after the JSON object.`;

      const parsed = await callGeminiForResume(prompt);
      setResumeData(parsed);
      setStatus({ type: "success", text: "Resume generated successfully." });
    } catch (err) {
      setError("Failed to generate resume. The AI response couldn't be read — please try again.");
      setStatus({ type: "error", text: "Failed to generate resume. Please try again." });
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
      <div style={{ borderBottom: "1px solid #1e3a5f", padding: "20px 24px", background: "rgba(15,23,42,0.8)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}><button onClick={() => window.history.length > 1 ? window.history.back() : onBack()} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(148,163,184,0.2)", color: "#e2e8f0", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 18px rgba(2,6,23,0.18)", transition: "transform 180ms ease, border-color 180ms ease" }}>← Back</button><button onClick={onBack} style={{ background: "linear-gradient(135deg,#0ea5e9,#14b8a6)", border: "none", color: "#02111f", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 900, cursor: "pointer", boxShadow: "0 10px 24px rgba(14,165,233,0.24)", transition: "transform 180ms ease, box-shadow 180ms ease" }}>Home</button></div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Create Resume From Scratch</div>
          <div style={{ width: 60 }} />
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        {status && <StatusMessage type={status.type} text={status.text} />}

        {!resumeData && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 40, flexWrap: "wrap" }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <div onClick={() => i < step ? setStep(i) : null} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: i === step ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : i < step ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)", border: i === step ? "none" : i < step ? "1px solid rgba(59,130,246,0.3)" : "1px solid #1e3a5f", color: i === step ? "#fff" : i < step ? "#60a5fa" : "#475569", fontSize: 12, fontWeight: 600, cursor: i <= step ? "pointer" : "default" }}>{i < step ? "✓" : i + 1} {s}</div>
                {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: i < step ? "#3b82f6" : "#1e3a5f" }} />}
              </div>
            ))}
          </div>
        )}
          <div style={{ textAlign: "center", marginTop: 22 }}>
            <div style={{ background: "#0f172a", borderRadius: 12, padding: 20, display: "inline-block", border: "1px solid #1e3a5f" }}>
              <div style={{ transform: "scale(0.55)", transformOrigin: "top center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                <ResumeTemplate data={resumeData || demoResume} layout={TEMPLATES[template].layout} accent={accent} />
              </div>
            </div>
          </div>

        {!resumeData && (
          <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid #1e3a5f", borderRadius: 16, padding: 32, backdropFilter: "blur(10px)" }}>
            {step === 0 && <div><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#f1f5f9" }}>Personal Information</h2><p style={{ fontSize: 12.5, color: "#64748b", marginBottom: 20 }}>Fields marked <span style={{ color: "#f87171" }}>*</span> are required.</p><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{[["name", "Full Name", "John Doe", true], ["email", "Email", "john@email.com", true], ["phone", "Phone", "+91 98765 43210", true], ["location", "Location", "Mumbai, India", false], ["linkedin", "LinkedIn URL", "linkedin.com/in/johndoe", false], ["jobTitle", "Target Job Title", "Senior Software Engineer", true]].map(([field, label, ph, required]) => <div key={field}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{label}{required && <span style={{ color: "#f87171" }}> *</span>}</label><input value={form[field]} onChange={(e) => updateField(field, e.target.value)} placeholder={ph} style={{ width: "100%", background: "#0f172a", border: `1px solid ${required && !form[field].trim() ? "#7f1d1d" : "#1e3a5f"}`, borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} /></div>)}</div><div style={{ marginTop: 16 }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Professional Summary Notes (optional)</label><textarea value={form.summary} onChange={(e) => updateField("summary", e.target.value)} placeholder="Brief overview of your career..." rows={3} style={{ width: "100%", background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} /></div><AITip text="Use the exact job title from the posting you're targeting — it helps your resume match ATS keyword scans for that specific role." /></div>}

            {step === 1 && <div><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: "#f1f5f9" }}>Work Experience</h2>{form.experience.map((exp, i) => <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e3a5f", borderRadius: 12, padding: 20, marginBottom: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><span style={{ fontSize: 13, fontWeight: 600, color: "#60a5fa" }}>Experience {i + 1}</span>{i > 0 && <button onClick={() => removeExp(i)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer" }}>Remove</button>}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{[["role", "Job Title", "Software Engineer"], ["company", "Company", "Acme Corp"], ["duration", "Duration", "Jan 2022 – Present"]].map(([field, label, ph]) => <div key={field} style={field === "duration" ? { gridColumn: "1 / -1" } : {}}><label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>{label}</label><input value={exp[field]} onChange={(e) => updateExp(i, field, e.target.value)} placeholder={ph} style={{ width: "100%", background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} /></div>)}<div style={{ gridColumn: "1 / -1" }}><label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Key Responsibilities & Achievements</label><textarea value={exp.description} onChange={(e) => updateExp(i, "description", e.target.value)} placeholder="Built REST APIs, reduced load time by 40%, led a team of 5..." rows={3} style={{ width: "100%", background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} /></div></div></div>)}<button onClick={addExp} style={{ background: "rgba(59,130,246,0.1)", border: "1px dashed rgba(59,130,246,0.4)", color: "#60a5fa", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer", width: "100%" }}>+ Add Another Experience</button></div>}

            {step === 2 && <div><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: "#f1f5f9" }}>Education</h2>{form.education.map((edu, i) => <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e3a5f", borderRadius: 12, padding: 20, marginBottom: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><span style={{ fontSize: 13, fontWeight: 600, color: "#60a5fa" }}>Education {i + 1}</span>{i > 0 && <button onClick={() => removeEdu(i)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer" }}>Remove</button>}</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>{[["institution", "Institution", "IIT Bombay"], ["degree", "Degree", "B.Tech Computer Science"], ["year", "Year", "2018 – 2022"]].map(([field, label, ph]) => <div key={field}><label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>{label}</label><input value={edu[field]} onChange={(e) => updateEdu(i, field, e.target.value)} placeholder={ph} style={{ width: "100%", background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} /></div>)}</div></div>)}<button onClick={addEdu} style={{ background: "rgba(59,130,246,0.1)", border: "1px dashed rgba(59,130,246,0.4)", color: "#60a5fa", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer", width: "100%" }}>+ Add Another Education</button></div>}

            {step === 3 && <div><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#f1f5f9" }}>Skills</h2><p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>List your technical and soft skills separated by commas.</p><textarea value={form.skills} onChange={(e) => updateField("skills", e.target.value)} placeholder="React, Node.js, Python, AWS, SQL, Leadership, Problem Solving, Communication..." rows={6} style={{ width: "100%", background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: "12px 14px", color: "#e2e8f0", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} /></div>}

            {step === 4 && <div><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#f1f5f9" }}>Choose a Style & Generate</h2><p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Pick a resume style, then let AI craft your content.</p><div style={{ display: "flex", gap: 12, marginBottom: 28 }}>{Object.entries(TEMPLATES).map(([key, t]) => <div key={key} onClick={() => setTemplate(key)} style={{ flex: 1, cursor: "pointer", border: template === key ? `2px solid ${t.accent}` : "1px solid #1e3a5f", borderRadius: 10, padding: 14, textAlign: "center", background: template === key ? "rgba(255,255,255,0.03)" : "transparent" }}><div style={{ width: "100%", height: 8, borderRadius: 4, background: t.accent, marginBottom: 10 }} /><div style={{ fontSize: 13, fontWeight: 600, color: template === key ? "#f1f5f9" : "#94a3b8" }}>{t.name}</div></div>)}</div>{!loading && <div style={{ textAlign: "center", padding: "20px 0" }}><div style={{ fontSize: 48, marginBottom: 16 }}>✦</div><p style={{ color: "#94a3b8", marginBottom: 28, fontSize: 15 }}>Ready to generate your resume for <strong style={{ color: "#60a5fa" }}>{form.name || "you"}</strong></p><button onClick={generateResume} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "#fff", borderRadius: 10, padding: "14px 40px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.3px" }}>✦ Generate Resume with AI</button></div>}{loading && <div style={{ textAlign: "center", padding: "40px 0" }}><div style={{ width: 48, height: 48, border: "3px solid #1e3a5f", borderTop: "3px solid #3b82f6", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} /><p style={{ color: "#64748b" }}>AI is crafting your resume...</p><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>}{error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: 16, color: "#f87171", fontSize: 14, marginBottom: 16 }}>{error}</div>}</div>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid #1e3a5f" }}><button onClick={() => setStep((s) => s - 1)} disabled={step === 0} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1e3a5f", color: step === 0 ? "#334155" : "#94a3b8", borderRadius: 8, padding: "10px 22px", fontSize: 14, cursor: step === 0 ? "not-allowed" : "pointer" }}>← Back</button>{step === 0 && (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.jobTitle.trim()) && <span style={{ fontSize: 12.5, color: "#f87171" }}>Fill in name, email, phone, and target job title to continue</span>}{step < STEPS.length - 1 && <button onClick={() => setStep((s) => s + 1)} disabled={step === 0 && (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.jobTitle.trim())} style={{ background: step === 0 && (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.jobTitle.trim()) ? "#1e293b" : "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: step === 0 && (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.jobTitle.trim()) ? "#475569" : "#fff", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 600, cursor: step === 0 && (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.jobTitle.trim()) ? "not-allowed" : "pointer" }}>Next →</button>}</div>
        </div>
        )}

        {resumeData && <div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 14, fontWeight: 600, color: "#4ade80" }}>✓ Resume ready</span><div style={{ display: "flex", gap: 6 }}>{Object.entries(TEMPLATES).map(([key, t]) => <div key={key} onClick={() => setTemplate(key)} style={{ width: 22, height: 22, borderRadius: "50%", background: t.accent, cursor: "pointer", border: template === key ? "2px solid #fff" : "2px solid transparent" }} />)}</div></div><div style={{ display: "flex", gap: 10 }}><button onClick={() => setResumeData(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1e3a5f", color: "#94a3b8", borderRadius: 8, padding: "9px 18px", fontSize: 13, cursor: "pointer" }}>← Edit Details</button><button onClick={generateResume} style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#a78bfa", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>↻ Regenerate</button>
        {/* Added Save Button Here */}
        <button
          onClick={saveResume}
          style={{
            background: "#16a34a",
            border: "none",
            color: "#fff",
            borderRadius: 8,
            padding: "9px 22px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          💾 Save Resume
        </button>
        <button onClick={downloadPDF} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "#fff", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>⬇ Download PDF</button></div></div><div style={{ background: "#0f172a", borderRadius: 16, padding: "32px 0", display: "flex", justifyContent: "center", border: "1px solid #1e3a5f" }}><div style={{ transform: "scale(0.95)", transformOrigin: "top center", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}><ResumeTemplate ref={printRef} data={resumeData} layout={TEMPLATES[template].layout} accent={accent} /></div></div></div>}
      </div>
    </div>
  );
}

