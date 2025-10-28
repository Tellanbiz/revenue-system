"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { getReconciliationsByStatus } from "@/lib/services/reconciliation/actions"

export default function MatchedTab() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading matched records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Matched Reconciliations
          </CardTitle>
          <CardDescription>
            Collections that have been successfully matched with payment records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {matchedRecords.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-muted-foreground">No matched reconciliations found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchedRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Collection #{record.collection_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.reconciled_amount} {record.currency} - {new Date(record.reconciled_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Matched</span>
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
