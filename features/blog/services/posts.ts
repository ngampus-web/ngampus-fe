/** `/blog?kategori=&halaman=` URLs; "semua" means no filter. */
export function blogHref(category: string, page = 1) {
  const params = new URLSearchParams()
  if (category !== "semua") params.set("kategori", category)
  if (page > 1) params.set("halaman", String(page))
  const query = params.toString()
  return query ? `/blog?${query}` : "/blog"
}
