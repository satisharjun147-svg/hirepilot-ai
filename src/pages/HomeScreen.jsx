const brand = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at 20% 0%, rgba(14,165,233,0.22), transparent 30%), linear-gradient(135deg,#07111f,#0c1624 48%,#0f172a)",
    color: "#f8fafc",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  shell: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 24px",
  },
  button: {
    border: "none",
    borderRadius: 10,
    padding: "11px 16px",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
};

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Invalid user data", error);
    localStorage.removeItem("user");
    return null;
  }
}

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function HomeScreen({ onOpen }) {
  const user = getSavedUser();
  const planLabel = user?.plan === "pro" ? "Pro" : user?.plan === "starter" ? "Starter" : "Free";
  const usageSummary = [
    { label: "Resumes", value: user?.resumeCount || 0, limit: user?.resumeLimit || 5 },
    { label: "ATS", value: user?.atsCount || 0, limit: user?.atsLimit || 5 },
    { label: "Letters", value: user?.coverLetterCount || 0, limit: user?.coverLetterLimit || 3 },
  ];

  const featureTiles = [
    { key: "resume", mark: "RB", title: "Resume Builder", desc: "Create a sharp ATS-ready resume from scratch.", cta: "Build resume" },
    { key: "improve", mark: "IR", title: "Improve Resume", desc: "Upload your current resume and rewrite weak bullets.", cta: "Improve now" },
    { key: "ats", mark: "ATS", title: "ATS Checker", desc: "Score your resume against a role and find gaps.", cta: "Check score", badge: "Popular" },
    { key: "coverletter", mark: "CL", title: "Cover Letter", desc: "Generate a tailored letter for each opening.", cta: "Write letter" },
    { key: "linkedin", mark: "IN", title: "LinkedIn Optimizer", desc: "Upgrade your headline, about section, and profile.", cta: "Optimize" },
    { key: "interview", mark: "IC", title: "Interview Coach", desc: "Practice stronger answers before the call.", cta: "Practice" },
  ];

  const savedItems = [
    { key: "myresumes", label: "My Resumes", value: "Resumes", accent: "#38bdf8" },
    { key: "mycoverletters", label: "My Cover Letters", value: "Letters", accent: "#f59e0b" },
    { key: "myatsreports", label: "My ATS Reports", value: "Reports", accent: "#22c55e" },
  ];

  const steps = ["Choose a role", "Add your details", "Let AI polish", "Download and apply"];
  const companies = ["Google", "Amazon", "Microsoft", "Infosys", "TCS", "Deloitte", "Accenture"];

  const FeatureCard = ({ feature }) => (
    <div
      style={{
        textAlign: "left",
        background: "rgba(15,23,42,0.74)",
        border: "1px solid rgba(125,211,252,0.16)",
        borderRadius: 12,
        padding: 20,
        minHeight: 176,
        color: "inherit",
        boxShadow: "0 18px 45px rgba(2,6,23,0.22)",
        transition: "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "rgba(125,211,252,0.32)";
        e.currentTarget.style.boxShadow = "0 24px 60px rgba(2,6,23,0.34)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(125,211,252,0.16)";
        e.currentTarget.style.boxShadow = "0 18px 45px rgba(2,6,23,0.22)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg,#0ea5e9,#14b8a6)",
            color: "#02111f",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          {feature.mark}
        </span>
        {feature.badge && (
          <span style={{ color: "#fef3c7", fontSize: 11, fontWeight: 800, background: "rgba(245,158,11,0.13)", border: "1px solid rgba(245,158,11,0.24)", borderRadius: 999, padding: "5px 8px", height: 16 }}>
            {feature.badge}
          </span>
        )}
      </div>
      <h3 style={{ margin: "0 0 8px", fontSize: 18, letterSpacing: 0 }}>{feature.title}</h3>
      <p style={{ margin: 0, color: "#94a3b8", fontSize: 13.5, lineHeight: 1.55 }}>{feature.desc}</p>
      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <button onClick={() => onOpen(feature.key)} style={{ background: "transparent", border: "none", color: "#7dd3fc", fontSize: 13, fontWeight: 900, cursor: "pointer", padding: 0 }}>
          {feature.cta}
        </button>
        <button onClick={() => onOpen(feature.key, { newTab: true })} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(148,163,184,0.16)", color: "#cbd5e1", borderRadius: 999, padding: "5px 9px", fontSize: 11.5, fontWeight: 800, cursor: "pointer" }}>
          New tab
        </button>
      </div>
    </div>
  );

  return (
    <div style={brand.page}>
      <nav style={{ borderBottom: "1px solid rgba(148,163,184,0.16)", position: "sticky", top: 0, zIndex: 20, background: "rgba(7,17,31,0.84)", backdropFilter: "blur(16px)" }}>
        <div style={{ ...brand.shell, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, paddingTop: 14, paddingBottom: 14, flexWrap: "wrap" }}>
          <button onClick={() => onOpen("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 0, transition: "opacity 180ms ease" }}>
            <span style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#38bdf8,#2dd4bf)", display: "grid", placeItems: "center", color: "#031525", fontWeight: 900 }}>H</span>
            <span style={{ fontWeight: 900, fontSize: 18 }}>HirePilot</span>
          </button>

          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#workspace" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Workspace</a>
            <a href="#features" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Tools</a>
            <a href="#pricing" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>Pricing</a>
          </div>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button onClick={() => onOpen("dashboard")} style={{ ...brand.button, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(148,163,184,0.18)", transition: "transform 180ms ease, background 180ms ease" }}>
                Dashboard
              </button>
              <button onClick={() => onOpen("pricing")} style={{ ...brand.button, background: "#0ea5e9", transition: "transform 180ms ease, filter 180ms ease" }}>
                Upgrade
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
                style={{ ...brand.button, background: "transparent", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.28)" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => onOpen("login")} style={{ ...brand.button, background: "#f8fafc", color: "#07111f" }}>
              Login
            </button>
          )}
        </div>
      </nav>

      <main style={{ ...brand.shell, paddingTop: 42, paddingBottom: 42 }}>
        {user ? (
          <section className="home-workspace-grid" id="workspace" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(280px,0.65fr)", gap: 22, alignItems: "stretch" }}>
            <div style={{ background: "linear-gradient(135deg,rgba(14,165,233,0.18),rgba(20,184,166,0.12)), rgba(15,23,42,0.74)", border: "1px solid rgba(125,211,252,0.18)", borderRadius: 18, padding: 28, boxShadow: "0 24px 70px rgba(2,6,23,0.34)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                {user.photo ? (
                  <img src={user.photo} alt={user.name || "Profile"} style={{ width: 54, height: 54, borderRadius: "50%", background: "#1e293b", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#14b8a6)", color: "#02111f", display: "grid", placeItems: "center", fontWeight: 900 }}>
                    {getInitials(user.name)}
                  </div>
                )}
                <div>
                  <div style={{ color: "#94a3b8", fontSize: 13, fontWeight: 700 }}>Welcome back</div>
                  <h1 style={{ margin: "3px 0 0", fontSize: 34, lineHeight: 1.1, letterSpacing: 0 }}>
                    {user.name || "Candidate"}
                  </h1>
                </div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "rgba(14,165,233,0.16)", border: "1px solid rgba(125,211,252,0.24)", color: "#bae6fd", fontSize: 12.5, fontWeight: 800, marginBottom: 20 }}>
                Current plan: {planLabel}
              </div>
              <p style={{ maxWidth: 620, color: "#cbd5e1", margin: "0 0 24px", fontSize: 16, lineHeight: 1.65 }}>
                Your workspace is ready. Pick the next best action and keep every saved resume, letter, and ATS report in one polished place.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => onOpen("resume")} style={{ ...brand.button, background: "linear-gradient(135deg,#0ea5e9,#14b8a6)", color: "#02111f" }}>
                  Build New Resume
                </button>
                <button onClick={() => onOpen("ats")} style={{ ...brand.button, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(148,163,184,0.18)" }}>
                  Check ATS Score
                </button>
                <button onClick={() => onOpen("improve")} style={{ ...brand.button, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(148,163,184,0.18)" }}>
                  Improve Existing Resume
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginTop: 18 }}>
                {usageSummary.map((item) => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(148,163,184,0.14)", borderRadius: 10, padding: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{item.value}/{item.limit}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 3 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <aside style={{ background: "rgba(15,23,42,0.74)", border: "1px solid rgba(148,163,184,0.16)", borderRadius: 18, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#7dd3fc", textTransform: "uppercase", marginBottom: 14 }}>Saved work</div>
              <div style={{ display: "grid", gap: 10 }}>
                {savedItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onOpen(item.key)}
                    style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12, padding: 14, color: "#fff", textAlign: "left", cursor: "pointer", transition: "transform 180ms ease, border-color 180ms ease" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 800 }}>{item.label}</span>
                      <span style={{ width: 9, height: 9, borderRadius: "50%", background: item.accent }} />
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>{item.value}</div>
                  </button>
                ))}
              </div>
            </aside>
          </section>
        ) : (
          <section className="home-hero-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: 28, alignItems: "center", paddingTop: 18 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 13px", borderRadius: 999, background: "rgba(14,165,233,0.12)", border: "1px solid rgba(125,211,252,0.22)", color: "#bae6fd", fontSize: 13, fontWeight: 800 }}>
                3 free AI credits • no card required
              </div>
              <h1 className="home-hero-title" style={{ fontSize: 56, lineHeight: 1.04, margin: "20px 0 16px", maxWidth: 760, letterSpacing: 0 }}>
                Build a resume that feels ready before the recruiter even opens it.
              </h1>
              <p style={{ color: "#cbd5e1", maxWidth: 640, fontSize: 17, lineHeight: 1.7, margin: 0 }}>
                HirePilot helps you create ATS-friendly resumes, tailored letters, LinkedIn copy, and interview answers from one polished workspace.
              </p>
              <div style={{ marginTop: 20, padding: "18px 20px", borderRadius: 16, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(148,163,184,0.16)", maxWidth: 700 }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#7dd3fc", marginBottom: 8 }}>
                  AI-powered job application tools
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 24, lineHeight: 1.25, color: "#f8fafc" }}>
                  AI resume builder, ATS checker, and cover letter generator in one place.
                </h2>
                <p style={{ margin: 0, color: "#cbd5e1", fontSize: 15, lineHeight: 1.65 }}>
                  Use HirePilot AI to build a resume with AI, improve an existing resume, optimize your LinkedIn profile, and prepare for interviews faster.
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <button onClick={() => onOpen("resume")} style={{ ...brand.button, background: "linear-gradient(135deg,#0ea5e9,#14b8a6)", color: "#02111f", padding: "14px 22px" }}>
                  Build My Resume Free
                </button>
                <button onClick={() => onOpen("login")} style={{ ...brand.button, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(148,163,184,0.18)", padding: "14px 22px" }}>
                  Login
                </button>
              </div>
            </div>

            <div style={{ background: "#f8fafc", color: "#0f172a", borderRadius: 18, padding: 22, boxShadow: "0 28px 80px rgba(0,0,0,0.34)" }}>
              <div style={{ borderBottom: "2px solid #0f172a", paddingBottom: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 26, fontWeight: 900 }}>Asha Kapoor</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>Senior Software Engineer</div>
              </div>
              {[
                "Scaled API performance by 42% through caching and query redesign.",
                "Led 4 engineers across a multi-tenant SaaS migration.",
                "Built hiring-ready bullets with clean ATS structure.",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: 8, marginBottom: 12, color: "#334155", fontSize: 13, lineHeight: 1.45 }}>
                  <span style={{ color: "#0ea5e9", fontWeight: 900 }}>•</span>
                  <span>{item}</span>
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 18 }}>
                {["React", "Node.js", "AWS", "SQL"].map((skill) => (
                  <span key={skill} style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: "7px 8px", fontSize: 12, fontWeight: 800 }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section style={{ marginTop: 54 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12 }}>
            {[
              ["2 min", "Average build time"],
              ["6", "Career AI tools"],
              ["25k+", "Resumes created"],
              ["4.8/5", "User rating"],
            ].map(([stat, label]) => (
              <div key={label} style={{ background: "rgba(15,23,42,0.58)", border: "1px solid rgba(148,163,184,0.14)", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 900 }}>{stat}</div>
                <div style={{ color: "#94a3b8", fontSize: 12.5, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" style={{ marginTop: 58 }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18, marginBottom: 18, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#7dd3fc", fontSize: 12, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>Career toolkit</div>
              <h2 style={{ margin: 0, fontSize: 30, letterSpacing: 0 }}>Everything needed before you apply</h2>
            </div>
            <button onClick={() => onOpen("pricing")} style={{ ...brand.button, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(148,163,184,0.18)" }}>
              View Plans
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {featureTiles.map((feature) => (
              <FeatureCard key={feature.key} feature={feature} />
            ))}
          </div>
        </section>

        <section className="home-two-column" style={{ marginTop: 58, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "rgba(15,23,42,0.58)", border: "1px solid rgba(148,163,184,0.14)", borderRadius: 8, padding: 22 }}>
            <h2 style={{ margin: "0 0 18px", fontSize: 24 }}>How it works</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {steps.map((step, index) => (
                <div key={step} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: "#0ea5e9", color: "#02111f", display: "grid", placeItems: "center", fontWeight: 900 }}>{index + 1}</span>
                  <span style={{ color: "#dbeafe", fontWeight: 750 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div id="pricing" style={{ background: "rgba(15,23,42,0.58)", border: "1px solid rgba(148,163,184,0.14)", borderRadius: 8, padding: 22 }}>
            <h2 style={{ margin: "0 0 14px", fontSize: 24 }}>Free to start</h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.6, margin: "0 0 18px" }}>Create resumes, run ATS checks, and save your work. Upgrade when you want more capacity.</p>
            <button onClick={() => onOpen("pricing")} style={{ ...brand.button, background: "#f8fafc", color: "#07111f" }}>
              See Pricing
            </button>
          </div>
        </section>

        <section style={{ marginTop: 48, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", fontWeight: 900, marginBottom: 16 }}>Users target roles at</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", color: "#cbd5e1", opacity: 0.72, fontWeight: 800 }}>
            {companies.map((company) => (
              <span key={company}>{company}</span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
