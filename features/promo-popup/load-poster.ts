import type { PopupPoster } from "./rules"

export function loadPoster(url: string, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve(false)
    const image = new Image()
    const finish = (loaded: boolean) => {
      clearTimeout(timer)
      signal.removeEventListener("abort", abort)
      image.onload = null
      image.onerror = null
      resolve(loaded)
    }
    const abort = () => {
      image.src = ""
      finish(false)
    }
    const timer = setTimeout(() => finish(false), 8000)
    signal.addEventListener("abort", abort, { once: true })
    image.onload = () => finish(image.naturalWidth > 0)
    image.onerror = () => finish(false)
    image.src = url
  })
}

export async function firstUsablePoster(
  posters: PopupPoster[],
  signal: AbortSignal,
  load = loadPoster
): Promise<PopupPoster[]> {
  for (let index = 0; index < posters.length && !signal.aborted; index++) {
    if (await load(posters[index].imageUrl, signal)) return posters.slice(index)
  }
  return []
}
