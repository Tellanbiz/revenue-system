"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Upload,
  ArrowLeftRight,
  Play
} from "lucide-react"
import { TopNavigation } from "@/components/navigation/top-navigation"
import TabNavigation, { TabItem } from "@/components/navigation/tab-navigation"

interface ReconciliationLayoutProps {
  children: ReactNode
}

const tabs: TabItem[] = [
  {
    id: "pending",
    label: "Pending Collections",
    icon: <Clock className="h-4 w-4" />
  },
  {
    id: "matched",
    label: "Matched",
    icon: <CheckCircle className="h-4 w-4" />
  },
  {
    id: "discrepancy",
    label: "Discrepancy",
    icon: <AlertTriangle className="h-4 w-4" />
  },
  {
    id: "unmatched",
    label: "Unmatched",
    icon: <RefreshCw className="h-4 w-4" />
  }
]

export default function ReconciliationLayout({ children }: ReconciliationLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Statement
          </Button>
          <Button variant="outline" size="sm">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Sync Transactions
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Start Reconciliation
          </Button>
        </div>
      </TopNavigation>

      <TabNavigation
        tabs={tabs}
        basePath="/dashboard/reconciliation/reconcile"
      />

      <div className="">
        {children}

      </div>
    </div>
  )
}