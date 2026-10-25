"use client"

import { Check, Copy, KeyRound } from "lucide-react"
import { useState } from "react"

import type { AccountDelivery } from "../types"

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "Email",
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked: the text stays selectable.
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Tersalin" : label}
      className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-subtle transition-colors hover:border-primary hover:text-primary"
    >
      {copied ? (
        <Check className="size-4 text-emerald-600" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  )
}

/** "key: value" lines become separate copyable rows; free text stays one block. */
function credentialRows(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  const pairs = lines.map((line) => {
    const match = /^([^:]{1,30}):\s*(.+)$/.exec(line)
    return match && !/^https?$/i.test(match[1])
      ? { label: match[1].trim(), value: match[2].trim() }
      : null
  })
  return pairs.every(Boolean)
    ? (pairs as { label: string; value: string }[])
    : null
}

/** Account details sent by the admin, shown on the order page. */
export function DeliveryBox({ delivery }: { delivery: AccountDelivery }) {
  const rows = credentialRows(delivery.credentials)
  const via = delivery.channels.map((c) => CHANNEL_LABELS[c] ?? c).join(" & ")

  return (
    <div className="rounded-2xl border border-line p-5">
      <div className="mb-4 flex items-center gap-2">
        <KeyRound className="size-5 text-primary" aria-hidden />
        <h3 className="font-semibold">Detail akun</h3>
      </div>
      {rows ? (
        <dl className="divide-y divide-line rounded-xl bg-orange-50/60">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <dt className="text-xs text-subtle">{row.label}</dt>
                <dd className="font-mono text-sm break-all text-black">
                  {row.value}
                </dd>
              </div>
              <CopyButton value={row.value} label={`Salin ${row.label}`} />
            </div>
          ))}
        </dl>
      ) : (
        <div className="flex items-start gap-3 rounded-xl bg-orange-50/60 p-4">
          <pre className="min-w-0 flex-1 font-mono text-sm break-all whitespace-pre-wrap text-black">
            {delivery.credentials}
          </pre>
          <CopyButton value={delivery.credentials} label="Salin detail akun" />
        </div>
      )}
      {delivery.instructions && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Petunjuk</p>
          <p className="mt-1 text-sm leading-6 whitespace-pre-line text-subtle">
            {delivery.instructions}
          </p>
        </div>
      )}
      <p className="mt-4 text-xs leading-5 text-subtle">
        Dikirim{via ? ` melalui ${via}` : ""} pada{" "}
        {new Intl.DateTimeFormat("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Jakarta",
        }).format(new Date(delivery.sentAt))}
        . Jangan bagikan data akun ini ke orang lain.
      </p>
    </div>
  )
}
