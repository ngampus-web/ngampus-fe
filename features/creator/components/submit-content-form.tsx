"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRef, useState } from "react"

import { DatePicker } from "@/components/shared/date-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { campaignPlatforms } from "@/features/creator/data/campaign"
import { useCreatorGate } from "@/features/creator/hooks/use-creator-gate"
import { PLATFORM_OPTIONS } from "@/features/creator/services/creator-rules"
import { creatorApi, filesApi } from "@/lib/api"

const fieldClass =
  "h-14 w-full rounded-full border border-line bg-white px-4 text-base font-normal tracking-[-0.02em] shadow-none outline-none placeholder:text-subtle focus-visible:border-primary focus-visible:ring-0 md:text-base"

const platforms = [
  "TikTok",
  ...campaignPlatforms
    .map((item) => item.name)
    .filter((name) => name !== "TikTok"),
]

const maxFileBytes = 5 * 1024 * 1024
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"])

/** Today's date in WIB as `YYYY-MM-DD` (max for "tanggal pembuatan"). */
function todayWib() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(
    new Date()
  )
}

function firstFieldError(details: Record<string, unknown> | undefined) {
  const fields = details?.fieldErrors as Record<string, string[]> | undefined
  return fields ? Object.values(fields)[0]?.[0] : undefined
}

export function SubmitContentForm() {
  const allowed = useCreatorGate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState("")
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!allowed) return null

  if (submitted) {
    return (
      <div className="flex flex-col gap-4" role="status">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">
          Yeay, Kontenmu Berhasil Disubmit! 🎉
        </h1>
        <p className="text-base leading-6 tracking-[-0.02em] text-black/70">
          Tinggal tunggu proses verifikasi dari tim Ngampus, ya. Pengecekan
          membutuhkan waktu maksimal 1 minggu.
        </p>
        <p className="text-base leading-6 tracking-[-0.02em] text-black/70">
          Kalau submission-mu valid, reward akan langsung masuk ke saldo akunmu
          dan statusnya bisa kamu pantau lewat dashboard.
        </p>
        <Button asChild size="pill" className="mt-2 w-full">
          <Link href="/creator/dashboard">Oke, Sip!</Link>
        </Button>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const file = fileRef.current?.files?.[0]
        if (!file) {
          setNote("Pilih screenshot jumlah views.")
          return
        }
        if (!allowedTypes.has(file.type)) {
          setNote("Format file harus JPG, PNG, atau WEBP.")
          return
        }
        if (file.size > maxFileBytes) {
          setNote("Ukuran file maksimal 5MB.")
          return
        }
        const platform = PLATFORM_OPTIONS.find(
          (p) => p.label === data.get("platform")
        )
        if (!platform) {
          setNote("Pilih platform.")
          return
        }
        setNote("")
        setSubmitting(true)
        const upload = await filesApi.upload(file, "submission_proof")
        if (!upload.success) {
          setSubmitting(false)
          setNote(upload.error.message)
          return
        }
        const res = await creatorApi.submit({
          contentUrl: String(data.get("link")),
          platform: platform.value,
          accountUsername: String(data.get("username")),
          contentPublishedOn: String(data.get("publishedOn")),
          viewsCount: Number(data.get("views")),
          proofFileId: upload.data.id,
        })
        setSubmitting(false)
        if (res.success) {
          setSubmitted(true)
          return
        }
        setNote(firstFieldError(res.error.details) ?? res.error.message)
      }}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">
          Submit Konten
        </h1>
        <p className="text-base tracking-[-0.02em]">
          Silahkan isi form sebagai bentuk verifikasi
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
        Link Konten
        <Input
          name="link"
          type="url"
          required
          placeholder="Paste link konten/post kamu disini..."
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
        Platform
        <Select name="platform" required defaultValue="TikTok">
          <SelectTrigger className={fieldClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
        Nama akun/username
        <Input
          name="username"
          required
          placeholder="@username"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
        Tanggal pembuatan
        <DatePicker
          name="publishedOn"
          required
          max={todayWib()}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
        Jumlah Views/impressions saat submit
        <Input
          name="views"
          type="text"
          inputMode="numeric"
          required
          pattern="[0-9]+"
          title="Isi dengan angka, contoh 1200"
          placeholder="Contoh: 1200"
          className={fieldClass}
        />
      </label>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="screenshot"
          className="text-sm font-medium tracking-[-0.02em]"
        >
          Screenshot jumlah views saat submit
        </label>
        <span className="relative">
          <input
            ref={fileRef}
            id="screenshot"
            name="screenshot"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(event) => {
              const file = event.target.files?.[0]
              setFileName(file?.name ?? "")
              setNote("")
            }}
          />
          <span className={`${fieldClass} flex items-center pr-12 text-subtle`}>
            <span className="truncate">{fileName || "Pilih File"}</span>
          </span>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-black"
            aria-hidden
          />
        </span>
        <p className="text-sm tracking-[-0.02em] text-subtle">
          Format file: JPG, PNG atau WEBP. Maks 5MB
        </p>
      </div>

      {note && (
        <p className="text-sm tracking-[-0.02em] text-primary">{note}</p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="mt-2 h-[52px] w-full rounded-3xl text-base"
      >
        Submit Video
      </Button>
    </form>
  )
}
