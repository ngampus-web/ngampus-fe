import Image from "next/image"

import { SectionHeading } from "@/components/shared/section-heading"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faq } from "@/features/home/data/home"

function ToggleIcon() {
  return (
    <span
      aria-hidden
      className="absolute top-1/2 right-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-3xl bg-surface transition-colors group-aria-expanded/accordion-trigger:bg-primary md:right-6"
    >
      <Image
        src="/icons/add.svg"
        alt=""
        width={24}
        height={24}
        className="group-aria-expanded/accordion-trigger:hidden"
      />
      <Image
        src="/icons/add-active.svg"
        alt=""
        width={24}
        height={24}
        className="hidden rotate-45 group-aria-expanded/accordion-trigger:block"
      />
    </span>
  )
}

export function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto flex w-full max-w-[1080px] scroll-mt-20 flex-col items-center gap-10 px-5 py-16 text-black md:px-10 lg:gap-15 lg:py-25"
    >
      <SectionHeading
        title={faq.title}
        description={faq.description}
        align="center"
        className="max-w-[601px]"
      />
      <Accordion
        type="single"
        collapsible
        defaultValue="item-0"
        className="flex flex-col gap-4"
      >
        {faq.items.map((item, i) => (
          <AccordionItem
            key={item.question}
            value={`item-${i}`}
            className="relative rounded-3xl border border-line-strong bg-white not-last:border-b"
          >
            <AccordionTrigger
              icon={<ToggleIcon />}
              className="static min-h-[94px] items-center rounded-3xl py-6 pr-20 pl-4 text-xl font-normal tracking-[-0.02em] hover:no-underline aria-expanded:min-h-0 aria-expanded:pb-4 aria-expanded:font-semibold md:pr-22 md:pl-6 md:text-2xl"
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pr-20 pb-6 pl-4 text-base tracking-[-0.02em] md:pr-22 md:pl-6 md:text-lg">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
