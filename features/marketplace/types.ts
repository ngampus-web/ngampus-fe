export type CheckoutSection = {
  title: string
  items: { title?: string; body: string }[]
}

export type CheckoutOffer = {
  /** API offer id; the order is priced on the server from it. */
  id?: string
  plan: string
  warranty: string
  duration: string
  price: number
  official: number
  preorder?: boolean
}

export type MarketplaceCheckout = {
  previewOnly?: boolean
  slug: string
  name: string
  logo: string
  rating: number
  soldCount: number
  isInStock: boolean
  monthly: number
  compare: number
  packages: string[]
  offers?: CheckoutOffer[]
  sections: CheckoutSection[]
}
