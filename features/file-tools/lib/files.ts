// Limits are lower than PDFKilat's (40 MB × 30) so phone tabs do not run out of memory.
export const MAX_FILE_BYTES = 25 * 1024 * 1024
export const MAX_FILES = 20
export const MAX_TOTAL_BYTES = 100 * 1024 * 1024

const fmt = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 })

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${fmt.format(bytes / 1024)} KB`
  return `${fmt.format(bytes / (1024 * 1024))} MB`
}

export function extOf(name: string) {
  return (name.split(".").pop() ?? "").toLowerCase()
}

export function sameFile(a: File, b: File) {
  return (
    a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
  )
}

/** Adds files within the limits; returns the first problem, if any. */
export function addFiles(
  current: File[],
  incoming: File[],
  { multiple, accepts }: { multiple: boolean; accepts: (file: File) => boolean }
): { files: File[]; error: string | null } {
  const next = multiple ? [...current] : []
  let error: string | null = null
  for (const file of incoming) {
    if (!accepts(file)) {
      error ??= `${file.name}: format ini belum didukung.`
      continue
    }
    if (file.size > MAX_FILE_BYTES) {
      error ??= `${file.name} lebih dari ${formatBytes(MAX_FILE_BYTES)}.`
      continue
    }
    if (next.some((f) => sameFile(f, file))) continue
    if (next.length >= MAX_FILES) {
      error ??= `Maksimal ${MAX_FILES} file sekaligus.`
      break
    }
    const total = next.reduce((sum, f) => sum + f.size, 0) + file.size
    if (total > MAX_TOTAL_BYTES) {
      error ??= `Total file maksimal ${formatBytes(MAX_TOTAL_BYTES)}.`
      break
    }
    next.push(file)
  }
  return { files: multiple ? next : next.slice(-1), error }
}

export function outputName(base: string, suffix: string) {
  const clean = base.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "_")
  return `${clean || "berkas"}_${suffix}.pdf`
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const url = URL.createObjectURL(
    new Blob([Uint8Array.from(bytes)], { type: "application/pdf" })
  )
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
