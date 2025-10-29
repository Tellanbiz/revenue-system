"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Building2,
  ChevronDown,
  LogOut,
  Search,
  User as UserIcon,
} from "lucide-react"
import { menuItems } from "./data"
import { getCurrentUserForClient } from "@/lib/services/shared/utils"

export function AppSidebar({ className }: { className?: string }) {
  // Initialize with all expandable menu items expanded
  const getAllExpandableItems = () => {
    return menuItems
      .filter(item => item.items && item.items.length > 0)
      .map(item => item.title)
  }

  const [activeItem, setActiveItem] = useState("Dashboard")
  const [expandedItems, setExpandedItems] = useState<string[]>(getAllExpandableItems())
  const [searchQuery, setSearchQuery] = useState("")
  const [currentUser, setCurrentUser] = useState<{
    name: string
    email: string
    role: string
    avatar: string | null
  }>({
    name: "Loading...",
    email: "",
    role: "",
    avatar: null
  })
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const result = await getCurrentUserForClient()
        if (result.user) {
          setCurrentUser({
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            avatar: result.user.avatar
          })
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        setCurrentUser({
          name: "Guest User",
          email: "",
          role: "Not logged in",
          avatar: null
        })
      }
    }

    fetchCurrentUser()
  }, [])

  // Auto-expand parent items when their sub-items are active
  useEffect(() => {
    // All sections are always expanded, no need for dynamic expansion
  }, [pathname])

  const toggleExpanded = (itemTitle: string) => {
    // Function kept for potential future use, but not currently used
    setExpandedItems((prev) =>
      prev.includes(itemTitle)
        ? prev.filter((item) => item !== itemTitle)
        : [...prev, itemTitle]
    )
  }

  // Filter navigation items based on search
  const filteredItems = menuItems.filter((item) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const titleMatch = item.title.toLowerCase().includes(query)
    const subItemMatch = item.items?.some((sub) =>
      sub.title.toLowerCase().includes(query)
    )
    return titleMatch || subItemMatch
  })

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 font-sans flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 pt-4 items-center flex-shrink-0 bg-white">
        <div className="flex items-center space-x-3 pt-4 pb-2 px-2">
          <Building2 className="w-6 h-6 text-primary" />

          <div>
            <h1 className="font-bold text-gray-900 text-base tracking-tight">
              Revenue System
            </h1>
            <p className="text-xs text-gray-500 font-medium">Ghana Revenue Hub</p>
          </div>
        </div>
      </div>

     

      {/* Navigation */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full py-3">
          <nav className="px-3 space-y-1">
            {filteredItems.map((item) => {
              const Icon = item.icon
              const hasSubItems = item.items && item.items.length > 0

              // Simple active check: exact URL match for item or any sub-item
              const isActive = (item.url && pathname === item.url) ||
                              (hasSubItems && item.items.some(sub => pathname === sub.url))

              return (
                <div key={item.title} className="mb-1 space-y-2">
                  {item.url ? (
                    <Link href={item.url}>
                      <Button
                        variant="ghost"
                        onClick={() => setActiveItem(item.title)}
                        className={cn(
                          "w-full justify-start h-9 px-3 mb-1 text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium text-sm rounded-lg transition-all group",
                          isActive && "bg-primary/10 text-primary border-primary/20"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 mr-2 transition-all",
                            isActive
                              ? "text-primary"
                              : "text-gray-500 group-hover:text-gray-700"
                          )}
                        />
                        <span className="flex-1 text-left">{item.title}</span>
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setActiveItem(item.title)
                        if (hasSubItems && item.items && item.items.length > 0) {
                          // Always navigate to the first sub-item since sections are always expanded
                          router.push(item.items[0].url)
                        }
                      }}
                      className={cn(
                        "w-full justify-start h-9 px-3 mb-1 text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium text-sm rounded-lg transition-all group",
                        isActive && "bg-primary/10 text-primary border-primary/20"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 mr-2 transition-all",
                          isActive
                            ? "text-primary"
                            : "text-gray-500 group-hover:text-gray-700"
                        )}
                      />
                      <span className="flex-1 text-left">{item.title}</span>
                      {hasSubItems && (
                        <ChevronDown
                          className="h-4 w-4 text-gray-500 rotate-180"
                        />
                      )}
                    </Button>
                  )}

                  {hasSubItems && (
                    <div className="mt-1 space-y-0.5 ml-3 pl-3 border-l-2 border-gray-200">
                      {item.items?.map((subItem) => (
                        <Link key={subItem.title} href={subItem.url || '#'}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start h-8 pl-3 pr-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-normal text-sm rounded-lg transition-all group",
                              pathname === subItem.url && "text-primary bg-primary/10 hover:text-primary"
                            )}
                          >
                            <span className="ml-1 text-left flex items-center">
                              {subItem.title}
                            </span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </ScrollArea>
      </div>

      {/* Profile Section */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="p-4">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-lg flex items-center justify-center shadow-sm ring-2 ring-primary/20 transition-all group-hover:ring-primary/40">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {currentUser.name}
              </div>
              <div className="text-xs text-gray-500 font-medium truncate">
                {currentUser.role}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}