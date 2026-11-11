const legacyBrand = /\b(ngampus)\.id\b(?!-|\.[a-z0-9])/gi

/** Update legacy branding in published CMS text and links. */
export function normalizeNgampusBrand<T>(content: T): T {
  if (typeof content === "string") {
    return content.replace(legacyBrand, "$1.co.id") as T
  }
  if (Array.isArray(content)) {
    return content.map(normalizeNgampusBrand) as T
  }
  if (content && typeof content === "object") {
    return Object.fromEntries(
      Object.entries(content).map(([key, value]) => [
        key,
        normalizeNgampusBrand(value),
      ])
    ) as T
  }
  return content
}
