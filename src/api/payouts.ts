import { mockRequest } from "./mock-request"
import type { PayoutRequest, PayoutQueueEntry } from "@/types"

const mockPayoutRequests: PayoutRequest[] = [
  {
    id: "payout-1",
    groupId: "grp-1",
    groupName: "Lightning Maendeleo Circle",
    amountBtc: 0.02,
    amountNaira: 1200000,
    status: "pending",
    requestedAt: new Date().toISOString(),
    feeBtc: 0.0002,
    feeNaira: 12000,
  },
]

export const getPayoutQueue = async (groupId?: string): Promise<PayoutQueueEntry[]> => {
  const mockQueue: PayoutQueueEntry[] = [
    {
      id: "queue-1",
      groupId: "grp-1",
      groupName: "Lightning Maendeleo Circle",
      order: 1,
      memberName: "Amelia Njoroge",
      trustScore: 815,
      payoutDate: "2025-02-25",
    },
  ]
  return mockRequest(groupId ? mockQueue.filter((q) => q.groupId === groupId) : mockQueue)
}

export const requestPayout = async (
  groupId: string,
  amountBtc: number,
): Promise<PayoutRequest> => {
  return mockRequest({
    ...mockPayoutRequests[0],
    id: `payout-${Date.now()}`,
    groupId,
    amountBtc,
    status: "processing",
    requestedAt: new Date().toISOString(),
  })
}

export const getPayoutRequests = async (): Promise<PayoutRequest[]> => {
  return mockRequest(mockPayoutRequests)
}

export const getPayoutStatus = async (payoutId: string): Promise<PayoutRequest> => {
  const payout = mockPayoutRequests.find((p) => p.id === payoutId)
  return mockRequest(
    payout || {
      ...mockPayoutRequests[0],
      id: payoutId,
      status: "completed",
      completedAt: new Date().toISOString(),
    },
  )
}

