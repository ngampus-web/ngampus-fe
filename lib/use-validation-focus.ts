"use client"

import { useEffect } from "react"

export function useValidationFocus(errors: unknown) {
  useEffect(() => {
    if (!errors || typeof errors !== "object" || !Object.keys(errors).length)
      return
    const frame = requestAnimationFrame(() =>
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    )
    return () => cancelAnimationFrame(frame)
  }, [errors])
}
