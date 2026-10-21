import type { Metadata } from "next"
import { RequireAuth } from "@/features/auth/components/require-auth"
import { PaymentFlow } from "@/features/payment/components/payment-flow"
import { isOrderCode } from "@/features/payment/services/api-gateway"
export const metadata: Metadata = {
  title: "Pembayaran QRIS",
  robots: { index: false, follow: false },
}
export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const flow = <PaymentFlow orderId={orderId} gateway />
  return isOrderCode(orderId) ? <RequireAuth>{flow}</RequireAuth> : flow
}
