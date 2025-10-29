"use client"

import { useState, useEffect } from "react"
import { getDistributions } from "@/lib/services/distribution/get"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
  
const columns = [
  {
    id: "collection",
    accessorKey: "collection.collection_number",
    header: "Collection",
  },
  {
    id: "department",
    accessorKey: "department.name",
    header: "Department",
  },
  {
    id: "allocated_amount",
    accessorKey: "allocated_amount",
    header: "Amount",
    cell: ({ row }: { row: any }) => `GHS ${parseFloat(row.original.allocated_amount).toFixed(2)}`,
  },
  {
    id: "percentage",
    accessorKey: "percentage",
    header: "Percentage",
    cell: ({ row }: { row: any }) => row.original.percentage ? `${parseFloat(row.original.percentage).toFixed(2)}%` : "-",
  },
  {
    id: "distributor",
    accessorKey: "distributor.name",
    header: "Distributed By",
  },
  {
    id: "distributed_at",
    accessorKey: "distributed_at",
    header: "Distributed At",
    cell: ({ row }: { row: any }) => new Date(row.original.distributed_at).toLocaleDateString(),
  },
]

interface DistributionsTableProps {
  onEditDistribution?: (distribution: any) => void
}

export function DistributionsTable({ onEditDistribution }: DistributionsTableProps) {
  const [distributions, setDistributions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDistributions()
  }, [])

  const loadDistributions = async () => {
    try {
      setLoading(true)
      const data = await getDistributions()
      setDistributions(data)
    } catch (error) {
      console.error("Failed to load distributions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Distributions</h2>
        <Link href="/dashboard/distribution/allocate">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Allocate Funds
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={distributions}
        searchColumn="collection"
        searchPlaceholder="Filter distributions..."
      />
    </div>
  )
}
