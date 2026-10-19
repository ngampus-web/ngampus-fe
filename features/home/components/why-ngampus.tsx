import {
  BadgeCheck,
  Clock,
  Layers,
  Lock,
  Timer,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { SectionHeading } from "@/components/shared/section-heading"
import { Card } from "@/components/ui/card"
import { whyNgampus } from "@/features/home/data/home"

const benefitIcons: Record<string, LucideIcon> = {
  "Harga Bersahabat": Wallet,
  "Proses Cepat": Timer,
  "Terpercaya & Bergaransi": BadgeCheck,
  "Akses 24 Jam": Clock,
  "Privasi Terjaga": Lock,
  "Lengkap dalam satu tempat": Layers,
}

export function WhyNgampus() {
  return (
    <section className="bg-plum-700 text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-5 py-16 md:px-10 lg:gap-[85px] lg:p-20">
        <SectionHeading title={whyNgampus.title} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyNgampus.items.map((item) => {
            const Icon = benefitIcons[item.title]
            return (
              <Card
                key={item.title}
                className="min-h-[240px] justify-between gap-10 rounded-2xl bg-white p-6 text-base text-black ring-0 lg:min-h-[280px]"
              >
                <div
                  className="flex size-15 shrink-0 items-center justify-center rounded-xl bg-plum-700"
                  aria-hidden
                >
                  <Icon className="size-7 text-white" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[22px] font-semibold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="tracking-[-0.02em]">{item.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
