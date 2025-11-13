"use client"

import type { PropsWithChildren } from "react"
import { AppShell } from "@/features/layout"

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return <AppShell>{children}</AppShell>
}

export default DashboardLayout

