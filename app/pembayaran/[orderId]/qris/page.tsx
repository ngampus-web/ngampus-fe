import type { Metadata } from "next"
import { PaymentFlow } from "@/features/payment/components/payment-flow"
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
  return <PaymentFlow orderId={orderId} gateway />
}
