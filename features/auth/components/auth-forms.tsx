"use client"

import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export function RegisterForm() {
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
        setNote("Pendaftaran belum tersedia. Akun belum dibuat.")
      }}
    >
      <Heading
        title="Daftar Sekarang"
        description="Buat akun Ngampus.id kamu sekarang!"
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
          Sudah memiliki akun?{" "}
          <Link href="/masuk" className="font-medium text-primary">
            Masuk
          </Link>
        </p>
      </div>
    </form>
  )
}

export function LoginForm() {
  const [note, setNote] = useState("")

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        setNote("Masuk belum tersedia. Akun belum bisa dipakai.")
      }}
    >
      <Heading
        title="Masuk Sekarang"
        description="Selamat datang kembali di Ngampus.id!"
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
      <label className="flex items-center gap-2 text-sm tracking-[-0.02em]">
        <input
          type="checkbox"
          name="remember"
          defaultChecked
          className="size-4 accent-primary"
        />
        Ingat Saya
      </label>
      <div className="flex flex-col gap-3">
        <Button type="submit" className="h-[52px] w-full rounded-3xl text-base">
          Masuk Sekarang
        </Button>
        {note && (
          <p className="text-center text-sm tracking-[-0.02em] text-subtle">
            {note}
          </p>
        )}
        <Link
          href="/lupa-password"
          className="text-center text-sm tracking-[-0.02em]"
        >
          Lupa password?
        </Link>
        <p className="text-center text-sm tracking-[-0.02em]">
          Belum memiliki akun?{" "}
          <Link href="/daftar" className="font-medium text-primary">
            Daftar
          </Link>
        </p>
      </div>
    </form>
  )
}

export function ForgotPasswordForm() {
  const [note, setNote] = useState("")

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        setNote("Pengiriman link reset belum tersedia.")
      }}
    >
      <Heading
        title="Lupa Password?"
        description="Masukkan email atau nomor WhatsApp yang terdaftar."
      />
      <Field
        id="contact"
        label="Email atau No. Whatsapp"
        placeholder="kamu@gmail.com"
        autoComplete="username"
      />
      <div className="flex flex-col gap-3">
        <Button type="submit" className="h-[52px] w-full rounded-3xl text-base">
          Kirim Link Reset
        </Button>
        {note && (
          <p className="text-center text-sm tracking-[-0.02em] text-subtle">
            {note}
          </p>
        )}
      </div>
    </form>
  )
}
