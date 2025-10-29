import { TopNavigation } from "@/components/navigation/top-navigation"
import { getDashboardStats } from "@/lib/services/dashboard/get"
import { DashboardStats } from "@/components/features/dashboard/dashboard-stats"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      {/* Main Content */}
      <div className="container mx-auto py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Overview of collections, users, and system performance
            </p>
          </div>

          <DashboardStats stats={stats} />
        </div>
      </div>
    </div>
  )
}