/** Services an admin can switch off (ngampus-be `features.enabled`). */
export type FeatureKey =
  | "marketplace"
  | "turnitin"
  | "ai_check"
  | "paraphrase"
  | "file_tools"
  | "creator"
  | "warranty"

export type FeatureFlags = Record<FeatureKey, boolean>

export const ALL_FEATURES_ON: FeatureFlags = {
  marketplace: true,
  turnitin: true,
  ai_check: true,
  paraphrase: true,
  file_tools: true,
  creator: true,
  warranty: true,
}

/** The three document services behind /cek-plagiarisme. */
export const PLAGIARISM_FEATURES: FeatureKey[] = [
  "turnitin",
  "ai_check",
  "paraphrase",
]

/** Service page slug under /cek-plagiarisme → its switch. */
export const PLAGIARISM_SLUG_FEATURE: Record<string, FeatureKey> = {
  turnitin: "turnitin",
  "cek-ai": "ai_check",
  "parafrase-manual": "paraphrase",
}

/** Site area → switch(es); an area stays up while any of its switches is on. */
const AREAS: [prefix: string, features: FeatureKey[]][] = [
  ["/marketplace", ["marketplace"]],
  ["/cek-plagiarisme", PLAGIARISM_FEATURES],
  ["/file-tools", ["file_tools"]],
  ["/creator", ["creator"]],
  ["/klaim-garansi", ["warranty"]],
]

/** False when the site area behind `path` is switched off. Other paths stay on. */
export function isPathEnabled(path: string, features: FeatureFlags): boolean {
  const area = AREAS.find(
    ([prefix]) => path === prefix || path.startsWith(`${prefix}/`)
  )
  return !area || area[1].some((key) => features[key])
}
