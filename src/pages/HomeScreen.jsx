export default function HomeScreen({ onOpen }) {
  const FeatureCard = ({ icon, title, desc, onClick, badge }) => (
    <div
      onClick={onClick}
      style={{
        background: "rgba(15,23,42,0.7)",
        border: "1px solid #1e3a5f",
        borderRadius: 16,
        padding: 24,
        cursor: "pointer",
        minHeight: 170,
        position: "relative",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e3a5f")}
    >
      {badge && (
        <span style={{ position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 700, color: "#facc15", background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.3)", borderRadius: 12, padding: "2px 8px" }}>
          {badge}
        </span>
      )}
      <div style={{ fontSize: 34, marginBottom: 12 }}>{icon}</div>
      <h3 style={{ margin: "0 0 8px", color: "#fff", fontSize: 17 }}>{title}</h3>
      <p style={{ color: "#94a3b8", margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>{desc}</p>
    </div>
  );

  const companies = ["Google", "Amazon", "Microsoft", "Infosys", "TCS", "Flipkart", "Deloitte", "Accenture"];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#020817,#0a1628,#020817)", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ borderBottom: "1px solid #1e3a5f", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>H</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>HirePilot</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 30, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", fontSize: 13 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
            3 Free AI Credits — No card required
          </div>

          <h1 style={{ fontSize: 50, marginTop: 22, marginBottom: 14, fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            Build a job-winning resume<br />in just <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2 minutes</span> with AI
          </h1>
          <p style={{ maxWidth: 620, margin: "0 auto", color: "#94a3b8", fontSize: 17, lineHeight: 1.6 }}>
            From your first draft to your next offer — build, score, and polish your resume, cover letter, LinkedIn, and interview answers, all powered by AI.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <button onClick={() => onOpen("resume")} style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "#fff", borderRadius: 10, padding: "14px 30px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              ✦ Build My Resume Free
            </button>
            <button onClick={() => onOpen("improve")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #1e3a5f", color: "#e2e8f0", borderRadius: 10, padding: "14px 30px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Improve My Existing Resume
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 40, flexWrap: "wrap" }}>
            {[["2 min", "Average build time"], ["6", "AI tools in one place"], ["100%", "Free to start"]].map(([stat, label]) => (
              <div key={label}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{stat}</div>
                <div style={{ fontSize: 12.5, color: "#64748b" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 50, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>Our users have gone on to work at</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap", opacity: 0.6 }}>
            {companies.map((c) => <span key={c} style={{ fontSize: 16, fontWeight: 700, color: "#cbd5e1", letterSpacing: "-0.3px" }}>{c}</span>)}
          </div>
        </div>

        <div style={{ marginTop: 64 }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Everything you need to get hired</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 14.5, marginBottom: 32 }}>Six AI tools, one place — from your first resume draft to your next interview.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            <FeatureCard icon="📄" title="Create Resume From Scratch" desc="Build an ATS-friendly resume using AI, step by step." onClick={() => onOpen("resume")} />
            <FeatureCard icon="🚀" title="Improve Existing Resume" desc="Upload your PDF or DOCX resume and let AI rewrite it." onClick={() => onOpen("improve")} />
            <FeatureCard icon="🎯" title="ATS Checker" desc="Get an ATS score and see exactly what to fix." onClick={() => onOpen("ats")} />
            <FeatureCard icon="✉️" title="Cover Letter Generator" desc="Generate a tailored cover letter from your resume + job post." onClick={() => onOpen("coverletter")} />
            <FeatureCard icon="💼" title="LinkedIn Optimizer" desc="Get a headline, About section, and experience bullets." onClick={() => onOpen("linkedin")} />
            <FeatureCard icon="🎤" title="Interview Coach" desc="Practice technical, HR, and behavioral questions." onClick={() => onOpen("interview")} />
          </div>
        </div>

        <div style={{ marginTop: 64, textAlign: "center" }}>
          <h2 style={{ fontSize: 24, marginBottom: 24, fontWeight: 800 }}>Simple, honest pricing</h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { name: "Free", price: "₹0", items: ["3 resumes", "1 template", "PDF download"] },
              { name: "Resume Pro", price: "₹49", items: ["Unlimited edits", "All templates"] },
              { name: "Career Pack", price: "₹149", items: ["ATS Score", "Job Match", "Cover Letter", "LinkedIn Optimizer"] },
              { name: "Premium", price: "₹299", items: ["Interview Coach", "Career Advisor", "Everything else"] },
            ].map((p) => (
              <div key={p.name} style={{ background: "rgba(15,23,42,0.7)", border: "1px solid #1e3a5f", borderRadius: 14, padding: 22, width: 200, textAlign: "left" }}>
                <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{p.name}</div>
                <div style={{ fontSize: 26, fontWeight: 800, margin: "6px 0 12px" }}>{p.price}</div>
                {p.items.map((it) => <div key={it} style={{ fontSize: 12.5, color: "#cbd5e1", marginBottom: 6 }}>✓ {it}</div>)}
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 70, paddingTop: 24, borderTop: "1px solid #1e3a5f", color: "#475569", fontSize: 12.5 }}>
          HirePilot · Built with AI · Your data stays in your browser
        </div>
      </div>
    </div>
  );
}