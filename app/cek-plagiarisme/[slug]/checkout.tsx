"use client"
import { ParaphraseCheckout } from "@/features/paraphrase/components/paraphrase-checkout"
import { PlagiarismCheckout } from "@/features/plagiarism/components/plagiarism-checkout"
import type { PlagiarismService } from "@/features/plagiarism/data/plagiarism"
import { useCheckoutPayment } from "@/features/payment/components/checkout-entry"
import type { DocumentConfig } from "@/features/plagiarism/services/document-config"
export function Checkout({
  service,
  config,
}: {
  service: PlagiarismService
  config: DocumentConfig
}) {
  const onCheckout = useCheckoutPayment()
  if (service.slug === "parafrase-manual")
    return (
      <ParaphraseCheckout onCheckout={onCheckout} rates={config.paraphrase} />
    )
  return (
    <PlagiarismCheckout
      service={service}
      config={config}
      onCheckout={onCheckout}
    />
  )
}
