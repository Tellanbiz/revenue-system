"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  FileText,
  CreditCard,
  Building2,
  XCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react"
import { getCollectionsWithFilters, type CollectionFilters } from "@/lib/services/collections/actions"
import { getReconciliationsByStatus, getReconciliations } from "@/lib/services/reconciliation/actions"
import { TopNavigation } from "@/components/navigation/top-navigation"

export default function ReconciliationStatsPage() {
  const [stats, setStats] = useState({
    totalCollections: 0,
    pendingReconciliation: 0,
    reconciledCollections: 0,
    matchedReconciliations: 0,
    unmatchedReconciliations: 0,
    discrepancyReconciliations: 0,
    investigatingReconciliations: 0,
    totalReconciliationAmount: 0,
    averageReconciliationTime: 0,
    reconciliationRate: 0,
    monthlyTrends: [] as any[],
    topReconcilers: [] as any[],
    statementStats: {
      totalStatements: 0,
      processedStatements: 0,
      processingStatements: 0,
      errorStatements: 0,
      totalStatementAmount: 0,
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)

      // Get all collections
      const allCollections = await getCollectionsWithFilters({}, 1, 10000)
      const totalCollections = allCollections.totalCount || 0

      // Get pending collections (not reconciled)
      const pendingCollections = await getCollectionsWithFilters(
        { reconciled: false },
        1,
        10000
      )
      const pendingCount = pendingCollections.totalCount || 0

      // Get reconciled collections
      const reconciledCount = totalCollections - pendingCount

      // Get reconciliation details
      const allReconciliations = await getReconciliations(10000)

      const matchedReconciliations = await getReconciliationsByStatus('matched', 10000)
      const unmatchedReconciliations = await getReconciliationsByStatus('unmatched', 10000)
      const discrepancyReconciliations = await getReconciliationsByStatus('discrepancy', 10000)
      const investigatingReconciliations = await getReconciliationsByStatus('investigating', 10000)

      // Calculate totals
      const totalReconciliationAmount = allReconciliations.reduce((sum, r) => sum + parseFloat(r.reconciled_amount), 0)

      // Calculate reconciliation rate
      const reconciliationRate = totalCollections > 0 ? (reconciledCount / totalCollections) * 100 : 0

      // Mock monthly trends (would come from actual data)
      const monthlyTrends = [
        { month: 'Jan', reconciled: 45, pending: 12 },
        { month: 'Feb', reconciled: 52, pending: 8 },
        { month: 'Mar', reconciled: 48, pending: 15 },
        { month: 'Apr', reconciled: 61, pending: 7 },
        { month: 'May', reconciled: 55, pending: 11 },
        { month: 'Jun', reconciled: 67, pending: 9 },
      ]

      // Mock top reconcilers (would come from actual data)
      const topReconcilers = [
        { name: 'John Doe', email: 'john@example.com', count: 45 },
        { name: 'Jane Smith', email: 'jane@example.com', count: 38 },
        { name: 'Mike Johnson', email: 'mike@example.com', count: 29 },
      ]

      // Mock statement stats (would come from actual data)
      const statementStats = {
        totalStatements: 12,
        processedStatements: 8,
        processingStatements: 3,
        errorStatements: 1,
        totalStatementAmount: 150000,
      }

      setStats({
        totalCollections,
        pendingReconciliation: pendingCount,
        reconciledCollections: reconciledCount,
        matchedReconciliations: matchedReconciliations.length,
        unmatchedReconciliations: unmatchedReconciliations.length,
        discrepancyReconciliations: discrepancyReconciliations.length,
        investigatingReconciliations: investigatingReconciliations.length,
        totalReconciliationAmount,
        averageReconciliationTime: 2.3, // Mock data
        reconciliationRate,
        monthlyTrends,
        topReconcilers,
        statementStats,
      })

    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => `GHS ${amount.toLocaleString('en-GH')}`

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading reconciliation statistics...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reconciliation Statistics</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive analytics and insights for reconciliation activities
              </p>
            </div>
            <Button onClick={loadStats} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCollections.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  All recorded collections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reconciliation Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.reconciliationRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Collections reconciled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reconciled Amount</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalReconciliationAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully verified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageReconciliationTime} days</div>
                <p className="text-xs text-muted-foreground">
                  From collection to reconciliation
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reconciliation</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingReconciliation}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Successfully Matched</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.matchedReconciliations}</div>
                <p className="text-xs text-muted-foreground">
                  Perfect matches
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discrepancies Found</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.discrepancyReconciliations}</div>
                <p className="text-xs text-muted-foreground">
                  Need investigation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
                <XCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.investigatingReconciliations}</div>
                <p className="text-xs text-muted-foreground">
                  Being reviewed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Statement Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statement Processing Statistics</CardTitle>
              <CardDescription>Bank and MoMo statement upload and processing metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.statementStats.totalStatements}</div>
                  <p className="text-sm text-muted-foreground">Total Statements</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.statementStats.processedStatements}</div>
                  <p className="text-sm text-muted-foreground">Processed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.statementStats.processingStatements}</div>
                  <p className="text-sm text-muted-foreground">Processing</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.statementStats.errorStatements}</div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCurrency(stats.statementStats.totalStatementAmount)}</div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Reconciliation Trends</CardTitle>
              <CardDescription>Reconciliation activity over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlyTrends.map((trend) => (
                  <div key={trend.month} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-medium w-12">{trend.month}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(trend.reconciled / (trend.reconciled + trend.pending)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <span className="text-green-600">{trend.reconciled} reconciled</span>
                      <span className="text-yellow-600">{trend.pending} pending</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Reconcilers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Reconcilers</CardTitle>
              <CardDescription>Most active reconciliation officers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topReconcilers.map((reconciler, index) => (
                  <div key={reconciler.email} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{reconciler.name}</p>
                        <p className="text-sm text-muted-foreground">{reconciler.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{reconciler.count} reconciliations</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}