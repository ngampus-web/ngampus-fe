export type CheckoutSection = {
  title: string
  items: { title?: string; body: string }[]
}

export type CheckoutOffer = {
  plan: string
  warranty: string
  duration: string
  price: number
  official: number
}

export type MarketplaceCheckout = {
  slug: string
  name: string
  logo: string
  monthly: number
  compare: number
  packages: string[]
  offers?: CheckoutOffer[]
  sections: CheckoutSection[]
}
