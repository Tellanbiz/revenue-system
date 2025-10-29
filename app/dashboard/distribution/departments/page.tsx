"use client"

import { TopNavigation } from "@/components/navigation/top-navigation"
import { DepartmentsTable } from "@/components/distribution/departments-table"

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col">
      <TopNavigation />
      <div className=" py-8 px-16">
        <DepartmentsTable />
      </div>
    </div>
  )
}
