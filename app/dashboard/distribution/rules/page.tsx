"use client"

import { TopNavigation } from "@/components/navigation/top-navigation"

export default function DistributionRulesPage() {
  return (
    <div className="flex flex-col">
      <TopNavigation />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Distribution Rules</h1>
        <p className="text-gray-600 mb-8">Define percentages and rules for automatic fund allocation</p>

        {/* TODO: Implement distribution rules component */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center text-gray-500">Distribution rules configuration coming soon...</p>
        </div>
      </div>
    </div>
  )
}
