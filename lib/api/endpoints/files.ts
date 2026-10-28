/**
 * Uploads — docs/API-CONTRACT.md §3: ask for a presigned URL, PUT the file
 * straight to storage, then let the API verify it.
 */

import { apiClient } from "../client"
import type {
  ApiResponse,
  FileInfo,
  FilePurpose,
  UploadTicket,
} from "@/types/api"

export const filesApi = {
  async upload(
    file: File,
    purpose: FilePurpose,
    /** Some browsers leave `file.type` empty (e.g. DOCX on Windows). */
    mimeType = file.type
  ): Promise<ApiResponse<FileInfo>> {
    const ticket = await apiClient.post<UploadTicket>("/uploads", {
      purpose,
      fileName: file.name,
      mimeType,
      sizeBytes: file.size,
    })
    if (!ticket.success) return ticket
    try {
      const put = await fetch(ticket.data.uploadUrl, {
        method: "PUT",
        headers: ticket.data.headers,
        body: file,
      })
      if (!put.ok) throw new Error(String(put.status))
    } catch {
      return {
        success: false,
        error: {
          message: "Gagal mengunggah file. Periksa koneksi lalu coba lagi.",
          code: "NETWORK_ERROR",
          status: 0,
        },
      }
    }
    return apiClient.post<FileInfo>(`/uploads/${ticket.data.fileId}/complete`)
  },
}
