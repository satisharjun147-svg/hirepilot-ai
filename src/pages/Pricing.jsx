import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { StatusMessage } from "../components/ToolPrimitives";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch (error) {
    console.error("Invalid user data", error);
    localStorage.removeItem("user");
    return null;
  }
}

export default function Pricing({ onBack }) {
  const [processing, setProcessing] = useState(false);
  const [notice, setNotice] = useState(null);
  const currentUser = getStoredUser();
  const currentPlan = currentUser?.plan || "free";
  const planLabel = currentPlan === "pro" ? "Pro" : currentPlan === "starter" ? "Starter" : "Free";

  const buyPlan = async (amount, plan) => {
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Invalid user data", error);
      localStorage.removeItem("user");
    }

    if (!user) {
      setNotice({ type: "error", text: "Please login first to upgrade your plan." });
      return;
    }

    if (!window.Razorpay) {
      setNotice({ type: "error", text: "Payment gateway is not available right now. Please try again shortly." });
      return;
    }

    setProcessing(true);
    setNotice(null);

    const options = {
      key: "rzp_test_T51jmpknbhThX1",
      amount: amount * 100,
      currency: "INR",
      name: "HirePilot",
      description: `${plan} plan`,
      handler: async function () {
        try {
          const updatedUser = {
            ...user,
            plan,
            resumeLimit: plan === "pro" ? 999999 : 50,
            coverLetterLimit: plan === "pro" ? 999999 : 50,
            atsLimit: plan === "pro" ? 999999 : 50,
          };

          if (user.uid) {
            await updateDoc(doc(db, "users", user.uid), {
              plan,
              resumeLimit: updatedUser.resumeLimit,
              coverLetterLimit: updatedUser.coverLetterLimit,
              atsLimit: updatedUser.atsLimit,
            });
          }

          localStorage.setItem("user", JSON.stringify(updatedUser));
          setNotice({ type: "success", text: `Your ${plan} plan is active now.` });
        } catch (err) {
          console.error(err);
          setNotice({ type: "error", text: err.message || "Plan update failed. Please try again." });
        } finally {
          setProcessing(false);
        }
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      setNotice({ type: "error", text: "Payment could not be initialized. Please try again." });
      setProcessing(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020817",
        color: "white",
        padding: "30px",
      }}
    >
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={onBack} style={{ border: "1px solid rgba(148,163,184,0.2)", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", borderRadius: 999, padding: "8px 14px", cursor: "pointer", boxShadow: "0 6px 18px rgba(2,6,23,0.18)", transition: "transform 180ms ease, border-color 180ms ease" }}>
            ← Back
          </button>
          <button onClick={() => onBack("home")} style={{ border: "none", background: "linear-gradient(135deg,#0ea5e9,#14b8a6)", color: "#02111f", borderRadius: 999, padding: "8px 14px", cursor: "pointer", fontWeight: 800, boxShadow: "0 10px 24px rgba(14,165,233,0.24)", transition: "transform 180ms ease, box-shadow 180ms ease" }}>
            Home
          </button>
        </div>

        <h1 style={{ margin: "0 0 8px", fontSize: 32 }}>Pricing</h1>
        <p style={{ color: "#cbd5e1", marginTop: 0, maxWidth: 620, lineHeight: 1.6 }}>Choose a plan that fits your job-search momentum.</p>
        {notice && (
          <div style={{ marginTop: 16 }}>
            <StatusMessage type={notice.type} text={notice.text} />
          </div>
        )}
        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 999, background: "rgba(14,165,233,0.16)", border: "1px solid rgba(125,211,252,0.24)", color: "#bae6fd", fontWeight: 800 }}>
          Current plan: {planLabel}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginTop: "30px", alignItems: "stretch" }}>
          <div style={{ border: "1px solid #334155", padding: "25px", borderRadius: "16px", background: currentPlan === "starter" ? "rgba(14,165,233,0.12)" : "rgba(15,23,42,0.72)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 260 }}>
            <div>
              <h2 style={{ marginTop: 0 }}>Starter</h2>
              <h1 style={{ margin: "8px 0", fontSize: 30 }}>₹99</h1>
              <p style={{ color: "#cbd5e1" }}>50 Resumes</p>
              <p style={{ color: "#cbd5e1" }}>50 ATS Reports</p>
              <p style={{ color: "#cbd5e1" }}>50 Cover Letters</p>
            </div>
            <button onClick={() => buyPlan(99, "starter")} disabled={processing} style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, cursor: processing ? "wait" : "pointer", opacity: processing ? 0.7 : 1, background: "#f8fafc", color: "#07111f", fontWeight: 800 }}>
              {processing ? "Processing..." : currentPlan === "starter" ? "Current Plan" : "Buy Starter"}
            </button>
          </div>

          <div style={{ border: "1px solid #334155", padding: "25px", borderRadius: "16px", background: currentPlan === "pro" ? "rgba(20,184,166,0.16)" : "rgba(15,23,42,0.72)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 260 }}>
            <div>
              <h2 style={{ marginTop: 0 }}>Pro</h2>
              <h1 style={{ margin: "8px 0", fontSize: 30 }}>₹299</h1>
              <p style={{ color: "#cbd5e1" }}>Unlimited Resumes</p>
              <p style={{ color: "#cbd5e1" }}>Unlimited ATS</p>
              <p style={{ color: "#cbd5e1" }}>Unlimited Cover Letters</p>
            </div>
            <button onClick={() => buyPlan(299, "pro")} disabled={processing} style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, cursor: processing ? "wait" : "pointer", opacity: processing ? 0.7 : 1, background: "linear-gradient(135deg,#0ea5e9,#14b8a6)", color: "#02111f", fontWeight: 800 }}>
              {processing ? "Processing..." : currentPlan === "pro" ? "Current Plan" : "Buy Pro"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}