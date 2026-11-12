export async function protectPdf(
  file: File,
  password: string
): Promise<Uint8Array> {
  if (!password || new TextEncoder().encode(password).length > 127)
    throw Error("Password wajib diisi, maksimal 127 byte.")
  if (file.size > 20 * 1024 * 1024) throw Error("Maksimal 20 MB.")
  const bytes = await file.arrayBuffer()
  return new Promise((resolve, reject) => {
    const worker = new Worker("/protect.worker.js")
    const timer = setTimeout(() => {
      worker.terminate()
      reject(Error("Proses terlalu lama. Coba PDF yang lebih kecil."))
    }, 90000)
    const cleanup = () => {
      clearTimeout(timer)
      worker.terminate()
    }
    worker.onmessage = ({ data }) => {
      cleanup()
      if (data.error) reject(Error(data.error))
      else resolve(new Uint8Array(data.bytes))
    }
    worker.onerror = () => {
      cleanup()
      reject(
        Error("Mesin proteksi gagal dimuat. Muat ulang halaman dan coba lagi.")
      )
    }
    worker.postMessage({ bytes, password }, [bytes])
  })
}
