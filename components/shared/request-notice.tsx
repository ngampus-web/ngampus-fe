import { Button } from "@/components/ui/button"

export function RequestNotice({
  message,
  onRetry,
  stale = false,
  pending = false,
}: {
  message: string
  onRetry?: () => void
  stale?: boolean
  pending?: boolean
}) {
  return (
    <div
      role="alert"
      className="my-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm"
    >
      <p className="font-medium">
        {stale
          ? "Data terakhir tetap ditampilkan, tetapi belum bisa diperbarui."
          : "Data belum bisa dimuat."}
      </p>
      <p className="mt-1 text-subtle">{message}</p>
      {onRetry && (
        <Button
          className="mt-3"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={onRetry}
        >
          {pending ? "Memuat…" : "Coba lagi"}
        </Button>
      )}
    </div>
  )
}
