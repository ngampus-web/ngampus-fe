"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
  Field,
  type FieldErrors,
  Heading,
  Note,
  PasswordField,
  SubmitButton,
} from "@/features/auth/components/auth-forms"
import { safeNext } from "@/features/auth/components/require-auth"
import { Turnstile } from "@/features/auth/components/turnstile"
import { creatorApi } from "@/lib/api"
import { useAuthStore } from "@/lib/stores/auth"

const DASHBOARD = "/creator/dashboard"

function creatorNext(next: string | null) {
  const target = safeNext(next)
  return target.startsWith("/creator/") ? target : DASHBOARD
}

function Spinner() {
  return (
    <div className="flex min-h-60 items-center justify-center text-subtle">
      <Loader2 className="size-6 animate-spin" aria-label="Memuat" />
    </div>
  )
}

/** Sign-up for visitors; a "join" form for users who already have an account. */
export function CreatorRegisterForm() {
  const status = useAuthStore((s) => s.status)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()

  useEffect(() => {
    if (user?.isCreator) router.replace(DASHBOARD)
  }, [user, router])

  if (status === "idle" || status === "loading" || user?.isCreator)
    return <Spinner />
  return user ? <JoinForm /> : <SignUpForm />
}

function SignUpForm() {
  const setSession = useAuthStore((s) => s.setSession)
  const router = useRouter()
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<FieldErrors>()
  const [turnstileToken, setTurnstileToken] = useState<string>()
  const [resetCaptcha, setResetCaptcha] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const password = String(data.get("password"))
        if (password !== String(data.get("confirm-password"))) {
          setErrors({ confirmPassword: ["Konfirmasi password belum sama."] })
          return
        }
        setSubmitting(true)
        setNote("")
        setErrors(undefined)
        const res = await creatorApi.register({
          name: String(data.get("name")),
          email: String(data.get("email")),
          whatsapp: String(data.get("whatsapp")),
          password,
          turnstileToken,
        })
        setSubmitting(false)
        if (res.success) {
          setSession(res.data.user, res.data.accessToken)
          router.replace(DASHBOARD)
          return
        }
        setErrors(
          res.error.details?.fieldErrors as Record<string, string[]> | undefined
        )
        setNote(res.error.message)
        setResetCaptcha((n) => n + 1)
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
      <Field
        id="whatsapp"
        label="Nomor WhatsApp"
        type="tel"
        inputMode="tel"
        placeholder="081234567890"
        autoComplete="tel"
        errors={errors}
      />
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
          Sudah punya akun creator?{" "}
          <Link href="/creator/masuk" className="font-medium text-primary">
            Masuk
          </Link>
        </p>
      </div>
    </form>
  )
}

function JoinForm() {
  const user = useAuthStore((s) => s.user)!
  const setUser = useAuthStore((s) => s.setUser)
  const router = useRouter()
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<FieldErrors>()
  const [submitting, setSubmitting] = useState(false)

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={async (event) => {
        event.preventDefault()
        const whatsapp = String(
          new FormData(event.currentTarget).get("whatsapp")
        )
        setSubmitting(true)
        setNote("")
        setErrors(undefined)
        const res = await creatorApi.join(whatsapp)
        setSubmitting(false)
        // 409: already a creator (e.g. joined in another tab).
        if (res.success || res.error.status === 409) {
          setUser({ ...user, isCreator: true })
          router.replace(DASHBOARD)
          return
        }
        setErrors(
          res.error.details?.fieldErrors as Record<string, string[]> | undefined
        )
        setNote(res.error.message)
      }}
    >
      <Heading
        title="Gabung Ngampus Creator"
        description={`Kamu masuk sebagai ${user.name}. Lengkapi nomor WhatsApp untuk mulai jadi creator.`}
      />
      <Field
        id="whatsapp"
        label="Nomor WhatsApp"
        type="tel"
        inputMode="tel"
        placeholder="081234567890"
        autoComplete="tel"
        defaultValue={user.phone ?? ""}
        errors={errors}
      />
      <div className="flex flex-col gap-3">
        <SubmitButton submitting={submitting} label="Gabung jadi Creator" />
        <Note text={note} tone="error" />
      </div>
    </form>
  )
}

export function CreatorLoginForm() {
  const login = useAuthStore((s) => s.login)
  const status = useAuthStore((s) => s.status)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const next = creatorNext(useSearchParams().get("next"))
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Already signed in: creators continue, others are offered the join form.
  useEffect(() => {
    if (status === "authenticated")
      router.replace(user?.isCreator ? next : "/creator/daftar")
  }, [status, user, next, router])

  if (status !== "guest") return <Spinner />

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitting(true)
        setNote("")
        const result = await login(
          String(data.get("email")),
          String(data.get("password")),
          true
        )
        setSubmitting(false)
        if (!result.success) setNote(result.error)
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
        <SubmitButton submitting={submitting} label="Masuk Sekarang" />
        <Note text={note} tone="error" />
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
