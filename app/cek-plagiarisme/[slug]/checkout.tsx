"use client"
import { ParaphraseCheckout } from "@/features/paraphrase/components/paraphrase-checkout"
import { PlagiarismCheckout } from "@/features/plagiarism/components/plagiarism-checkout"
import type { PlagiarismService } from "@/features/plagiarism/data/plagiarism"
import { useCheckoutPayment } from "@/features/payment/components/checkout-entry"
import type { ParaphraseRates } from "@/features/paraphrase/services/pricing"
import type { AiCheckPricing } from "@/features/plagiarism/services/document-file"
export function Checkout({
  service,
  aiPricing,
  paraphraseRates,
}: {
  service: PlagiarismService
  aiPricing?: AiCheckPricing
  paraphraseRates?: ParaphraseRates
}) {
  const onCheckout = useCheckoutPayment()
  if (service.slug === "parafrase-manual")
    return (
      <ParaphraseCheckout onCheckout={onCheckout} rates={paraphraseRates} />
    )
  return (
    <PlagiarismCheckout
      service={service}
      aiPricing={aiPricing}
      onCheckout={onCheckout}
    />
  )
}
