import { degrees, type PDFPage } from "pdf-lib"
/** Map a position in the displayed crop box back to PDF coordinates. */
export function signaturePlacement(
  page: PDFPage,
  ratio: number,
  widthPercent: number,
  xPercent: number,
  yPercent: number
) {
  const box = page.getCropBox()
  const angle = ((page.getRotation().angle % 360) + 360) % 360
  const sideways = angle === 90 || angle === 270
  const viewW = sideways ? box.height : box.width,
    viewH = sideways ? box.width : box.height
  const width = Math.min((viewW * widthPercent) / 100, viewH * 0.8 * ratio),
    height = width / ratio
  const vx = ((viewW - width) * xPercent) / 100,
    vy = (viewH - height) * (1 - yPercent / 100)
  const positions: Record<number, [number, number]> = {
    0: [vx, vy],
    90: [box.width - vy, vx],
    180: [box.width - vx, box.height - vy],
    270: [vy, box.height - vx],
  }
  const [x, y] = positions[angle] ?? positions[0]
  return { x: box.x + x, y: box.y + y, width, height, rotate: degrees(angle) }
}
