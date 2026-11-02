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
      URL,
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
const creator = load("features/creator/services/creator-rules.ts")
assert.equal(creator.platformLabel("x_threads"), "X / Thread")
assert.equal(creator.SUBMISSION_STATUS.pending.label, "Diproses")
assert.equal(creator.SUBMISSION_STATUS.approved.label, "Diterima")
assert.equal(creator.wibDateTime("2026-10-04T06:01:52Z"), "2026-10-04 13:01:52")
assert.equal(
  creator.withdrawalError(40000, { min: 50000, balance: 60000 }),
  "Minimal withdraw Rp 50.000."
)
assert.equal(
  creator.withdrawalError(70000, { min: 50000, balance: 60000 }),
  "Nominal melebihi saldo yang tersedia."
)
assert.equal(creator.withdrawalError(60000, { min: 50000, balance: 60000 }), "")
assert.equal(creator.creatorEntryHref(null), "/creator/daftar")
assert.equal(creator.creatorEntryHref({ isCreator: false }), "/creator/daftar")
assert.equal(
  creator.creatorEntryHref({ isCreator: true }),
  "/creator/submit?from=beranda"
)
console.log(
  "PASS: warranty terms, logo fallbacks, blog queries, creator steps, and creator rules."
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
assert.equal(
  paymentRules.validateMarketplaceEmail(" buyer@example.com "),
  "buyer@example.com"
)
for (const value of [
  undefined,
  "",
  "buyer",
  "buyer@",
  "buyer@example.com other",
]) {
  assert.throws(() => paymentRules.validateMarketplaceEmail(value))
}
assert.doesNotThrow(() =>
  paymentRules.validateDraft({
    ...draft,
    details: {
      ...draft.details,
      customerName: "",
      customerEmail: "buyer@example.com",
    },
  })
)
assert.throws(() =>
  paymentRules.validateDraft({
    ...draft,
    details: { ...draft.details, customerEmail: "invalid" },
  })
)
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
  25000
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

const history = load("features/orders/services/order-history.ts")
assert.equal(
  history.sections.map((s) => s.label).join(" | "),
  "Plagiarism Checker | Marketplace Account"
)
assert.equal(history.filterLabel("exclude_quotes"), "Tanpa Kutipan")
assert.equal(history.filterLabel("exclude_bibliography"), "Tanpa Bibliografi")
assert.equal(history.filterLabel("Custom"), "Custom")
assert.equal(
  JSON.stringify(
    history.readCounts({
      page: 1,
      counts: { total: 5, completed: 2, processing: 1, unpaid: 1 },
    })
  ),
  JSON.stringify({ total: 5, completed: 2, processing: 1, unpaid: 1 })
)
assert.equal(
  JSON.stringify(history.readCounts(undefined)),
  JSON.stringify({ total: 0, completed: 0, processing: 0, unpaid: 0 })
)
assert.equal(history.historyStatus.expired.label, "Tidak Dibayar")
assert.match(history.formatOrderDate("2026-01-01T17:30:00Z"), /2 Jan 2026/)
console.log(
  "PASS: order history sections, filter chips, API counts and WIB dates."
)

const claims = load("features/warranty/services/claims.ts")
assert.equal(claims.claimCategories.length, 3)
assert.equal(claims.categoryLabel("quota_limit"), "Limit Tercapai")
assert.equal(claims.claimStatus("reviewing").label, "Dalam Proses")
assert.equal(claims.claimStatus("accepted").label, "Dalam Proses")
assert.equal(claims.claimStatus("resolved").label, "Selesai")
assert.equal(claims.cornerStatus("reviewing"), "Menunggu Review")
assert.equal(claims.cornerStatus("resolved"), "Proses Selesai")
const claimAt = "2026-10-01T09:50:53Z"
const reviewingSteps = claims.claimSteps("reviewing", [
  { status: "submitted", at: claimAt, note: null },
  { status: "reviewing", at: claimAt, note: null },
])
assert.equal(
  reviewingSteps.map((s) => `${s.title}:${s.state}`).join(" | "),
  "Klaim Berhasil Diajukan:done | Klaim Dicek Sistem:done | Klaim Diterima (Admin akan segera menghubungi):pending"
)
const rejectedSteps = claims.claimSteps("rejected", [
  { status: "submitted", at: claimAt, note: null },
  { status: "reviewing", at: claimAt, note: null },
  { status: "rejected", at: claimAt, note: "Bukti kurang" },
])
assert.equal(rejectedSteps.at(-1).state, "failed")
assert.equal(rejectedSteps.at(-1).note, "Bukti kurang")
assert.equal(claims.claimSteps("resolved", []).at(-1).title, "Proses Selesai")
assert.equal(
  claims.evidenceError({ type: "image/gif", size: 10 }),
  "Screenshot harus berupa JPG, PNG, atau WEBP."
)
assert.equal(
  claims.evidenceError({ type: "image/png", size: 6 * 1024 * 1024 }),
  "Ukuran screenshot maksimal 5 MB."
)
assert.equal(claims.evidenceError({ type: "image/webp", size: 1024 }), null)
assert.equal(claims.formatClaimTime(claimAt), "01/10/26 · 16.50")
console.log(
  "PASS: warranty claim categories, status labels, timeline steps and screenshot rules."
)

const fallback = load("lib/api/fallback.ts")
const staticFaq = [{ id: "static-0" }]
assert.equal(
  (
    await fallback.withFallback(
      () => Promise.reject(new Error("down")),
      staticFaq
    )
  )[0].id,
  "static-0"
)
assert.deepEqual(
  await fallback.withFallback(() => Promise.resolve([]), staticFaq),
  []
)
assert.equal(
  (
    await fallback.withFallback(
      () => Promise.resolve([{ id: "api" }]),
      staticFaq
    )
  )[0].id,
  "api"
)
assert.equal(fallback.initials("Nadia P."), "NP")
assert.equal(fallback.initials("  reza  "), "R")
const slidesHelper = load("components/shared/promo-slides.ts")
const slides = slidesHelper.bannersToSlides([
  { title: "Promo", imageUrl: "https://cdn.test/a.png", linkUrl: null },
  { title: "Tanpa gambar", imageUrl: null, linkUrl: "/x" },
])
assert.equal(slides.length, 1)
assert.equal(`${slides[0].href}|${slides[0].alt}`, "#|Promo")
console.log(
  "PASS: content fallback on failure, authoritative empty lists, avatar initials, banner slides."
)

const feedback = load("lib/errors.ts")
assert.equal(
  feedback.errorMessage({ code: "INVALID_CREDENTIALS", status: 401 }),
  "Email atau password belum cocok."
)
assert.match(
  feedback.errorMessage({ code: "UNAUTHENTICATED", status: 401 }),
  /Sesi masukmu/
)
assert.match(
  feedback.errorMessage({ code: "RATE_LIMITED", status: 429 }),
  /Tunggu sebentar/
)
assert.equal(feedback.errorMessage({ name: "AbortError" }), "")
assert.equal(feedback.errorMessage({ code: "ABORTED", status: 0 }), "")
assert.equal(
  feedback.errorMessage(
    new Error("secret stack / vendor failure"),
    "File belum dapat diproses."
  ),
  "File belum dapat diproses."
)
assert.equal(
  feedback.errorMessage(
    new feedback.UserFacingError("Izinkan pop-up untuk membuka preview.")
  ),
  "Izinkan pop-up untuk membuka preview."
)
assert.match(
  feedback.errorMessage({
    code: "INTERNAL_ERROR",
    status: 500,
    message: "SQL credential leak",
  }),
  /gangguan/
)
assert.match(
  feedback.errorMessage({
    code: "VALIDATION_ERROR",
    details: { fieldErrors: { password: ["Rahasia"] } },
  }),
  /isian/
)
const uncertain = new feedback.RequestError(
  { code: "NETWORK_ERROR", status: 0, details: { rule: "x" } },
  "Periksa riwayat pesanan sebelum mencoba lagi."
)
assert.equal(uncertain.status, 0)
assert.equal(uncertain.details.rule, "x")
assert.equal(
  feedback.errorMessage(uncertain),
  "Periksa riwayat pesanan sebelum mencoba lagi."
)
console.log(
  "PASS: safe feedback, credential/session distinction, explicit local errors, abort suppression and uncertain requests."
)

// Exercise action boundaries with small dependency doubles, without a browser.
function loadComponent(relative, dependencies, globals = {}) {
  const filename = path.resolve(root, relative)
  const loadedModule = { exports: {} }
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText
  vm.runInNewContext(
    source,
    {
      module: loadedModule,
      exports: loadedModule.exports,
      ...globals,
      require: (name) => {
        assert.ok(name in dependencies, `Missing test dependency: ${name}`)
        return dependencies[name]
      },
    },
    { filename }
  )
  return loadedModule.exports
}
const outcomes = []
const redirects = []
let creationError = null
let creationCalls = 0
const gatewayDouble = {
  createMarketplaceOrder: async () => {
    creationCalls++
    if (creationError) throw creationError
    return { id: "MKT-TEST0001" }
  },
}
const checkout = loadComponent(
  "features/payment/components/checkout-entry.tsx",
  {
    "next/navigation": {
      useRouter: () => ({ push: (href) => redirects.push(href) }),
    },
    "@/lib/toast": { notify: { success: (message) => outcomes.push(message) } },
    "../services/api-gateway": { apiGateway: gatewayDouble },
    "../services/preview-gateway": { previewGateway: {} },
  }
)
const submitCheckout = checkout.useCheckoutPayment()
await submitCheckout({
  ...draft,
  details: { ...draft.details, offerId: "offer" },
})
assert.equal(creationCalls, 1)
assert.equal(outcomes.length, 1)
assert.equal(redirects.at(-1), "/pembayaran/MKT-TEST0001")
creationError = new feedback.RequestError(
  { code: "NETWORK_ERROR", status: 0 },
  "Periksa riwayat pesanan sebelum mencoba lagi."
)
await assert.rejects(
  submitCheckout({ ...draft, details: { ...draft.details, offerId: "offer" } })
)
assert.equal(creationCalls, 2, "A lost response must not replay order creation")
assert.equal(
  outcomes.length,
  1,
  "A failed creation must not emit a success toast"
)
assert.equal(redirects.length, 1)
assert.equal(
  feedback.errorMessage(
    new feedback.RequestError({ code: "ABORTED", status: 0 }, "uncertain")
  ),
  ""
)

const eventsByName = new Map()
const visibleToasts = new Map()
const nativeModule = loadComponent(
  "components/ui/toaster.tsx",
  {
    react: { useEffect: (effect) => effect() },
    "react/jsx-runtime": { jsx: (type, props) => ({ type, props }) },
    sonner: {
      Toaster: "toaster",
      toast: {
        error: (message, options) => visibleToasts.set(options.id, message),
      },
    },
  },
  {
    document: {
      addEventListener: (name, listener) => eventsByName.set(name, listener),
      removeEventListener: (name) => eventsByName.delete(name),
    },
  }
)
const host = nativeModule.Toaster()
assert.equal(host.props.closeButton, true)
assert.equal(host.props.position, "top-right")
eventsByName.get("invalid")()
eventsByName.get("invalid")()
assert.equal(
  visibleToasts.size,
  1,
  "Multiple invalid fields must share one summary toast"
)
console.log(
  "PASS: one checkout outcome, redirect intent, no mutation replay and deduplicated native validation feedback."
)

const creatorState = []
let creatorHook = 0
let creatorEffects = []
let historyFails = true
let meCalls = 0
let historyCalls = 0
const creatorOutcomes = []
const creatorData = loadComponent(
  "features/creator/hooks/use-creator-data.ts",
  {
    react: {
      useState: (initial) => {
        const index = creatorHook++
        if (!(index in creatorState)) creatorState[index] = initial
        return [
          creatorState[index],
          (next) => {
            creatorState[index] =
              typeof next === "function" ? next(creatorState[index]) : next
          },
        ]
      },
      useRef: (initial) => {
        const index = creatorHook++
        if (!(index in creatorState)) creatorState[index] = { current: initial }
        return creatorState[index]
      },
      useCallback: (callback) => callback,
      useEffect: (effect) => creatorEffects.push(effect),
    },
    "@/lib/api": {
      creatorApi: {
        me: async () => {
          meCalls++
          return { success: true, data: { stats: { balance: 75000 } } }
        },
        submissions: async () => {
          historyCalls++
          return historyFails
            ? {
                success: false,
                error: { message: "Riwayat belum bisa dimuat." },
              }
            : { success: true, data: [{ code: "UGC-TEST0001" }] }
        },
        withdrawals: async () => ({ success: true, data: [] }),
      },
    },
    "@/lib/errors": feedback,
    "@/lib/toast": {
      notify: {
        success: (message) =>
          creatorOutcomes.push({ kind: "success", message }),
        error: (error) => creatorOutcomes.push({ kind: "error", error }),
      },
    },
  }
)
function renderCreatorData() {
  creatorHook = 0
  creatorEffects = []
  return creatorData.useCreatorData(true)
}
renderCreatorData()
creatorEffects[0]()
await new Promise((resolve) => setImmediate(resolve))
let creatorView = renderCreatorData()
assert.equal(creatorView.data.me.stats.balance, 75000)
assert.equal(
  creatorView.data.submissions,
  null,
  "Failed initial history must not become an empty list"
)
assert.equal(
  creatorView.sectionErrors.submissions,
  "Riwayat belum bisa dimuat."
)
assert.equal(creatorOutcomes.length, 0, "Initial reads must stay silent")
historyFails = false
creatorView.retrySection("submissions")
await new Promise((resolve) => setImmediate(resolve))
creatorView = renderCreatorData()
assert.equal(creatorView.data.submissions[0].code, "UGC-TEST0001")
assert.equal(meCalls, 1, "Retrying history must not reload the profile")
assert.equal(creatorOutcomes.length, 1)
historyFails = true
creatorView.retrySection("submissions")
await new Promise((resolve) => setImmediate(resolve))
creatorView = renderCreatorData()
assert.equal(
  creatorView.data.submissions[0].code,
  "UGC-TEST0001",
  "Refresh failure must retain prior history"
)
assert.equal(creatorView.data.me.stats.balance, 75000)
assert.equal(historyCalls, 3)
assert.equal(creatorOutcomes.length, 2)
assert.equal(creatorOutcomes[1].kind, "error")
console.log(
  "PASS: independent creator sections, retained stale data, targeted retries and quiet automatic reads."
)

const popupRules = load("features/promo-popup/rules.ts")
for (const pathname of [
  "/",
  "/marketplace",
  "/marketplace/chatgpt",
  "/cek-plagiarisme/cek-ai",
  "/blog/post",
  "/creator",
]) {
  assert.equal(popupRules.isPopupRoute(pathname), true)
}
for (const pathname of [
  "/masuk",
  "/pembayaran/MKT-1",
  "/marketplace/a/checkout",
  "/creator/dashboard",
  "/klaim-garansi",
  "/file-tools",
  "/marketplace-evil",
]) {
  assert.equal(popupRules.isPopupRoute(pathname), false)
}
for (const destination of [
  null,
  "",
  "//evil.test",
  "/\\\\evil.test",
  "javascript:alert(1)",
  "https://evil.test",
]) {
  assert.equal(popupRules.isPopupDestination(destination), false)
}
const poster = {
  id: "one",
  title: "ChatGPT",
  imageUrl: "https://cdn.test/poster.png",
  linkUrl: "/marketplace/chatgpt",
}
assert.equal(
  popupRules.popupPosters([
    poster,
    { ...poster, linkUrl: "//evil.test" },
    { ...poster, imageUrl: null },
  ]).length,
  1
)
assert.equal(popupRules.popupWasShown(sessionStorage), false)
popupRules.markPopupShown(sessionStorage)
assert.equal(sessionStorage.getItem(popupRules.POPUP_SESSION_KEY), "1")
assert.equal(popupRules.popupWasShown(sessionStorage), true)
assert.equal(
  popupRules.popupWasShown({
    getItem: () => {
      throw new Error("blocked")
    },
  }),
  true
)
cache.delete(path.resolve(root, "features/promo-popup/rules.ts"))
const restoredPopup = load("features/promo-popup/rules.ts")
assert.equal(restoredPopup.popupWasShown(sessionStorage), true)
cache.delete(path.resolve(root, "features/promo-popup/rules.ts"))
const unavailablePopup = load("features/promo-popup/rules.ts")
const deniedStorage = {
  getItem() {
    throw new Error("blocked")
  },
  setItem() {
    throw new Error("blocked")
  },
}
assert.equal(unavailablePopup.popupWasShown(deniedStorage), false)
unavailablePopup.markPopupShown(deniedStorage)
assert.equal(unavailablePopup.popupWasShown(deniedStorage), true)
const { firstUsablePoster } = load("features/promo-popup/load-poster.ts")
const candidates = [
  poster,
  {
    ...poster,
    id: "two",
    imageUrl: "https://cdn.test/two.png",
    linkUrl: "/cek-plagiarisme",
  },
]
const attempts = []
const usable = await firstUsablePoster(
  candidates,
  { aborted: false },
  async (url) => {
    attempts.push(url)
    return url.endsWith("two.png")
  }
)
assert.equal(usable.length, 1)
assert.equal(usable[0].id, "two")
assert.equal(attempts.length, 2)
assert.equal(
  (await firstUsablePoster(candidates, { aborted: false }, async () => false))
    .length,
  0
)
assert.equal(
  (
    await firstUsablePoster(candidates, { aborted: true }, async () => {
      throw new Error("should not load")
    })
  ).length,
  0
)
console.log(
  "PASS: popup route safety, poster filtering, per-tab persistence, storage-denied fallback, failed-image fallback and aborted loading."
)
let previewPopup = false
let popupFetchFails = false
let popupFetchCalls = 0
const popupRoute = loadComponent("app/api/promo-popup/route.ts", {
  "next/headers": { draftMode: async () => ({ isEnabled: previewPopup }) },
  "next/server": {
    NextResponse: { json: (body, options) => ({ body, options }) },
  },
  "@/lib/api/server": {
    serverGet: async () => {
      popupFetchCalls++
      if (popupFetchFails) throw new Error("unavailable")
      return { data: [poster] }
    },
  },
  "@/features/promo-popup/rules": popupRules,
})
assert.equal((await popupRoute.GET()).body.data.length, 1)
previewPopup = true
assert.equal((await popupRoute.GET()).body.data.length, 0)
assert.equal(
  popupFetchCalls,
  1,
  "Preview must not request production popup content"
)
previewPopup = false
popupFetchFails = true
assert.equal((await popupRoute.GET()).body.data.length, 0)

const popupJsx = (type, props) => ({ type, props })
const popupDialogState = []
let popupDialogHook = 0
let popupClosed = 0
const dialog = loadComponent("features/promo-popup/poster-dialog.tsx", {
  react: {
    useState: (initial) => {
      const id = popupDialogHook++
      if (!(id in popupDialogState)) popupDialogState[id] = initial
      return [
        popupDialogState[id],
        (value) => {
          popupDialogState[id] =
            typeof value === "function" ? value(popupDialogState[id]) : value
        },
      ]
    },
    useRef: (initial) => ({ current: initial }),
  },
  "react/jsx-runtime": { jsx: popupJsx, jsxs: popupJsx },
  "radix-ui": {
    Dialog: {
      Root: "root",
      Portal: "portal",
      Content: "content",
      Title: "title",
      Close: "close",
      Overlay: "overlay",
    },
  },
  "lucide-react": { ChevronLeft: "previous", ChevronRight: "next", X: "x" },
  "next/link": { default: "link" },
})
const renderPopup = (items = candidates) => {
  popupDialogHook = 0
  return dialog.PosterDialog({
    posters: items,
    onClose: () => popupClosed++,
    restoreFocus: { current: null },
  })
}
const flattenPopup = (node) => {
  if (!node || typeof node !== "object") return []
  return [node, ...[node.props?.children].flat(Infinity).flatMap(flattenPopup)]
}
let popupTree = flattenPopup(renderPopup())
assert.equal(
  popupTree.filter((node) => node.type === "img").length,
  1,
  "Only the active poster image is mounted"
)
const nextPromo = popupTree.find(
  (node) => node.props?.["aria-label"] === "Promo berikutnya"
)
nextPromo.props.onClick()
assert.equal(popupDialogState[0], 1)
popupTree = flattenPopup(renderPopup())
const popupLink = popupTree.find((node) => node.props?.href)
assert.equal(popupLink.props.href, candidates[1].linkUrl)
popupLink.props.onClick({ preventDefault() {} })
assert.equal(popupClosed, 1)
popupTree.find((node) => node.type === "root").props.onOpenChange(false)
assert.equal(popupClosed, 2)
popupDialogState.length = 0
popupTree = flattenPopup(renderPopup([poster]))
assert.equal(
  popupTree.some((node) => node.props?.["aria-label"] === "Promo berikutnya"),
  false
)
console.log(
  "PASS: popup preview suppression, quiet fetch failures, deferred poster images, navigation target, dismissal and single-slide controls."
)
popupDialogState.length = 0
popupTree = flattenPopup(renderPopup())
const touchSurface = popupTree.find((node) => node.props?.onTouchStart)
touchSurface.props.onTouchStart({ touches: [{ clientX: 200, clientY: 100 }] })
touchSurface.props.onTouchEnd({
  changedTouches: [{ clientX: 80, clientY: 110 }],
})
assert.equal(popupDialogState[0], 1, "Horizontal swipe selects the next poster")
let preventedSwipeClick = false
const closedBeforeSwipe = popupClosed
popupTree
  .find((node) => node.props?.href)
  .props.onClick({
    preventDefault() {
      preventedSwipeClick = true
    },
  })
assert.equal(preventedSwipeClick, true)
assert.equal(
  popupClosed,
  closedBeforeSwipe,
  "Swiping must not accidentally follow the poster link"
)
let preventedArrow = false
popupTree
  .find((node) => node.type === "content")
  .props.onKeyDown({
    key: "ArrowRight",
    preventDefault() {
      preventedArrow = true
    },
  })
assert.equal(preventedArrow, true)
console.log(
  "PASS: popup swipe and keyboard handlers navigate slides without accidental link activation."
)
