"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { getReconciliationsByStatus } from "@/lib/services/reconciliation/actions"

export default function DiscrepancyTab() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading discrepancy records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Reconciliation Discrepancies
          </CardTitle>
          <CardDescription>
            Collections with amount discrepancies that require attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {discrepancyRecords.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <p className="text-muted-foreground">No discrepancy records found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {discrepancyRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg border-orange-200 bg-orange-50">
                  <div className="space-y-1">
                    <p className="font-medium">Collection #{record.collection_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.reconciled_amount} {record.currency} - Discrepancy: {record.discrepancy_amount}
                    </p>
                    <p className="text-xs text-orange-800">
                      {record.discrepancy_reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-600">Discrepancy</span>
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
