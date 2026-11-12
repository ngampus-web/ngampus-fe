/** Bound raster memory before drawing. Process and release each image sequentially. */
export async function imageCanvas(
  file: Blob,
  rotation = 0,
  grayscale = false,
  maxEdge = 2400
) {
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const scale = Math.min(
      1,
      maxEdge / Math.max(image.naturalWidth, image.naturalHeight)
    )
    const w = Math.max(1, Math.round(image.naturalWidth * scale)),
      h = Math.max(1, Math.round(image.naturalHeight * scale))
    const canvas = document.createElement("canvas")
    canvas.width = rotation % 180 ? h : w
    canvas.height = rotation % 180 ? w : h
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas tidak tersedia.")
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    if (grayscale) ctx.filter = "grayscale(1) contrast(1.15)"
    ctx.drawImage(image, -w / 2, -h / 2, w, h)
    return canvas
  } finally {
    URL.revokeObjectURL(url)
  }
}
export async function canvasBytes(
  canvas: HTMLCanvasElement,
  type = "image/jpeg",
  quality = 0.92
) {
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Gagal mengolah gambar."))),
      type,
      quality
    )
  )
  return new Uint8Array(await blob.arrayBuffer())
}
export function freeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 0
  canvas.height = 0
}
export function trimSignature(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas tidak tersedia.")
  const { width, height } = canvas
  const pixels = ctx.getImageData(0, 0, width, height).data
  let left = width,
    top = height,
    right = -1,
    bottom = -1
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (pixels[(y * width + x) * 4 + 3] > 16) {
        left = Math.min(left, x)
        right = Math.max(right, x)
        top = Math.min(top, y)
        bottom = Math.max(bottom, y)
      }
  if (right < left) throw new Error("Gambar tanda tangan terlebih dahulu.")
  left = Math.max(0, left - 4)
  top = Math.max(0, top - 4)
  right = Math.min(width - 1, right + 4)
  bottom = Math.min(height - 1, bottom + 4)
  const out = document.createElement("canvas")
  out.width = right - left + 1
  out.height = bottom - top + 1
  out
    .getContext("2d")!
    .drawImage(
      canvas,
      left,
      top,
      out.width,
      out.height,
      0,
      0,
      out.width,
      out.height
    )
  return out
}
