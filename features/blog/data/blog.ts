// Fallback filter chips when the API is unreachable. Articles live in the API (ngampus-be blog module).
export const blogCategories = [
  { id: "semua", label: "Semua" },
  { id: "tips-mahasiswa", label: "Tips Mahasiswa" },
  { id: "ai-teknologi", label: "AI & Teknologi" },
  { id: "akademik", label: "Akademik" },
  { id: "tools-tutorial", label: "Tools & Tutorial" },
  { id: "info-ngampus", label: "Info Ngampus" },
] as const
