import { apiClient } from "./client"
import type { TrustScoreSnapshot, TrustFactor, TrustLevel } from "@/types"

interface TrustScoreResponse {
  score: number
  level: TrustLevel
}

export const getTrustScore = async (): Promise<TrustScoreResponse> => {
  try {
    const response = await apiClient.get<TrustScoreResponse>("/trust-score")
    return response.data
  } catch (error) {
    console.error("Get trust score error:", error)
    throw error
  }
}

export const getTrustScoreHistory = async (): Promise<TrustScoreSnapshot[]> => {
  try {
    const response = await apiClient.get<TrustScoreSnapshot[]>("/trust-score/history")
    return response.data
  } catch (error) {
    console.error("Get trust score history error:", error)
    throw error
  }
}

export const getTrustFactors = async (): Promise<TrustFactor[]> => {
  try {
    const response = await apiClient.get<TrustFactor[]>("/trust-score/factors")
    return response.data
  } catch (error) {
    console.error("Get trust factors error:", error)
    throw error
  }
}

