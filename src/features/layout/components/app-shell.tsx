"use client"

import type { PropsWithChildren } from "react"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"

export const AppShell = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen bg-muted/40">
    <AppSidebar />
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <main className="flex-1 space-y-6 p-4 md:p-8">{children}</main>
    </div>
  </div>
)

