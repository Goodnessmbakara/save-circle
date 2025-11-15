'use client'

import { create } from "zustand"
import { getTrustLevel } from "@/lib/trust"
import {
  CreateGroupPayload,
  GroupSummary,
  Notification,
  PaymentEntry,
  PayoutQueueEntry,
  TrustFactor,
  TrustScoreSnapshot,
  UserProfile,
  VoteApplication,
} from "@/types"
import {
  getCurrentUser,
  linkMavapay as linkMavapayApi,
  getGroups,
  getGroupById as getGroupByIdApi,
  createGroup as createGroupApi,
  joinGroup as joinGroupApi,
  toggleGroupStatus as toggleGroupStatusApi,
  getPayments,
  getVotes,
  submitVote as submitVoteApi,
  getTrustScore,
  getTrustScoreHistory,
  getTrustFactors,
  getPayoutQueue,
  getNotifications,
  markNotificationRead as markNotificationReadApi,
  markAllNotificationsRead as markAllNotificationsReadApi,
} from "@/api"

interface AppState {
  user: UserProfile | null
  groups: GroupSummary[]
  payments: PaymentEntry[]
  votes: VoteApplication[]
  trustScoreHistory: TrustScoreSnapshot[]
  trustFactors: TrustFactor[]
  payoutQueue: PayoutQueueEntry[]
  notifications: Notification[]
  selectedGroupId?: string
  loading: {
    user: boolean
    groups: boolean
    payments: boolean
    votes: boolean
    trustScore: boolean
    payoutQueue: boolean
    notifications: boolean
  }
  // Fetch functions
  fetchUser: () => Promise<void>
  fetchGroups: () => Promise<void>
  fetchPayments: () => Promise<void>
  fetchVotes: () => Promise<void>
  fetchTrustScore: () => Promise<void>
  fetchPayoutQueue: () => Promise<void>
  fetchNotifications: () => Promise<void>
  // Actions
  linkMavapay: (walletId: string) => Promise<void>
  createGroup: (payload: CreateGroupPayload) => Promise<GroupSummary>
  joinGroup: (groupId: string) => Promise<void>
  setSelectedGroup: (groupId: string) => void
  submitVote: (voteId: string, decision: "approve" | "reject") => Promise<void>
  markPaymentPaid: (paymentId: string) => void
  toggleGroupStatus: (groupId: string, status: "Open" | "Closed") => Promise<void>
  getGroupById: (groupId: string) => GroupSummary | undefined
  markNotificationRead: (notificationId: string) => Promise<void>
  markAllNotificationsRead: () => Promise<void>
  addNotification: (notification: Notification) => void
  setUser: (user: UserProfile | null) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  groups: [],
  payments: [],
  votes: [],
  trustScoreHistory: [],
  trustFactors: [],
  payoutQueue: [],
  notifications: [],
  selectedGroupId: undefined,
  loading: {
    user: false,
    groups: false,
    payments: false,
    votes: false,
    trustScore: false,
    payoutQueue: false,
    notifications: false,
  },
  // Fetch functions
  fetchUser: async () => {
    set({ loading: { ...get().loading, user: true } })
    try {
      const user = await getCurrentUser()
      set({ user, loading: { ...get().loading, user: false } })
    } catch (error) {
      console.error("Failed to fetch user:", error)
      set({ loading: { ...get().loading, user: false } })
      throw error
    }
  },
  fetchGroups: async () => {
    set({ loading: { ...get().loading, groups: true } })
    try {
      const groups = await getGroups()
      set({ groups, loading: { ...get().loading, groups: false } })
    } catch (error) {
      console.error("Failed to fetch groups:", error)
      set({ loading: { ...get().loading, groups: false } })
      throw error
    }
  },
  fetchPayments: async () => {
    set({ loading: { ...get().loading, payments: true } })
    try {
      const payments = await getPayments()
      set({ payments, loading: { ...get().loading, payments: false } })
    } catch (error) {
      console.error("Failed to fetch payments:", error)
      set({ loading: { ...get().loading, payments: false } })
      throw error
    }
  },
  fetchVotes: async () => {
    set({ loading: { ...get().loading, votes: true } })
    try {
      const votes = await getVotes()
      set({ votes, loading: { ...get().loading, votes: false } })
    } catch (error) {
      console.error("Failed to fetch votes:", error)
      set({ loading: { ...get().loading, votes: false } })
      throw error
    }
  },
  fetchTrustScore: async () => {
    set({ loading: { ...get().loading, trustScore: true } })
    try {
      const [scoreData, history, factors] = await Promise.all([
        getTrustScore(),
        getTrustScoreHistory(),
        getTrustFactors(),
      ])
      const user = get().user
      if (user) {
        set({
          user: {
            ...user,
            trustScore: scoreData.score,
            trustLevel: scoreData.level,
          },
          trustScoreHistory: history,
          trustFactors: factors,
          loading: { ...get().loading, trustScore: false },
        })
      } else {
        set({
          trustScoreHistory: history,
          trustFactors: factors,
          loading: { ...get().loading, trustScore: false },
        })
      }
    } catch (error) {
      console.error("Failed to fetch trust score:", error)
      set({ loading: { ...get().loading, trustScore: false } })
      throw error
    }
  },
  fetchPayoutQueue: async () => {
    set({ loading: { ...get().loading, payoutQueue: true } })
    try {
      const payoutQueue = await getPayoutQueue()
      set({ payoutQueue, loading: { ...get().loading, payoutQueue: false } })
    } catch (error) {
      console.error("Failed to fetch payout queue:", error)
      set({ loading: { ...get().loading, payoutQueue: false } })
      throw error
    }
  },
  fetchNotifications: async () => {
    set({ loading: { ...get().loading, notifications: true } })
    try {
      const notifications = await getNotifications()
      set({ notifications, loading: { ...get().loading, notifications: false } })
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      set({ loading: { ...get().loading, notifications: false } })
      throw error
    }
  },
  // Actions
  linkMavapay: async (walletId: string) => {
    try {
      await linkMavapayApi(walletId)
      const user = get().user
      if (user) {
        set({
          user: {
            ...user,
            mavapayLinked: true,
            mavapayWalletId: walletId,
          },
        })
      }
    } catch (error) {
      console.error("Failed to link Mavapay:", error)
      throw error
    }
  },
  createGroup: async (payload: CreateGroupPayload) => {
    try {
      const newGroup = await createGroupApi(payload)
      set((state) => ({
        groups: [newGroup, ...state.groups],
      }))
      // Refresh user to get updated group IDs
      await get().fetchUser()
      return newGroup
    } catch (error) {
      console.error("Failed to create group:", error)
      throw error
    }
  },
  joinGroup: async (groupId: string) => {
    try {
      await joinGroupApi(groupId)
      // Refresh groups and user to get updated data
      await Promise.all([get().fetchGroups(), get().fetchUser()])
    } catch (error) {
      console.error("Failed to join group:", error)
      throw error
    }
  },
  setSelectedGroup: (groupId: string) => set({ selectedGroupId: groupId }),
  submitVote: async (voteId: string, decision: "approve" | "reject") => {
    try {
      await submitVoteApi(voteId, decision)
      // Refresh votes to get updated status
      await get().fetchVotes()
    } catch (error) {
      console.error("Failed to submit vote:", error)
      throw error
    }
  },
  markPaymentPaid: (paymentId: string) => {
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.id === paymentId
          ? { ...payment, status: "Paid" as const, type: "History" as const }
          : payment,
      ),
    }))
    // Refresh trust score after payment
    get().fetchTrustScore()
  },
  toggleGroupStatus: async (groupId: string, status: "Open" | "Closed") => {
    try {
      const updatedGroup = await toggleGroupStatusApi(groupId, status)
      set((state) => ({
        groups: state.groups.map((group) =>
          group.id === groupId ? updatedGroup : group,
        ),
      }))
    } catch (error) {
      console.error("Failed to toggle group status:", error)
      throw error
    }
  },
  getGroupById: (groupId: string) => get().groups.find((group) => group.id === groupId),
  markNotificationRead: async (notificationId: string) => {
    try {
      await markNotificationReadApi(notificationId)
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n,
        ),
      }))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      throw error
    }
  },
  markAllNotificationsRead: async () => {
    try {
      await markAllNotificationsReadApi()
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }))
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
      throw error
    }
  },
  addNotification: (notification: Notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  setUser: (user: UserProfile | null) => set({ user }),
}))

export const markNotificationRead = async (notificationId: string) => {
  await useAppStore.getState().markNotificationRead(notificationId)
}

export const markAllNotificationsRead = async () => {
  await useAppStore.getState().markAllNotificationsRead()
}

