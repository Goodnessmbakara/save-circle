import { apiClient } from "./client"
import { CreateGroupPayload, GroupSummary } from "@/types"

interface JoinGroupResponse {
  groupId: string
  status: string
  message: string
}

export const getGroups = async (): Promise<GroupSummary[]> => {
  try {
    const response = await apiClient.get<GroupSummary[]>("/groups")
    return response.data
  } catch (error) {
    console.error("Get groups error:", error)
    throw error
  }
}

export const getGroupById = async (groupId: string): Promise<GroupSummary | null> => {
  try {
    const response = await apiClient.get<GroupSummary>(`/groups/${groupId}`)
    return response.data
  } catch (error) {
    console.error("Get group by ID error:", error)
    if ((error as any).response?.status === 404) {
      return null
    }
    throw error
  }
}

export const createGroup = async (payload: CreateGroupPayload): Promise<GroupSummary> => {
  try {
    const response = await apiClient.post<GroupSummary>("/groups", payload)
    return response.data
  } catch (error) {
    console.error("Create group error:", error)
    throw error
  }
}

export const joinGroup = async (groupId: string): Promise<JoinGroupResponse> => {
  try {
    const response = await apiClient.post<JoinGroupResponse>(`/groups/${groupId}/join`)
    return response.data
  } catch (error) {
    console.error("Join group error:", error)
    throw error
  }
}

export const toggleGroupStatus = async (
  groupId: string,
  status: "Open" | "Closed",
): Promise<GroupSummary> => {
  try {
    const response = await apiClient.put<GroupSummary>(`/groups/${groupId}/status`, { status })
    return response.data
  } catch (error) {
    console.error("Toggle group status error:", error)
    throw error
  }
}

