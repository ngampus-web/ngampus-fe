import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { countDocxWords } from "../features/paraphrase/services/docx-word-count.ts"
const fixture = async (name) =>
  new Blob([
    await readFile(new URL(`./fixtures/${name}.docx`, import.meta.url)),
  ])
assert.equal(await countDocxWords(await fixture("paraphrase-sample")), 8)
await assert.rejects(
  countDocxWords(await fixture("paraphrase-empty")),
  /Tidak ada teks/
)
await assert.rejects(
  countDocxWords(new Blob(["not a docx"])),
  /DOCX tidak dapat dibaca/
)
console.log(
  "PASS: DOCX paragraph/table word count, empty and invalid documents."
)
