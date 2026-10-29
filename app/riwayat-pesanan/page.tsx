import type { Metadata } from "next"

import { OrderHistoryEntry } from "@/features/orders/components/order-history-entry"

export const metadata: Metadata = {
  title: "Riwayat Pesanan",
  description: "Riwayat pesanan cek plagiarisme dan akun marketplace kamu.",
}

export default function OrderHistoryPage() {
  return <OrderHistoryEntry />
}
