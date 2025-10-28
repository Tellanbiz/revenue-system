"use client"

import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"
import { getReconciliationsByStatus } from "@/lib/services/reconciliation/actions"
import { ReconciliationDataTable } from "@/components/features/reconciliation/reconciliation-table"

export default function MatchedPage() {
  const [matchedRecords, setMatchedRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Get matched reconciliation records
      const matched = await getReconciliationsByStatus('matched', 100)
      setMatchedRecords(matched)

    } catch (error) {
      console.error("Failed to load matched reconciliation data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ReconciliationDataTable
      records={matchedRecords}
      loading={loading}
      title="Matched Reconciliations"
      description="Collections that have been successfully matched with payment records"
      emptyMessage="No matched reconciliations found"
      emptyIcon={<CheckCircle className="h-6 w-6 text-green-600" />}
    />
  )
}