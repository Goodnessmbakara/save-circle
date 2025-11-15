"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/store/use-app-store"
import { Wallet, User, Shield, Users, Edit, Save, X } from "lucide-react"
import { getTrustProgress } from "@/lib/trust"
import { Progress } from "@/components/ui/progress"
import { updateProfile } from "@/api/profile"
import { Skeleton } from "@/components/ui/skeleton"

const ProfilePage = () => {
  const { user, groups, linkMavapay, fetchUser, fetchGroups, loading } = useAppStore()

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchUser(), fetchGroups()])
      } catch (error) {
        console.error("Failed to load profile data:", error)
      }
    }
    loadData()
  }, [fetchUser, fetchGroups])

  if (loading.user || loading.groups) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>
  }

  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  })
  const [walletId, setWalletId] = useState(user.mavapayWalletId || "")
  const [showWalletDialog, setShowWalletDialog] = useState(false)

  const userGroups = groups.filter(
    (group) =>
      user.memberGroupIds.includes(group.id) || user.adminGroupIds.includes(group.id),
  )
  const adminGroups = groups.filter((group) => user.adminGroupIds.includes(group.id))
  const memberGroups = groups.filter(
    (group) => user.memberGroupIds.includes(group.id) && !user.adminGroupIds.includes(group.id),
  )

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editedUser)
      await fetchUser()
      setIsEditing(false)
    } catch (error: any) {
      console.error("Failed to update profile:", error)
      alert(error.response?.data?.message || "Failed to update profile. Please try again.")
    }
  }

  const handleCancelEdit = () => {
    setEditedUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
    })
    setIsEditing(false)
  }

  const handleLinkWallet = async () => {
    if (walletId.trim()) {
      try {
        await linkMavapay(walletId.trim())
        await fetchUser()
        setShowWalletDialog(false)
        setWalletId("")
      } catch (error) {
        console.error("Failed to link wallet:", error)
        alert("Failed to link wallet. Please try again.")
      }
    }
  }

  const handleUnlinkWallet = async () => {
    try {
      await linkMavapay("")
      await fetchUser()
    } catch (error) {
      console.error("Failed to unlink wallet:", error)
      alert("Failed to unlink wallet. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      Save changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-xl">
                        {user.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Trust Score
              </CardTitle>
              <CardDescription>Your financial reputation on the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{user.trustScore}</p>
                  <p className="text-sm text-muted-foreground">{user.trustLevel}</p>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {user.trustLevel}
                </Badge>
              </div>
              <Progress value={getTrustProgress(user.trustScore)} />
              <Link href="/trust-score">
                <Button variant="outline" className="w-full">
                  View detailed breakdown
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Groups
              </CardTitle>
              <CardDescription>
                Groups you're a member or admin of ({userGroups.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All ({userGroups.length})</TabsTrigger>
                  <TabsTrigger value="admin">Admin ({adminGroups.length})</TabsTrigger>
                  <TabsTrigger value="member">Member ({memberGroups.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-2 mt-4">
                  {userGroups.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      You're not in any groups yet.
                    </p>
                  ) : (
                    userGroups.map((group) => (
                      <Link
                        key={group.id}
                        href={`/groups/${group.id}`}
                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.adminGroupIds.includes(group.id) ? "Admin" : "Member"} ·{" "}
                            {group.membersCount}/{group.memberCap} members
                          </p>
                        </div>
                        <Badge variant={group.status === "Open" ? "secondary" : "outline"}>
                          {group.status}
                        </Badge>
                      </Link>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="admin" className="space-y-2 mt-4">
                  {adminGroups.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      You're not an admin of any groups.
                    </p>
                  ) : (
                    adminGroups.map((group) => (
                      <Link
                        key={group.id}
                        href={`/groups/${group.id}`}
                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Admin · {group.membersCount}/{group.memberCap} members
                          </p>
                        </div>
                        <Badge variant={group.status === "Open" ? "secondary" : "outline"}>
                          {group.status}
                        </Badge>
                      </Link>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="member" className="space-y-2 mt-4">
                  {memberGroups.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      You're not a member of any groups.
                    </p>
                  ) : (
                    memberGroups.map((group) => (
                      <Link
                        key={group.id}
                        href={`/groups/${group.id}`}
                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Member · {group.membersCount}/{group.memberCap} members
                          </p>
                        </div>
                        <Badge variant={group.status === "Open" ? "secondary" : "outline"}>
                          {group.status}
                        </Badge>
                      </Link>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Mavapay Wallet
              </CardTitle>
              <CardDescription>Connect wallet for payouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.mavapayLinked ? (
                <>
                  <Alert>
                    <AlertTitle>Wallet linked</AlertTitle>
                    <AlertDescription>
                      Your Mavapay wallet is connected and ready to receive payouts.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label>Wallet ID</Label>
                    <div className="rounded-lg border bg-muted/40 p-3 font-mono text-sm">
                      {user.mavapayWalletId}
                    </div>
                  </div>
                  <Button variant="destructive" onClick={handleUnlinkWallet} className="w-full">
                    Unlink wallet
                  </Button>
                </>
              ) : (
                <>
                  <Alert variant="destructive">
                    <AlertTitle>Wallet not linked</AlertTitle>
                    <AlertDescription>
                      Link your Mavapay wallet to receive payouts in local currency.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={() => setShowWalletDialog(true)}
                    className="w-full"
                  >
                    Link Mavapay wallet
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total groups</span>
                <span className="font-medium">{user.totalGroups}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trust score</span>
                <span className="font-medium">{user.trustScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next contribution</span>
                <span className="font-medium">{user.nextContribution.amountBtc} BTC</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Mavapay wallet</DialogTitle>
            <DialogDescription>
              Enter your Mavapay wallet ID to receive payouts in local currency.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-id">Wallet ID</Label>
              <Input
                id="wallet-id"
                placeholder="MAVA-1234-56"
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
              />
            </div>
            <Alert>
              <AlertDescription>
                Make sure your Mavapay wallet is active and verified before linking.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={handleLinkWallet} className="flex-1" disabled={!walletId.trim()}>
                Link wallet
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowWalletDialog(false)
                  setWalletId("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfilePage

