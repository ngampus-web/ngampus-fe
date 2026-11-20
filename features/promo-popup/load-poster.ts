import type { PopupPoster } from "./rules"

export function loadPoster(url: string, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve(false)
    const image = new Image()
    const finish = (loaded: boolean, reason?: string) => {
      if (!loaded && reason && !signal.aborted)
        console.warn(`[promo-popup] poster not usable (${reason}):`, url)
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
    // Posters are large PNGs; slow mobile links need more than a few seconds.
    const timer = setTimeout(() => finish(false, "timeout"), 20000)
    signal.addEventListener("abort", abort, { once: true })
    image.onload = () =>
      image.naturalWidth > 0 ? finish(true) : finish(false, "empty image")
    image.onerror = () => finish(false, "load error")
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
