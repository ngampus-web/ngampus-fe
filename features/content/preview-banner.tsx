import { draftMode } from "next/headers"
import { readContentDraft } from "./preview"

export async function PreviewBanner() {
  if (!(await draftMode()).isEnabled) return null
  const draft = await readContentDraft()
  return (
    <aside className="sticky top-0 z-[100] flex flex-wrap items-center justify-center gap-3 bg-amber-100 px-4 py-3 text-sm text-amber-950">
      <span>
        {draft
          ? "Preview — perubahan ini belum dipublikasikan. Berlaku 10 menit."
          : "Preview kedaluwarsa. Konten tersimpan ditampilkan."}
      </span>
      <form action="/api/content-preview/exit" method="post">
        <button className="font-semibold underline" type="submit">
          Keluar dari preview
        </button>
      </form>
    </aside>
  )
}
