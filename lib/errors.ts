export class UserFacingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UserFacingError"
  }
}

export interface ErrorInfo {
  code?: string
  status?: number
  message?: string
  details?: Record<string, unknown>
}

export class RequestError extends UserFacingError {
  readonly code?: string
  readonly status?: number
  readonly details?: Record<string, unknown>
  constructor(info: ErrorInfo, uncertainMessage?: string) {
    super(
      uncertainMessage &&
        info.code !== "SERVICE_UNAVAILABLE" &&
        (info.status === 0 || (info.status ?? 0) >= 500)
        ? uncertainMessage
        : errorMessage(info)
    )
    this.code = info.code
    this.status = info.status
    this.details = info.details
  }
}

export function isAborted(error: unknown): boolean {
  return (
    !!error &&
    typeof error === "object" &&
    (("name" in error && error.name === "AbortError") ||
      ("code" in error && error.code === "ABORTED"))
  )
}

export function errorMessage(error: unknown, fallback?: string): string {
  if (isAborted(error)) return ""
  if (error instanceof UserFacingError) return error.message
  const info = error && typeof error === "object" ? (error as ErrorInfo) : {}
  if (info.code === "ABORTED") return ""
  if (info.code === "INVALID_CREDENTIALS")
    return "Email atau password belum cocok."
  if (info.code === "UNAUTHENTICATED")
    return "Sesi masukmu berakhir. Silakan masuk lagi."
  if (info.code === "FORBIDDEN")
    return "Akunmu tidak memiliki izin untuk melakukan tindakan ini."
  if (info.code === "SERVICE_UNAVAILABLE")
    return "Cek Turnitin sedang dalam pemeliharaan. Silakan coba lagi nanti."
  if (info.code === "RATE_LIMITED" || info.status === 429)
    return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi."
  if (info.code === "NETWORK_ERROR" || info.status === 0)
    return (
      fallback ??
      "Tidak dapat terhubung. Periksa koneksi internet lalu coba lagi."
    )
  if ((info.status ?? 0) >= 500)
    return (
      fallback ??
      "Layanan sedang mengalami gangguan. Silakan coba lagi sebentar."
    )
  if (info.code === "VALIDATION_ERROR")
    return "Ada isian yang perlu diperbaiki. Periksa kembali formulirmu."
  if (
    [
      "BUSINESS_RULE",
      "NOT_FOUND",
      "CONFLICT",
      "INVALID_STATE",
      "FILE_TOO_LARGE",
      "FILE_INVALID",
      // Names the service an admin switched off.
      "FEATURE_DISABLED",
    ].includes(info.code ?? "") &&
    info.message
  )
    return info.message
  return fallback ?? "Tindakan belum berhasil. Silakan coba lagi."
}
