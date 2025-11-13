import { mockGroups } from "@/data/mock-data"
import { mockRequest } from "./mock-request"
import { CreateGroupPayload, GroupSummary } from "@/types"

export const getGroups = async () => mockRequest(mockGroups)

export const getGroupById = async (groupId: string) =>
  mockRequest(mockGroups.find((group) => group.id === groupId))

export const createGroup = async (
  payload: CreateGroupPayload,
): Promise<GroupSummary> =>
  mockRequest({
    ...payload,
    id: `grp-${Date.now()}`,
    description: payload.description,
    members: [],
    membersCount: 1,
    memberCap: payload.memberCap,
    status: "Open",
    durationWeeks: payload.durationWeeks,
    cycleStatus: "Cycle 1 starting",
    nextContributionDate: new Date().toISOString().slice(0, 10),
    nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    rules: [],
    hasPendingVote: false,
    contributionAmountBtc: payload.contributionAmountBtc,
    frequency: payload.frequency,
  })

export const joinGroup = async (groupId: string) =>
  mockRequest({
    groupId,
    status: "requested",
    message: "Join request submitted for admin review.",
  })

