import { Home, DollarSign, FileText, BarChart3, RotateCcw, CreditCard, Users, Settings, TrendingUp, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    description: "Overview of total collections, pending reconciliations, top-performing assemblies. Graphs: daily/weekly collections, revenue distribution",
  },
  {
    title: "Revenue Collections",
    icon: DollarSign,
    items: [
      {
        title: "All Collections",
        description: "List or search payments"
      },
      {
        title: "New Payment",
        description: "Record a manual or MoMo payment"
      },
      {
        title: "Collections by Source",
        description: "Market, Permits, Property, etc."
      },
      {
        title: "Receipts",
        description: "View or download payment receipts"
      },
    ]
  },
  {
    title: "Permits & Licenses",
    icon: FileText,
    items: [
      {
        title: "Business Operating Permits",
      },
      {
        title: "Building Permits",
      },
      {
        title: "Sanitation / Property Fees",
      },
    ]
  },
  {
    title: "Reconciliation",
    icon: BarChart3,
    items: [
      {
        title: "Pending Reconciliation",
      },
      {
        title: "Bank Deposits / MoMo Statements",
      },
      {
        title: "Discrepancy Report",
      },
      {
        title: "Reconciled Records",
      },
    ]
  },
  {
    title: "Revenue Distribution",
    icon: RotateCcw,
    items: [
      {
        title: "Distribution Rules",
        description: "Define percentages to departments"
      },
      {
        title: "Automated Split View",
        description: "See how funds were shared"
      },
      {
        title: "Expenditure Overview",
      },
    ]
  },
  {
    title: "Payments Channel",
    icon: CreditCard,
    items: [
      {
        title: "Mobile Money (MoMo)",
      },
      {
        title: "Bank / Card Payments",
      },
      {
        title: "Transaction Logs",
      },
    ]
  },
  {
    title: "Users & Roles",
    icon: Users,
    items: [
      {
        title: "Collectors",
      },
      {
        title: "Supervisors / Admins",
      },
      {
        title: "Departments / Assemblies",
      },
    ]
  },
  {
    title: "System Setup",
    icon: Settings,
    items: [
      {
        title: "Revenue Sources",
        description: "Add new fee types"
      },
      {
        title: "Assemblies / Wards",
      },
      {
        title: "Integrations",
        description: "MoMo APIs, Bank APIs"
      },
      {
        title: "Settings",
      },
    ]
  },
  {
    title: "Reports",
    icon: TrendingUp,
    items: [
      {
        title: "Daily Collection Report",
      },
      {
        title: "Revenue by Assembly",
      },
      {
        title: "Top Collectors",
      },
      {
        title: "Distribution Summary",
      },
    ]
  },
  {
    title: "Profile / Logout",
    icon: User,
    items: [
      {
        title: "User Info & Role",
      },
      {
        title: "Logout",
      },
    ]
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1">
          <h2 className="text-lg font-semibold">Revenue System</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.items && (
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton>
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}