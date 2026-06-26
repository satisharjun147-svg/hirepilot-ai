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

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "Saved resume";
}

export default function MyResumes({ onBack }) {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const user = getUser();
      if (!user) return;

      const safeUserId = user.uid || user.email;
      const q = query(collection(db, "resumes"), where("userId", "==", safeUserId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));

      setResumes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;

    try {
      const user = getUser();
      await deleteDoc(doc(db, "resumes", id));
      setResumes((items) => items.filter((r) => r.id !== id));

      if (user?.uid) {
        await updateDoc(doc(db, "users", user.uid), { resumeCount: increment(-1) });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (selectedResume) {
    const r = selectedResume.resumeData || {};

    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <button onClick={() => setSelectedResume(null)} style={{ ...btn, background: "rgba(255,255,255,0.08)", color: "#cbd5e1", marginBottom: 22 }}>
            Back
          </button>

          <div style={{ background: "#f8fafc", color: "#0f172a", borderRadius: 8, padding: 32, boxShadow: "0 24px 70px rgba(2,6,23,0.35)" }}>
            <div style={{ borderBottom: "2px solid #0f172a", paddingBottom: 16, marginBottom: 20 }}>
              <h1 style={{ margin: 0, fontSize: 34 }}>{r.name || selectedResume.name || "Resume"}</h1>
              <p style={{ margin: "6px 0 0", color: "#475569" }}>{r.jobTitle || selectedResume.email}</p>
            </div>

            {r.summary && (
              <>
                <h2 style={{ fontSize: 15, textTransform: "uppercase" }}>Summary</h2>
                <p style={{ lineHeight: 1.65 }}>{r.summary}</p>
              </>
            )}

            {!!r.skills?.length && (
              <>
                <h2 style={{ fontSize: 15, textTransform: "uppercase" }}>Skills</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {r.skills.map((s, i) => (
                    <span key={i} style={{ border: "1px solid #cbd5e1", borderRadius: 6, padding: "6px 9px", fontSize: 13, fontWeight: 700 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}

            {!!r.experience?.length && (
              <>
                <h2 style={{ fontSize: 15, textTransform: "uppercase", marginTop: 24 }}>Experience</h2>
                {r.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: 18 }}>
                    <h3 style={{ margin: "0 0 6px" }}>{exp.role} {exp.company ? `at ${exp.company}` : ""}</h3>
                    <ul style={{ marginTop: 6, lineHeight: 1.6 }}>
                      {(exp.bullets || []).map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}
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
            <div style={{ color: "#7dd3fc", fontSize: 12, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>Resume library</div>
            <h1 style={{ margin: 0, fontSize: 36 }}>My Resumes</h1>
          </div>
          <div style={{ color: "#94a3b8", fontWeight: 700 }}>{resumes.length} saved</div>
        </div>

        {resumes.length === 0 ? (
          <div style={{ background: "rgba(15,23,42,0.72)", border: "1px solid rgba(148,163,184,0.16)", borderRadius: 8, padding: 28 }}>
            <h2 style={{ marginTop: 0 }}>No resumes saved yet</h2>
            <p style={{ color: "#94a3b8", marginBottom: 0 }}>Create and save your first resume to see it here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {resumes.map((resume) => (
              <div key={resume.id} style={{ background: "rgba(15,23,42,0.72)", border: "1px solid rgba(148,163,184,0.16)", borderRadius: 8, padding: 18 }}>
                <div style={{ color: "#7dd3fc", fontSize: 12, fontWeight: 900, marginBottom: 10 }}>{formatDate(resume.createdAt)}</div>
                <h3 style={{ margin: "0 0 6px", fontSize: 20 }}>{resume.name || "Untitled Resume"}</h3>
                <p style={{ margin: "0 0 18px", color: "#94a3b8", fontSize: 13 }}>{resume.email || resume.resumeData?.jobTitle || "Ready to open"}</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setSelectedResume(resume)} style={{ ...btn, background: "#0ea5e9", color: "#02111f" }}>
                    Open
                  </button>
                  <button onClick={() => deleteResume(resume.id)} style={{ ...btn, background: "rgba(248,113,113,0.14)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.24)" }}>
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
