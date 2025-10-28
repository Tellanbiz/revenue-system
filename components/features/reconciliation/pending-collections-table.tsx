"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { RefreshCw } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

interface PendingCollection {
  id: number
  collection_number: string
  amount: string
  currency: string
  type: string
  payment_method: string
  payment_date: Date
}

interface PendingCollectionsTableProps {
  collections: PendingCollection[]
  loading: boolean
}

export function PendingCollectionsTable({
  collections,
  loading
}: PendingCollectionsTableProps) {
  const router = useRouter()

  const formatCurrency = (amount: string, currency: string = 'GHS') => {
    return `${currency} ${parseFloat(amount).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`
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

  const handleReconcile = (collection: PendingCollection) => {
    router.push(`/dashboard/reconciliation/${collection.id}/reconcile`)
  }

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      market_fee: "🏪 Market Fee",
      permit_fee: "📄 Permit Fee",
      property_rate: "🏠 Property Rate",
      license_fee: "📋 License Fee",
      fine_penalty: "⚠️ Fine/Penalty",
      other: "📦 Other"
    }

    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
        {typeLabels[type as keyof typeof typeLabels] || type.replace('_', ' ')}
      </span>
    )
  }

  const getPaymentMethodBadge = (method: string) => {
    const methodLabels = {
      cash: "💵 Cash",
      mobile_money: "📱 Mobile Money",
      bank_transfer: "🏦 Bank Transfer",
      card: "💳 Card",
      check: "📄 Check"
    }

    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
        {methodLabels[method as keyof typeof methodLabels] || method.replace('_', ' ')}
      </span>
    )
  }

  const columns: ColumnDef<PendingCollection>[] = [
    {
      accessorKey: "collection_number",
      header: "Collection #",
      cell: ({ row }) => (
        <div className="font-medium">#{row.getValue("collection_number")}</div>
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
      cell: ({ row }) => getTypeBadge(row.getValue("type")),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <div className="font-medium">{formatCurrency(row.getValue("amount"), row.original.currency)}</div>,
    },
    {
      accessorKey: "payment_method",
      header: "Payment Method",
      cell: ({ row }) => getPaymentMethodBadge(row.getValue("payment_method")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleReconcile(row.original)}
        >
          Reconcile
        </Button>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading pending collections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <DataTable columns={columns} data={collections} />
    </div>
  )
}
