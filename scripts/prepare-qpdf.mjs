import { copyFile, mkdir } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
const require = createRequire(import.meta.url)
const dir = dirname(require.resolve("@neslinesli93/qpdf-wasm"))
await mkdir("public/qpdf", { recursive: true })
for (const name of ["qpdf.js", "qpdf.wasm"])
  await copyFile(join(dir, name), join("public/qpdf", name))
