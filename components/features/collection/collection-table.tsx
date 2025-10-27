"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Eye,
  Edit,
} from "lucide-react"
import { type Collection, type CollectionStatus, type PaymentMethod, type CollectionType } from "@/lib/services/collections/actions"
import { ColumnDef } from "@tanstack/react-table"
import { CollectionFilters } from "@/lib/services/collections/actions"

interface CollectionTableProps {
  collections: Collection[]
  revenueSources: any[]
  loading: boolean
  currentPage: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
  filters: CollectionFilters
  onFilterChange: (key: keyof CollectionFilters, value: any) => void
}

export function CollectionTable({
  collections,
  revenueSources,
  loading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  filters,
  onFilterChange
}: CollectionTableProps) {
  const formatCurrency = (amount: string) => {
    return `GHS ${parseFloat(amount).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: CollectionStatus) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800"
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${variants[status] || "bg-gray-100 text-gray-800"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getPaymentMethodBadge = (method: PaymentMethod) => {
    const methodLabels = {
      cash: "💵 Cash",
      mobile_money: "📱 Mobile Money",
      bank_transfer: "🏦 Bank Transfer",
      card: "💳 Card",
      check: "📄 Check"
    }

    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
        {methodLabels[method] || method}
      </span>
    )
  }

  const filterComponents = (
    <>
   
    </>
  )

  const columns: ColumnDef<Collection>[] = [
    {
      accessorKey: "collection_number",
      header: "Collection #",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("collection_number")}</div>
      ),
    },
    {
      accessorKey: "payment_date",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("payment_date")),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
          {row.getValue("type")}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <div className="font-medium">{formatCurrency(row.getValue("amount"))}</div>,
    },
    {
      accessorKey: "payment_method",
      header: "Payment Method",
      cell: ({ row }) => getPaymentMethodBadge(row.getValue("payment_method")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "revenue_source_id",
      header: "Revenue Source",
      cell: ({ row }) => {
        const sourceId = row.getValue("revenue_source_id") as number
        const source = revenueSources.find(s => s.id === sourceId)
        return source?.name || 'N/A'
      },
    },
    {
      accessorKey: "assembly_ward",
      header: "Assembly",
      cell: ({ row }) => row.getValue("assembly_ward") || 'N/A',
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading collections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <DataTable columns={columns} data={collections} filters={filterComponents} />
    </div>
  )
}