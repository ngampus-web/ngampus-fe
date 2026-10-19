import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  title: string | string[]
  description?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const lines = Array.isArray(title) ? title : [title]

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <h2 className="text-[32px] leading-[1.2] font-medium tracking-[-0.02em] md:text-title">
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
      {description ? <p className="tracking-[-0.02em]">{description}</p> : null}
    </div>
  )
}
