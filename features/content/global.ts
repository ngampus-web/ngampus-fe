import { serverGet } from "@/lib/api/server"
import { normalizeNgampusBrand } from "@/lib/normalize-ngampus-brand"
import { PAGE_DEFAULTS } from "./defaults"
import type { GlobalContent } from "@/lib/api/endpoints/content"
import { readContentDraft } from "./preview"

export const GLOBAL_DEFAULTS: GlobalContent = {
  announcement: {
    text: "Promo dan update terbaru Ngampus? Pantau langsung lewat Saluran WhatsApp kami!",
    url: "https://whatsapp.com/channel/0029Vb8T6U2KGGGEX7gFIJ2i",
    active: true,
  },
  contacts: {
    whatsapp: "6281918685172",
    email: "cs@ngampus.co.id",
    instagram: "https://www.instagram.com/ngampusofc/" as string | null,
    tiktok: "https://www.tiktok.com/@ngampusofc" as string | null,
    supportHours: "",
  },
  footer: PAGE_DEFAULTS.footer,
}
export async function getGlobalContent(): Promise<GlobalContent> {
  const draft = await readContentDraft()
  let content: GlobalContent
  try {
    const settings = (await serverGet<GlobalContent>("/content/settings")).data
    content = {
      ...GLOBAL_DEFAULTS,
      ...settings,
      contacts: { ...GLOBAL_DEFAULTS.contacts, ...settings.contacts },
      footer: { ...GLOBAL_DEFAULTS.footer, ...settings.footer },
    }
  } catch {
    content = GLOBAL_DEFAULTS
  }
  return draft?.page === "footer"
    ? {
        ...content,
        footer: normalizeNgampusBrand(draft.value as GlobalContent["footer"]),
      }
    : content
}
