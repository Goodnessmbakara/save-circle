import { apiClient } from "./client"
import type { PaymentEntry } from "@/types"

interface InvoiceResponse {
  paymentId: string
  invoice: string
  status: string
}

interface VerifyPaymentResponse {
  paymentId: string
  status: string
  confirmedAt?: string
}

export const getPayments = async (): Promise<PaymentEntry[]> => {
  try {
    const response = await apiClient.get<PaymentEntry[]>("/payments")
    return response.data
  } catch (error) {
    console.error("Get payments error:", error)
    throw error
  }
}

export const createPaymentInvoice = async (paymentId: string): Promise<InvoiceResponse> => {
  try {
    const response = await apiClient.post<InvoiceResponse>("/payments/invoice", { paymentId })
    return response.data
  } catch (error) {
    console.error("Create payment invoice error:", error)
    throw error
  }
}

export const verifyPayment = async (paymentId: string): Promise<VerifyPaymentResponse> => {
  try {
    const response = await apiClient.post<VerifyPaymentResponse>("/payments/verify", {
      paymentId,
    })
    return response.data
  } catch (error) {
    console.error("Verify payment error:", error)
    throw error
  }
}

