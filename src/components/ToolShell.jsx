export default function ToolShell({ title, onBack, children }) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #020817 0%, #0a1628 50%, #020817 100%)", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px 0" }}>
        <button onClick={() => window.location.reload()} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: 14, marginBottom: 20 }}>
          ← Back to Home
        </button>
      </div>
      <div style={{ borderBottom: "1px solid #1e3a5f", padding: "20px 24px", background: "rgba(15,23,42,0.8)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 14, cursor: "pointer" }}>← Home</button>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
          <div style={{ width: 60 }} />
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>{children}</div>
    </div>
  );
}