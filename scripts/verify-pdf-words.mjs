import assert from "node:assert/strict"
import { deflateSync } from "node:zlib"
import { countPdfWords } from "../features/plagiarism/services/pdf-word-count.ts"

function makePdf(streams, { compressed = false, unicode = false } = {}) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ]
  if (unicode) {
    objects[2] =
      "<< /Type /Font /Subtype /Type0 /BaseFont /Demo /Encoding /Identity-H /DescendantFonts [4 0 R] /ToUnicode 5 0 R >>"
    objects.push(
      "<< /Type /Font /Subtype /CIDFontType2 /BaseFont /Demo /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /DW 500 >>"
    )
    const cmap =
      "/CIDInit /ProcSet findresource begin 12 dict begin begincmap /CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def /CMapName /Demo def /CMapType 2 def 1 begincodespacerange <0000> <FFFF> endcodespacerange 1 beginbfrange <0000> <FFFF> <0000> endbfrange endcmap CMapName currentdict /CMap defineresource pop end end"
    objects.push(`<< /Length ${cmap.length} >>\nstream\n${cmap}\nendstream`)
  }
  const pages = []
  for (const content of streams) {
    const pageId = objects.length + 1
    pages.push(`${pageId} 0 R`)
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 800] /Resources << /Font << /F1 3 0 R >> >> /Contents ${pageId + 1} 0 R >>`
    )
    const bytes = compressed
      ? deflateSync(Buffer.from(content))
      : Buffer.from(content)
    objects.push(
      Buffer.concat([
        Buffer.from(
          `<< /Length ${bytes.length}${compressed ? " /Filter /FlateDecode" : ""} >>\nstream\n`
        ),
        bytes,
        Buffer.from("\nendstream"),
      ])
    )
  }
  objects[1] = `<< /Type /Pages /Kids [${pages.join(" ")}] /Count ${pages.length} >>`
  const chunks = [Buffer.from("%PDF-1.7\n")]
  const offsets = [0]
  let size = chunks[0].length
  objects.forEach((obj, i) => {
    offsets.push(size)
    const chunk = Buffer.concat([
      Buffer.from(`${i + 1} 0 obj\n`),
      Buffer.from(obj),
      Buffer.from("\nendobj\n"),
    ])
    chunks.push(chunk)
    size += chunk.length
  })
  chunks.push(
    Buffer.from(
      `xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets
        .slice(1)
        .map((n) => `${String(n).padStart(10, "0")} 00000 n \n`)
        .join(
          ""
        )}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${size}\n%%EOF`
    )
  )
  return new Blob(chunks, { type: "application/pdf" })
}
const text = (value) => `BT /F1 12 Tf 50 700 Td ${value} Tj ET`
assert.equal(await countPdfWords(makePdf([text("(Satu dua tiga)")])), 3)
assert.equal(
  await countPdfWords(
    makePdf([text("<53617475206475612074696761>")], { compressed: true })
  ),
  3
)
assert.equal(
  await countPdfWords(
    makePdf([text("(Satu dua)"), text("(Tiga empat lima)")], {
      compressed: true,
    })
  ),
  5
)
// Encoded glyphs require a ToUnicode font map; the old literal-string parser returned null.
assert.equal(
  await countPdfWords(
    makePdf([text("<0053006100740075002000640075006100200074006900670061>")], {
      unicode: true,
      compressed: true,
    })
  ),
  3
)
// Font/drawing chunks within the same word must not inflate the count.
assert.equal(
  await countPdfWords(
    makePdf(["BT /F1 12 Tf 50 700 Td [(Nga) 0 (mpus) -300 (hebat)] TJ ET"])
  ),
  2
)
await assert.rejects(countPdfWords(makePdf([""])), /Tidak ada teks/)
await assert.rejects(
  countPdfWords(new Blob(["invalid PDF"])),
  /rusak atau tidak valid/
)
console.log(
  "PASS: literal, compressed hex, multipage, Unicode font mapping, split words, textless and invalid PDFs."
)
