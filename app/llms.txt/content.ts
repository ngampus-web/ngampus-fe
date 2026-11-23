import { getBlogPosts } from "@/features/blog/api"
import { getGlobalContent } from "@/features/content/global"
import { getHomeContent } from "@/features/home/content"
import { getMarketplaceProducts } from "@/features/marketplace/api"
import { warrantyTerms } from "@/features/marketplace/data/marketplace"
import { plagiarismServices } from "@/features/plagiarism/data/plagiarism"
import { startPrices } from "@/features/plagiarism/services/document-config"
import { getDocumentConfig } from "@/features/plagiarism/services/document-services"
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo"

const formatRupiah = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`

async function loadLlmsData() {
  const [global, home, docConfig, products, blogResult] = await Promise.all([
    getGlobalContent(),
    getHomeContent(),
    getDocumentConfig(),
    getMarketplaceProducts(),
    getBlogPosts({ page: 1, perPage: 30 }).catch(() => ({
      posts: [],
      meta: { page: 1, perPage: 30, total: 0, totalPages: 0 },
    })),
  ])
  return {
    global,
    home,
    prices: startPrices(docConfig),
    products,
    posts: blogResult.posts,
  }
}

export async function buildLlmsTxt(): Promise<string> {
  const { global, prices, products, posts } = await loadLlmsData()
  const turnitinPrice = formatRupiah(prices.turnitin ?? 7000)
  const aiPrice = formatRupiah(prices["cek-ai"] ?? 6000)
  const paraphrasePrice = formatRupiah(prices["parafrase-manual"] ?? 25000)

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> Ngampus.co.id adalah platform kebutuhan kuliah all-in-one untuk mahasiswa Indonesia: layanan cek plagiarisme Turnitin murah (no repository) mulai ${turnitinPrice}/file, cek deteksi AI mulai ${aiPrice}/file, jasa parafrase manual mulai ${paraphrasePrice}, marketplace akun AI & aplikasi premium murah bergaransi (ChatGPT, Claude, Gemini, Perplexity, Canva, CapCut, Grammarly, dll.), serta file tools PDF online gratis 24 jam.`,
    "",
    "## Informasi Utama",
    `- Website: ${SITE_URL}`,
    "- Wilayah layanan: Indonesia (Bahasa Indonesia, pembayaran QRIS / IDR, akses 24 jam)",
    `- Kontak resmi: ${global.contacts.email} | WhatsApp +${global.contacts.whatsapp}`,
    `- Alamat: ${global.footer.address}`,
    `- Versi lengkap untuk AI retrieval: ${absoluteUrl("/llms-full.txt")}`,
    `- Sitemap XML: ${absoluteUrl("/sitemap.xml")}`,
    "",
    "## Layanan Cek Plagiarisme, Turnitin Murah & Cek AI",
    `- [Hub Plagiarisme Checker](${absoluteUrl("/cek-plagiarisme")}): Cek similarity Turnitin no repository, deteksi AI Turnitin, dan parafrase manual untuk tugas, makalah, jurnal, dan skripsi.`,
    `- [Cek Plagiasi Turnitin V2 — Mulai ${turnitinPrice}/file](${absoluteUrl("/cek-plagiarisme/turnitin")}): Cek similarity Turnitin murah, cepat, aman no repository dengan laporan lengkap dan Digital Receipt.`,
    `- [Cek AI Turnitin — Mulai ${aiPrice}/file](${absoluteUrl("/cek-plagiarisme/cek-ai")}): Cek persentase deteksi tulisan AI (ChatGPT/AI detector Turnitin) dengan privasi dokumen terjaga.`,
    `- [Jasa Parafrase Manual — Mulai ${paraphrasePrice}](${absoluteUrl("/cek-plagiarisme/parafrase-manual")}): Parafrase manual untuk menurunkan skor plagiarisme Turnitin dan deteksi AI secara natural.`,
    "",
    "## Marketplace Akun AI & Aplikasi Premium Murah",
    `- [Katalog Marketplace Akun Premium](${absoluteUrl("/marketplace")}): Akun AI dan aplikasi produktivitas/hiburan harga mahasiswa dengan ketentuan garansi yang jelas.`,
  ]

  if (products.length > 0) {
    for (const product of products.slice(0, 20)) {
      const price = formatRupiah(product.startingPrice)
      lines.push(
        `- [Akun ${product.name} Murah — Mulai ${price}](${absoluteUrl(`/marketplace/${product.slug}`)}): ${product.shortDescription}`
      )
    }
  } else {
    lines.push(
      `- [Akun ChatGPT Murah](${absoluteUrl("/marketplace/chatgpt")}): Akses ChatGPT Plus/Pro harga mahasiswa bergaransi.`,
      `- [Akun Claude AI Murah](${absoluteUrl("/marketplace/claude")}): Akses Claude Pro untuk riset, coding, dan penulisan akademik.`,
      `- [Akun Canva Pro Murah](${absoluteUrl("/marketplace/canva")}): Akses Canva Pro untuk presentasi, poster, dan desain tugas.`
    )
  }

  lines.push(
    "",
    "## File Tools PDF Gratis",
    `- [File Tools PDF Online Gratis](${absoluteUrl("/file-tools")}): Gabung PDF, kompres PDF, scan dokumen, tanda tangan PDF, proteksi password PDF, serta konversi Word, gambar, dan teks ke PDF langsung di browser.`
  )

  if (posts.length > 0) {
    lines.push("", "## Artikel & Panduan Terbaru")
    for (const post of posts.slice(0, 15)) {
      lines.push(
        `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.excerpt}`
      )
    }
  }

  lines.push(
    "",
    "## Halaman Pendukung",
    `- [Ngampus Creator](${absoluteUrl("/creator")}): Program kampanye konten kreator mahasiswa dengan reward saldo.`,
    `- [Blog & Berita](${absoluteUrl("/blog")}): Panduan cek Turnitin, tips skripsi, dan pemanfaatan AI untuk kuliah.`,
    `- [Syarat & Ketentuan](${absoluteUrl("/syarat-ketentuan")})`,
    `- [Kebijakan Privasi](${absoluteUrl("/kebijakan-privasi")})`
  )

  return `${lines.join("\n")}\n`
}

export async function buildLlmsFullTxt(): Promise<string> {
  const { global, home, prices, products, posts } = await loadLlmsData()
  const base = await buildLlmsTxt()

  const extra: string[] = ["", "---", "", "## Detail Layanan Dokumen Akademik"]

  for (const service of plagiarismServices) {
    const price = formatRupiah(prices[service.slug] ?? service.price)
    extra.push(
      `### ${service.title}`,
      `- URL: ${absoluteUrl(`/cek-plagiarisme/${service.slug}`)}`,
      `- Harga mulai: ${price}`,
      `- Ringkasan: ${service.summary}`,
      `- Deskripsi: ${service.description}`,
      ""
    )
  }

  if (products.length > 0) {
    extra.push("## Daftar Lengkap Produk Marketplace Akun AI & Premium")
    for (const product of products) {
      const price = formatRupiah(product.startingPrice)
      const official = formatRupiah(product.startingOfficialPrice)
      const stock = product.isInStock ? "Tersedia" : "Stok habis sementara"
      const stats =
        product.rating > 0 && product.soldCount > 0
          ? ` | Rating ${product.rating.toFixed(1)}/5 (${product.soldCount} terjual)`
          : ""
      extra.push(
        `- **${product.name}** (${product.category.name}) — Mulai ${price} (harga resmi ${official}) | ${stock}${stats} — ${absoluteUrl(`/marketplace/${product.slug}`)}: ${product.shortDescription}`
      )
    }
    extra.push("")
  }

  if (home.faqs.length > 0) {
    extra.push("## Pertanyaan Umum (FAQ)")
    for (const item of home.faqs) {
      extra.push(`### ${item.question}`, item.answer, "")
    }
  }

  extra.push("## Ringkasan Ketentuan Garansi Marketplace")
  for (const term of warrantyTerms.items) {
    extra.push(`- ${term.body}`)
  }

  if (posts.length > 15) {
    extra.push("", "## Artikel Blog Lainnya")
    for (const post of posts.slice(15)) {
      extra.push(
        `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.excerpt}`
      )
    }
  }

  extra.push(
    "",
    "## Kanal Resmi",
    `- Email: ${global.contacts.email}`,
    `- WhatsApp: https://wa.me/${global.contacts.whatsapp}`,
    ...(global.contacts.instagram
      ? [`- Instagram: ${global.contacts.instagram}`]
      : []),
    ...(global.contacts.tiktok ? [`- TikTok: ${global.contacts.tiktok}`] : [])
  )

  return `${base}${extra.join("\n")}\n`
}
