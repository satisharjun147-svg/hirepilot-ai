import { TEMPLATES } from "../shared/resumeConstants";

export default function TemplatePicker({ template, setTemplate }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Style ({Object.keys(TEMPLATES).length} options)</span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxHeight: 86, overflowY: "auto", padding: "2px 2px 4px" }}>
        {Object.entries(TEMPLATES).map(([key, t]) => (
          <div key={key} onClick={() => setTemplate(key)} title={t.name} style={{ cursor: "pointer", border: template === key ? `2px solid ${t.accent}` : "1px solid #1e3a5f", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: t.accent }} />
            <span style={{ fontSize: 11.5, color: template === key ? "#f1f5f9" : "#94a3b8", whiteSpace: "nowrap" }}>{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}