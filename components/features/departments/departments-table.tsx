import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Building2, User } from "lucide-react"
import { useState, useEffect } from "react"
import { getDepartments } from "@/lib/services/distribution/get"

interface DepartmentRecord {
  id: number
  name: string
  code: string
  description?: string | null
  head_id?: number | null
  created_at: Date
}

interface DepartmentsDataTableProps {
  departments?: DepartmentRecord[]
}

export function DepartmentsDataTable({ departments: initialDepartments }: DepartmentsDataTableProps) {
  const [departments, setDepartments] = useState<DepartmentRecord[]>(initialDepartments || [])
  const [loading, setLoading] = useState(!initialDepartments)

  useEffect(() => {
    if (!initialDepartments) {
      loadDepartments()
    }
  }, [initialDepartments])

  const loadDepartments = async () => {
    try {
      setLoading(true)
      const data = await getDepartments()
      setDepartments(data)
    } catch (error) {
      console.error("Failed to load departments:", error)
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

  const columns: ColumnDef<DepartmentRecord>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <div className="font-medium text-sm">
          <Badge variant="outline" className="font-mono">
            {row.getValue("code")}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Department Name",
      cell: ({ row }) => (
        <div className="font-medium flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-600" />
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string | null
        return (
          <div className="max-w-xs">
            {description ? (
              <span className="text-sm text-muted-foreground">{description}</span>
            ) : (
              <span className="text-xs text-muted-foreground italic">No description</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "head_id",
      header: "Head",
      cell: ({ row }) => {
        const headId = row.getValue("head_id") as number | null
        return (
          <div className="flex items-center gap-2">
            {headId ? (
              <>
                <User className="h-4 w-4 text-green-600" />
                <span className="text-sm">Assigned</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-muted-foreground">Not assigned</span>
              </>
            )}
          </div>
        )
      },
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
          <p className="text-muted-foreground">Loading departments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={departments} />
    </div>
  )
}
