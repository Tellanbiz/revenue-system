"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function TopNavigation({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean)

    const breadcrumbs = []

    // Always start with Home
    breadcrumbs.push({
      label: <Home className="h-4 w-4" />,
      href: '/',
      isHome: true,
      isActive: false,
      key: 'home'
    })

    let currentPath = ''

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Skip 'dashboard' in breadcrumbs since it's redundant
      if (segment === 'dashboard') return

      // Format segment labels
      let label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())

      // Special formatting for common routes
      const routeLabels: Record<string, string> = {
        'collections': 'Revenue Collections',
        'permits': 'Permits & Licenses',
        'reconciliation': 'Reconciliation',
        'distribution': 'Revenue Distribution',
        'payments': 'Payment Channels',
        'users': 'Users & Roles',
        'setup': 'System Setup',
        'reports': 'Reports',
        'profile': 'Profile'
      }

      if (routeLabels[segment]) {
        label = routeLabels[segment]
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: index === pathSegments.length - 1,
        key: currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumbs if we're just on home/dashboard AND there are no children
  if (breadcrumbs.length <= 1 && !children) {
    return null
  }

  return (
    <header className="flex h-18 shrink-0 items-center gap-2 px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col flex-1 min-w-0">
        <Breadcrumb>
        <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.key || item.href || index}>
                <BreadcrumbItem>
                {index === 0 ? (
                    <BreadcrumbLink asChild>
                    <Link href={item.href}>
                        <span className="sr-only">Home</span>
                        {item.label}
                    </Link>
                    </BreadcrumbLink>
                ) : item.isActive ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                    <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
            ))}
        </BreadcrumbList>
        </Breadcrumb>
        </div>

        {/* Custom children content */}
        {children}

    </header>

  )
}