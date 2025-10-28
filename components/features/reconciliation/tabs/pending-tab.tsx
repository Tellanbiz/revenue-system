"use client"

import { useState, useEffect } from "react"
import { PendingCollectionsTable } from "@/components/features/reconciliation/pending-collections-table"
import { getCollectionsWithFilters, type CollectionFilters } from "@/lib/services/collections/actions"
import { getReconciliationsByStatus } from "@/lib/services/reconciliation/actions"

export default function PendingTab() {
  const [pendingCollections, setPendingCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
