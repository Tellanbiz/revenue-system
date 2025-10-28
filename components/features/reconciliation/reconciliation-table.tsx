"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertTriangle,
  X,
  Calendar,
  DollarSign
} from "lucide-react"

interface ReconciliationRecord {
  id: number
  collection_number: string
  reconciled_amount: string
  currency: string
  reconciled_at: string
  status: 'matched' | 'discrepancy' | 'unmatched'
  discrepancy_amount?: string
  discrepancy_reason?: string
  transaction_reference?: string
}

interface ReconciliationDataTableProps {
  records: ReconciliationRecord[]
  loading: boolean
  title: string
  description: string
  emptyMessage: string
  emptyIcon: React.ReactNode
}

export function ReconciliationDataTable({
  records,
  loading,
  title,
  description,
  emptyMessage,
  emptyIcon
}: ReconciliationDataTableProps) {
  const formatCurrency = (amount: string, currency: string = 'GHS') => {
    return `${currency} ${parseFloat(amount).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Matched
          </Badge>
        )
      case 'discrepancy':
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Discrepancy
          </Badge>
        )
      case 'unmatched':
        return (
          <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="h-3 w-3 mr-1" />
            Unmatched
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const columns: ColumnDef<ReconciliationRecord>[] = [
    {
      accessorKey: "collection_number",
      header: "Collection #",
      cell: ({ row }) => (
        <div className="font-medium">#{row.getValue("collection_number")}</div>
      ),
    },
    {
      accessorKey: "reconciled_amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.getValue("reconciled_amount"), row.original.currency)}
        </div>
      ),
    },
    {
      accessorKey: "reconciled_at",
      header: "Date",
      cell: ({ row }) => formatDate(row.getValue("reconciled_at")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "details",
      header: "Details",
      cell: ({ row }) => {
        const record = row.original
        if (record.status === 'discrepancy' && record.discrepancy_amount) {
          return (
            <div className="space-y-1">
              <div className="text-sm text-orange-600">
                Discrepancy: {formatCurrency(record.discrepancy_amount, record.currency)}
              </div>
              {record.discrepancy_reason && (
                <div className="text-xs text-muted-foreground max-w-xs truncate">
                  {record.discrepancy_reason}
                </div>
              )}
            </div>
          )
        }
        if (record.status === 'unmatched' && record.transaction_reference) {
          return (
            <div className="text-sm text-muted-foreground">
              Ref: {record.transaction_reference}
            </div>
          )
        }
        return null
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading {title.toLowerCase()}...</p>
        </div>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          {emptyIcon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-2">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={records} />
    </div>
  )
}
