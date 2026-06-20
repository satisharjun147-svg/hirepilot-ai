import { TEMPLATE_GROUPS, TEMPLATES } from "../shared/resumeConstants";

const PREVIEW_IMAGES = {
  classic: "/templates/classic.svg",
  sidebar: "/templates/sidebar.svg",
  dark: "/templates/dark.svg",
  band: "/templates/band.svg",
  banner: "/templates/banner.svg",
  timeline: "/templates/timeline.svg",
  compact: "/templates/compact.svg",
  minimal: "/templates/minimal.svg",
};

export default function TemplateGallery({ onSelect, onSkip, title = "Choose a resume template" }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#020817,#0a1628,#020817)", color: "#fff", padding: "40px 24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{title}</h1>
          <p style={{ color: "#94a3b8", fontSize: 14.5 }}>21 templates across 8 layout styles. Pick one now, or skip and choose later.</p>
        </div>

        {TEMPLATE_GROUPS.map((group) => {
          const variants = Object.entries(TEMPLATES).filter(([, template]) => template.layout === group.layout);
          if (!variants.length) return null;

          return (
            <div key={group.layout} style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                {group.label}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 }}>
                {variants.map(([key, template]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelect(key)}
                    style={{ cursor: "pointer", border: "1px solid #1e3a5f", borderRadius: 12, padding: 10, background: "rgba(15,23,42,0.5)", transition: "border-color 0.15s", textAlign: "left" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = template.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e3a5f")}
                  >
                    <div style={{ width: "100%", aspectRatio: "210 / 297", marginBottom: 8, background: "#0f172a", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <img
                        src={PREVIEW_IMAGES[template.layout] || PREVIEW_IMAGES.classic}
                        alt={`${template.name} resume preview`}
                        style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ fontSize: 12, color: "#e2e8f0", textAlign: "center", fontWeight: 600 }}>{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={onSkip} style={{ background: "none", border: "1px solid #1e3a5f", color: "#94a3b8", borderRadius: 8, padding: "10px 24px", fontSize: 13.5, cursor: "pointer" }}>
            Skip — I'll choose a style later
          </button>
        </div>
      </div>
    </div>
  );
}