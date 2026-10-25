"use client"

import { Loader2, TicketPercent, X } from "lucide-react"
import { useId } from "react"

import { Button } from "@/components/ui/button"

export interface AppliedPromo {
  code: string
  discount: number
  description?: string | null
}

/** "Kode Promo" + "Gunakan"; the discount itself always comes from the server. */
export function PromoField({
  value,
  onChange,
  applied,
  error,
  busy,
  onApply,
  onRemove,
}: {
  value: string
  onChange: (value: string) => void
  applied: AppliedPromo | null
  error?: string
  busy?: boolean
  onApply: () => void
  onRemove: () => void
}) {
  const id = useId()
  const hintId = `${id}-hint`
  return (
    <div className="flex flex-col gap-2 text-sm font-medium tracking-[-0.02em]">
      <label htmlFor={id}>Kode Promo</label>
      {applied ? (
        <div className="flex items-center justify-between gap-3 rounded-full border border-emerald-200 bg-emerald-50 py-1.5 pr-1.5 pl-4">
          <span className="flex min-w-0 items-center gap-2 text-emerald-700">
            <TicketPercent className="size-4 shrink-0" aria-hidden />
            <span className="truncate">
              <span className="font-semibold">{applied.code}</span>
              {applied.description && (
                <span className="font-normal"> · {applied.description}</span>
              )}
            </span>
          </span>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Hapus kode promo ${applied.code}`}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-100"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ) : (
        <span className="relative">
          <TicketPercent
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle"
            aria-hidden
          />
          <input
            id={id}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                onApply()
              }
            }}
            placeholder="Kode promo"
            autoComplete="off"
            autoCapitalize="characters"
            aria-invalid={!!error}
            aria-describedby={error ? hintId : undefined}
            className="h-12 w-full rounded-full border border-line bg-white pr-28 pl-11 text-base tracking-[-0.02em] uppercase outline-none placeholder:text-subtle placeholder:normal-case focus-visible:border-primary aria-invalid:border-red-500 md:text-sm"
          />
          <Button
            type="button"
            onClick={onApply}
            disabled={busy || !value.trim()}
            size="pill"
            className="absolute top-1/2 right-1.5 h-9 -translate-y-1/2 px-3.5 text-sm"
          >
            {busy && <Loader2 className="animate-spin" aria-hidden />}
            Gunakan
          </Button>
        </span>
      )}
      {error && !applied && (
        <p
          id={hintId}
          role="alert"
          className="text-xs font-normal text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  )
}
