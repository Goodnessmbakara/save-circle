"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { navItems } from "../nav-items"
import { useAppStore } from "@/store/use-app-store"

export const AppSidebar = () => {
  const pathname = usePathname()
  const isAdmin = useAppStore((state) => (state.user?.adminGroupIds.length ?? 0) > 0)

  const visibleItems = navItems.filter((item) => (item.requiresAdmin ? isAdmin : true))

  return (
    <aside className="hidden w-64 flex-col border-r bg-card/60 p-6 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-2 pb-8 font-semibold">
        <Image
          src="/save-circle-logo.png"
          alt="Save Circle logo"
          width={24}
          height={24}
          className="h-6 w-6 object-contain"
        />
        <span>Lightning ROSCA</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
            </Link>
          )
        })}
      </nav>

      <div className="rounded-lg border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 text-sm">
        <p className="font-semibold text-primary">Need liquidity?</p>
        <p className="mt-1 text-muted-foreground">
          Switch on auto top-ups to never miss a Lightning contribution.
        </p>
      </div>
    </aside>
  )
}
