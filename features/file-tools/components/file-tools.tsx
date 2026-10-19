"use client"

import {
  Combine,
  Download,
  FileOutput,
  FileText,
  MousePointerClick,
  Shrink,
  Upload,
  type LucideIcon,
} from "lucide-react"
import { useId, useState } from "react"

import { Breadcrumb } from "@/components/layout/breadcrumb"
import { SectionHeading } from "@/components/shared/section-heading"
import {
  fileToolFromParam,
  fileTools,
  fileToolsHowTo,
  fileToolsUpload,
} from "@/features/file-tools/data/file-tools"
import { cn } from "@/lib/utils"

const toolIcons: Record<(typeof fileTools)[number]["icon"], LucideIcon> = {
  merge: Combine,
  kompres: Shrink,
  convert: FileOutput,
}

const stepIcons = {
  choose: MousePointerClick,
  upload: Upload,
  download: Download,
}

export function FileTools({
  initialTool,
}: {
  initialTool?: string | string[]
}) {
  const toolKey = Array.isArray(initialTool) ? initialTool[0] : initialTool
  return <FileToolsPanel key={toolKey ?? "merge"} initialTool={toolKey} />
}

function FileToolsPanel({ initialTool }: { initialTool?: string }) {
  const uploadId = useId()
  const toolKey = Array.isArray(initialTool) ? initialTool[0] : initialTool
  const [toolId, setToolId] = useState(() => fileToolFromParam(toolKey))
  const [files, setFiles] = useState<File[]>([])

  const tool = fileTools.find((item) => item.id === toolId) ?? fileTools[0]

  const fileLabel =
    files.length === 0
      ? fileToolsUpload.description
      : files.length === 1
        ? files[0].name
        : `${files.length} file dipilih`

  return (
    <>
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }, { label: "File Tools" }]}
      />
      <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-5 py-12 md:px-10 lg:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {fileTools.map((item) => {
            const Icon = toolIcons[item.icon]
            const selected = item.id === tool.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setToolId(item.id)
                  setFiles([])
                }}
                className={cn(
                  "flex flex-col items-start gap-6 rounded-2xl border bg-white p-5 text-left",
                  selected ? "border-primary" : "border-line"
                )}
              >
                <span
                  className="flex size-10 items-center justify-center rounded-lg bg-primary text-white"
                  aria-hidden
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-base font-semibold tracking-[-0.02em]">
                    {item.title}
                  </span>
                  <span className="text-sm tracking-[-0.02em] text-subtle">
                    {item.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <label
          htmlFor={uploadId}
          className="flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-surface px-6 py-10 text-center"
        >
          <span className="flex size-12 items-center justify-center rounded-xl bg-white">
            <FileText className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-base font-semibold tracking-[-0.02em]">
              {fileToolsUpload.title}
            </span>
            <span className="text-sm tracking-[-0.02em] text-subtle">
              {fileLabel}
            </span>
          </span>
        </label>
        <input
          key={tool.id}
          id={uploadId}
          type="file"
          accept={tool.accept}
          multiple={tool.multiple}
          className="sr-only"
          onChange={(event) =>
            setFiles(event.target.files ? [...event.target.files] : [])
          }
        />
      </section>

      <section className="bg-surface">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-12 px-5 py-16 md:px-10 lg:py-20">
          <SectionHeading
            title={fileToolsHowTo.title}
            description={fileToolsHowTo.description}
            align="center"
            className="max-w-[640px]"
          />
          <div className="grid w-full gap-4 md:grid-cols-3">
            {fileToolsHowTo.steps.map((step) => {
              const Icon = stepIcons[step.icon]
              return (
                <article
                  key={step.title}
                  className="flex min-h-[280px] flex-col justify-between rounded-2xl border border-line bg-white p-6"
                >
                  <span
                    className="flex size-14 items-center justify-center rounded-xl bg-plum-900 text-white"
                    aria-hidden
                  >
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-6 tracking-[-0.02em]">
                      {step.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
