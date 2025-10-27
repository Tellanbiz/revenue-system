import { TopNavigation } from "@/components/navigation/top-navigation"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      {/* Main Content */}
      <div className="container mx-auto py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Overview of total collections, pending reconciliations, top-performing assemblies
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Total Collections
                  </p>
                  <p className="text-2xl font-bold">$45,231.89</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Pending Reconciliations
                  </p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Top Assembly
                  </p>
                  <p className="text-2xl font-bold">Central</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Revenue Growth
                  </p>
                  <p className="text-2xl font-bold">+20.1%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Collections</h3>
              <div className="h-64 bg-muted rounded flex items-center justify-center">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Distribution</h3>
              <div className="h-64 bg-muted rounded flex items-center justify-center">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}