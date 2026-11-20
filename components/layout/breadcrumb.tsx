import { ChevronRight } from "lucide-react"
import Link from "next/link"

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-line">
      <ol
        tabIndex={0}
        className="mx-auto flex max-w-[1280px] [scrollbar-width:none] items-center gap-2 overflow-x-auto px-5 py-4 text-sm tracking-[-0.02em] whitespace-nowrap text-black md:px-10"
      >
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={item.label} className="flex shrink-0 items-center gap-2">
              {index > 0 && (
                <ChevronRight
                  className="size-4 shrink-0 text-subtle"
                  aria-hidden
                />
              )}
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
