import { Home, DollarSign, FileText, BarChart3, RotateCcw, CreditCard, Users, Settings, TrendingUp } from "lucide-react"

export const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/dashboard",
      description: "Overview of total collections, pending reconciliations, top-performing assemblies. Graphs: daily/weekly collections, revenue distribution",
    },
    {
      title: "Revenue Collections",
      icon: DollarSign,
      items: [
        {
          title: "All Collections",
          url: "/dashboard/collections",
          description: "List or search payments"
        },
        {
          title: "New Collection",
          url: "/dashboard/collections/new",
          description: "Record a manual or MoMo payment"
        },
        {
          title: "Collections by Source",
          url: "/dashboard/collections/sources",
          description: "Market, Permits, Property, etc."
        },
      ]
    },
    {
      title: "Reconciliation",
      icon: BarChart3,
      items: [
        {
          title: "Reconciliation Records",
          url: "/dashboard/reconciliation/reconcile",
        },
        {
          title: "Statements",
          url: "/dashboard/reconciliation/statements",
        },
        {
          title: "Reconciliation Stats",
          url: "/dashboard/reconciliation/stats",
        },
      ]
    },
    {
      title: "Revenue Distribution",
      icon: RotateCcw,
      items: [
        {
          title: "Departments",
          url: "/dashboard/distribution/departments",
          description: "Manage departments for fund allocation"
        },
        {
          title: "Distributions",
          url: "/dashboard/distribution",
          description: "View allocated funds"
        },
        {
          title: "Allocate Funds",
          url: "/dashboard/distribution/allocate",
          description: "Distribute reconciled collection funds"
        },
      
      ]
    },
    {
      title: "Users & Roles",
      icon: Users,
      items: [
        {
          title: "Collectors",
          url: "/dashboard/users/collectors",
        },
        {
          title: "Supervisors / Admins",
          url: "/dashboard/users/admins",
        },
        {
          title: "Departments / Assemblies",
          url: "/dashboard/users/departments",
        },
      ]
    },
    {
      title: "System Setup",
      icon: Settings,
      items: [
        {
          title: "Assemblies / Wards",
          url: "/dashboard/setup/assemblies",
        },
        {
          title: "Settings",
          url: "/dashboard/setup/settings",
        },
      ]
    },
    {
      title: "Reports",
      icon: TrendingUp,
      items: [
        {
          title: "Daily Collection Report",
          url: "/dashboard/reports/daily",
        },
        {
          title: "Revenue by Assembly",
          url: "/dashboard/reports/assembly",
        },
        {
          title: "Top Collectors",
          url: "/dashboard/reports/collectors",
        },
        {
          title: "Distribution Summary",
          url: "/dashboard/reports/distribution",
        },
      ]
    },
  ]