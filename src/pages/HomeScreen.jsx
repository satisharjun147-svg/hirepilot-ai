export default function HomeScreen({ onOpen }) {
    let user = null;

  try {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      user = JSON.parse(savedUser);
    }
  } catch (error) {
    console.error("Invalid user data");
    localStorage.removeItem("user");
  }
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
  const howItWorks = [
    { step: "1", title: "Choose Template" },
    { step: "2", title: "Enter Details" },
    { step: "3", title: "AI Creates Resume" },
    { step: "4", title: "Download PDF" },
  ];

  const featureTiles = [
    { icon: "📄", title: "Resume Builder", desc: "Create an ATS-friendly resume in minutes with guided AI." , action: "resume" },
    { icon: "🎯", title: "ATS Checker", desc: "Score your resume and get clear fixes before you apply.", action: "ats" },
    { icon: "✉️", title: "Cover Letter Generator", desc: "Write tailored cover letters matched to each job post.", action: "coverletter" },
    { icon: "💼", title: "LinkedIn Optimizer", desc: "Improve your profile headline, summary, and impact bullets.", action: "linkedin" },
    { icon: "🎤", title: "Interview Coach", desc: "Practice answers for technical, HR, and behavioral rounds.", action: "interview" },
    { icon: "🚀", title: "Resume Improver", desc: "Upgrade an existing resume with stronger bullets and clarity.", action: "improve" },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      items: ["5 resumes", "3 cover letters", "ATS score", "Basic templates"],
    },
    {
      name: "Starter",
      price: "₹99/month",
      highlighted: true,
      items: ["Unlimited resumes", "Premium templates", "LinkedIn optimizer", "Interview coach"],
    },
    {
      name: "Pro",
      price: "₹299/month",
      items: ["Everything included", "Priority AI generation", "Future job matching"],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#020817,#0a1628,#020817)", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <nav style={{ borderBottom: "1px solid #1e3a5f", padding: "16px 24px", position: "sticky", top: 0, backdropFilter: "blur(14px)", background: "rgba(2,8,23,0.8)", zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>H</div>
            <div className="logo" style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>HirePilot</div>
          </div>
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#features" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Features</a>
            <a href="#templates" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Templates</a>
            <a href="#pricing" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Pricing</a>
            <a href="#ats" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>ATS Checker</a>
          </div>
          {user ? (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
    }}
  >
    <img
      src={user.photo}
      alt=""
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
      }}
    />

    <div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: "700",
          color: "#fff",
        }}
      >
        {user.name}
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#94a3b8",
        }}
      >
        {user.email}
      </div>
    </div>

    <button
      onClick={() => {
        localStorage.removeItem("user");
        window.location.reload();
      }}
      style={{
        background: "#ef4444",
        border: "none",
        color: "#fff",
        borderRadius: "8px",
        padding: "8px 12px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  </div>
) : (
  <button
    onClick={() => onOpen("login")}
    style={{
      background: "rgba(255,255,255,0.06)",
      border: "1px solid #1e3a5f",
      color: "#e2e8f0",
      borderRadius: 999,
      padding: "10px 18px",
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    Login
  </button>
)}
        </div>
      </nav>

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
            Create ATS-friendly resumes, cover letters, LinkedIn profiles, and interview-ready answers in minutes. No design skills required.
          </p>

          <div className="trust-badges" style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginTop: 20 }}>
            <span style={{ background: "#0f172a", color: "white", padding: "8px 15px", borderRadius: 20, fontSize: 14 }}>✓ ATS Optimized</span>
            <span style={{ background: "#0f172a", color: "white", padding: "8px 15px", borderRadius: 20, fontSize: 14 }}>✓ 25,000+ Resumes Created</span>
            <span style={{ background: "#0f172a", color: "white", padding: "8px 15px", borderRadius: 20, fontSize: 14 }}>✓ 4.8/5 User Rating</span>
            <span style={{ background: "#0f172a", color: "white", padding: "8px 15px", borderRadius: 20, fontSize: 14 }}>✓ Instant PDF Download</span>
          </div>

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

        <section style={{ marginTop: 64 }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, marginBottom: 24 }}>How HirePilot Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {howItWorks.map((item) => (
              <div key={item.title} style={{ background: "rgba(15,23,42,0.7)", border: "1px solid #1e3a5f", borderRadius: 16, padding: 24, textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", fontSize: 18, fontWeight: 800 }}>{item.step}</div>
                <h3 style={{ margin: 0, fontSize: 18 }}>{item.title}</h3>
              </div>
            ))}
          </div>
        </section>

        <div style={{ marginTop: 50, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>Our users have gone on to work at</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap", opacity: 0.6 }}>
            {companies.map((c) => <span key={c} style={{ fontSize: 16, fontWeight: 700, color: "#cbd5e1", letterSpacing: "-0.3px" }}>{c}</span>)}
          </div>
        </div>

        <section id="features" style={{ marginTop: 64 }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Everything You Need To Get Hired</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 14.5, marginBottom: 32 }}>Six AI tools, one place — from your first resume draft to your next interview.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {featureTiles.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                desc={feature.desc}
                onClick={() => onOpen(feature.action)}
                badge={feature.title === "ATS Checker" ? "Popular" : undefined}
              />
            ))}
          </div>
        </section>

        <section id="pricing" style={{ marginTop: 64, textAlign: "center" }}>
          <h2 style={{ fontSize: 24, marginBottom: 24, fontWeight: 800 }}>Pricing</h2>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {pricingPlans.map((plan) => (
              <div key={plan.name} style={{ background: plan.highlighted ? "linear-gradient(180deg, rgba(59,130,246,0.18), rgba(15,23,42,0.9))" : "rgba(15,23,42,0.7)", border: plan.highlighted ? "1px solid #3b82f6" : "1px solid #1e3a5f", borderRadius: 16, padding: 24, width: 240, textAlign: "left", boxShadow: plan.highlighted ? "0 20px 50px rgba(59,130,246,0.15)" : "none" }}>
                <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{plan.name}</div>
                <div style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 12px" }}>{plan.price}</div>
                {plan.items.map((it) => <div key={it} style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 8 }}>✓ {it}</div>)}
              </div>
            ))}
          </div>
        </section>

        <div style={{ textAlign: "center", marginTop: 70, paddingTop: 24, borderTop: "1px solid #1e3a5f", color: "#475569", fontSize: 12.5 }}>
          HirePilot · Built with AI · Your data stays in your browser
        </div>
      </div>
    </div>
  );
}