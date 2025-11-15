import { apiClient } from "./client"
import type { VoteApplication } from "@/types"

interface SubmitVoteResponse {
  voteId: string
  decision: "approve" | "reject"
  receivedAt: string
}

export const getVotes = async (): Promise<VoteApplication[]> => {
  try {
    const response = await apiClient.get<VoteApplication[]>("/votes")
    return response.data
  } catch (error) {
    console.error("Get votes error:", error)
    throw error
  }
}

export const submitVote = async (
  voteId: string,
  decision: "approve" | "reject",
): Promise<SubmitVoteResponse> => {
  try {
    const response = await apiClient.post<SubmitVoteResponse>(`/votes/${voteId}`, { decision })
    return response.data
  } catch (error) {
    console.error("Submit vote error:", error)
    throw error
  }
}

