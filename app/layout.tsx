import type { Metadata } from "next"
import { HOME_PAGE_TITLE } from "@/lib/site-metadata"
import { Geist_Mono, Inter } from "next/font/google"
import { SiteChrome } from "@/components/layout/site-chrome"
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

export const metadata: Metadata = {
  title: {
    default: HOME_PAGE_TITLE,
    template: "%s | Ngampus.id",
  },
  description:
    "Platform kuliah all-in-one: cek plagiasi, deteksi AI, akses AI premium, dan file tools untuk mahasiswa Indonesia.",
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
        <SiteChrome footer={<Footer content={global} />}>{children}</SiteChrome>
        <PromoPopup />
        <Toaster />
      </body>
    </html>
  )
}
