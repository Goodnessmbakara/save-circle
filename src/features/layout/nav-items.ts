import type { ComponentType } from "react"
import {
  Banknote,
  Gauge,
  Layers,
  ShieldCheck,
  Users2,
  Vote,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
  badge?: string
  requiresAdmin?: boolean
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
  },
  {
    label: "Groups",
    href: "/groups",
    icon: Users2,
  },
  {
    label: "Create Group",
    href: "/groups/create",
    icon: Layers,
  },
  {
    label: "Payments",
    href: "/payments",
    icon: Banknote,
  },
  {
    label: "Trust Score",
    href: "/trust-score",
    icon: ShieldCheck,
  },
  {
    label: "Voting",
    href: "/groups",
    icon: Vote,
    badge: "Live",
  },
  {
    label: "Admin",
    href: "/admin",
    icon: ShieldCheck,
    requiresAdmin: true,
  },
]
