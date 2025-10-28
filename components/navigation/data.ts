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
      title: "Permits & Licenses",
      icon: FileText,
      items: [
        {
          title: "Business Operating Permits",
          url: "/dashboard/permits/business",
        },
        {
          title: "Building Permits",
          url: "/dashboard/permits/building",
        },
        {
          title: "Sanitation / Property Fees",
          url: "/dashboard/permits/sanitation",
        },
      ]
    },
    {
      title: "Revenue Distribution",
      icon: RotateCcw,
      items: [
        {
          title: "Distribution Rules",
          url: "/dashboard/distribution/rules",
          description: "Define percentages to departments"
        },
        {
          title: "Automated Split View",
          url: "/dashboard/distribution/split",
          description: "See how funds were shared"
        },
        {
          title: "Expenditure Overview",
          url: "/dashboard/distribution/expenditure",
        },
      ]
    },
    {
      title: "Payments Channel",
      icon: CreditCard,
      items: [
        {
          title: "Mobile Money (MoMo)",
          url: "/dashboard/payments/momo",
        },
        {
          title: "Bank / Card Payments",
          url: "/dashboard/payments/bank",
        },
        {
          title: "Transaction Logs",
          url: "/dashboard/payments/logs",
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
          title: "Revenue Sources",
          url: "/dashboard/setup/sources",
          description: "Add new fee types"
        },
        {
          title: "Assemblies / Wards",
          url: "/dashboard/setup/assemblies",
        },
        {
          title: "Integrations",
          url: "/dashboard/setup/integrations",
          description: "MoMo APIs, Bank APIs"
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