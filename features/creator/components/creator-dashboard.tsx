"use client"

import {
  Clapperboard,
  ExternalLink,
  Timer,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"

import { CreatorHeader } from "@/features/creator/components/creator-header"
import { Button } from "@/components/ui/button"
import { useCreatorData } from "@/features/creator/hooks/use-creator-data"
import { useCreatorGate } from "@/features/creator/hooks/use-creator-gate"
import {
  type CreatorPlatform,
  type CreatorSubmitStatus,
  platformLabel,
  rupiah,
  SUBMISSION_STATUS,
  WITHDRAWAL_STATUS,
  wibDateTime,
} from "@/features/creator/services/creator-rules"

const statusStyle: Record<CreatorSubmitStatus, string> = {
  Diproses: "bg-[#fff6e8] text-[#b86e00]",
  Ditolak: "bg-[#fdecec] text-[#d14343]",
  Diterima: "bg-[#e8f8ef] text-[#1f9d55]",
}

const statusDot: Record<CreatorSubmitStatus, string> = {
  Diproses: "bg-[#f5a524]",
  Ditolak: "bg-[#e15b5b]",
  Diterima: "bg-[#22a35a]",
}

function PlatformMark({ platform }: { platform: CreatorPlatform }) {
  if (platform === "TikTok") {
    return (
      <span className="flex size-5 items-center justify-center rounded-full bg-black text-white">
        <svg
          viewBox="0 0 24 24"
          className="size-3"
          fill="currentColor"
          aria-hidden
        >
          <path d="M14.2 3c.4 2.4 1.8 4.1 4.1 4.4v2.8a7 7 0 0 1-4.1-1.3v6.4a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.9a2.8 2.8 0 1 0 1.9 2.7V3z" />
        </svg>
      </span>
    )
  }

  if (platform === "Instagram") {
    return (
      <span className="flex size-5 items-center justify-center rounded-full bg-[#e1306c] text-[10px] font-semibold text-white">
        Ig
      </span>
    )
  }

  return (
    <span className="flex size-5 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white">
      X
    </span>
  )
}

export function CreatorDashboard() {
  const allowed = useCreatorGate()
  const { data, error, reload } = useCreatorData(allowed)

  if (!data) {
    return (
      <div className="min-h-svh bg-white">
        {error && (
          <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-5 text-center text-sm text-subtle">
            <p>{error}</p>
            <Button
              type="button"
              variant="outline"
              size="pill"
              onClick={reload}
            >
              Coba lagi
            </Button>
          </div>
        )}
      </div>
    )
  }

  const MIN_WITHDRAWAL = data.me.withdraw.min
  const saldo = data.me.stats.balance
  const creatorSubmissions = data.submissions.map((item) => ({
    link: item.contentUrl,
    platform: platformLabel(item.platform),
    submittedAt: wibDateTime(item.createdAt),
    status: SUBMISSION_STATUS[item.status].label,
    reward: item.rewardAmount ?? 0,
  }))
  const creatorWithdrawals = data.withdrawals.map((item) => ({
    at: wibDateTime(item.createdAt),
    amount: item.amount,
    status: WITHDRAWAL_STATUS[item.status].label,
    bank: item.bankName,
    note: item.adminNote ?? "",
  }))
  const stats: { label: string; value: string; icon: LucideIcon }[] = [
    {
      label: "Total konten",
      value: String(data.me.stats.totalContent),
      icon: Clapperboard,
    },
    {
      label: "Total diproses",
      value: String(
        creatorSubmissions.filter((item) => item.status === "Diproses").length
      ),
      icon: Timer,
    },
    { label: "Withdraw saldo", value: rupiah(saldo), icon: Wallet },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <CreatorHeader />
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 py-10 md:px-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] leading-[1.2] font-medium tracking-[-0.02em]">
            Dashboard Ngampus Creator
          </h1>
          <p className="text-sm leading-6 tracking-[-0.02em] text-subtle">
            Lihat dan pantau semua progress Ngampus Creatormu di sini!
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <li
                key={item.label}
                className="flex items-start justify-between gap-3 rounded-2xl border border-line p-5"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm tracking-[-0.02em] text-subtle">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold tracking-[-0.02em]">
                    {item.value}
                  </p>
                  {item.label === "Withdraw saldo" && (
                    <>
                      <p className="text-xs text-subtle">
                        Minimal withdraw {rupiah(MIN_WITHDRAWAL)}
                      </p>
                      <Button
                        asChild
                        size="pill"
                        className="mt-1 h-8 w-fit px-3 text-sm"
                      >
                        <Link href="/creator/withdraw">Withdraw</Link>
                      </Button>
                    </>
                  )}
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
              </li>
            )
          })}
        </ul>
        <section className="flex flex-col gap-4 rounded-2xl border border-line p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1b2559]">
              Yuk, Submit Kontenmu
            </h2>
            <Link
              href="/creator"
              className="text-sm tracking-[-0.02em] text-primary"
            >
              Pastikan baca panduan Ngampus Creator dulu ya!
            </Link>
          </div>
          <Button asChild size="pill">
            <Link href="/creator/submit?from=dashboard">Submit Video</Link>
          </Button>
        </section>
        <section className="overflow-hidden rounded-2xl border border-line">
          <h2 className="px-5 pt-5 pb-2 text-base font-semibold tracking-[-0.02em] text-[#1b2559]">
            Riwayat Submit Video
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm tracking-[-0.02em]">
              <thead>
                <tr className="text-[11px] font-medium tracking-[0.08em] text-subtle uppercase">
                  {[
                    "No",
                    "Link video",
                    "Platform",
                    "Tanggal",
                    "Status",
                    "Reward",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 font-medium whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {creatorSubmissions.length === 0 ? (
                  <tr className="border-t border-line">
                    <td colSpan={6} className="px-5 py-4 text-subtle">
                      Belum ada submit video.
                    </td>
                  </tr>
                ) : (
                  creatorSubmissions.map((item, index) => (
                    <tr key={item.link} className="border-t border-line">
                      <td className="px-5 py-4">{index + 1}</td>
                      <td className="px-5 py-4">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#1f9d55]"
                        >
                          {item.link}
                          <ExternalLink
                            className="size-3.5 shrink-0"
                            aria-hidden
                          />
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <PlatformMark platform={item.platform} />
                          {item.platform}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {item.submittedAt}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${statusStyle[item.status]}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${statusDot[item.status]}`}
                          />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {rupiah(item.reward)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-line">
          <h2 className="px-5 pt-5 pb-2 text-base font-semibold tracking-[-0.02em] text-[#1b2559]">
            Riwayat withdraw
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm tracking-[-0.02em]">
              <thead>
                <tr className="text-[11px] font-medium tracking-[0.08em] text-subtle uppercase">
                  {["Waktu", "Nominal", "Status", "Bank", "Catatan"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 font-medium whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {creatorWithdrawals.length === 0 ? (
                  <tr className="border-t border-line">
                    <td colSpan={5} className="px-5 py-4 text-subtle">
                      Belum ada withdraw.
                    </td>
                  </tr>
                ) : (
                  creatorWithdrawals.map((item) => (
                    <tr
                      key={`${item.at}-${item.bank}`}
                      className="border-t border-line"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">{item.at}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {rupiah(item.amount)}
                      </td>
                      <td className="px-5 py-4">{item.status}</td>
                      <td className="px-5 py-4">{item.bank}</td>
                      <td className="px-5 py-4">{item.note}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
