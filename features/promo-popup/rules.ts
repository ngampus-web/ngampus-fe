export const POPUP_SESSION_KEY = "ngampus:promo-popup:shown:v1"

export interface PopupPoster {
  id: string
  title: string
  imageUrl: string
  linkUrl: string
}

export function isPopupRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/creator" ||
    /^\/(marketplace|cek-plagiarisme|blog)(\/[^/]+)?\/?$/.test(pathname)
  )
}

export function isPopupDestination(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\/(?!\/)/.test(value) ||
    /[\\\s]/.test(value) ||
    Array.from(value).some((char) => char.charCodeAt(0) < 32)
  )
    return false
  try {
    return (
      new URL(value, "https://ngampus.co.id").origin === "https://ngampus.co.id"
    )
  } catch {
    return false
  }
}

export function popupPosters(value: unknown): PopupPoster[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (row): row is PopupPoster =>
      !!row &&
      typeof row.id === "string" &&
      typeof row.title === "string" &&
      row.title.trim().length > 0 &&
      typeof row.imageUrl === "string" &&
      /^https?:\/\//.test(row.imageUrl) &&
      isPopupDestination(row.linkUrl)
  )
}

let shownInMemory = false

export function popupWasShown(storage: Pick<Storage, "getItem"> | null) {
  if (shownInMemory) return true
  try {
    return storage?.getItem(POPUP_SESSION_KEY) === "1"
  } catch {
    return false
  }
}

export function markPopupShown(storage: Pick<Storage, "setItem"> | null) {
  shownInMemory = true
  try {
    storage?.setItem(POPUP_SESSION_KEY, "1")
  } catch {}
}

export function popupStorage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}
