import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ onBack }) {
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userRef = doc(db, "users", result.user.uid);
      const existingUser = await getDoc(userRef);
      const existingData = existingUser.exists() ? existingUser.data() : {};

      await setDoc(
        userRef,
        {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          plan: existingData.plan || "free",
          resumeCount: existingData.resumeCount ?? 0,
          coverLetterCount: existingData.coverLetterCount ?? 0,
          atsCount: existingData.atsCount ?? 0,
          resumeLimit: existingData.resumeLimit ?? 5,
          coverLetterLimit: existingData.coverLetterLimit ?? 3,
          atsLimit: existingData.atsLimit ?? 5,
          createdAt: existingData.createdAt || new Date().toISOString(),
        },
        { merge: true }
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        })
      );

      onBack();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, rgba(14,165,233,0.24), transparent 35%), linear-gradient(135deg,#020817,#0a1628,#020817)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "rgba(15,23,42,0.94)",
          border: "1px solid rgba(125,211,252,0.16)",
          borderRadius: "24px",
          padding: "38px",
          textAlign: "center",
          boxShadow: "0 24px 70px rgba(0,0,0,0.36)",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: "linear-gradient(135deg,#38bdf8,#14b8a6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: "900",
            color: "#02111f",
            margin: "0 auto 20px",
          }}
        >
          H
        </div>

        <h1 style={{ color: "#fff", marginBottom: "10px", fontSize: "34px", fontWeight: "800" }}>Welcome back</h1>
        <p style={{ color: "#94a3b8", marginBottom: "24px", lineHeight: "1.6" }}>
          Sign in to continue building sharper resumes, stronger cover letters, and interview-ready answers.
        </p>

        <div style={{ display: "grid", gap: 10, marginBottom: 20, textAlign: "left" }}>
          {[
            "Save your best work in one place",
            "Track usage and plan value clearly",
            "Jump back into your last resume in seconds",
          ].map((point) => (
            <div key={point} style={{ display: "flex", gap: 10, color: "#cbd5e1", fontSize: 13.5 }}>
              <span style={{ color: "#38bdf8", fontWeight: 900 }}>✓</span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        <button
          onClick={loginWithGoogle}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
            color: "#111827",
            fontWeight: "800",
            fontSize: "15px",
            cursor: "pointer",
            marginBottom: "12px",
          }}
        >
          Continue with Google
        </button>

        <button
          onClick={onBack}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid rgba(148,163,184,0.22)",
            background: "transparent",
            color: "#cbd5e1",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>

        <p style={{ color: "#64748b", fontSize: "12px", marginTop: "24px" }}>
          Secure sign-in powered by Firebase Authentication
        </p>
      </div>
    </div>
  );
}
