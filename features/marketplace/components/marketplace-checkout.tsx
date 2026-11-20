"use client"
import { notify } from "@/lib/toast"

import { Check, Mail, Phone, Star } from "lucide-react"
import { useRef, useState } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import { Turnstile } from "@/features/auth/components/turnstile"
import { useGuestTurnstile } from "@/features/auth/hooks/use-guest-turnstile"
import {
  checkoutDurations,
  checkoutTypes,
} from "@/features/marketplace/data/marketplace"
import { type MarketplaceCheckout } from "@/features/marketplace/types"
import {
  type AppliedPromo,
  PromoField,
} from "@/features/payment/components/promo-field"
import type { OrderDraft } from "@/features/payment/types"
import { ordersApi } from "@/lib/api/endpoints/orders"
import { isPreorderPlan } from "../services/preorder"
import { ProductLogo } from "./product-logo"
import { StockBadge } from "./stock-badge"
import {
  localPhone,
  useProfileAutofill,
} from "@/features/auth/hooks/use-profile-autofill"
import { cn } from "@/lib/utils"

function rupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}

/** A plan with no units left; unknown stock (previews) counts as available. */
const soldOut = (offer: { stock?: number }) =>
  offer.stock !== undefined && offer.stock <= 0

function Choice({
  selected,
  label,
  detail,
  preorder,
  disabled,
  onSelect,
}: {
  selected: boolean
  label: string
  preorder?: boolean
  detail?: string
  disabled?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-left text-sm tracking-[-0.02em]",
        disabled && "cursor-not-allowed bg-muted/50 text-subtle opacity-60"
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-[4px] border",
          selected
            ? "border-primary bg-primary text-white"
            : "border-line bg-white"
        )}
      >
        {selected && <Check className="size-3" strokeWidth={3} aria-hidden />}
      </span>
      <span>
        <span className="block">{label}</span>
        {disabled ? (
          <span className="block text-xs font-semibold">Stok habis</span>
        ) : (
          preorder && (
            <span className="block text-xs font-semibold text-primary">
              Pre-order
            </span>
          )
        )}
        {detail && <span className="block text-xs text-subtle">{detail}</span>}
      </span>
    </button>
  )
}

export function MarketplaceCheckout({
  product,
  onCheckout,
}: {
  product: MarketplaceCheckout
  onCheckout: (draft: OrderDraft) => Promise<void>
}) {
  const inFlight = useRef(false)
  const captcha = useGuestTurnstile()
  const [payBusy, setPayBusy] = useState(false)
  const offers = product.offers
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  useProfileAutofill((user) => {
    setEmail((v) => v || user.email)
    setWhatsapp((v) => v || localPhone(user.phone))
  })
  const firstOffer = offers?.find((offer) => !soldOut(offer)) ?? offers?.[0]
  const [packageName, setPackageName] = useState(
    firstOffer?.plan ?? product.packages[0]
  )
  const [accountType, setAccountType] = useState(checkoutTypes[0])
  const [durationId, setDurationId] = useState(
    firstOffer?.duration ?? checkoutDurations[0].id
  )
  const [payNote, setPayNote] = useState("")
  const [promoInput, setPromoInput] = useState("")
  const [promo, setPromo] = useState<
    (AppliedPromo & { offerId: string; total: number }) | null
  >(null)
  const [promoError, setPromoError] = useState("")
  const [promoBusy, setPromoBusy] = useState(false)

  const planOffers = offers?.filter((offer) => offer.plan === packageName)
  const selectedOffer =
    planOffers?.find((offer) => offer.duration === durationId) ??
    planOffers?.[0]
  const selectedSoldOut = selectedOffer ? soldOut(selectedOffer) : false
  const duration =
    checkoutDurations.find((item) => item.id === durationId) ??
    checkoutDurations[0]
  const total = selectedOffer
    ? selectedOffer.price
    : product.monthly * duration.months
  const official = selectedOffer
    ? selectedOffer.official
    : product.compare * duration.months
  const savings = official - total
  // A quote is tied to the offer it was made for; another plan needs a new one.
  const activePromo =
    promo && promo.offerId === selectedOffer?.id ? promo : null
  const payable = activePromo ? activePromo.total : total
  // A free code covers everything: the server pays the order on the spot, so
  // there is nothing to pay. The total always comes from the server quote.
  const isFree = !!activePromo && activePromo.total === 0

  async function applyPromo() {
    const code = promoInput.trim().toUpperCase()
    const offerId = selectedOffer?.id
    if (!code || !offerId) return
    setPromoBusy(true)
    setPromoError("")
    const res = await ordersApi.quote({
      kind: "marketplace",
      offerId,
      promoCode: code,
    })
    setPromoBusy(false)
    if (!res.success) {
      notify.error(res.error)
      setPromoError(res.error.message)
      return
    }
    notify.success("Kode promo berhasil digunakan.")
    setPromo({
      code,
      discount: res.data.discount,
      offerId,
      total: res.data.total,
    })
  }

  function removePromo() {
    notify.success("Kode promo dilepas.")
    setPromo(null)
    setPromoError("")
  }

  function selectPlan(plan: string) {
    setPackageName(plan)
    const inPlan = offers?.filter((offer) => offer.plan === plan)
    const next = inPlan?.find((offer) => !soldOut(offer)) ?? inPlan?.[0]
    if (next) setDurationId(next.duration)
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: product.name },
        ]}
      />
      <section className="mx-auto grid w-full max-w-[1100px] grid-cols-1 items-start gap-4 px-5 py-12 md:px-10 lg:grid-cols-2 lg:py-16">
        <article className="flex flex-col gap-4 rounded-2xl border border-line p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 max-sm:w-full">
              <ProductLogo src={product.logo} />
              <div className="flex min-w-0 flex-col gap-1">
                <h1 className="text-lg font-semibold tracking-[-0.02em] wrap-anywhere">
                  {product.name}
                </h1>
                <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm tracking-[-0.02em] text-subtle">
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-black">
                    <Star
                      className="size-4 fill-primary text-primary"
                      aria-hidden
                    />
                    {product.rating.toFixed(1)}
                  </span>
                  <span>
                    · Telah Terjual {product.soldCount.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex max-w-full flex-wrap gap-2">
              {!product.previewOnly &&
                !(isPreorderPlan(offers, packageName) && product.isInStock) && (
                  <StockBadge
                    product={product}
                    className="px-3 py-1.5 text-xs"
                  />
                )}
              {[
                product.previewOnly
                  ? "Pratinjau"
                  : isPreorderPlan(offers, packageName) && product.isInStock
                    ? "Pre-order"
                    : null,
                "Garansi",
              ]
                .filter((badge): badge is string => badge !== null)
                .map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-line px-3 py-1.5 text-xs tracking-[-0.02em]"
                  >
                    {badge}
                  </span>
                ))}
            </div>
          </div>

          {product.sections.map((section) => (
            <div
              key={section.title}
              className="flex flex-col gap-3 rounded-2xl border border-line p-4"
            >
              <h2 className="text-base font-semibold tracking-[-0.02em]">
                {section.title}
              </h2>
              <ul className="list-disc space-y-3 pl-5 text-sm leading-6 tracking-[-0.02em] wrap-anywhere">
                {section.items.map((item) => (
                  <li key={item.body}>
                    {item.title && (
                      <span className="font-semibold">{item.title}</span>
                    )}
                    {item.title ? ` ${item.body}` : item.body}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </article>

        <form
          className="flex flex-col gap-4"
          onSubmit={async (event) => {
            event.preventDefault()
            if (product.previewOnly || !product.isInStock || selectedSoldOut)
              return
            if (inFlight.current) return
            inFlight.current = true
            setPayBusy(true)
            setPayNote("")
            try {
              await onCheckout({
                turnstileToken: captcha.consume(),
                phone: whatsapp,
                amount: payable,
                promoCode: activePromo?.code,
                details: {
                  kind: "marketplace",
                  slug: product.slug,
                  offerId: selectedOffer?.id,
                  title: product.name,
                  customerEmail: email.trim(),
                  plan: packageName,
                  duration: selectedOffer?.duration ?? duration.label,
                  warranty: selectedOffer?.warranty,
                  accountType: offers ? undefined : accountType,
                },
              })
            } catch (error) {
              setPayNote(
                notify.error(
                  error,
                  "Pesanan tidak dapat dibuat. Silakan periksa kembali data pesanan."
                )
              )
            } finally {
              inFlight.current = false
              setPayBusy(false)
            }
          }}
        >
          <section className="flex flex-col gap-4 rounded-2xl border border-line p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold tracking-[-0.02em]">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-sm text-white">
                1
              </span>
              Masukkan Data Pembeli
            </h2>
            <label className="flex flex-col gap-2 text-sm tracking-[-0.02em]">
              Email
              <span className="relative">
                <Mail
                  className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle"
                  aria-hidden
                />
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-full border border-line pr-4 pl-11 text-sm tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary"
                />
              </span>
            </label>
            <label className="flex flex-col gap-2 text-sm tracking-[-0.02em]">
              No. Whatsapp
              <span className="relative">
                <Phone
                  className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle"
                  aria-hidden
                />
                <input
                  required
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                  placeholder="Nomor WhatsApp"
                  autoComplete="tel"
                  inputMode="tel"
                  className="h-12 w-full rounded-full border border-line pr-4 pl-11 text-sm tracking-[-0.02em] outline-none placeholder:text-subtle focus-visible:border-primary"
                />
              </span>
            </label>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-line p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold tracking-[-0.02em]">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-sm text-white">
                2
              </span>
              Pilih Nominal/Varian
            </h2>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm tracking-[-0.02em]">Paket</legend>
              <div className="flex flex-wrap gap-2" role="radiogroup">
                {product.packages.map((item) => (
                  <Choice
                    key={item}
                    selected={item === packageName}
                    label={item}
                    preorder={isPreorderPlan(offers, item)}
                    disabled={
                      !!offers &&
                      offers
                        .filter((offer) => offer.plan === item)
                        .every(soldOut)
                    }
                    onSelect={() => selectPlan(item)}
                  />
                ))}
              </div>
            </fieldset>
            {!offers && (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm tracking-[-0.02em]">
                  Tipe
                </legend>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {checkoutTypes.map((item) => (
                    <Choice
                      key={item}
                      selected={item === accountType}
                      label={item}
                      onSelect={() => setAccountType(item)}
                    />
                  ))}
                </div>
              </fieldset>
            )}
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm tracking-[-0.02em]">
                Durasi
              </legend>
              <div className="flex flex-wrap gap-2" role="radiogroup">
                {planOffers
                  ? planOffers.map((item) => (
                      <Choice
                        key={item.duration}
                        selected={item.duration === selectedOffer?.duration}
                        label={item.duration}
                        detail={rupiah(item.price)}
                        disabled={soldOut(item)}
                        onSelect={() => setDurationId(item.duration)}
                      />
                    ))
                  : checkoutDurations.map((item) => (
                      <Choice
                        key={item.id}
                        selected={item.id === durationId}
                        label={item.label}
                        detail={rupiah(product.monthly * item.months)}
                        onSelect={() => setDurationId(item.id)}
                      />
                    ))}
              </div>
              {selectedOffer && (
                <p className="text-sm tracking-[-0.02em] text-subtle">
                  Garansi {selectedOffer.warranty}
                </p>
              )}
            </fieldset>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-line p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold tracking-[-0.02em]">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-sm text-white">
                3
              </span>
              Ringkasan Pembayaran
            </h2>
            {offers && (
              <PromoField
                value={promoInput}
                onChange={(v) => {
                  setPromoInput(v)
                  setPromoError("")
                }}
                applied={activePromo}
                error={
                  promoError ||
                  (promo && !activePromo
                    ? "Paket berubah. Klik Gunakan lagi untuk menerapkan kode promo."
                    : "")
                }
                busy={promoBusy}
                onApply={applyPromo}
                onRemove={removePromo}
              />
            )}
            <dl className="flex flex-col gap-2 text-sm tracking-[-0.02em]">
              <div className="flex justify-between gap-4">
                <dt>Harga Resmi</dt>
                <dd>{rupiah(official)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-emerald-600">
                <dt>Hemat</dt>
                <dd>-{rupiah(savings)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Subtotal</dt>
                <dd>{rupiah(total)}</dd>
              </div>
              {activePromo && (
                <div className="flex justify-between gap-4 text-emerald-600">
                  <dt>Diskon ({activePromo.code})</dt>
                  <dd>−{rupiah(activePromo.discount)}</dd>
                </div>
              )}
              {activePromo &&
                activePromo.total !== total - activePromo.discount && (
                  <div className="flex justify-between gap-4">
                    <dt>Biaya layanan</dt>
                    <dd>
                      {rupiah(
                        activePromo.total - (total - activePromo.discount)
                      )}
                    </dd>
                  </div>
                )}
              <div className="flex justify-between gap-4 font-semibold">
                <dt>Total Pembayaran</dt>
                <dd>{rupiah(payable)}</dd>
              </div>
            </dl>
            {captcha.required && !product.previewOnly && (
              <Turnstile {...captcha.widget} />
            )}
            <Button
              type="submit"
              disabled={
                product.previewOnly ||
                !captcha.ready ||
                payBusy ||
                !product.isInStock ||
                selectedSoldOut
              }
              className="h-12 w-full rounded-3xl text-base"
            >
              {product.previewOnly
                ? "Pembayaran belum tersedia"
                : !product.isInStock || selectedSoldOut
                  ? "Stok Habis"
                  : payBusy
                    ? "Menyiapkan pesanan…"
                    : isFree
                      ? "Konfirmasi Pesanan Gratis"
                      : "Bayar Sekarang"}
            </Button>
            <p className="text-center text-xs leading-5 text-subtle">
              {product.previewOnly
                ? "Data katalog pratinjau. Pembayaran tersedia setelah layanan terhubung kembali."
                : isFree
                  ? "Kode promo menutup seluruh harga, jadi tidak ada pembayaran yang perlu dilakukan."
                  : "Pratinjau alur pembayaran. Belum ada transaksi nyata."}
            </p>
            {payNote && (
              <p className="text-center text-sm tracking-[-0.02em] text-subtle">
                {payNote}
              </p>
            )}
          </section>
        </form>
      </section>
    </>
  )
}
