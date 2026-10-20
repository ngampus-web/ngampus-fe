"use client"

import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api"
import { useAuthStore } from "@/lib/stores/auth"

import { safeNext } from "./require-auth"
import { Turnstile } from "./turnstile"

type FieldErrors = Record<string, string[]> | undefined

function FieldError({ errors, name }: { errors: FieldErrors; name: string }) {
  const message = errors?.[name]?.[0]
  if (!message) return null
  return (
    <p className="px-4 text-sm tracking-[-0.02em] text-destructive">
      {message}
    </p>
  )
}

function Note({
  text,
  tone = "muted",
}: {
  text: string
  tone?: "muted" | "error"
}) {
  if (!text) return null
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`text-center text-sm tracking-[-0.02em] ${tone === "error" ? "text-destructive" : "text-subtle"}`}
    >
      {text}
    </p>
  )
}

const fieldClass =
  "h-14 rounded-full border-line px-4 text-base tracking-[-0.02em] shadow-none placeholder:text-subtle focus-visible:border-primary focus-visible:ring-0 md:text-base"

function Field({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  errors,
  errorKey,
}: {
  id: string
  label: string
  type?: string
  placeholder: string
  autoComplete?: string
  errors?: FieldErrors
  errorKey?: string
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
        aria-invalid={Boolean(errors?.[errorKey ?? id])}
        className={fieldClass}
      />
      <FieldError errors={errors} name={errorKey ?? id} />
    </div>
  )
}

function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  errors,
  errorKey,
}: {
  id: string
  label: string
  placeholder: string
  autoComplete?: string
  errors?: FieldErrors
  errorKey?: string
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
      <FieldError errors={errors} name={errorKey ?? id} />
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

function useSubmitting() {
  const [submitting, setSubmitting] = useState(false)
  return [submitting, setSubmitting] as const
}

function SubmitButton({
  submitting,
  label,
}: {
  submitting: boolean
  label: string
}) {
  return (
    <Button
      type="submit"
      disabled={submitting}
      className="h-[52px] w-full rounded-3xl text-base"
    >
      {submitting ? "Memproses..." : label}
    </Button>
  )
}

export function RegisterForm() {
  const register = useAuthStore((s) => s.register)
  const router = useRouter()
  const next = safeNext(useSearchParams().get("next"))
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<FieldErrors>()
  const [turnstileToken, setTurnstileToken] = useState<string>()
  const [resetCaptcha, setResetCaptcha] = useState(0)
  const [submitting, setSubmitting] = useSubmitting()

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const password = String(data.get("password"))
        const confirmPassword = String(data.get("confirm-password"))
        if (password !== confirmPassword) {
          setErrors({ confirmPassword: ["Konfirmasi password belum sama."] })
          return
        }
        setSubmitting(true)
        setNote("")
        setErrors(undefined)
        const result = await register({
          name: String(data.get("name")),
          email: String(data.get("email")),
          password,
          confirmPassword,
          turnstileToken,
        })
        setSubmitting(false)
        if (result.success) {
          router.replace(next)
          return
        }
        setErrors(result.fieldErrors)
        setNote(result.error)
        setResetCaptcha((n) => n + 1)
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
          errors={errors}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          placeholder="kamu@gmail.com"
          autoComplete="email"
          errors={errors}
        />
      </div>
      <PasswordField
        id="password"
        label="Password"
        placeholder="Password"
        autoComplete="new-password"
        errors={errors}
      />
      <PasswordField
        id="confirm-password"
        label="Konfirmasi Password"
        placeholder="Konfirmasi password"
        autoComplete="new-password"
        errors={errors}
        errorKey="confirmPassword"
      />
      <Turnstile onToken={setTurnstileToken} resetKey={resetCaptcha} />
      <div className="flex flex-col gap-3">
        <SubmitButton submitting={submitting} label="Daftar Sekarang" />
        <Note text={note} tone="error" />
        <p className="text-center text-sm tracking-[-0.02em]">
          Sudah memiliki akun?{" "}
          <Link
            href={
              next === "/"
                ? "/masuk"
                : `/masuk?next=${encodeURIComponent(next)}`
            }
            className="font-medium text-primary"
          >
            Masuk
          </Link>
        </p>
      </div>
    </form>
  )
}

export function LoginForm() {
  const login = useAuthStore((s) => s.login)
  const router = useRouter()
  const next = safeNext(useSearchParams().get("next"))
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<FieldErrors>()
  const [submitting, setSubmitting] = useSubmitting()

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitting(true)
        setNote("")
        setErrors(undefined)
        const result = await login(
          String(data.get("email")),
          String(data.get("password")),
          data.get("remember") === "on"
        )
        setSubmitting(false)
        if (result.success) {
          router.replace(next)
          return
        }
        setErrors(result.fieldErrors)
        setNote(result.error)
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
        errors={errors}
      />
      <PasswordField
        id="password"
        label="Password"
        placeholder="Password"
        autoComplete="current-password"
        errors={errors}
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
        <SubmitButton submitting={submitting} label="Masuk Sekarang" />
        <Note text={note} tone="error" />
        <Link
          href="/lupa-password"
          className="text-center text-sm tracking-[-0.02em]"
        >
          Lupa password?
        </Link>
        <p className="text-center text-sm tracking-[-0.02em]">
          Belum memiliki akun?{" "}
          <Link
            href={
              next === "/"
                ? "/daftar"
                : `/daftar?next=${encodeURIComponent(next)}`
            }
            className="font-medium text-primary"
          >
            Daftar
          </Link>
        </p>
      </div>
    </form>
  )
}

export function ForgotPasswordForm() {
  const [note, setNote] = useState("")
  const [tone, setTone] = useState<"muted" | "error">("muted")
  const [errors, setErrors] = useState<FieldErrors>()
  const [turnstileToken, setTurnstileToken] = useState<string>()
  const [resetCaptcha, setResetCaptcha] = useState(0)
  const [submitting, setSubmitting] = useSubmitting()

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={async (event) => {
        event.preventDefault()
        const email = String(new FormData(event.currentTarget).get("email"))
        setSubmitting(true)
        setErrors(undefined)
        const res = await authApi.requestPasswordReset(email, turnstileToken)
        setSubmitting(false)
        setResetCaptcha((n) => n + 1)
        if (res.success) {
          setTone("muted")
          setNote(
            "Jika email terdaftar, link reset password sudah dikirim. Cek inbox atau folder spam."
          )
          return
        }
        setTone("error")
        setErrors(res.error.details?.fieldErrors as FieldErrors)
        setNote(res.error.message)
      }}
    >
      <Heading
        title="Lupa Password?"
        description="Masukkan email yang terdaftar untuk menerima link reset."
      />
      <Field
        id="email"
        label="Email"
        type="email"
        placeholder="kamu@gmail.com"
        autoComplete="email"
        errors={errors}
      />
      <Turnstile onToken={setTurnstileToken} resetKey={resetCaptcha} />
      <div className="flex flex-col gap-3">
        <SubmitButton submitting={submitting} label="Kirim Link Reset" />
        <Note text={note} tone={tone} />
        <Link href="/masuk" className="text-center text-sm tracking-[-0.02em]">
          Kembali ke halaman masuk
        </Link>
      </div>
    </form>
  )
}

export function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? ""
  const router = useRouter()
  const [note, setNote] = useState(
    token
      ? ""
      : "Link reset tidak valid. Minta link baru dari halaman lupa password."
  )
  const [errors, setErrors] = useState<FieldErrors>()
  const [submitting, setSubmitting] = useSubmitting()

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const newPassword = String(data.get("password"))
        if (newPassword !== data.get("confirm-password")) {
          setErrors({ confirmPassword: ["Konfirmasi password belum sama."] })
          return
        }
        setSubmitting(true)
        setErrors(undefined)
        const res = await authApi.resetPassword(token, newPassword)
        setSubmitting(false)
        if (res.success) {
          router.replace("/masuk?reset=1")
          return
        }
        setErrors(res.error.details?.fieldErrors as FieldErrors)
        setNote(res.error.message)
      }}
    >
      <Heading
        title="Buat Password Baru"
        description="Masukkan password baru untuk akun Ngampus.id kamu."
      />
      <PasswordField
        id="password"
        label="Password Baru"
        placeholder="Minimal 8 karakter"
        autoComplete="new-password"
        errors={errors}
        errorKey="newPassword"
      />
      <PasswordField
        id="confirm-password"
        label="Konfirmasi Password"
        placeholder="Konfirmasi password"
        autoComplete="new-password"
        errors={errors}
        errorKey="confirmPassword"
      />
      <div className="flex flex-col gap-3">
        <SubmitButton
          submitting={submitting || !token}
          label="Simpan Password"
        />
        <Note text={note} tone="error" />
        <Link
          href="/lupa-password"
          className="text-center text-sm tracking-[-0.02em]"
        >
          Minta link baru
        </Link>
      </div>
    </form>
  )
}
