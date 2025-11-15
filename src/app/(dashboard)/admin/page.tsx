"use client"

import { useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAppStore } from "@/store/use-app-store"
import { Skeleton } from "@/components/ui/skeleton"

const AdminPage = () => {
  const {
    user,
    groups,
    votes,
    payoutQueue,
    toggleGroupStatus,
    fetchUser,
    fetchGroups,
    fetchVotes,
    fetchPayoutQueue,
    loading,
  } = useAppStore()
  const isAdmin = (user?.adminGroupIds.length ?? 0) > 0

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchUser(),
          fetchGroups(),
          fetchVotes(),
          fetchPayoutQueue(),
        ])
      } catch (error) {
        console.error("Failed to load admin data:", error)
      }
    }
    loadData()
  }, [fetchUser, fetchGroups, fetchVotes, fetchPayoutQueue])

  if (loading.user || loading.groups || loading.votes || loading.payoutQueue) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <Alert>
        <AlertTitle>Admin access required</AlertTitle>
        <AlertDescription>Only group admins can access this panel.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin panel</h1>
        <p className="text-muted-foreground">
          Open or close groups, review onboarding votes, and track payout queue ordering.
        </p>
      </div>
      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="applications">Member applications</TabsTrigger>
          <TabsTrigger value="payout">Payout queue</TabsTrigger>
        </TabsList>
        <TabsContent value="groups" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Groups management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>{group.name}</TableCell>
                      <TableCell>
                        {group.membersCount}/{group.memberCap}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={group.status}
                          onValueChange={async (value: "Open" | "Closed") => {
                            try {
                              await toggleGroupStatus(group.id, value)
                            } catch (error) {
                              console.error("Failed to toggle group status:", error)
                            }
                          }}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="applications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending join requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Approvals</TableHead>
                    <TableHead>Deadline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {votes.map((vote) => {
                    const percent = Math.round((vote.approvals / vote.totalVoters) * 100)
                    return (
                      <TableRow key={vote.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{vote.applicantName}</p>
                            <p className="text-xs text-muted-foreground">{vote.applicantRole}</p>
                          </div>
                        </TableCell>
                        <TableCell>{vote.groupId}</TableCell>
                        <TableCell>
                          <Badge variant={percent >= vote.requiredPercentage ? "secondary" : "outline"}>
                            {percent}% / {vote.requiredPercentage}%
                          </Badge>
                        </TableCell>
                        <TableCell>{vote.deadline}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payout" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout queue</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Trust</TableHead>
                    <TableHead>Payout date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutQueue.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.groupName}</TableCell>
                      <TableCell>{entry.order}</TableCell>
                      <TableCell>{entry.memberName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.trustScore}</Badge>
                      </TableCell>
                      <TableCell>{entry.payoutDate}</TableCell>
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

export default AdminPage

