"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { getReconciliationsByStatus } from "@/lib/services/reconciliation/actions"
import { ReconciliationDataTable } from "@/components/features/reconciliation/reconciliation-table"

export default function DiscrepancyPage() {
  const [discrepancyRecords, setDiscrepancyRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Get discrepancy reconciliation records
      const discrepancies = await getReconciliationsByStatus('discrepancy', 100)
      setDiscrepancyRecords(discrepancies)

    } catch (error) {
      console.error("Failed to load discrepancy reconciliation data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ReconciliationDataTable
      records={discrepancyRecords}
      loading={loading}
      title="Reconciliation Discrepancies"
      description="Collections with amount discrepancies that require attention"
      emptyMessage="No discrepancy records found"
      emptyIcon={<AlertTriangle className="h-6 w-6 text-orange-600" />}
    />
  )
}