export type ReportKind = "turnitin" | "ai"

export type DetectedScore = {
  /** Which kind of report the PDF is, judged by its contents. */
  kind: ReportKind
  /** Integer percentage printed on the report. */
  score: number
}

const PERCENT = String.raw`(\d{1,3})\s*%`

// Each pattern was matched against real reports (see
// ngampus-management/data-testing/data-testing-turnitin-ai).
const PATTERNS: { kind: ReportKind; pattern: RegExp }[] = [
  // Turnitin "Integrity Overview" page: "23% Overall Similarity".
  { kind: "turnitin", pattern: new RegExp(`${PERCENT}\\s*Overall Similarity`, "i") },
  // Turnitin classic report: "24%" then "SIMILARITY INDEX".
  { kind: "turnitin", pattern: new RegExp(`${PERCENT}\\s*SIMILARITY INDEX`, "i") },
  // GPTZero scan: "AI Probability" then "69%".
  { kind: "ai", pattern: new RegExp(`AI Probability\\s*${PERCENT}`, "i") },
  // Turnitin AI writing report: "92% detected as AI" (no sample seen yet).
  { kind: "ai", pattern: new RegExp(`${PERCENT}\\s*detected as AI`, "i") },
]

/** Reads the score off the text of one report page, or null when absent. */
export function parseReportScore(pageText: string): DetectedScore | null {
  for (const { kind, pattern } of PATTERNS) {
    const match = pageText.match(pattern)
    if (!match) continue
    const score = Number(match[1])
    if (score >= 0 && score <= 100) return { kind, score }
  }
  return null
}

/** Front pages hold the score in new-style reports and GPTZero scans. */
const FRONT_PAGES = 3
/**
 * Classic Turnitin reports append the "Originality Report" after the paper,
 * so the score sits near the end (page 97 of 121, 186 of 195 in samples).
 */
const TAIL_PAGES = 100

/** Page numbers to read, most likely first, each at most once. */
export function pagesToScan(total: number): number[] {
  const pages: number[] = []
  for (let n = 1; n <= Math.min(FRONT_PAGES, total); n += 1) pages.push(n)
  for (let n = total; n > Math.max(FRONT_PAGES, total - TAIL_PAGES); n -= 1) {
    pages.push(n)
  }
  return pages
}

/**
 * Finds the score printed in a report PDF. Runs in the browser, so the file
 * never leaves the device. Best effort: any failure (password, scan without
 * text, unknown layout) yields null and the user types the score instead.
 */
export async function detectReportScore(
  file: Blob
): Promise<DetectedScore | null> {
  let task: { promise: Promise<any>; destroy: () => Promise<void> } | undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
    const assets = `/pdfjs/${pdfjs.version}`
    const inBrowser = typeof window !== "undefined"
    if (inBrowser) {
      pdfjs.GlobalWorkerOptions.workerSrc = `${assets}/pdf.worker.min.mjs`
    }
    task = pdfjs.getDocument({
      data: new Uint8Array(await file.arrayBuffer()),
      ...(inBrowser
        ? {
            cMapUrl: `${assets}/cmaps/`,
            cMapPacked: true,
            standardFontDataUrl: `${assets}/standard_fonts/`,
            wasmUrl: `${assets}/wasm/`,
          }
        : {}),
      verbosity: 0,
    })
    const pdf = await task!.promise
    for (const number of pagesToScan(pdf.numPages)) {
      const page = await pdf.getPage(number)
      const content = await page.getTextContent()
      page.cleanup()
      const text = content.items
        .map((item: { str?: string; hasEOL?: boolean }) =>
          "str" in item ? item.str + (item.hasEOL ? "\n" : "") : ""
        )
        .join("")
      const found = parseReportScore(text)
      if (found) return found
    }
    return null
  } catch {
    return null
  } finally {
    await task?.destroy().catch(() => undefined)
  }
}
