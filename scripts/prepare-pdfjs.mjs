import { cp, mkdir, readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)
const source = path.dirname(require.resolve("pdfjs-dist/package.json"))
const { version } = JSON.parse(
  await readFile(path.join(source, "package.json"), "utf8")
)
const target = new URL(`../public/pdfjs/${version}/`, import.meta.url)
await mkdir(target, { recursive: true })
await cp(
  path.join(source, "legacy/build/pdf.worker.min.mjs"),
  new URL("pdf.worker.min.mjs", target)
)
for (const folder of ["cmaps", "standard_fonts", "wasm"]) {
  await cp(path.join(source, folder), new URL(folder, target), {
    recursive: true,
  })
}
console.log(`PDF.js ${version} assets ready`)
