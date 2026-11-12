/* global Module, importScripts */
self.onmessage = async ({ data }) => {
  try {
    importScripts("/qpdf/qpdf.js")
    const engine = await Module({
      locateFile: () => "/qpdf/qpdf.wasm",
      noInitialRun: true,
      print: () => {},
      printErr: () => {},
    })
    engine.FS.writeFile("/input.pdf", new Uint8Array(data.bytes))
    const owner = Array.from(crypto.getRandomValues(new Uint8Array(32)), (v) =>
      v.toString(16).padStart(2, "0")
    ).join("")
    const status = engine.callMain([
      "/input.pdf",
      "--encrypt",
      data.password,
      owner,
      "256",
      "--",
      "/protected.pdf",
    ])
    if (status !== 0 && status !== 3) throw Error("Encryption failed")
    const bytes = new Uint8Array(engine.FS.readFile("/protected.pdf"))
    self.postMessage({ bytes: bytes.buffer }, [bytes.buffer])
  } catch {
    self.postMessage({
      error:
        "PDF tidak dapat dikunci. Gunakan PDF yang valid dan belum diproteksi.",
    })
  }
}
