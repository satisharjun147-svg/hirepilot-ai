import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ onBack }) {

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(
        auth,
        provider
      );

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

          createdAt: existingData.createdAt || new Date().toISOString()
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
window.location.reload();

      console.log(result.user);

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#020817,#0a1628,#020817)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(15,23,42,0.9)",
          border: "1px solid #1e3a5f",
          borderRadius: "20px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "16px",
            background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: "bold",
            color: "#fff",
            margin: "0 auto 20px",
          }}
        >
          H
        </div>

        <h1
          style={{
            color: "#fff",
            marginBottom: "10px",
            fontSize: "34px",
            fontWeight: "800",
          }}
        >
          Welcome Back
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "30px",
            lineHeight: "1.6",
          }}
        >
          Sign in to continue building resumes, cover letters and interview preparation.
        </p>

        <button
           onClick={loginWithGoogle}
           style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "#ffffff",
            color: "#111827",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
            marginBottom: "16px",
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
            border: "1px solid #334155",
            background: "transparent",
            color: "#cbd5e1",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>

        <p
          style={{
            color: "#64748b",
            fontSize: "12px",
            marginTop: "24px",
          }}
        >
          Secure login powered by Firebase Authentication
        </p>
      </div>
    </div>
  );
}
