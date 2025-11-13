import { mockVotes } from "@/data/mock-data"
import { mockRequest } from "./mock-request"

export const getVotes = async () => mockRequest(mockVotes)

export const submitVote = async (voteId: string, decision: "approve" | "reject") =>
  mockRequest({
    voteId,
    decision,
    receivedAt: new Date().toISOString(),
  })

