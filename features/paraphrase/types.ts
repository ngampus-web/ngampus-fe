export type ParaphraseKind = "turnitin" | "ai" | "combined"
export type Turnaround = "relaxed" | "regular" | "urgent"
export type FileMetadata = { name: string; size: number }
export type ParaphraseDetails = {
  kind: "paraphrase"
  slug: "parafrase-manual"
  title: string
  fileName: string
  fileSize: number
  wordCount: number
  service: ParaphraseKind
  reports: {
    type: "turnitin" | "ai"
    file: FileMetadata
    initialScore: number
    targetScore: number
  }[]
  notes: string
  language: "id" | "en"
  field: string
  customerName: string
  turnaround: Turnaround
}
