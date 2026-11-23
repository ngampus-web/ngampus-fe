import type { Metadata } from "next"
import { HOME_PAGE_DESCRIPTION, HOME_PAGE_TITLE } from "@/lib/site-metadata"
import {
  buildOpenGraph,
  buildTwitterCard,
  CORE_SEO_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo"
import { Geist_Mono, Inter } from "next/font/google"
import { SiteChrome } from "@/components/layout/site-chrome"
import { WhatsAppShortcut } from "@/components/layout/whatsapp-shortcut"
import { Footer } from "@/components/layout/footer"
import { getGlobalContent } from "@/features/content/global"
import { PreviewBanner } from "@/features/content/preview-banner"
import "./globals.css"
import { PromoPopup } from "@/features/promo-popup/promo-popup"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: HOME_PAGE_TITLE,
    template: "%s | Ngampus.co.id",
  },
  description: HOME_PAGE_DESCRIPTION,
  keywords: CORE_SEO_KEYWORDS,
  openGraph: buildOpenGraph({
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    path: "/",
  }),
  twitter: buildTwitterCard({
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const global = await getGlobalContent()
  return (
    <html
      lang="id"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <PreviewBanner />
        <SiteChrome
          footer={<Footer content={global} />}
          features={global.features}
        >
          {children}
        </SiteChrome>
        <WhatsAppShortcut phone={global.contacts.whatsapp} />
        <PromoPopup />
        <Toaster />
      </body>
    </html>
  )
}
