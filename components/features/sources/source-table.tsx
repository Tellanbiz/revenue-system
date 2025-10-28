"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Edit,
  Trash2,
} from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

export interface RevenueSource {
  id: number
  code: string
  name: string
  type: 'market' | 'permit' | 'license' | 'property' | 'utility' | 'fine' | 'other'
  category: string | null
  subcategory: string | null
  description: string | null
  requirements: string | null
  applicable_to: string | null
  responsible_department: string | null
  applicable_assemblies: string | null
  standard_rate: string | null
  minimum_amount: string | null
  maximum_amount: string | null
  currency: string | null
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'annually' | null
  is_active: boolean
  notes: string | null
  effective_date: Date
  expiry_date: Date | null
  created_at: Date
  updated_at: Date
  created_by: number | null
  updated_by: number | null
}

interface SourceTableProps {
  sources: RevenueSource[]
  loading: boolean
  onEdit?: (source: RevenueSource) => void
  onDelete?: (source: RevenueSource) => void
}

export function SourceTable({
  sources,
  loading,
  onEdit,
  onDelete
}: SourceTableProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeBadge = (type: string) => {
    return (
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded capitalize">
        {type.replace('_', ' ')}
      </span>
    )
  }

  const getFrequencyBadge = (frequency: string | null) => {
    if (!frequency) return null
    return (
      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded capitalize">
        {frequency.replace('_', ' ')}
      </span>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs rounded ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading revenue sources...</p>
        </div>
      </div>
    )
  }

  if (sources.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No revenue sources found</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="font-medium font-mono">{source.code}</TableCell>
                <TableCell className="font-medium">{source.name}</TableCell>
                <TableCell>{getTypeBadge(source.type)}</TableCell>
                <TableCell>{source.category || 'N/A'}</TableCell>
                <TableCell>{getFrequencyBadge(source.frequency)}</TableCell>
                <TableCell>
                  {source.standard_rate ? `${source.currency || 'GHS'} ${source.standard_rate}` : 'N/A'}
                </TableCell>
                <TableCell>{source.responsible_department || 'N/A'}</TableCell>
                <TableCell>{getStatusBadge(source.is_active)}</TableCell>
                <TableCell>{formatDate(source.effective_date)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(source)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(source)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}