import { apiClient } from "./client"
import type { PayoutRequest, PayoutQueueEntry } from "@/types"

export const getPayoutQueue = async (groupId?: string): Promise<PayoutQueueEntry[]> => {
  try {
    const url = groupId ? `/payouts/queue?groupId=${groupId}` : "/payouts/queue"
    const response = await apiClient.get<PayoutQueueEntry[]>(url)
    return response.data
  } catch (error) {
    console.error("Get payout queue error:", error)
    throw error
  }
}

export const requestPayout = async (
  groupId: string,
  amountBtc: number,
): Promise<PayoutRequest> => {
  try {
    const response = await apiClient.post<PayoutRequest>("/payouts/request", {
      groupId,
      amountBtc,
    })
    return response.data
  } catch (error) {
    console.error("Request payout error:", error)
    throw error
  }
}

export const getPayoutRequests = async (): Promise<PayoutRequest[]> => {
  try {
    const response = await apiClient.get<PayoutRequest[]>("/payouts")
    return response.data
  } catch (error) {
    console.error("Get payout requests error:", error)
    throw error
  }
}

export const getPayoutStatus = async (payoutId: string): Promise<PayoutRequest> => {
  try {
    const response = await apiClient.get<PayoutRequest>(`/payouts/${payoutId}/status`)
    return response.data
  } catch (error) {
    console.error("Get payout status error:", error)
    throw error
  }
}

