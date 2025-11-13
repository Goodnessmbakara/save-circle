import { mockPayoutQueue, mockTrustScoreHistory, mockUser } from "@/data/mock-data"
import { mockRequest } from "./mock-request"

export const getTrustScore = async () =>
  mockRequest({
    score: mockUser.trustScore,
    level: mockUser.trustLevel,
  })

export const getTrustScoreHistory = async () =>
  mockRequest(mockTrustScoreHistory)

export const getPayoutQueue = async () => mockRequest(mockPayoutQueue)

