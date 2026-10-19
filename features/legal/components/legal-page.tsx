import { Breadcrumb } from "@/components/layout/breadcrumb"
import { type LegalSection } from "@/features/legal/data/legal"

export function LegalPage({
  title,
  sections,
  description,
}: {
  title: string
  sections: LegalSection[]
  description: string
}) {
  return (
    <>
      <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: title }]} />
      <article className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-5 py-16 md:px-10 lg:py-20">
        <header className="flex max-w-[720px] flex-col gap-3">
          <h1 className="text-[32px] leading-[1.2] font-medium tracking-[-0.02em] md:text-title">
            {title}
          </h1>
          <p className="tracking-[-0.02em]">{description}</p>
        </header>
        <div className="flex max-w-[860px] flex-col gap-8">
          {sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-2">
              <h2 className="text-base font-semibold tracking-[-0.02em]">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-7 tracking-[-0.02em]"
                >
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className="list-disc space-y-1 pl-5 text-base leading-7 tracking-[-0.02em]">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </>
  )
}
