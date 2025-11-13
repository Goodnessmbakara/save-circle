"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/store/use-app-store"

const GroupsPage = () => {
  const { groups } = useAppStore()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [minContribution, setMinContribution] = useState("")

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const statusMatch = statusFilter === "all" || group.status === statusFilter
      const amountMatch = minContribution
        ? group.contributionAmountBtc >= Number(minContribution)
        : true
      return statusMatch && amountMatch
    })
  }, [groups, statusFilter, minContribution])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Savings groups</h1>
          <p className="text-muted-foreground">Browse open ROSCAs or create your own Lightning-powered circle.</p>
        </div>
        <Button asChild>
          <Link href="/groups/create">Create group</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Min contribution (BTC)</p>
            <Input
              type="number"
              min="0"
              step="0.0001"
              value={minContribution}
              onChange={(event) => setMinContribution(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick links</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/groups/create">Launch new group</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">Admin panel</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available groups</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-xs text-muted-foreground">{group.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{group.contributionAmountBtc} BTC</TableCell>
                  <TableCell>{group.frequency}</TableCell>
                  <TableCell>{group.durationWeeks} weeks</TableCell>
                  <TableCell>
                    {group.membersCount}/{group.memberCap}
                  </TableCell>
                  <TableCell>
                    <Badge variant={group.status === "Open" ? "secondary" : "outline"}>{group.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/groups/${group.id}`}>View details</Link>
                      </Button>
                      {group.status === "Open" && (
                        <Button asChild size="sm">
                          <Link href={`/groups/${group.id}`}>Request to join</Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default GroupsPage

