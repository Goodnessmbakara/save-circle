export type TrustLevel = "Excellent" | "Good" | "Fair" | "Poor" | "Very Poor"

export interface TrustScoreSnapshot {
  date: string
  score: number
}

export interface TrustFactor {
  id: string
  label: string
  weight: number
  score: number
  description: string
  suggestion: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatarInitials: string
  trustScore: number
  trustLevel: TrustLevel
  totalGroups: number
  nextContribution: {
    date: string
    amountBtc: number
  }
  mavapayLinked: boolean
  mavapayWalletId?: string
  adminGroupIds: string[]
  memberGroupIds: string[]
}

export interface GroupMember {
  id: string
  name: string
  role: "member" | "admin"
  trustScore: number
  contributionStatus: "On-time" | "Late" | "Defaulted"
  lastContribution: string
}

export interface GroupCycle {
  cycleNumber: number
  totalCycles: number
  status: "Active" | "Completed" | "Upcoming"
}

export interface GroupSummary {
  id: string
  name: string
  description: string
  contributionAmountBtc: number
  frequency: "Weekly" | "Monthly"
  durationWeeks: number
  membersCount: number
  memberCap: number
  status: "Open" | "Closed"
  nextContributionDate: string
  nextPayoutDate: string
  cycleStatus: string
  rules: string[]
  members: GroupMember[]
  hasPendingVote: boolean
}

export interface PaymentEntry {
  id: string
  groupId: string
  groupName: string
  dueDate: string
  amountBtc: number
  status: "Pending" | "Paid" | "Late"
  invoice: string
  type: "Upcoming" | "History"
}

export interface VoteApplication {
  id: string
  groupId: string
  applicantName: string
  applicantRole: string
  trustScore: number
  summary: string
  approvals: number
  rejections: number
  requiredPercentage: number
  totalVoters: number
  deadline: string
  status: "pending" | "approved" | "rejected"
}

export interface PayoutQueueEntry {
  id: string
  groupId: string
  groupName: string
  order: number
  memberName: string
  trustScore: number
  payoutDate: string
}

export interface CreateGroupPayload {
  name: string
  description: string
  contributionAmountBtc: number
  frequency: "Weekly" | "Monthly"
  durationWeeks: number
  memberCap: number
}
