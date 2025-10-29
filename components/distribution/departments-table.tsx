"use client"

import { useState, useEffect } from "react"
import { getDepartments } from "@/lib/services/distribution/get"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DepartmentDialog } from "./department-dialog"

const columns = [
  {
    id: "code",
    accessorKey: "code",
    header: "Code",
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "head",
    accessorKey: "head.name",
    header: "Head",
  },
  {
    id: "is_active",
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }: { row: any }) => row.original.is_active ? "Yes" : "No",
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }: { row: any }) => new Date(row.original.created_at).toLocaleDateString(),
  },
]

interface DepartmentsTableProps {
  onEditDepartment?: (department: any) => void
}

export function DepartmentsTable({ onEditDepartment }: DepartmentsTableProps) {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)

  useEffect(() => {
    loadDepartments()
  }, [])

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

  const handleCreate = () => {
    setSelectedDepartment(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (department: any) => {
    setSelectedDepartment(department)
    setIsDialogOpen(true)
    onEditDepartment?.(department)
  }

  const handleDialogClose = (refresh?: boolean) => {
    setIsDialogOpen(false)
    if (refresh) {
      loadDepartments()
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Departments</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={departments}
        searchColumn="name"
        searchPlaceholder="Filter departments..."
      />

      <DepartmentDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        department={selectedDepartment}
      />
    </div>
  )
}
