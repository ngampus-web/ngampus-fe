import type { FileMetadata, ParaphraseDetails } from "../types"
import {
  MAX_FILE_SIZE,
  paraphraseServices,
  turnaroundOptions,
} from "../options"
export function validateFile(file: FileMetadata, extension: "docx" | "pdf") {
  if (
    !file.name.toLowerCase().endsWith(`.${extension}`) ||
    !Number.isSafeInteger(file.size) ||
    file.size <= 0 ||
    file.size > MAX_FILE_SIZE
  ) {
    throw new Error(
      `Gunakan file ${extension.toUpperCase()} yang tidak kosong, maksimal 25 MB.`
    )
  }
}
export function validateParaphrase(d: ParaphraseDetails) {
  validateFile({ name: d.fileName, size: d.fileSize }, "docx")
  if (
    d.slug !== "parafrase-manual" ||
    !paraphraseServices.some((s) => s.id === d.service)
  )
    throw new Error("Pilih jenis layanan parafrase.")
  if (!Number.isSafeInteger(d.wordCount) || d.wordCount <= 0)
    throw new Error("Jumlah kata DOCX belum tersedia.")
  if (!d.customerName.trim() || d.customerName.length > 100)
    throw new Error("Isi nama lengkap, maksimal 100 karakter.")
  if (!["id", "en"].includes(d.language))
    throw new Error("Pilih bahasa dokumen.")
  if (!turnaroundOptions.some((t) => t.id === d.turnaround))
    throw new Error("Pilih estimasi pengerjaan.")
  if (
    typeof d.notes !== "string" ||
    d.notes.length > 2000 ||
    typeof d.field !== "string" ||
    d.field.length > 120
  )
    throw new Error("Catatan atau bidang terlalu panjang.")
  const required = d.service === "combined" ? ["turnitin", "ai"] : [d.service]
  if (
    !Array.isArray(d.reports) ||
    d.reports.length !== required.length ||
    !required.every((type) => d.reports.some((r) => r.type === type))
  )
    throw new Error("Lengkapi laporan PDF untuk layanan yang dipilih.")
  for (const report of d.reports) {
    validateFile(report.file, "pdf")
    if (
      !Number.isFinite(report.initialScore) ||
      report.initialScore <= 10 ||
      report.initialScore > 100
    )
      throw new Error("Skor awal harus lebih dari 10% hingga 100%.")
    if (
      !Number.isFinite(report.targetScore) ||
      report.targetScore < 10 ||
      report.targetScore >= report.initialScore
    )
      throw new Error(
        "Target minimal 10% dan harus lebih rendah dari skor awal."
      )
  }
}
