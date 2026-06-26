import { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#07111f,#0f172a)",
  color: "#f8fafc",
  padding: "28px",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
};

const btn = {
  border: "none",
  borderRadius: 8,
  padding: "9px 13px",
  fontWeight: 800,
  cursor: "pointer",
};

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function scoreColor(score) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#f87171";
}

function ReportSection({ title, items }) {
  return (
    <div style={{ marginTop: 22 }}>
      <h2 style={{ color: "#7dd3fc", fontSize: 13, textTransform: "uppercase", marginBottom: 10 }}>{title}</h2>
      <div style={{ display: "grid", gap: 8 }}>
        {(items || []).map((item, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 8, padding: 12, color: "#cbd5e1", lineHeight: 1.55 }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyATSReports({ onBack }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const user = getUser();
      if (!user) return;

      const safeUserId = user.uid || user.email;
      const q = query(collection(db, "atsreports"), where("userId", "==", safeUserId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete ATS report?")) return;

    try {
      const user = getUser();
      await deleteDoc(doc(db, "atsreports", id));
      setReports((items) => items.filter((r) => r.id !== id));

      if (user?.uid) {
        await updateDoc(doc(db, "users", user.uid), { atsCount: increment(-1) });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (selectedReport) {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button onClick={() => setSelectedReport(null)} style={{ ...btn, background: "rgba(255,255,255,0.08)", color: "#cbd5e1", marginBottom: 22 }}>
            Back
          </button>

          <div style={{ background: "rgba(15,23,42,0.74)", border: "1px solid rgba(148,163,184,0.16)", borderRadius: 8, padding: 26 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, borderBottom: "1px solid rgba(148,163,184,0.16)", paddingBottom: 18, marginBottom: 6 }}>
              <span style={{ fontSize: 58, fontWeight: 900, color: scoreColor(selectedReport.score) }}>{selectedReport.score}</span>
              <span style={{ color: "#94a3b8", fontSize: 20 }}>/ 100 ATS Score</span>
            </div>

            <ReportSection title="Missing Keywords" items={selectedReport.missingKeywords} />
            <ReportSection title="Formatting Issues" items={selectedReport.formattingIssues} />
            <ReportSection title="Section Completeness" items={selectedReport.sectionCompleteness} />
            <ReportSection title="Keyword Density" items={selectedReport.keywordDensity} />
            <ReportSection title="Recommendations" items={selectedReport.recommendations} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 1020, margin: "0 auto" }}>
        <button onClick={onBack} style={{ ...btn, background: "rgba(255,255,255,0.08)", color: "#cbd5e1", marginBottom: 22 }}>
          Back
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 18, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <div style={{ color: "#7dd3fc", fontSize: 12, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>ATS history</div>
            <h1 style={{ margin: 0, fontSize: 36 }}>My ATS Reports</h1>
          </div>
          <div style={{ color: "#94a3b8", fontWeight: 700 }}>{reports.length} saved</div>
        </div>

        {reports.length === 0 ? (
          <div style={{ background: "rgba(15,23,42,0.72)", border: "1px solid rgba(148,163,184,0.16)", borderRadius: 8, padding: 28 }}>
            <h2 style={{ marginTop: 0 }}>No ATS reports yet</h2>
            <p style={{ color: "#94a3b8", marginBottom: 0 }}>Run an ATS check and save the report to see it here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {reports.map((report) => (
              <div key={report.id} style={{ background: "rgba(15,23,42,0.72)", border: "1px solid rgba(148,163,184,0.16)", borderRadius: 8, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <div>
                    <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 800 }}>
                      {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Saved report"}
                    </div>
                    <h3 style={{ margin: "8px 0 0", fontSize: 18 }}>ATS Report</h3>
                  </div>
                  <div style={{ color: scoreColor(report.score), fontSize: 34, fontWeight: 900 }}>{report.score}</div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                  <button onClick={() => setSelectedReport(report)} style={{ ...btn, background: "#0ea5e9", color: "#02111f" }}>
                    Open
                  </button>
                  <button onClick={() => deleteReport(report.id)} style={{ ...btn, background: "rgba(248,113,113,0.14)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.24)" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
