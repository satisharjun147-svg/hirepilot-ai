export default function ToolShell({ title, onBack, children }) {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    onBack();
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #020817 0%, #0a1628 50%, #020817 100%)", color: "#e2e8f0" }}>
      <div style={{ borderBottom: "1px solid #1e3a5f", padding: "20px 24px", background: "rgba(15,23,42,0.8)", position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(12px)" }}>
        <div className="tool-shell-inner">
          <div className="tool-shell-actions">
            <button onClick={goBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(148,163,184,0.2)", color: "#e2e8f0", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 18px rgba(2,6,23,0.18)", transition: "transform 180ms ease, border-color 180ms ease" }}>
              ← Back
            </button>
            <button onClick={onBack} style={{ background: "linear-gradient(135deg,#0ea5e9,#14b8a6)", border: "none", color: "#02111f", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 900, cursor: "pointer", boxShadow: "0 10px 24px rgba(14,165,233,0.24)", transition: "transform 180ms ease, box-shadow 180ms ease" }}>
              Home
            </button>
          </div>
          <div className="tool-shell-title">{title}</div>
          <div className="tool-shell-spacer" />
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>{children}</div>
    </div>
  );
}
