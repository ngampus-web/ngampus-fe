/** Product families can contain both ready-stock and pre-order plans. */
export function isPreorderPlan(product: string, plan = "") {
  // The live Claude catalog names its Pro variants by account type.
  if (
    product === "claude" &&
    ["private", "sharing 5u"].includes(plan.trim().toLowerCase())
  )
    return true
  const name = `${product} ${plan}`.toLowerCase().replace(/[-_]/g, " ")
  return (
    (/\b(?:chatgpt|gpt)\b/.test(name) && /\bplus\b/.test(name)) ||
    (/\bclaude\b/.test(name) && /\bpro\b/.test(name))
  )
}
