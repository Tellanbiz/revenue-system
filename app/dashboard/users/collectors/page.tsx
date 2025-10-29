"use client"

import { CollectorsDataTable } from "@/components/features/collectors/collectors-table"
import { TopNavigation } from "@/components/navigation/top-navigation"
import { Button } from "@/components/ui/button"

export default function CollectorsPage() {
  return (
    <div className="flex flex-col">
      <TopNavigation>
          <Button>Register New Collector</Button>
        </TopNavigation>
      <div className="px-16">
        <CollectorsDataTable />
      </div>
    </div>
  )
}
