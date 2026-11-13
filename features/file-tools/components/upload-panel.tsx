import type { ComponentProps, ReactNode } from "react"
import { FileText, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function UploadPanel({
  icon: Icon = FileText,
  hint,
  hintId,
  onPick,
  busy,
  label = "Pilih file",
  children,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  icon?: LucideIcon
  hint: string
  hintId?: string
  onPick: () => void
  busy?: boolean
  label?: string
  children?: ReactNode
}) {
  return (
    <div
      {...props}
      className={cn(
        "flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-6 py-10 text-center",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-white text-black">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          size="pill"
          className="px-8"
          aria-describedby={hintId}
          disabled={busy}
          onClick={onPick}
        >
          {label}
        </Button>
        {children}
      </div>
      <p
        id={hintId}
        className="max-w-full text-sm [overflow-wrap:anywhere] text-subtle"
      >
        {hint}
      </p>
    </div>
  )
}
