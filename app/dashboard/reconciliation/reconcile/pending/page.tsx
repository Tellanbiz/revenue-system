"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "lucide-react"
import { getCollectionsWithFilters, type CollectionFilters } from "@/lib/services/collections/actions"
import { getReconciliationsByStatus } from "@/lib/services/reconciliation/actions"
import { TopNavigation } from "@/components/navigation/top-navigation"
import { PendingCollectionsTable } from "@/components/features/reconciliation/pending-collections-table"

export default function ReconciliationPage() {
  const [pendingCollections, setPendingCollections] = useState<any[]>([])
  const [reconciledRecords, setReconciledRecords] = useState<any[]>([])
  const [discrepancies, setDiscrepancies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pending: 0,
    matched: 0,
    unmatched: 0,
    totalCollections: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Get pending collections (not reconciled yet)
      const pendingResult = await getCollectionsWithFilters(
        { reconciled: false },
        1,
        100
      )
      setPendingCollections(pendingResult.collections || [])

      // Get reconciled records
      const reconciled = await getReconciliationsByStatus('matched', 100)
      setReconciledRecords(reconciled)

      // Get discrepancies
      const unmatched = await getReconciliationsByStatus('unmatched', 100)
      const discrepanciesData = await getReconciliationsByStatus('discrepancy', 100)
      setDiscrepancies([...unmatched, ...discrepanciesData])

      // Calculate stats
      const totalCollections = await getCollectionsWithFilters({}, 1, 1000)
      setStats({
        pending: pendingResult.totalCount || 0,
        matched: reconciled.length,
        unmatched: unmatched.length + discrepanciesData.length,
        totalCollections: totalCollections.totalCount || 0
      })

    } catch (error) {
      console.error("Failed to load reconciliation data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PendingCollectionsTable
        collections={pendingCollections}
        loading={loading}
    />
  )
}