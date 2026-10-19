import type { CreatorSubmission, CreatorWithdrawal } from "../types"

export const creatorSubmissions: CreatorSubmission[] = [
  {
    link: "https://tiktok.com/xxxxx",
    platform: "TikTok",
    submittedAt: "2026-10-04 13:01:52",
    status: "Diterima",
    reward: 350000,
  },
]

export const creatorWithdrawals: CreatorWithdrawal[] = []

export const MIN_WITHDRAWAL = 50000
export const creatorDemoBalance = creatorSubmissions
  .filter((item) => item.status === "Diterima")
  .reduce((total, item) => total + item.reward, 0)

export function creatorDemoName(name: string) {
  return name.trim().toLowerCase() === "budi" ? "Budi Yanto" : name
}

export function withdrawalError(amount: number) {
  if (!Number.isSafeInteger(amount) || amount < MIN_WITHDRAWAL)
    return "Minimal withdraw Rp 50.000."
  if (amount > creatorDemoBalance)
    return "Nominal melebihi saldo yang tersedia."
  return ""
}
