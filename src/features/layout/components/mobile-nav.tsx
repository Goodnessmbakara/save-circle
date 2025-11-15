"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { navItems } from "../nav-items"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useAppStore } from "@/store/use-app-store"

export const MobileNav = () => {
  const pathname = usePathname()
  const isAdmin = useAppStore((state) => (state.user?.adminGroupIds.length ?? 0) > 0)
  const visibleItems = navItems.filter((item) => (item.requiresAdmin ? isAdmin : true))

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation</span>
      </SheetTrigger>
      <SheetContent side="left" className="p-6">
        <Link href="/dashboard" className="mb-6 flex items-center gap-2 font-semibold">
          <Image
            src="/save-circle-logo.png"
            alt="Save Circle logo"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
          <span>Lightning ROSCA</span>
        </Link>
        <nav className="flex flex-col gap-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (pathname?.startsWith(item.href) && item.href !== "/dashboard")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
