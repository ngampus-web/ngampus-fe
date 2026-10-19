export type CreatorSubmitStatus = "Diproses" | "Ditolak" | "Diterima"

export type CreatorPlatform = "TikTok" | "Instagram" | "X / Thread"

export type CreatorSubmission = {
  link: string
  platform: CreatorPlatform
  submittedAt: string
  status: CreatorSubmitStatus
  reward: number
}

export type CreatorWithdrawal = {
  at: string
  amount: number
  status: string
  bank: string
  note: string
}

export type CreatorSession = {
  name: string
  email: string
}
