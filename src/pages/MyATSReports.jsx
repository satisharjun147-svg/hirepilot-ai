import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { db } from "../firebase";

export default function MyATSReports({ onBack }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const q = query(
        collection(db, "atsreports"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete ATS report?")) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await deleteDoc(doc(db, "atsreports", id));

      setReports(reports.filter((r) => r.id !== id));

      if (user?.uid) {
        await updateDoc(
          doc(db, "users", user.uid),
          {
            atsCount: increment(-1)
          }
        );
      }

      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (selectedReport) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#020817",
          color: "white",
          padding: 30
        }}
      >
        <button onClick={() => setSelectedReport(null)}>
          Back
        </button>

        <h1>
          ATS Score: {selectedReport.score}
        </h1>

        <h2>Missing Keywords</h2>
        <ul>
          {(selectedReport.missingKeywords || []).map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>

        <h2>Formatting Issues</h2>
        <ul>
          {(selectedReport.formattingIssues || []).map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>

        <h2>Section Completeness</h2>
        <ul>
          {(selectedReport.sectionCompleteness || []).map((section, i) => (
            <li key={i}>{section}</li>
          ))}
        </ul>

        <h2>Keyword Density</h2>
        <ul>
          {(selectedReport.keywordDensity || []).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2>Recommendations</h2>
        <ul>
          {(selectedReport.recommendations || []).map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020817",
        color: "white",
        padding: "30px"
      }}
    >
      <button onClick={onBack}>
        Back
      </button>

      <h1>My ATS Reports</h1>

      {reports.length === 0 ? (
        <p>No ATS reports found.</p>
      ) : (
        reports.map((report) => (
          <div
            key={report.id}
            style={{
              border: "1px solid #334155",
              borderRadius: 12,
              padding: 20,
              marginBottom: 15
            }}
          >
            <h3>
              ATS Score: {report.score}
            </h3>

            <p>
              {report.createdAt
                ? new Date(report.createdAt).toLocaleDateString()
                : ""}
            </p>

            <div
              style={{
                display: "flex",
                gap: 10
              }}
            >
              <button
                onClick={() => setSelectedReport(report)}
              >
                Open
              </button>

              <button
                onClick={() => deleteReport(report.id)}
                style={{
                  background: "#ef4444",
                  color: "#fff"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
