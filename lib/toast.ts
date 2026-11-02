import { toast } from "sonner"
import { errorMessage, type ErrorInfo } from "./errors"

export const notify = {
  info: (message: string) => {
    toast.info(message, { duration: 4000 })
    return message
  },
  success: (message: string) => toast.success(message, { duration: 4000 }),
  error: (error: unknown, fallback?: string) => {
    const message = errorMessage(error, fallback)
    if (message)
      toast.error(message, {
        duration: 8000,
        id:
          (error as ErrorInfo | null)?.code === "UNAUTHENTICATED"
            ? "session-expired"
            : undefined,
      })
    return message
  },
}
