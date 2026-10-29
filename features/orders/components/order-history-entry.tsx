"use client"

import { Loader2 } from "lucide-react"

import { useAuthStore } from "@/lib/stores/auth"

import { GuestOrderLookup } from "./guest-order-lookup"
import { OrderHistory } from "./order-history"

/** Accounts see their order list; guests look an order up (no login needed). */
export function OrderHistoryEntry() {
  const status = useAuthStore((s) => s.status)
  if (status === "authenticated") return <OrderHistory />
  if (status === "guest") return <GuestOrderLookup />
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-subtle">
      <Loader2 className="size-6 animate-spin" aria-label="Memuat" />
    </div>
  )
}
