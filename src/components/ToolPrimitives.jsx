export const panelStyle = { background: "rgba(15,23,42,0.6)", border: "1px solid #1e3a5f", borderRadius: 16, padding: 32 };
export const taStyle = { width: "100%", background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 8, padding: 14, color: "#e2e8f0", fontSize: 13.5, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" };
export const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 };
export const primaryBtn = { width: "100%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", color: "#fff", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" };

export function Spinner({ label }) {
  return (
    <div style={{ textAlign: "center", padding: "30px 0", color: "#64748b", fontSize: 14 }}>
      <div style={{ width: 30, height: 30, border: "3px solid #1e3a5f", borderTop: "3px solid #3b82f6", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
      {label}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ErrBox({ msg }) {
  return <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: 14, color: "#f87171", fontSize: 13.5, marginTop: 16 }}>{msg}</div>;
}

export function AITip({ text }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.2)", borderRadius: 10, padding: 14, marginTop: 18 }}>
      <span style={{ fontSize: 16 }}>💡</span>
      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "#facc15", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>AI Tip</div>
        <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5 }}>{text}</div>
      </div>
    </div>
  );
}