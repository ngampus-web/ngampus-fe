import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cta } from "@/features/home/data/home"

export function Cta() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-16 md:px-10 lg:py-20">
      <div className="relative mx-auto flex max-w-[1120px] flex-col overflow-hidden rounded-[32px] bg-plum-700 lg:h-[400px] lg:flex-row">
        <div className="flex flex-col items-start gap-8 px-6 pt-12 md:px-14 lg:w-[671px] lg:pt-[76px] lg:pr-0">
          <h2 className="text-[40px] leading-[1.2] font-medium tracking-[-0.02em] text-white sm:text-[56px] lg:text-display">
            {cta.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <Button
            asChild
            variant="white"
            className="h-13 w-[237px] rounded-3xl px-4 text-base font-normal tracking-[-0.02em]"
          >
            <Link href={cta.href}>{cta.button}</Link>
          </Button>
        </div>
        <Image
          src="/images/mascot-happy.png"
          alt=""
          width={593}
          height={880}
          sizes="320px"
          className="mx-auto mt-6 -mb-20 h-[360px] w-[240px] object-contain lg:absolute lg:top-8 lg:left-[742px] lg:m-0 lg:h-[480px] lg:w-[320px]"
        />
      </div>
    </section>
  )
}
