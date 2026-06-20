export const STEPS = ["Personal Info", "Experience", "Education", "Skills", "Generate"];

export const initialForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  jobTitle: "",
  summary: "",
  experience: [{ company: "", role: "", duration: "", description: "" }],
  education: [{ institution: "", degree: "", year: "" }],
  skills: "",
};

export const TEMPLATES = {
  modern_blue: { name: "Modern", layout: "classic", accent: "#2563eb" },
  modern_emerald: { name: "Modern Green", layout: "classic", accent: "#059669" },
  modern_charcoal: { name: "Modern Dark", layout: "classic", accent: "#0f172a" },
  sidebar_indigo: { name: "Sidebar", layout: "sidebar", accent: "#4f46e5" },
  sidebar_teal: { name: "Sidebar Teal", layout: "sidebar", accent: "#0d9488" },
  sidebar_rose: { name: "Sidebar Rose", layout: "sidebar", accent: "#e11d48" },
  band_violet: { name: "Header Band", layout: "band", accent: "#7c3aed" },
  band_amber: { name: "Header Band Gold", layout: "band", accent: "#b45309" },
  minimal_ink: { name: "Minimal", layout: "minimal", accent: "#1e293b" },
  minimal_slate: { name: "Minimal Slate", layout: "minimal", accent: "#475569" },
  dark_cyan: { name: "Dark Sidebar", layout: "dark", accent: "#06b6d4" },
  dark_purple: { name: "Dark Purple", layout: "dark", accent: "#a855f7" },
  timeline_blue: { name: "Timeline", layout: "timeline", accent: "#3b82f6" },
  timeline_green: { name: "Timeline Green", layout: "timeline", accent: "#16a34a" },
  compact_navy: { name: "Compact", layout: "compact", accent: "#1d4ed8" },
  compact_maroon: { name: "Compact Maroon", layout: "compact", accent: "#9f1239" },
  banner_sky: { name: "Photo Banner", layout: "banner", accent: "#0284c7" },
  banner_coral: { name: "Photo Banner Coral", layout: "banner", accent: "#ea580c" },
  classic_forest: { name: "Classic Forest", layout: "classic", accent: "#166534" },
  sidebar_slate: { name: "Sidebar Slate", layout: "sidebar", accent: "#334155" },
  minimal_wine: { name: "Minimal Wine", layout: "minimal", accent: "#7f1d1d" },
};

export const TEMPLATE_GROUPS = [
  { layout: "classic", label: "Classic" },
  { layout: "sidebar", label: "Sidebar" },
  { layout: "band", label: "Header Band" },
  { layout: "minimal", label: "Minimal" },
  { layout: "dark", label: "Dark Sidebar" },
  { layout: "timeline", label: "Timeline" },
  { layout: "compact", label: "Compact" },
  { layout: "banner", label: "Photo Banner" },
];

export const RESUME_JSON_SHAPE = `{
  "name": "string",
  "jobTitle": "string",
  "contact": { "email": "string", "phone": "string", "location": "string", "linkedin": "string" },
  "summary": "string (2-3 sentences, no markdown)",
  "experience": [
    { "role": "string", "company": "string", "duration": "string", "bullets": ["string", "string"] }
  ],
  "education": [
    { "degree": "string", "institution": "string", "year": "string" }
  ],
  "skills": ["string", "string"]
}`;