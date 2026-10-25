import { ExternalLink } from "lucide-react"

import type { CreatorExample } from "@/lib/api/endpoints/content"

const PLATFORM: Record<CreatorExample["platform"], string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  x_threads: "X / Threads",
}

function ExampleTable({
  title,
  items,
}: {
  title: string
  items: CreatorExample[]
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <h3 className="text-sm font-semibold tracking-[-0.02em]">{title}</h3>
      <div className="overflow-x-auto rounded-[12px] border border-line">
        <table className="w-full text-left text-sm tracking-[-0.02em]">
          <thead className="bg-surface text-subtle">
            <tr>
              <th className="px-4 py-2.5 font-medium">Platform</th>
              <th className="px-4 py-2.5 font-medium">Konten</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3 whitespace-nowrap">
                  {PLATFORM[item.platform]}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-1.5 break-all text-primary hover:underline"
                  >
                    {item.caption || item.url}
                    <ExternalLink
                      className="mt-0.5 size-3.5 shrink-0"
                      aria-hidden
                    />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Examples managed in admin; hidden until at least one is published. */
export function CreatorExamples({
  video,
  post,
}: {
  video: CreatorExample[]
  post: CreatorExample[]
}) {
  if (!video.length && !post.length) return null
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line p-5 md:p-6">
      <h2 className="text-base font-semibold tracking-[-0.02em]">
        Contoh Konten
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {video.length > 0 && (
          <ExampleTable title="Video TikTok & Instagram" items={video} />
        )}
        {post.length > 0 && (
          <ExampleTable title="Post X / Threads" items={post} />
        )}
      </div>
    </section>
  )
}
