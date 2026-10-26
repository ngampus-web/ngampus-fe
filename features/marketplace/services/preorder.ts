import type { CheckoutOffer } from "../types"

/** A plan is pre-order when any of its offers is flagged so by the admin. */
export function isPreorderPlan(
  offers: CheckoutOffer[] | undefined,
  plan: string
) {
  return !!offers?.some((offer) => offer.plan === plan && offer.preorder)
}
