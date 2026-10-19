import type { WarrantyClaim } from "../types"

export const warrantyClaimOrders = [
  {
    id: "ORD-2026-9781",
    product: "YouTube Premium & Music (3 Bulan Invite)",
  },
  {
    id: "ORD-2026-9804",
    product: "Netflix Premium Ultra HD (1 Profil 1 User)",
  },
  {
    id: "ORD-2026-9710",
    product: "ChatGPT Plus (1 Bulan Privat)",
  },
]

export const warrantyClaims: WarrantyClaim[] = [
  {
    id: "CLM-2026-188",
    orderId: "ORD-2026-9781",
    product: "YouTube Premium & Music (3 Bulan Invite)",
    reason: "Password Berubah",
    status: "dalam-proses",
    submittedAt: "2026-10-01 16:50:53",
  },
  {
    id: "CLM-2026-104",
    orderId: "ORD-2026-9804",
    product: "Netflix Premium Ultra HD (1 Profil 1 User)",
    reason: "Password Berubah",
    status: "dalam-proses",
    submittedAt: "2026-09-27 10:14:00",
  },
  {
    id: "CLM-2026-098",
    orderId: "ORD-2026-9710",
    product: "ChatGPT Plus (1 Bulan Privat)",
    reason: "Limit Tercapai",
    status: "selesai",
    submittedAt: "2026-09-15 08:30:00",
  },
]
