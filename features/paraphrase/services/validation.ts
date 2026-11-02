import { UserFacingError } from "../../../lib/errors"
import type { FileMetadata, ParaphraseDetails } from "../types"
import { paraphraseServices, turnaroundOptions } from "../options"
import { paraphraseRates } from "./pricing"
export function validateFile(
  file: FileMetadata,
  extension: "docx" | "pdf",
  maxFileMb = paraphraseRates.maxFileMb
) {
  if (
    !file.name.toLowerCase().endsWith(`.${extension}`) ||
    !Number.isSafeInteger(file.size) ||
    file.size <= 0 ||
    file.size > maxFileMb * 1024 * 1024
  ) {
    throw new UserFacingError(
      `Gunakan file ${extension.toUpperCase()} yang tidak kosong, maksimal ${maxFileMb} MB.`
    )
  }
}
export function validateParaphrase(d: ParaphraseDetails) {
  const { maxFileMb, minTarget } = d.rates ?? paraphraseRates
  validateFile({ name: d.fileName, size: d.fileSize }, "docx", maxFileMb)
  if (
    d.slug !== "parafrase-manual" ||
    !paraphraseServices.some((s) => s.id === d.service)
  )
    throw new UserFacingError("Pilih jenis layanan parafrase.")
  if (!Number.isSafeInteger(d.wordCount) || d.wordCount <= 0)
    throw new UserFacingError("Jumlah kata DOCX belum tersedia.")
  if (!d.customerName.trim() || d.customerName.length > 100)
    throw new UserFacingError("Isi nama lengkap, maksimal 100 karakter.")
  if (!["id", "en"].includes(d.language))
    throw new UserFacingError("Pilih bahasa dokumen.")
  if (!turnaroundOptions.some((t) => t.id === d.turnaround))
    throw new UserFacingError("Pilih estimasi pengerjaan.")
  if (
    typeof d.notes !== "string" ||
    d.notes.length > 2000 ||
    typeof d.field !== "string" ||
    d.field.length > 120
  )
    throw new UserFacingError("Catatan atau bidang terlalu panjang.")
  const required = d.service === "combined" ? ["turnitin", "ai"] : [d.service]
  if (
    !Array.isArray(d.reports) ||
    d.reports.length !== required.length ||
    !required.every((type) => d.reports.some((r) => r.type === type))
  )
    throw new UserFacingError(
      "Lengkapi laporan PDF untuk layanan yang dipilih."
    )
  for (const report of d.reports) {
    validateFile(report.file, "pdf", maxFileMb)
    if (
      !Number.isFinite(report.initialScore) ||
      report.initialScore <= minTarget ||
      report.initialScore > 100
    )
      throw new UserFacingError(
        `Skor awal harus lebih dari ${minTarget}% hingga 100%.`
      )
    if (
      !Number.isFinite(report.targetScore) ||
      report.targetScore < minTarget ||
      report.targetScore >= report.initialScore
    )
      throw new UserFacingError(
        `Target minimal ${minTarget}% dan harus lebih rendah dari skor awal.`
      )
  }
}
