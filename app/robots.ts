import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

const PRIVATE_PATHS = [
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
]

const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      ...AI_SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
