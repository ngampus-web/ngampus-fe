export type WarrantyClaimStatus = "dalam-proses" | "selesai" | "ditolak"

export type WarrantyClaim = {
  id: string
  orderId: string
  product: string
  reason: string
  status: WarrantyClaimStatus
  submittedAt: string
}
