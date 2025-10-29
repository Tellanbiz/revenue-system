"use client"

import { TopNavigation } from "@/components/navigation/top-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Shield, Building2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  return (
    <div className="flex flex-col">
      <TopNavigation />
      <div className=" py-8 px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Collectors */}
          <Link href="/dashboard/users/collectors">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <CardTitle className="text-lg">Collectors</CardTitle>
                <CardDescription>
                  Manage field collectors and their assignments
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Supervisors & Admins */}
          <Link href="/dashboard/users/admins">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <CardTitle className="text-lg">Supervisors & Admins</CardTitle>
                <CardDescription>
                  Manage system administrators and supervisors
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Departments & Assemblies */}
          <Link href="/dashboard/users/departments">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <CardTitle className="text-lg">Departments & Assemblies</CardTitle>
                <CardDescription>
                  Manage organizational structure and administrative divisions
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}