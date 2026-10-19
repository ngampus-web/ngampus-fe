import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Checkout } from "./checkout"
import {
  getPlagiarismService,
  plagiarismServices,
} from "@/features/plagiarism/data/plagiarism"

export function generateStaticParams() {
  return plagiarismServices.map((service) => ({ slug: service.slug }))
}

type PlagiarismServicePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PlagiarismServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getPlagiarismService(slug)
  if (!service) return { title: "Layanan tidak ditemukan" }
  return {
    title: service.title,
    description: service.description,
  }
}

export default async function PlagiarismServicePage({
  params,
}: PlagiarismServicePageProps) {
  const { slug } = await params
  const service = getPlagiarismService(slug)
  if (!service) notFound()

  return <Checkout service={service} />
}
