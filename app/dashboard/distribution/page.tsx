"use client"

import { TopNavigation } from "@/components/navigation/top-navigation"
import { DistributionsTable } from "@/components/distribution/distributions-table"

export default function DistributionsPage() {
  return (
    <div className="flex flex-col">
      <TopNavigation />
      <div className=" py-8 px-16">
        <DistributionsTable />
      </div>
    </div>
  )
}