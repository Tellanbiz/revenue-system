"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts"
import {
  DollarSign,
  Users,
  Building2,
  MapPin,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  X
} from "lucide-react"

interface DashboardStatsProps {
  stats: {
    collections: {
      totalCollections: number
      totalAmount: number
      pendingCollections: number
      completedCollections: number
      reconciledCollections: number
    }
    users: {
      totalUsers: number
      activeUsers: number
      collectors: number
      admins: number
      supervisors: number
    }
    departments: number
    assemblies: number
    revenueSources: number
    reconciliations: {
      totalReconciliations: number
      matched: number
      discrepancy: number
      unmatched: number
    }
    recentCollections: Array<{
      date: string
      amount: number
      count: number
    }>
    topAssemblies: Array<{
      assembly_ward: string | null
      totalAmount: number
      collectionCount: number
    }>
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function DashboardStats({ stats }: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return `GHS ${amount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`
  }

  // Prepare data for charts
  const collectionStatusData = [
    { name: 'Completed', value: stats.collections.completedCollections, color: '#00C49F' },
    { name: 'Pending', value: stats.collections.pendingCollections, color: '#FFBB28' }
  ]

  const userRoleData = [
    { name: 'Collectors', value: stats.users.collectors, color: '#0088FE' },
    { name: 'Supervisors', value: stats.users.supervisors, color: '#00C49F' },
    { name: 'Admins', value: stats.users.admins, color: '#FFBB28' }
  ]

  const reconciliationData = [
    { name: 'Matched', value: stats.reconciliations.matched, color: '#00C49F' },
    { name: 'Discrepancy', value: stats.reconciliations.discrepancy, color: '#FFBB28' },
    { name: 'Unmatched', value: stats.reconciliations.unmatched, color: '#FF8042' }
  ]

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.collections.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.collections.totalCollections} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.users.totalUsers} total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reconciliations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reconciliations.totalReconciliations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reconciliations.matched} matched
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Assembly</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topAssemblies[0]?.assembly_ward || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {stats.topAssemblies[0] ? formatCurrency(stats.topAssemblies[0].totalAmount) : 'No data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Collections Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Collections (Last 7 Days)</CardTitle>
            <CardDescription>Daily collection amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.recentCollections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Collection Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Status</CardTitle>
            <CardDescription>Distribution of collection statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={collectionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {collectionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* User Roles Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>Distribution of user roles in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userRoleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reconciliation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Status</CardTitle>
            <CardDescription>Status of reconciled transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reconciliationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {reconciliationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">System Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Departments:</span>
              <Badge variant="outline">{stats.departments}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Assemblies:</span>
              <Badge variant="outline">{stats.assemblies}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Revenue Sources:</span>
              <Badge variant="outline">{stats.revenueSources}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Assemblies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.topAssemblies.slice(0, 3).map((assembly, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm truncate flex-1">{assembly.assembly_ward || 'Unknown Assembly'}</span>
                <Badge variant="secondary" className="ml-2">
                  {formatCurrency(assembly.totalAmount)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Reconciled:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {stats.collections.reconciledCollections}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Success Rate:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {stats.collections.totalCollections > 0
                  ? `${Math.round((stats.collections.completedCollections / stats.collections.totalCollections) * 100)}%`
                  : '0%'
                }
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
