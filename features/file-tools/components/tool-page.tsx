import type { ReactNode } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"

export function ToolPage({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "File Tools", href: "/file-tools" },
          { label: title },
        ]}
      />
      <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-5 py-12 md:px-10 lg:py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {children}
      </section>
    </>
  )
}
