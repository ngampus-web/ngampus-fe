import type { Metadata } from "next"

import { RequireAuth } from "@/features/auth/components/require-auth"
import { OrderHistory } from "@/features/orders/components/order-history"

export const metadata: Metadata = {
  title: "Riwayat Pesanan",
  description: "Riwayat pesanan cek plagiarisme dan akun marketplace kamu.",
}

export default function OrderHistoryPage() {
  return (
    <RequireAuth>
      <OrderHistory />
    </RequireAuth>
  )
}
