"use client"

import { TopNavigation } from "@/components/navigation/top-navigation"
import { DepartmentsDataTable } from "@/components/features/departments/departments-table"

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col">
      <TopNavigation />
      <div className=" py-8 px-16">
        <DepartmentsDataTable />
      </div>
    </div>
  )
}
