"use client"

import { Toaster as Sonner } from "sonner"
import { useEffect } from "react"
import { toast } from "sonner"

export function Toaster() {
  useEffect(() => {
    const invalid = () =>
      toast.error(
        "Ada isian yang perlu diperbaiki. Periksa kembali formulirmu.",
        { id: "native-validation", duration: 8000 }
      )
    document.addEventListener("invalid", invalid, true)
    return () => document.removeEventListener("invalid", invalid, true)
  }, [])
  return (
    <Sonner
      richColors
      closeButton
      position="top-right"
      toastOptions={{ style: { fontFamily: "var(--font-inter), sans-serif" } }}
    />
  )
}
