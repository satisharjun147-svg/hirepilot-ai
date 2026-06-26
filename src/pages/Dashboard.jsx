import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Dashboard({ onBack }) {
  const [userData, setUserData] = useState({
    plan: "free",
    resumeCount: 0,
    coverLetterCount: 0,
    atsCount: 0,
    resumeLimit: 5,
    coverLetterLimit: 3,
    atsLimit: 5,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.uid) return;

      const snapshot = await getDoc(doc(db, "users", user.uid));
      if (!snapshot.exists()) return;

      setUserData((current) => ({
        ...current,
        ...snapshot.data(),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const cardStyle = {
    background: "rgba(15,23,42,0.82)",
    border: "1px solid rgba(125,211,252,0.16)",
    borderRadius: 16,
    padding: 24,
    textAlign: "left",
    boxShadow: "0 18px 45px rgba(2,6,23,0.22)",
  };

  const planName = userData.plan
    ? userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1)
    : "Free";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, rgba(14,165,233,0.2), transparent 26%), linear-gradient(135deg,#020817,#0a1628,#020817)",
        color: "#fff",
        padding: "30px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(148,163,184,0.2)",
            color: "#fff",
            borderRadius: 999,
            padding: "9px 14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "#7dd3fc", textTransform: "uppercase", fontSize: 12, fontWeight: 800, letterSpacing: "0.16em" }}>Workspace</div>
            <h1 style={{ margin: "8px 0 8px", fontSize: 34, fontWeight: 800 }}>Dashboard</h1>
            <p style={{ margin: 0, color: "#cbd5e1", maxWidth: 620, lineHeight: 1.6 }}>
              Keep track of your plan, usage, and progress from one calm, premium place.
            </p>
          </div>
          <div style={{ background: "rgba(14,165,233,0.12)", border: "1px solid rgba(125,211,252,0.22)", borderRadius: 999, padding: "8px 12px", color: "#bae6fd", fontSize: 13, fontWeight: 800 }}>
            Plan • {planName}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px", marginTop: "28px" }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: "#7dd3fc", fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>Current plan</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 24 }}>{planName}</h2>
            <p style={{ margin: "0 0 14px", color: "#94a3b8" }}>More flexibility, more credits, better flow.</p>
            <button
              onClick={() => alert("Coming Soon")}
              style={{
                background: "linear-gradient(135deg,#0ea5e9,#14b8a6)",
                border: "none",
                color: "#02111f",
                borderRadius: 10,
                padding: "10px 16px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Upgrade Plan
            </button>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: "#7dd3fc", fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>Resume usage</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 24 }}>
              {userData.resumeCount || 0} / {userData.resumeLimit || 5}
            </h2>
            <p style={{ margin: 0, color: "#94a3b8" }}>Resume generations and rewrites.</p>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: "#7dd3fc", fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>ATS usage</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 24 }}>
              {userData.atsCount || 0} / {userData.atsLimit || 5}
            </h2>
            <p style={{ margin: 0, color: "#94a3b8" }}>Role-based ATS checks and feedback.</p>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, color: "#7dd3fc", fontWeight: 800, textTransform: "uppercase", marginBottom: 8 }}>Cover letters</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 24 }}>
              {userData.coverLetterCount || 0} / {userData.coverLetterLimit || 3}
            </h2>
            <p style={{ margin: 0, color: "#94a3b8" }}>Tailored letters and outreach drafts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
