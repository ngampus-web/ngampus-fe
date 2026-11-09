import { createHash } from "node:crypto"
import { creatorDefault } from "./defaults/creator"

// Upgrade only exact copies of the old bundled guide; preserve custom CMS edits.
const legacyFingerprints = {
  platforms: "891e5ffb81da2ef9f2ab570219f4aa7e54183b494e4133ecdcbb429a279a67c5",
  fees: "ef2a8656797f431394b1b32bd9e097336e90e68ae8b9493e7924dfd084dc3b2e",
  contentRules:
    "52dc54142a77953f403a842c236c0473803ca57ca24584b794847bda56fdb8d2",
  sections: "d54b60edf97a17280ef9ee8d98778593d2f091e35953ed203a5abad785def78e",
} as const

export function upgradeCreatorGuide<T extends typeof creatorDefault>(
  content: T
): T {
  const updated = { ...content }
  for (const key of Object.keys(
    legacyFingerprints
  ) as (keyof typeof legacyFingerprints)[]) {
    const fingerprint = createHash("sha256")
      .update(JSON.stringify(content[key]) ?? "null")
      .digest("hex")
    if (fingerprint === legacyFingerprints[key]) {
      Object.assign(updated, { [key]: creatorDefault[key] })
    }
  }
  return updated
}
