"use client"

import { TopNavigation } from "@/components/navigation/top-navigation"

export default function SplitViewPage() {
  return (
    <div className="flex flex-col">
      <TopNavigation />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Automated Split View</h1>
        <p className="text-gray-600 mb-8">See how funds were automatically shared across departments</p>

        {/* TODO: Implement split view component */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center text-gray-500">Split view functionality coming soon...</p>
        </div>
      </div>
    </div>
  )
}
