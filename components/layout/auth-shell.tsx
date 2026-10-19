import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export function AuthShell({
  children,
  backHref = "/",
  backLabel = "Kembali ke Beranda",
}: {
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}) {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <div className="border-b border-line">
        <div className="mx-auto flex h-[60px] w-full max-w-[1280px] items-center px-5 md:px-10">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm tracking-[-0.02em] text-black"
          >
            <ChevronLeft className="size-5" aria-hidden />
            {backLabel}
          </Link>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[480px] rounded-3xl border border-line bg-white px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
