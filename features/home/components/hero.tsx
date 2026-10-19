import Image from "next/image"

import { hero } from "@/features/home/data/home"

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col-reverse items-center gap-10 px-5 py-12 md:px-10 lg:min-h-[564px] lg:flex-row lg:gap-15 lg:px-20 lg:py-0">
      <div className="flex w-full flex-1 flex-col gap-3 text-black">
        <h1 className="text-[40px] leading-[1.2] font-medium tracking-[-0.02em] sm:text-[56px] lg:text-display">
          {hero.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="max-w-[514px] leading-5 tracking-[-0.02em]">
          {hero.description}
        </p>
      </div>

      <Image
        src="/images/mascot-hero.png"
        alt="Maskot Ngampus"
        width={660}
        height={861}
        priority
        sizes="320px"
        className="h-[280px] w-auto shrink-0 object-contain sm:h-[340px] lg:h-[420px]"
      />
    </section>
  )
}
