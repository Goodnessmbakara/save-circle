import { apiClient } from "./client"
import type { UserProfile } from "@/types"

interface UpdateProfilePayload {
  name?: string
  email?: string
  phone?: string
}

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get<UserProfile>("/profile")
    return response.data
  } catch (error) {
    console.error("Get profile error:", error)
    throw error
  }
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  try {
    const response = await apiClient.put<UserProfile>("/profile", payload)
    return response.data
  } catch (error) {
    console.error("Update profile error:", error)
    throw error
  }
}

