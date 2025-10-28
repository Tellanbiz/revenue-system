"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { getReconciliationsByStatus } from "@/lib/services/reconciliation/actions"
import { ReconciliationDataTable } from "@/components/features/reconciliation/reconciliation-table"

export default function UnmatchedPage() {
  const [unmatchedRecords, setUnmatchedRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Get unmatched reconciliation records
      const unmatched = await getReconciliationsByStatus('unmatched', 100)
      setUnmatchedRecords(unmatched)

    } catch (error) {
      console.error("Failed to load unmatched reconciliation data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ReconciliationDataTable
      records={unmatchedRecords}
      loading={loading}
      title="Unmatched Reconciliations"
      description="Collections that could not be matched with any payment records"
      emptyMessage="No unmatched records found"
      emptyIcon={<X className="h-6 w-6 text-red-600" />}
    />
  )
}