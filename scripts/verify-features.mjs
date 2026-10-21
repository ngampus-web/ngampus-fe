import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import vm from "node:vm"
import ts from "typescript"

// Load pure TS feature modules without adding a test-runner dependency.
const root = fileURLToPath(new URL("../", import.meta.url))
const cache = new Map()
const events = new EventTarget()
const storage = new Map()
const sessionStorage = {
  get length() {
    return storage.size
  },
  key: (index) => Array.from(storage.keys())[index] ?? null,
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
}
function load(relative) {
  const filename = path.resolve(root, relative)
  if (cache.has(filename)) return cache.get(filename).exports
  const loadedModule = { exports: {} }
  cache.set(filename, loadedModule)
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText
  const require = (specifier) => {
    assert.ok(
      specifier.startsWith("."),
      "Pure feature services should use local modules"
    )
    return load(path.resolve(path.dirname(filename), specifier + ".ts"))
  }
  vm.runInNewContext(
    source,
    {
      module: loadedModule,
      exports: loadedModule.exports,
      require,
      URLSearchParams,
      window: events,
      sessionStorage,
      Event,
      crypto: globalThis.crypto,
    },
    { filename }
  )
  return loadedModule.exports
}

// Catalog content now lives in the API (ngampus-be seed tests cover the 14 products).
const { warranty, warrantyTerms, marketplaceLogoFallback } = load(
  "features/marketplace/data/marketplace.ts"
)
assert.equal(warranty.items.length, 2)
assert.equal(warrantyTerms.items.length, 8)
assert.ok(warrantyTerms.items.some(({ body }) => body.includes("× 80%")))
assert.equal(Object.keys(marketplaceLogoFallback).length, 14)
const blog = load("features/blog/services/posts.ts")
const { blogCategories } = load("features/blog/data/blog.ts")
assert.equal(blogCategories[0].id, "semua")
assert.equal(blog.blogHref("semua"), "/blog")
assert.equal(
  blog.blogHref("tips-mahasiswa", 2),
  "/blog?kategori=tips-mahasiswa&halaman=2"
)
const { creatorJoinSteps } = load("features/creator/data/campaign.ts")
assert.equal(creatorJoinSteps.length, 3)
const session = load("features/creator/services/demo-session.ts")
let changes = 0
const unsubscribe = session.subscribeCreatorSession(() => changes++)
assert.equal(session.readCreatorSession(), null)
session.writeCreatorSession({ name: "Test", email: "test@example.com" })
assert.equal(session.readCreatorSession().name, "Test")
assert.equal(changes, 1)
session.clearCreatorSession()
assert.equal(session.readCreatorSession(), null)
assert.equal(changes, 2)
unsubscribe()
session.writeCreatorSession({ name: "Test", email: "test@example.com" })
assert.equal(changes, 2)
sessionStorage.setItem("ngampus-creator-session", "invalid json")
assert.equal(session.readCreatorSession(), null)
console.log(
  "PASS: warranty terms, logo fallbacks, blog queries, creator steps, and session lifecycle."
)

const paymentRules = load("features/payment/services/order-rules.ts")
const { previewGateway, simulateStatus } = load(
  "features/payment/services/preview-gateway.ts"
)
assert.equal(paymentRules.normalizePhone("0812 3456 7890"), "6281234567890")
assert.equal(paymentRules.normalizePhone("+62 812-3456-7890"), "6281234567890")
assert.throws(() => paymentRules.normalizePhone("invalid"))
const draft = {
  phone: "081234567890",
  amount: 40000,
  details: {
    kind: "marketplace",
    slug: "chatgpt",
    title: "ChatGPT",
    customerName: "Preview Test",
    plan: "Sharing",
    duration: "14 Hari",
  },
}
assert.throws(() => paymentRules.validateDraft({ ...draft, amount: -1 }))
assert.equal(paymentRules.parseOrder("invalid json"), null)
let paymentEvents = 0
const { subscribeOrders } = load("features/payment/services/preview-gateway.ts")
const stopPaymentEvents = subscribeOrders(() => paymentEvents++)
const order = await previewGateway.createOrder(draft)
assert.equal(order.status, "pending")
assert.equal(order.phone, "6281234567890")
assert.equal((await previewGateway.getOrder(order.id)).details.plan, "Sharing")
assert.equal(
  (await previewGateway.startPayment(order.id)).checkoutUrl,
  `/pembayaran/${order.id}/qris`
)
assert.throws(() => simulateStatus(order.id, "completed"))
simulateStatus(order.id, "processing")
await assert.rejects(previewGateway.startPayment(order.id))
simulateStatus(order.id, "completed")
assert.equal((await previewGateway.getOrder(order.id)).status, "completed")
assert.throws(() => simulateStatus(order.id, "pending"))
assert.equal(paymentEvents, 3)
stopPaymentEvents()
for (const status of ["cancelled", "failed", "expired"]) {
  const next = await previewGateway.createOrder(draft)
  simulateStatus(next.id, status)
  await assert.rejects(previewGateway.startPayment(next.id))
  assert.throws(() => simulateStatus(next.id, "processing"))
}
const old = await previewGateway.createOrder(draft)
const expired = { ...old, expiresAt: new Date(Date.now() - 1).toISOString() }
sessionStorage.setItem(
  `ngampus-payment-preview:${old.id}`,
  JSON.stringify(expired)
)
assert.equal(paymentRules.effectiveStatus(expired), "expired")
await assert.rejects(previewGateway.startPayment(old.id))
assert.throws(() => simulateStatus(old.id, "processing"))
for (const slug of ["turnitin", "cek-ai", "parafrase-manual"]) {
  const d = {
    phone: "081234567890",
    amount: 7000,
    details: {
      kind: "document",
      slug,
      title: slug,
      fileName: "Contoh.pdf",
      fileSize: 1024,
      filters:
        slug === "turnitin"
          ? ["Exclude Quotes", "Exclude Small Matches: 20 %"]
          : [],
    },
  }
  const result = await previewGateway.createOrder(d)
  assert.equal(result.details.fileName, "Contoh.pdf")
  assert.equal(result.details.filters.length, slug === "turnitin" ? 2 : 0)
  assert.throws(() =>
    paymentRules.validateDraft({
      ...d,
      details: { ...d.details, fileSize: 11 * 1024 * 1024 },
    })
  )
  assert.throws(() =>
    paymentRules.validateDraft({
      ...d,
      details: { ...d.details, fileName: "wrong.exe" },
    })
  )
}
assert.equal(await previewGateway.getOrder("missing"), null)
assert.equal(
  paymentRules.parseOrder(JSON.stringify({ ...order, mode: "live" })),
  null
)
console.log(
  "PASS: payment input validation, four checkout kinds, preview persistence, transitions, expiry, and terminal-state protection."
)

const paraphrase = {
  kind: "paraphrase",
  slug: "parafrase-manual",
  title: "Parafrase Turnitin & AI",
  fileName: "Naskah.docx",
  fileSize: 2048,
  wordCount: 1000,
  service: "combined",
  reports: [
    {
      type: "turnitin",
      file: { name: "Laporan.pdf", size: 1024 },
      initialScore: 55,
      targetScore: 10,
    },
    {
      type: "ai",
      file: { name: "AI.pdf", size: 1024 },
      initialScore: 80,
      targetScore: 15,
    },
  ],
  notes: "Pertahankan istilah teknis",
  language: "id",
  field: "Ekonomi",
  customerName: "Pengguna Uji",
  turnaround: "urgent",
}
const pricing = load("features/paraphrase/services/pricing.ts")
const paraDraft = {
  phone: "081234567890",
  amount: pricing.calculateParaphrasePrice(paraphrase).total,
  details: paraphrase,
}
const paraOrder = await previewGateway.createOrder(paraDraft)
assert.equal(
  (await previewGateway.getOrder(paraOrder.id)).details.reports[1].targetScore,
  15
)
assert.equal(
  paymentRules.orderBackHref(paraOrder),
  "/cek-plagiarisme/parafrase-manual"
)
simulateStatus(paraOrder.id, "processing")
assert.equal(
  (await previewGateway.getOrder(paraOrder.id)).details.notes,
  paraphrase.notes
)
for (const service of ["turnitin", "ai"]) {
  const details = {
    ...paraphrase,
    service,
    reports: paraphrase.reports.filter((r) => r.type === service),
  }
  paymentRules.validateDraft({
    ...paraDraft,
    details,
    amount: pricing.calculateParaphrasePrice(details).total,
  })
}
for (const patch of [
  { reports: [] },
  { reports: [paraphrase.reports[0], paraphrase.reports[0]] },
  {
    reports: [
      { ...paraphrase.reports[0], targetScore: 9 },
      paraphrase.reports[1],
    ],
  },
  {
    reports: [
      { ...paraphrase.reports[0], targetScore: 55 },
      paraphrase.reports[1],
    ],
  },
  {
    reports: [
      { ...paraphrase.reports[0], initialScore: 101 },
      paraphrase.reports[1],
    ],
  },
  { wordCount: 0 },
  { fileName: "Wrong.pdf" },
  { fileSize: 26 * 1024 * 1024 },
  { customerName: "" },
  { language: "unknown" },
  { turnaround: "unknown" },
])
  assert.throws(() =>
    paymentRules.validateDraft({
      ...paraDraft,
      details: { ...paraphrase, ...patch },
    })
  )
console.log(
  "PASS: paraphrase service combinations, score boundaries, required reports, file limits, and payment persistence."
)

const priceInput = {
  wordCount: 10000,
  service: "turnitin",
  turnaround: "relaxed",
  reports: [{ type: "turnitin", initialScore: 20, targetScore: 10 }],
}
for (const [turnaround, expected] of [
  ["relaxed", 85000],
  ["regular", 110500],
  ["urgent", 127500],
]) {
  assert.equal(
    pricing.calculateParaphrasePrice({ ...priceInput, turnaround }).total,
    expected
  )
}
for (const [wordCount, expected] of [
  [1, 25006],
  [5000, 52500],
  [5001, 57505],
  [9999, 82495],
  [10000, 85000],
  [14999, 107496],
  [15000, 107500],
  [15001, 107504],
]) {
  assert.equal(
    pricing.calculateParaphrasePrice({ ...priceInput, wordCount }).total,
    expected
  )
}
const combinedPrice = pricing.calculateParaphrasePrice({
  ...priceInput,
  service: "combined",
  reports: [
    ...priceInput.reports,
    { type: "ai", initialScore: 30, targetScore: 10 },
  ],
})
assert.equal(combinedPrice.wordCost, 45000)
assert.equal(combinedPrice.reduction, 30)
assert.equal(combinedPrice.total, 165000)
assert.equal(
  pricing.calculateParaphrasePrice({
    ...priceInput,
    wordCount: 1,
    reports: [{ type: "turnitin", initialScore: 10.01, targetScore: 10 }],
  }).total,
  31
)
assert.throws(() =>
  pricing.calculateParaphrasePrice({
    ...priceInput,
    reports: [{ type: "turnitin", initialScore: 20.001, targetScore: 10 }],
  })
)
for (const patch of [
  { wordCount: 0 },
  { wordCount: -1 },
  { wordCount: 1.5 },
  { turnaround: "invalid" },
  { reports: [] },
  { reports: [{ type: "turnitin", initialScore: NaN, targetScore: 10 }] },
  { reports: [{ type: "turnitin", initialScore: 20, targetScore: 20 }] },
]) {
  assert.throws(() =>
    pricing.calculateParaphrasePrice({ ...priceInput, ...patch })
  )
}
assert.throws(() => paymentRules.validateDraft({ ...paraDraft, amount: 25000 }))
console.log(
  "PASS: pricing tier boundaries, supplied deadline examples, combined reductions, decimals, rounding, and amount consistency."
)

const orderFilters = load("features/orders/services/filter-orders.ts")
const allPreviewOrders = load(
  "features/payment/services/preview-gateway.ts"
).listPreviewOrders()
assert.ok(allPreviewOrders.length > 0)
const marketHistory = orderFilters.filterOrders(
  allPreviewOrders,
  "081234567890",
  "marketplace"
)
assert.ok(marketHistory.length > 0)
assert.ok(marketHistory.every((item) => item.details.kind === "marketplace"))
const documentHistory = orderFilters.filterOrders(
  allPreviewOrders,
  "+62 812-3456-7890",
  "plagiarism"
)
assert.ok(documentHistory.some((item) => item.details.kind === "paraphrase"))
assert.ok(documentHistory.every((item) => item.details.kind !== "marketplace"))
assert.equal(
  orderFilters.filterOrders(
    allPreviewOrders,
    order.id.toLowerCase(),
    "marketplace"
  ).length,
  1
)
assert.equal(
  orderFilters.filterOrders(allPreviewOrders, order.id, "plagiarism").length,
  0
)
assert.equal(
  orderFilters.filterOrders(allPreviewOrders, "", "marketplace").length,
  0
)
assert.equal(
  orderFilters.filterOrders(allPreviewOrders, "081299999999", "marketplace")
    .length,
  0
)
console.log(
  "PASS: order history categories, exact order ID and normalized phone search."
)
