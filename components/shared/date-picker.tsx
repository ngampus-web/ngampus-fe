"use client"

import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const toDate = (value: string) => new Date(`${value}T00:00:00`)

/**
 * Date field with the site's calendar. Value is `YYYY-MM-DD` (like
 * `<input type="date">`); `name` posts it with the form.
 */
export function DatePicker({
  id,
  name,
  value,
  defaultValue,
  onChange,
  max,
  min,
  required,
  disabled,
  placeholder = "Pilih tanggal",
  className,
}: {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  max?: string
  min?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
}) {
  const [own, setOwn] = useState(defaultValue ?? "")
  const [open, setOpen] = useState(false)
  const current = value ?? own
  const selected = current ? toDate(current) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex items-center justify-between gap-2 text-left",
            className
          )}
        >
          <span className={selected ? undefined : "text-subtle"}>
            {selected
              ? format(selected, "d MMMM yyyy", { locale: localeId })
              : placeholder}
          </span>
          <CalendarIcon className="size-5 shrink-0" aria-hidden />
        </button>
      </PopoverTrigger>
      {/* Keeps native form posting and `required` validation. */}
      {name && (
        <input
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          name={name}
          value={current}
          required={required}
          onChange={() => {}}
        />
      )}
      <PopoverContent
        className="w-auto rounded-2xl border border-line bg-white p-0"
        align="start"
      >
        <Calendar
          mode="single"
          locale={localeId}
          selected={selected}
          defaultMonth={selected ?? (max ? toDate(max) : undefined)}
          disabled={[
            ...(max ? [{ after: toDate(max) }] : []),
            ...(min ? [{ before: toDate(min) }] : []),
          ]}
          onSelect={(date) => {
            const next = date ? format(date, "yyyy-MM-dd") : ""
            setOwn(next)
            onChange?.(next)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
