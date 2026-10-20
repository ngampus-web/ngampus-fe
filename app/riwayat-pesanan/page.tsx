import type { Metadata } from "next"

import { RequireAuth } from "@/features/auth/components/require-auth"
import { OrderHistory } from "@/features/orders/components/order-history"

export const metadata: Metadata = {
  title: "Riwayat Pesanan",
  description: "Cari pesanan dengan nomor WhatsApp atau kode order.",
}

export default function OrderHistoryPage() {
  return (
    <RequireAuth>
      <OrderHistory />
    </RequireAuth>
  )
}
