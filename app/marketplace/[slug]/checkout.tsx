"use client"
import { MarketplaceCheckout } from "@/features/marketplace/components/marketplace-checkout"
import type { MarketplaceCheckout as CheckoutProduct } from "@/features/marketplace/types"
import { useCheckoutPayment } from "@/features/payment/components/checkout-entry"
export function Checkout({ product }: { product: CheckoutProduct }) {
  const onCheckout = useCheckoutPayment()
  return <MarketplaceCheckout product={product} onCheckout={onCheckout} />
}
