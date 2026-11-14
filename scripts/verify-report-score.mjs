import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import path from "node:path"
import {
  detectReportScore,
  pagesToScan,
  parseReportScore,
} from "../features/paraphrase/services/report-score.ts"

// Pure parsing, one case per known layout.
assert.deepEqual(parseReportScore("23% Overall Similarity\nThe combined"), {
  kind: "turnitin",
  score: 23,
})
assert.deepEqual(parseReportScore("0%\nSIMILARITY INDEX\n0%\nINTERNET"), {
  kind: "turnitin",
  score: 0,
})
assert.deepEqual(parseReportScore("AI Probability\n69%\nThis number"), {
  kind: "ai",
  score: 69,
})
assert.deepEqual(parseReportScore("92% detected as AI"), { kind: "ai", score: 92 })
assert.equal(parseReportScore("Bibliografi 12% dari total"), null)
assert.equal(parseReportScore("101% Overall Similarity"), null)

// Front pages first, then the tail walking backwards, no repeats.
assert.deepEqual(pagesToScan(2), [1, 2])
assert.deepEqual(pagesToScan(5), [1, 2, 3, 5, 4])
assert.equal(pagesToScan(1000).length, 103)
assert.equal(new Set(pagesToScan(1000)).size, 103)

// Real reports: SAMPLES=<dir of data-testing-turnitin-ai>.
const root = process.env.SAMPLES
if (!root) {
  console.log("PASS: parsing. Set SAMPLES=<data-testing dir> to check real PDFs.")
  process.exit(0)
}
const expected = [
  ["Cek AI/GPTZero AI Scan - Krisis Moneter 1997_ Ketika Rupiah Runtuh Pertengahan 1997, kawasan Asia Tenggara dihantam badai yan.pdf", "ai", 100],
  ["Cek AI/GPTZero AI Scan - Latar Belakang.pdf", "ai", 69],
  ["Cek AI/GPTZero AI Scan - Makalah_six_sigma.pdf (1).pdf", "ai", 0],
  ["Turnitin/V1/Laporan_PJT_Assignment_Ibu_Ratih_SC-09893AE22496_file_1.pdf", "turnitin", 0],
  ["Turnitin/V1/Laporan_turnitis_bab_1-5_7777_SC-339F5F20_file_1.pdf", "turnitin", 24],
  ["Turnitin/V2/GPTZero_Outline_Skripsi_Kenan_Revisi_Gz_Report.pdf", "turnitin", 10],
  ["Turnitin/V2/Kentank_SKRIPSI_KENAN_Gz_Report.pdf", "turnitin", 23],
  ["Turnitin/V2/SKRIPSI NEW_unlocked 2.pdf", "turnitin", 90],
  ["Turnitin/V2/Laporan_DRAFT_SIDANG_AKMAL_FIXX_BANGETTTT_SC-F2F5CCB81632_file_1.pdf", "turnitin", 15],
]
for (const [file, kind, score] of expected) {
  const blob = new Blob([await readFile(path.join(root, file))])
  const started = Date.now()
  const found = await detectReportScore(blob)
  console.log(`${found?.kind}/${found?.score}`.padEnd(14), `${Date.now() - started}ms`.padEnd(8), path.basename(file).slice(0, 50))
  assert.deepEqual(found, { kind, score }, file)
}
// Not a report, and not a PDF at all.
assert.equal(await detectReportScore(new Blob(["bukan pdf"])), null)
console.log("PASS: parsing and all real sample reports.")
