export type NavLink = {
  label: string
  href: string
  description?: string
  icon?: "phone" | "email" | "tiktok" | "instagram"
}

export const mainNav: Pick<NavLink, "label" | "href">[] = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Plagiarisme", href: "/cek-plagiarisme" },
  { label: "File Tools", href: "/file-tools" },
  { label: "Riwayat Pesanan", href: "/riwayat-pesanan" },
  { label: "Ngampus Creator", href: "/creator" },
]

export const whatsappChannelUrl =
  "https://whatsapp.com/channel/0029Vb8T6U2KGGGEX7gFIJ2i"

export const tiktokUrl = "https://www.tiktok.com/@ngampusofc"

export const instagramUrl = "https://www.instagram.com/ngampusofc/"

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "MENU",
    links: [
      { label: "Halaman Utama", href: "/" },
      { label: "Riwayat Pesanan", href: "/riwayat-pesanan" },
      { label: "Ngampus Creator", href: "/creator" },
      { label: "Blog & Berita", href: "/blog" },
      { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
      { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
    ],
  },
  {
    title: "LAYANAN",
    links: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Plagiarisme", href: "/cek-plagiarisme" },
      { label: "File Tools", href: "/file-tools" },
    ],
  },
  {
    title: "KONTAK KAMI",
    links: [
      {
        label: "+62 819-1868-5172",
        href: "tel:+6281918685172",
        icon: "phone",
      },
      {
        label: "cs@ngampus.co.id",
        href: "mailto:cs@ngampus.co.id",
        icon: "email",
      },
      { label: "@ngampusofc", href: tiktokUrl, icon: "tiktok" },
      { label: "@ngampusofc", href: instagramUrl, icon: "instagram" },
    ],
  },
]
