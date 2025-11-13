"use client"

import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "./mobile-nav"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { useAppStore } from "@/store/use-app-store"

export const AppHeader = () => {
  const { user } = useAppStore()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b bg-background/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <MobileNav />
        <Image
          src="/save-circle-logo.png"
          alt="Save Circle logo"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Lightning-Powered ROSCA Platform</p>
          <p className="font-semibold">Savings you control, payouts in seconds</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="text-right text-sm hidden sm:block">
          <p className="text-xs text-muted-foreground">Trust score</p>
          <p className="font-semibold">
            {user.trustScore} · {user.trustLevel}
          </p>
          <Badge variant={user.mavapayLinked ? "secondary" : "destructive"}>
            {user.mavapayLinked ? "Mavapay linked" : "Link Mavapay"}
          </Badge>
        </div>
        <Link href="/profile">
          <Avatar className="size-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
            <AvatarFallback>{user.avatarInitials}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}

