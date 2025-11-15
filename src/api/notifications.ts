import { apiClient } from "./client"
import type { Notification } from "@/types"

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await apiClient.get<Notification[]>("/notifications")
    return response.data
  } catch (error) {
    console.error("Get notifications error:", error)
    throw error
  }
}

export const markNotificationRead = async (notificationId: string): Promise<Notification> => {
  try {
    const response = await apiClient.put<Notification>(`/notifications/${notificationId}/read`)
    return response.data
  } catch (error) {
    console.error("Mark notification read error:", error)
    throw error
  }
}

export const markAllNotificationsRead = async (): Promise<void> => {
  try {
    await apiClient.put("/notifications/read-all")
  } catch (error) {
    console.error("Mark all notifications read error:", error)
    throw error
  }
}

