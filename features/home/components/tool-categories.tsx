import Image from "next/image"
import Link from "next/link"

import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toolCategories } from "@/features/home/data/home"

const categoryMascots: Record<
  string,
  { src: string; width: number; height: number }
> = {
  "Marketplace Account": {
    src: "/images/mascot-marketplace.png",
    width: 677,
    height: 901,
  },
  "Plagiarisme Checker": {
    src: "/images/mascot-academic.png",
    width: 667,
    height: 955,
  },
  "File tools": {
    src: "/images/mascot-file-tools.png",
    width: 664,
    height: 866,
  },
}

export function ToolCategories() {
  return (
    <section
      id="tools"
      className="mx-auto flex w-full max-w-[1280px] scroll-mt-20 flex-col gap-10 px-5 py-16 text-black md:px-10 lg:gap-15 lg:p-20"
    >
      <SectionHeading
        title={toolCategories.title}
        description={toolCategories.description}
      />
      <div className="grid items-stretch gap-4 md:grid-cols-3">
        {toolCategories.items.map((item) => {
          const mascot = categoryMascots[item.title]
          return (
            <Card
              key={item.title}
              className="justify-between gap-6 rounded-2xl bg-surface p-6 text-base ring-0"
            >
              <Image
                src={mascot.src}
                alt=""
                width={mascot.width}
                height={mascot.height}
                sizes="220px"
                className="mx-auto h-44 w-auto object-contain"
              />
              <div className="flex flex-col items-start gap-[21px]">
                <div className="flex flex-col gap-3">
                  <h3 className="text-[22px] font-semibold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="tracking-[-0.02em]">{item.description}</p>
                </div>
                <Button asChild size="pill">
                  <Link href={item.href}>{item.cta ?? "Lihat tools"}</Link>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
