import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { productLogo, type ProductSummary } from "@/features/marketplace/api"
import { cn } from "@/lib/utils"

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`

export function ProductCard({ app }: { app: ProductSummary }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center gap-3">
        <Image
          src={productLogo(app)}
          alt=""
          width={56}
          height={56}
          unoptimized={/^https?:\/\//.test(productLogo(app))}
          className="size-14 rounded-xl object-cover"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-semibold tracking-[-0.02em]">
            {app.name}
          </h3>
          <p className="flex items-center gap-1.5 text-sm tracking-[-0.02em] text-subtle">
            <Star className="size-4 fill-primary text-primary" aria-hidden />
            <span className="text-black">{app.rating.toFixed(1)}</span>
            <span>· Telah Terjual {app.soldCount.toLocaleString("id-ID")}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm tracking-[-0.02em] text-subtle line-through">
          {rupiah(app.startingOfficialPrice)}
        </p>
        <p className="text-2xl font-semibold tracking-[-0.02em]">
          {rupiah(app.startingPrice)}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            app.isInStock ? "Stok Tersedia" : "Stok Habis",
            ...(app.hasPreorder ? ["Pre-order"] : []),
            "Garansi",
          ].map((badge) => (
            <span
              key={badge}
              className={cn(
                "rounded-full border border-line px-3 py-2 text-sm tracking-[-0.02em]",
                badge === "Pre-order" && "font-semibold text-primary"
              )}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <Button asChild className="h-11 w-full rounded-3xl text-sm">
        <Link href={`/marketplace/${app.slug}`}>Beli Sekarang</Link>
      </Button>
    </article>
  )
}
