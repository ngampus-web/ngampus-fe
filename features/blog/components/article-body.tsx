/**
 * Renders API `contentHtml` (sanitized server-side with an allowlist).
 * Styles match the previous block renderer.
 */
export function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className="flex flex-col gap-5 text-base leading-7 tracking-[-0.02em] text-black [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:text-black/70 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:leading-snug [&_h2]:font-medium [&_h3]:mt-3 [&_h3]:text-xl [&_h3]:leading-snug [&_h3]:font-medium [&_img]:h-auto [&_img]:w-full [&_img]:rounded-2xl [&_li>p]:inline [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-6 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
