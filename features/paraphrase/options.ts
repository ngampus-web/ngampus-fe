export const paraphraseServices = [
  {
    id: "turnitin",
    label: "Parafrase Turnitin",
    description: "Fokus mengurangi kemiripan tulisan.",
  },
  {
    id: "ai",
    label: "Parafrase AI",
    description: "Bantu tulisan terasa lebih natural.",
  },
  {
    id: "combined",
    label: "Parafrase Turnitin & AI",
    description: "Dua kebutuhan dalam satu pesanan.",
  },
] as const
export const turnaroundOptions = [
  { id: "relaxed", label: "Santai Aja", duration: ">48 Jam", multiplier: 1 },
  { id: "regular", label: "Gaskeun", duration: "24–48 Jam", multiplier: 1.3 },
  {
    id: "urgent",
    label: "Kejar Deadline",
    duration: "<24 Jam",
    multiplier: 1.5,
  },
] as const
export const MAX_FILE_SIZE = 25 * 1024 * 1024
