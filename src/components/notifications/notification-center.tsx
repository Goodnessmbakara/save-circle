"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/store/use-app-store"
import type { Notification } from "@/types"
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Users,
  MessageSquare,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "payment_reminder":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "vote_request":
      return <MessageSquare className="h-4 w-4 text-blue-600" />
    case "payout_ready":
      return <Wallet className="h-4 w-4 text-green-600" />
    case "group_update":
      return <Users className="h-4 w-4 text-purple-600" />
    case "application_status":
      return <CheckCircle2 className="h-4 w-4 text-primary" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const router = useRouter()
  const markNotificationRead = useAppStore((state) => state.markNotificationRead)

  const handleClick = () => {
    if (!notification.read) {
      markNotificationRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <div
      className={`flex gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
        !notification.read ? "bg-primary/5 border-primary/20" : ""
      }`}
      onClick={handleClick}
    >
      <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{notification.title}</p>
          {!notification.read && (
            <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}

export const NotificationCenter = () => {
  const notifications = useAppStore((state) => state.notifications)
  const markAllNotificationsRead = useAppStore((state) => state.markAllNotificationsRead)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    markAllNotificationsRead()
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-sm font-medium">No notifications</p>
        <p className="text-xs text-muted-foreground">
          You'll see updates about payments, votes, and payouts here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 py-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        </div>
      )}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}

