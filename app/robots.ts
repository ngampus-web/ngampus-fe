import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/pembayaran/",
          "/riwayat-pesanan",
          "/klaim-garansi",
          "/masuk",
          "/daftar",
          "/lupa-password",
          "/reset-password",
          "/verify-email",
          "/creator/dashboard",
          "/creator/masuk",
          "/creator/daftar",
          "/creator/submit",
          "/creator/withdraw",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
