"use client"

import { Check, Phone, Star, UserRound } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  checkoutDurations,
  checkoutTypes,
} from "@/features/marketplace/data/marketplace"
import { type MarketplaceCheckout } from "@/features/marketplace/types"
import type { OrderDraft } from "@/features/payment/types"
import { cn } from "@/lib/utils"

function rupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`
}

function Choice({
  selected,
  label,
  detail,
  onSelect,
}: {
  selected: boolean
  label: string
  detail?: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-left text-sm tracking-[-0.02em]"
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
  const [payBusy, setPayBusy] = useState(false)
  const offers = product.offers
  const [name, setName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [packageName, setPackageName] = useState(product.packages[0])
  const [accountType, setAccountType] = useState(checkoutTypes[0])
  const [durationId, setDurationId] = useState(
    offers?.find((offer) => offer.plan === product.packages[0])?.duration ??
      checkoutDurations[0].id
  )
  const [payNote, setPayNote] = useState("")

  const planOffers = offers?.filter((offer) => offer.plan === packageName)
  const selectedOffer =
    planOffers?.find((offer) => offer.duration === durationId) ??
    planOffers?.[0]
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

  function selectPlan(plan: string) {
    setPackageName(plan)
    const next = offers?.find((offer) => offer.plan === plan)
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
      <section className="mx-auto grid w-full max-w-[1100px] items-start gap-4 px-5 py-12 md:px-10 lg:grid-cols-2 lg:py-16">
        <article className="flex flex-col gap-4 rounded-2xl border border-line p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={product.logo}
                alt=""
                width={56}
                height={56}
                className="size-14 rounded-xl object-cover"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-semibold tracking-[-0.02em]">
                  {product.name}
                </h1>
                <p className="flex items-center gap-1.5 text-sm tracking-[-0.02em] text-subtle">
                  <Star
                    className="size-4 fill-primary text-primary"
                    aria-hidden
                  />
                  <span className="text-black">5.0</span>
                  <span>· Telah Terjual 599</span>
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              {["Stok Tersedia", "Garansi"].map((badge) => (
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
              <ul className="list-disc space-y-3 pl-5 text-sm leading-6 tracking-[-0.02em]">
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
            if (inFlight.current) return
            inFlight.current = true
            setPayBusy(true)
            setPayNote("")
            try {
              await onCheckout({
                phone: whatsapp,
                amount: total,
                details: {
                  kind: "marketplace",
                  slug: product.slug,
                  title: product.name,
                  customerName: name.trim(),
                  plan: packageName,
                  duration: selectedOffer?.duration ?? duration.label,
                  warranty: selectedOffer?.warranty,
                  accountType: offers ? undefined : accountType,
                },
              })
            } catch (error) {
              setPayNote(
                error instanceof Error
                  ? error.message
                  : "Pesanan tidak dapat dibuat."
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
              Nama Lengkap
              <span className="relative">
                <UserRound
                  className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle"
                  aria-hidden
                />
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nama lengkap"
                  autoComplete="name"
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
              <div className="flex justify-between gap-4 font-semibold">
                <dt>Total Pembayaran</dt>
                <dd>{rupiah(total)}</dd>
              </div>
            </dl>
            <Button
              type="submit"
              disabled={payBusy}
              className="h-12 w-full rounded-3xl text-base"
            >
              {payBusy ? "Menyiapkan pesanan…" : "Bayar Sekarang"}
            </Button>
            <p className="text-center text-xs leading-5 text-subtle">
              Pratinjau alur pembayaran. Belum ada transaksi nyata.
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
