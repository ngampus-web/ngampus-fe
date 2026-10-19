"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  creatorDemoBalance,
  MIN_WITHDRAWAL,
  withdrawalError,
} from "../data/demo-dashboard"

const fieldClass =
  "h-14 w-full rounded-full border border-line bg-white px-4 text-base font-normal tracking-[-0.02em] shadow-none outline-none placeholder:text-subtle focus-visible:border-primary focus-visible:ring-0 md:text-base"

const banks = ["BCA", "Mandiri", "BNI", "BRI", "SeaBank"]

export function WithdrawForm() {
  const [note, setNote] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="flex flex-col gap-4" role="status">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">
          Yeay, Pengajuan Withdraw Berhasil! 🎉
        </h1>
        <p className="text-base leading-6 tracking-[-0.02em] text-black/70">
          Pengajuan penarikan saldomu berhasil dikirim. Tim Ngampus akan
          memprosesnya dalam waktu maksimal 2 × 24 jam, ya
        </p>
        <p className="text-base leading-6 tracking-[-0.02em] text-black/70">
          Kamu bisa memantau status penarikan dan melihat riwayatnya melalui
          dashboard
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
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const amount = Number(String(data.get("amount") ?? ""))
        const error = withdrawalError(amount)
        if (error) {
          setNote(error)
          return
        }
        setNote("")
        setSubmitted(true)
      }}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">
          Penarikan Saldo
        </h1>
        <p className="text-base tracking-[-0.02em]">
          Isi data rekening untuk menarik saldo kamu
        </p>
      </div>

      <p className="text-sm text-subtle">
        Saldo dummy: Rp {creatorDemoBalance.toLocaleString("id-ID")}. Minimal
        withdraw Rp {MIN_WITHDRAWAL.toLocaleString("id-ID")}.
      </p>
      <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
        Nominal
        <Input
          name="amount"
          type="text"
          inputMode="numeric"
          required
          pattern="[0-9]+"
          title="Isi dengan angka, contoh 50000"
          placeholder="Contoh: 50000"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
        Bank
        <span className="relative">
          <select
            name="bank"
            required
            defaultValue="BCA"
            className={`${fieldClass} appearance-none pr-12`}
          >
            {banks.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-black"
            aria-hidden
          />
        </span>
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
        Nomor rekening
        <Input
          name="account"
          required
          inputMode="numeric"
          pattern="[0-9]+"
          placeholder="Nomor rekening"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
        Nama pemilik rekening
        <Input
          name="holder"
          required
          placeholder="Nama sesuai rekening"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
        Catatan
        <Input name="note" placeholder="Opsional" className={fieldClass} />
      </label>

      <p className="rounded-2xl bg-primary/5 p-4 text-sm leading-6 text-black/70">
        Proses penarikan saldo membutuhkan waktu maksimal 2 × 24 jam. Dana akan
        ditransfer langsung ke rekening yang kamu cantumkan oleh tim Ngampus.
        Kamu dapat memantau status penarikan melalui{" "}
        <Link
          href="/creator/dashboard"
          className="font-medium text-primary underline underline-offset-2"
        >
          Dashboard
        </Link>
        .
      </p>

      {note && (
        <p className="text-sm tracking-[-0.02em] text-primary">{note}</p>
      )}

      <Button
        type="submit"
        className="mt-2 h-[52px] w-full rounded-3xl text-base"
      >
        Tarik Saldo
      </Button>
    </form>
  )
}
