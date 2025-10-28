"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  X,
  RefreshCw,
} from "lucide-react"
import { getReconciliationsByStatus } from "@/lib/services/reconciliation/actions"

export default function UnmatchedTab() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading unmatched records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-600" />
            Unmatched Reconciliations
          </CardTitle>
          <CardDescription>
            Collections that could not be matched with any payment records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {unmatchedRecords.length === 0 ? (
            <div className="text-center py-8">
              <X className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <p className="text-muted-foreground">No unmatched records found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {unmatchedRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                  <div className="space-y-1">
                    <p className="font-medium">Collection #{record.collection_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.reconciled_amount} {record.currency} - No matching payment found
                    </p>
                    <p className="text-xs text-red-800">
                      Transaction reference: {record.transaction_reference}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Unmatched</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
