"use client"

import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  readCreatorSession,
  writeCreatorSession,
} from "@/features/creator/services/demo-session"

const fieldClass =
  "h-14 rounded-full border-line px-4 text-base tracking-[-0.02em] shadow-none placeholder:text-subtle focus-visible:border-primary focus-visible:ring-0 md:text-base"

function Field({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string
  label: string
  type?: string
  placeholder: string
  autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium tracking-[-0.02em]">
        {label}
      </label>
      <Input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={fieldClass}
      />
    </div>
  )
}

function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
}: {
  id: string
  label: string
  placeholder: string
  autoComplete?: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium tracking-[-0.02em]">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          required
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${fieldClass} pr-12`}
        />
        <button
          type="button"
          className="absolute top-1/2 right-4 -translate-y-1/2 text-black"
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <Eye className="size-5" aria-hidden />
          ) : (
            <EyeOff className="size-5" aria-hidden />
          )}
        </button>
      </div>
    </div>
  )
}

function Heading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-6">
      <Image
        src="/images/auth-mark.png"
        alt=""
        width={136}
        height={136}
        priority
        className="mx-auto size-[68px]"
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">{title}</h1>
        <p className="text-base tracking-[-0.02em]">{description}</p>
      </div>
    </div>
  )
}

export function CreatorRegisterForm() {
  const router = useRouter()
  const [note, setNote] = useState("")

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        if (data.get("password") !== data.get("confirm-password")) {
          setNote("Konfirmasi password belum sama.")
          return
        }
        const name = String(data.get("name") ?? "").trim()
        const email = String(data.get("email") ?? "").trim()
        writeCreatorSession({ name, email })
        router.push("/creator/dashboard")
      }}
    >
      <Heading
        title="Daftar Creator"
        description="Buat akun Ngampus Creator untuk masuk ke dashboard."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="name"
          label="Nama Lengkap"
          placeholder="Nama lengkap"
          autoComplete="name"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          placeholder="kamu@gmail.com"
          autoComplete="email"
        />
      </div>
      <PasswordField
        id="password"
        label="Password"
        placeholder="Password"
        autoComplete="new-password"
      />
      <PasswordField
        id="confirm-password"
        label="Konfirmasi Password"
        placeholder="Konfirmasi password"
        autoComplete="new-password"
      />
      <div className="flex flex-col gap-3">
        <Button type="submit" className="h-[52px] w-full rounded-3xl text-base">
          Daftar Sekarang
        </Button>
        {note && (
          <p className="text-center text-sm tracking-[-0.02em] text-subtle">
            {note}
          </p>
        )}
        <p className="text-center text-sm tracking-[-0.02em]">
          Sudah punya akun creator?{" "}
          <Link href="/creator/masuk" className="font-medium text-primary">
            Masuk
          </Link>
        </p>
      </div>
    </form>
  )
}

export function CreatorLoginForm() {
  const router = useRouter()

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const email = String(data.get("email") ?? "").trim()
        const existing = readCreatorSession()
        const name =
          existing?.email === email
            ? existing.name
            : email.split("@")[0] || "Creator"
        writeCreatorSession({ name, email })
        router.push("/creator/dashboard")
      }}
    >
      <Heading
        title="Masuk Creator"
        description="Masuk untuk membuka dashboard Ngampus Creator."
      />
      <Field
        id="email"
        label="Email"
        type="email"
        placeholder="kamu@gmail.com"
        autoComplete="email"
      />
      <PasswordField
        id="password"
        label="Password"
        placeholder="Password"
        autoComplete="current-password"
      />
      <div className="flex flex-col gap-3">
        <Button type="submit" className="h-[52px] w-full rounded-3xl text-base">
          Masuk Sekarang
        </Button>
        <p className="text-center text-sm tracking-[-0.02em]">
          Belum punya akun creator?{" "}
          <Link href="/creator/daftar" className="font-medium text-primary">
            Daftar
          </Link>
        </p>
      </div>
    </form>
  )
}
