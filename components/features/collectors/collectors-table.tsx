"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { getUsers } from "@/lib/services/users/actions"

interface CollectorRecord {
  id: number
  name: string
  email: string
  phone_number: string
  role: string
  status: string
  employee_id: string | null
  department: string | null
  assembly_ward: string | null
  created_at: Date
}

interface CollectorsDataTableProps {
  collectors?: CollectorRecord[]
}

export function CollectorsDataTable({ collectors: initialCollectors }: CollectorsDataTableProps) {
  const [collectors, setCollectors] = useState<CollectorRecord[]>(initialCollectors || [])
  const [loading, setLoading] = useState(!initialCollectors)

  useEffect(() => {
    if (!initialCollectors) {
      loadCollectors()
    }
  }, [initialCollectors])

  const loadCollectors = async () => {
    try {
      setLoading(true)
      const result = await getUsers({ role: "collector" })
      if (result.success) {
        setCollectors(result.users || [])
      }
    } catch (error) {
      console.error("Failed to load collectors:", error)
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

  const columns: ColumnDef<CollectorRecord>[] = [
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
      cell: ({ row }) => (
        <div className="font-medium flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600" />
          {row.getValue("name")}
        </div>
      ),
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
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        const department = row.getValue("department") as string | null
        return (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{department || "—"}</span>
          </div>
        )
      },
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
          <p className="text-muted-foreground">Loading collectors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={collectors} />
    </div>
  )
}
