"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/store/use-app-store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const GroupDetailsPage = () => {
  const params = useParams<{ id: string }>()
  const { getGroupById, joinGroup, user, payments, votes } = useAppStore()
  const group = getGroupById(params.id)

  if (!group) {
    return notFound()
  }

  const isMember = user.memberGroupIds.includes(group.id)
  const isAdmin = user.adminGroupIds.includes(group.id)
  const groupVotes = votes.filter((vote) => vote.groupId === group.id && vote.status === "pending")
  const groupPayments = payments.filter((payment) => payment.groupId === group.id)
  const nextPayout = group.nextPayoutDate

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-muted-foreground">Group</p>
          <h1 className="text-3xl font-semibold">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isMember && (
            <Button onClick={() => joinGroup(group.id)}>Request to join</Button>
          )}
          {isAdmin && (
            <Button variant="outline">Manage group</Button>
          )}
          {groupVotes.length > 0 && (
            <Button asChild variant="secondary">
              <Link href={`/groups/${group.id}/voting`}>Open voting</Link>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-4 px-6 py-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Contribution</p>
            <p className="text-lg font-semibold">{group.contributionAmountBtc} BTC</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Frequency</p>
            <p className="text-lg font-semibold">{group.frequency}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Next payout</p>
            <p className="text-lg font-semibold">{nextPayout}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant={group.status === "Open" ? "secondary" : "outline"}>{group.status}</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          {groupVotes.length > 0 && <TabsTrigger value="voting">Voting</TabsTrigger>}
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold">{group.durationWeeks} weeks</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="text-lg font-semibold">
                    {group.membersCount}/{group.memberCap}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Rules</p>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {group.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Member roster</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Trust score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.trustScore}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.contributionStatus === "On-time"
                              ? "secondary"
                              : member.contributionStatus === "Late"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {member.contributionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.lastContribution}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        {groupVotes.length > 0 && (
          <TabsContent value="voting">
            <Card>
              <CardHeader>
                <CardTitle>Pending applications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupVotes.map((vote) => {
                  const progress = Math.round((vote.approvals / vote.totalVoters) * 100)
                  return (
                    <div key={vote.id} className="space-y-3 rounded-xl border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold">{vote.applicantName}</p>
                          <p className="text-sm text-muted-foreground">{vote.applicantRole}</p>
                        </div>
                        <Badge>{vote.trustScore} trust score</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{vote.summary}</p>
                      <div className="text-xs text-muted-foreground">
                        Deadline: {vote.deadline} · Requires {vote.requiredPercentage}% approval
                      </div>
                      <Alert>
                        <AlertTitle>Status</AlertTitle>
                        <AlertDescription>
                          {vote.approvals} approvals · {vote.rejections} rejections ({progress}% achieved)
                        </AlertDescription>
                      </Alert>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>{payment.amountBtc} BTC</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "Paid" ? "secondary" : "outline"}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{payment.invoice.slice(0, 12)}...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default GroupDetailsPage
