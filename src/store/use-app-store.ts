'use client'

import { create } from "zustand"
import { getTrustLevel } from "@/lib/trust"
import {
  mockGroups,
  mockPayments,
  mockPayoutQueue,
  mockTrustFactors,
  mockTrustScoreHistory,
  mockUser,
  mockVotes,
} from "@/data/mock-data"
import {
  CreateGroupPayload,
  GroupMember,
  GroupSummary,
  PaymentEntry,
  PayoutQueueEntry,
  TrustFactor,
  TrustScoreSnapshot,
  UserProfile,
  VoteApplication,
} from "@/types"

interface AppState {
  user: UserProfile
  groups: GroupSummary[]
  payments: PaymentEntry[]
  votes: VoteApplication[]
  trustScoreHistory: TrustScoreSnapshot[]
  trustFactors: TrustFactor[]
  payoutQueue: PayoutQueueEntry[]
  selectedGroupId?: string
  linkMavapay: (walletId: string) => void
  createGroup: (payload: CreateGroupPayload) => GroupSummary
  joinGroup: (groupId: string) => void
  setSelectedGroup: (groupId: string) => void
  submitVote: (voteId: string, decision: "approve" | "reject") => void
  markPaymentPaid: (paymentId: string) => void
  toggleGroupStatus: (groupId: string, status: "Open" | "Closed") => void
  getGroupById: (groupId: string) => GroupSummary | undefined
}

const buildMemberRecord = (user: UserProfile): GroupMember => ({
  id: user.id,
  name: user.name,
  role: "member",
  trustScore: user.trustScore,
  contributionStatus: "On-time",
  lastContribution: new Date().toISOString().slice(0, 10),
})

export const useAppStore = create<AppState>((set, get) => ({
  user: mockUser,
  groups: mockGroups,
  payments: mockPayments,
  votes: mockVotes,
  trustScoreHistory: mockTrustScoreHistory,
  trustFactors: mockTrustFactors,
  payoutQueue: mockPayoutQueue,
  selectedGroupId: mockGroups[0]?.id,
  linkMavapay: (walletId) =>
    set((state) => ({
      user: {
        ...state.user,
        mavapayLinked: true,
        mavapayWalletId: walletId,
      },
    })),
  createGroup: (payload) => {
    const newGroup: GroupSummary = {
      id: `grp-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      contributionAmountBtc: payload.contributionAmountBtc,
      frequency: payload.frequency,
      durationWeeks: payload.durationWeeks,
      membersCount: 1,
      memberCap: payload.memberCap,
      status: "Open",
      nextContributionDate: new Date().toISOString().slice(0, 10),
      nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      cycleStatus: "Cycle 1 starting",
      rules: [
        "Lightning contributions must be settled before the deadline.",
        "Trust-score updates occur right after payouts.",
      ],
      members: [buildMemberRecord(get().user)],
      hasPendingVote: false,
    }

    set((state) => ({
      groups: [newGroup, ...state.groups],
      user: {
        ...state.user,
        adminGroupIds: [...state.user.adminGroupIds, newGroup.id],
        memberGroupIds: [...state.user.memberGroupIds, newGroup.id],
        totalGroups: state.user.totalGroups + 1,
      },
    }))

    return newGroup
  },
  joinGroup: (groupId) =>
    set((state) => {
      if (state.user.memberGroupIds.includes(groupId)) {
        return state
      }

      const updatedGroups = state.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: [...group.members, buildMemberRecord(state.user)],
              membersCount: group.membersCount + 1,
            }
          : group,
      )

      return {
        groups: updatedGroups,
        user: {
          ...state.user,
          memberGroupIds: [...state.user.memberGroupIds, groupId],
        },
      }
    }),
  setSelectedGroup: (groupId) => set({ selectedGroupId: groupId }),
  submitVote: (voteId, decision) =>
    set((state) => ({
      votes: state.votes.map((vote) =>
        vote.id === voteId
          ? {
              ...vote,
              approvals:
                decision === "approve" ? vote.approvals + 1 : vote.approvals,
              rejections:
                decision === "reject" ? vote.rejections + 1 : vote.rejections,
              status:
                (decision === "approve"
                  ? (vote.approvals + 1) * 100
                  : vote.approvals * 100) /
                  vote.totalVoters >=
                vote.requiredPercentage
                  ? "approved"
                  : vote.status,
            }
          : vote,
      ),
    })),
  markPaymentPaid: (paymentId) =>
    set((state) => {
      const updatedPayments = state.payments.map((payment) =>
        payment.id === paymentId
          ? { ...payment, status: "Paid", type: "History" }
          : payment,
      )

      const newScore = Math.min(state.user.trustScore + 5, 1000)
      const updatedUser = {
        ...state.user,
        trustScore: newScore,
        trustLevel: getTrustLevel(newScore),
      }

      return {
        payments: updatedPayments,
        user: updatedUser,
        trustScoreHistory: [
          ...state.trustScoreHistory,
          {
            date: new Date().toISOString().slice(0, 10),
            score: newScore,
          },
        ],
      }
    }),
  toggleGroupStatus: (groupId, status) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId ? { ...group, status } : group,
      ),
    })),
  getGroupById: (groupId) => get().groups.find((group) => group.id === groupId),
}))

