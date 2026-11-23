import type { Metadata } from "next"

import { OrderHistoryEntry } from "@/features/orders/components/order-history-entry"
import { NOINDEX_ROBOTS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Riwayat Pesanan",
  description: "Riwayat pesanan cek plagiarisme dan akun marketplace kamu.",
  robots: NOINDEX_ROBOTS,
}

export default function OrderHistoryPage() {
  return <OrderHistoryEntry />
}
