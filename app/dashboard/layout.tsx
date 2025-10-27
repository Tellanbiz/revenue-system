"use client"

import { AppSidebar } from "@/components/navigation/sidebar"
import { TopNavigation } from "@/components/navigation/top-navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}