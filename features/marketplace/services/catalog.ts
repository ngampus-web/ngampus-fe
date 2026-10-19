import {
  marketplaceApps,
  checkoutCatalog,
  warranty,
  warrantyTerms,
} from "../data/marketplace"
import type { CheckoutSection, MarketplaceCheckout } from "../types"

function descriptionSection(name: string, price: string): CheckoutSection {
  return {
    title: "Deskripsi",
    items: [
      {
        title: "Harga Lebih Hemat",
        body: `Nikmati akses ${name} dengan harga lebih terjangkau mulai dari ${price}/bulan, cocok untuk kamu yang ingin menggunakan AI premium tanpa harus membayar harga langganan resmi penuh.`,
      },
      {
        title: "Tersedia Pilihan Private & Sharing",
        body: `Pilih paket sesuai kebutuhan. Private cocok untuk penggunaan yang lebih personal, sedangkan Sharing Account cocok untuk kamu yang ingin akses ${name} dengan harga lebih hemat.`,
      },
    ],
  }
}

function parseAmount(price: string) {
  return Number(price.replace(/\D/g, ""))
}

export function getMarketplaceCheckout(slug: string) {
  const app = marketplaceApps.find((item) => item.slug === slug)
  if (!app) return

  const monthly = parseAmount(app.price)
  const compare = parseAmount(app.comparePrice)
  const catalog = checkoutCatalog[app.slug]
  const packages = catalog
    ? [...new Set(catalog.offers.map((offer) => offer.plan))]
    : app.slug === "chatgpt"
      ? ["ChatGPT Plus", "ChatGPT Pro"]
      : [app.name, `${app.name} Pro`]

  return {
    slug: app.slug,
    name: catalog?.name ?? app.name,
    logo: app.logo,
    monthly,
    compare: compare > monthly ? compare : monthly,
    packages,
    offers: catalog?.offers,
    sections: [
      catalog
        ? {
            title: "Deskripsi",
            items: catalog.paragraphs.map((body) => ({ body })),
          }
        : descriptionSection(app.name, app.price),
      ...(catalog?.planDescriptions.length
        ? [
            {
              title: "Penjelasan Plan",
              items: catalog.planDescriptions.map((body) => ({ body })),
            },
          ]
        : []),
      ...(catalog?.notes.length
        ? [
            {
              title: "Catatan Penting",
              items: catalog.notes.map((body) => ({ body })),
            },
          ]
        : []),
      {
        ...warranty,
        items: [
          ...warranty.items,
          ...(catalog?.additionalWarranty ?? []).map((body) => ({ body })),
        ],
      },
      warrantyTerms,
    ],
  } satisfies MarketplaceCheckout
}
