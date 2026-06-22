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

export default function MyResumes({ onBack }) {
const [resumes, setResumes] = useState([]);
const [selectedResume, setSelectedResume] = useState(null);

useEffect(() => {
loadResumes();
}, []);

const loadResumes = async () => {
try {
const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  const q = query(
    collection(db, "resumes"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  const data = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));

  setResumes(data);
} catch (err) {
  console.error(err);
}

};

const deleteResume = async (id) => {
const ok = window.confirm(
"Delete this resume?"
);

if (!ok) return;

try {
  const user = JSON.parse(localStorage.getItem("user"));

  await deleteDoc(doc(db, "resumes", id));

  setResumes(
    resumes.filter((r) => r.id !== id)
  );

  if (user?.uid) {
    await updateDoc(
      doc(db, "users", user.uid),
      {
        resumeCount: increment(-1)
      }
    );
  }

  alert("Deleted successfully");
} catch (err) {
  console.error(err);
  alert(err.message);
}

};

if (selectedResume) {
const r = selectedResume.resumeData;

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
      onClick={() => setSelectedResume(null)}
    >
      ← Back
    </button>

    <h1>{r.name}</h1>

    <p>{r.email}</p>

    <h2>Summary</h2>
    <p>{r.summary}</p>

    <h2>Skills</h2>
    <ul>
      {(r.skills || []).map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>

    <h2>Experience</h2>

    {(r.experience || []).map((exp, i) => (
      <div key={i}>
        <h3>
          {exp.role} - {exp.company}
        </h3>

        <ul>
          {(exp.bullets || []).map(
            (b, idx) => (
              <li key={idx}>{b}</li>
            )
          )}
        </ul>
      </div>
    ))}
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

← Back



  <h1>My Resumes</h1>

  {resumes.length === 0 ? (
    <p>No resumes saved yet.</p>
  ) : (
    resumes.map((resume) => (
      <div
        key={resume.id}
        style={{
          border: "1px solid #334155",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "15px",
        }}
      >
        <h3>{resume.name}</h3>

        <p>{resume.email}</p>

        <p>{resume.createdAt}</p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() =>
              setSelectedResume(resume)
            }
          >
            Open
          </button>

          <button
            onClick={() =>
              deleteResume(resume.id)
            }
            style={{
              background: "#ef4444",
              color: "#fff",
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
