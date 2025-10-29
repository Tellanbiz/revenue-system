"use client"

import { TopNavigation } from "@/components/navigation/top-navigation"
import { AdminsDataTable } from "@/components/features/admins/admins-table"
import { Button } from "@/components/ui/button"

export default function AdminsPage() {
  return (
    <div className="flex flex-col">
      <TopNavigation>
        <Button>Register New Admin</Button>
      </TopNavigation>
      <div className="px-16">
        <AdminsDataTable />
      </div>
    </div>
  )
}
