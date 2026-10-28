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
  /** Uploaded DOCX (live orders). */
  sourceFileId?: string
  reports: {
    type: "turnitin" | "ai"
    file: FileMetadata
    /** Uploaded PDF (live orders). */
    fileId?: string
    initialScore: number
    targetScore: number
  }[]
  notes: string
  language: "id" | "en"
  field: string
  customerName: string
  turnaround: Turnaround
  /** Schedule from the API (live orders); deadline is set once paid. */
  schedule?: {
    paidAt: string | null
    deadlineAt: string | null
    startedAt: string | null
  }
  hasResult?: boolean
}
