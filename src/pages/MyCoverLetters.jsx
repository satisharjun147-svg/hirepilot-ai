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

export default function MyCoverLetters({ onBack }) {
  const [letters, setLetters] = useState([]);
  // Step 1: Added state for selected letter
  const [selectedLetter, setSelectedLetter] = useState(null);

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      // Safe fallback to match our save function
      const safeUserId = user.uid || user.email;

      const q = query(
        collection(db, "coverletters"),
        where("userId", "==", safeUserId)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setLetters(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLetter = async (id) => {
    const ok = window.confirm("Delete this cover letter?");

    if (!ok) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await deleteDoc(doc(db, "coverletters", id));

      setLetters(letters.filter((l) => l.id !== id));

      if (user?.uid) {
        await updateDoc(
          doc(db, "users", user.uid),
          {
            coverLetterCount: increment(-1)
          }
        );
      }

      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Step 2: Added early return for viewing a selected letter
  if (selectedLetter) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#020817",
          color: "white",
          padding: "30px",
        }}
      >
        <button
          onClick={() => setSelectedLetter(null)}
          style={{
            background: "transparent",
            border: "none",
            color: "#60a5fa",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          ← Back
        </button>

        <h1>
          {selectedLetter.companyName || "Cover Letter"}
        </h1>

        <div
          style={{
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "25px",
            marginTop: "20px",
            whiteSpace: "pre-wrap",
            lineHeight: "1.8",
            color: "#e2e8f0"
          }}
        >
          {selectedLetter.content}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020817",
        color: "white",
        padding: "30px",
      }}
    >
      <button
        onClick={onBack}
        style={{
          background: "transparent",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "20px"
        }}
      >
        ← Back
      </button>

      <h1>My Cover Letters</h1>

      {letters.length === 0 ? (
        <p>No cover letters saved yet.</p>
      ) : (
        letters.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #1e3a5f",
              borderRadius: 10,
              padding: 20,
              marginBottom: 16
            }}
          >
            <h3 style={{ color: "#fff", marginTop: 0 }}>
              {item.companyName || "Cover Letter"}
            </h3>

            <p style={{ color: "#94a3b8", margin: "4px 0" }}>
              {item.email}
            </p>

            <p style={{ color: "#94a3b8", margin: "4px 0 16px 0", fontSize: "14px" }}>
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              {/* Step 3: Replaced alert with setSelectedLetter */}
              <button
                onClick={() => setSelectedLetter(item)}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                View Letter
              </button>

              <button
                onClick={() => deleteLetter(item.id)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer"
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
