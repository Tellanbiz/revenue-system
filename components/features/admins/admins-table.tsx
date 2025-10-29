"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Shield, Crown, Phone, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { getUsers } from "@/lib/services/users/actions"

interface AdminRecord {
  id: number
  name: string
  email: string
  phone_number: string
  role: string
  status: string
  employee_id: string | null
  department: string | null
  created_at: Date
}

interface AdminsDataTableProps {
  admins?: AdminRecord[]
}

export function AdminsDataTable({ admins: initialAdmins }: AdminsDataTableProps) {
  const [admins, setAdmins] = useState<AdminRecord[]>(initialAdmins || [])
  const [loading, setLoading] = useState(!initialAdmins)

  useEffect(() => {
    if (!initialAdmins) {
      loadAdmins()
    }
  }, [initialAdmins])

  const loadAdmins = async () => {
    try {
      setLoading(true)
      // Get both supervisors and admins
      const [supervisorsResult, adminsResult] = await Promise.all([
        getUsers({ role: "supervisor" }),
        getUsers({ role: "admin" })
      ])

      const allAdmins = [
        ...(supervisorsResult.success ? supervisorsResult.users || [] : []),
        ...(adminsResult.success ? adminsResult.users || [] : [])
      ]

      setAdmins(allAdmins)
    } catch (error) {
      console.error("Failed to load admins:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? Crown : Shield
  }

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'text-purple-600' : 'text-blue-600'
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">
        {status}
      </Badge>
    )
  }

  const columns: ColumnDef<AdminRecord>[] = [
    {
      accessorKey: "employee_id",
      header: "Employee ID",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("employee_id") || "—"}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        const RoleIcon = getRoleIcon(role)
        return (
          <div className="font-medium flex items-center gap-2">
            <RoleIcon className={`h-4 w-4 ${getRoleColor(role)}`} />
            {row.getValue("name")}
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <Badge variant="outline" className="capitalize">
            {role}
          </Badge>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.getValue("phone_number")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => formatDate(row.getValue("created_at")),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading administrators...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={admins} />
    </div>
  )
}
