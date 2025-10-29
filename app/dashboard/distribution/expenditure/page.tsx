"use client"

import { TopNavigation } from "@/components/navigation/top-navigation"

export default function ExpenditurePage() {
  return (
    <div className="flex flex-col">
      <TopNavigation />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Expenditure Overview</h1>
        <p className="text-gray-600 mb-8">Track how distributed funds are being spent</p>

        {/* TODO: Implement expenditure overview component */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center text-gray-500">Expenditure tracking functionality coming soon...</p>
        </div>
      </div>
    </div>
  )
}
