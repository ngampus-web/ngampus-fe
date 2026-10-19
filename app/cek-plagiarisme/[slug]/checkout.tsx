"use client"
import { ParaphraseCheckout } from "@/features/paraphrase/components/paraphrase-checkout"
import { PlagiarismCheckout } from "@/features/plagiarism/components/plagiarism-checkout"
import type { PlagiarismService } from "@/features/plagiarism/data/plagiarism"
import { useCheckoutPayment } from "@/features/payment/components/checkout-entry"
export function Checkout({ service }: { service: PlagiarismService }) {
  const onCheckout = useCheckoutPayment()
  if (service.slug === "parafrase-manual")
    return <ParaphraseCheckout onCheckout={onCheckout} />
  return <PlagiarismCheckout service={service} onCheckout={onCheckout} />
}
