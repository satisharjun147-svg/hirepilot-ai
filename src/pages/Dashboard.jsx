import { useEffect, useState } from "react";
import {
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";

export default function Dashboard({ onBack }) {
  const [userData, setUserData] = useState({
    plan: "free",
    resumeCount: 0,
    coverLetterCount: 0,
    atsCount: 0,
    resumeLimit: 5,
    coverLetterLimit: 3,
    atsLimit: 5
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
        ...snapshot.data()
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const cardStyle = {
    background: "#0f172a",
    border: "1px solid #1e3a5f",
    borderRadius: 12,
    padding: 24,
    textAlign: "center"
  };

  const planName = userData.plan
    ? userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1)
    : "Free";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020817",
        color: "#fff",
        padding: "30px"
      }}
    >
      <button onClick={onBack}>
        Back
      </button>

      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        <div style={cardStyle}>
          <h2>{planName}</h2>
          <p>Current Plan</p>
          <button
            onClick={() => alert("Coming Soon")}
            style={{
              background: "#2563eb",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              padding: "10px 16px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Upgrade Plan
          </button>
        </div>

        <div style={cardStyle}>
          <h2>
            {userData.resumeCount || 0} / {userData.resumeLimit || 5}
          </h2>
          <p>Resume Usage</p>
        </div>

        <div style={cardStyle}>
          <h2>
            {userData.atsCount || 0} / {userData.atsLimit || 5}
          </h2>
          <p>ATS Usage</p>
        </div>

        <div style={cardStyle}>
          <h2>
            {userData.coverLetterCount || 0} / {userData.coverLetterLimit || 3}
          </h2>
          <p>Cover Letter Usage</p>
        </div>
      </div>
    </div>
  );
}
