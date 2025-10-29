"use client"

import { useState, useEffect } from "react"
import { createDistribution } from "@/lib/services/distribution/post"
import { updateDistribution } from "@/lib/services/distribution/actions"
import { getDepartments } from "@/lib/services/distribution/get"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DistributionDialogProps {
  open: boolean
  onOpenChange: (refresh?: boolean) => void
  distribution?: any
  collections: any[]
}

export function DistributionDialog({ open, onOpenChange, distribution, collections }: DistributionDialogProps) {
  const [formData, setFormData] = useState({
    collection_id: distribution?.collection_id || "",
    department_id: distribution?.department_id || "",
    allocated_amount: distribution?.allocated_amount || "",
    percentage: distribution?.percentage || "",
    notes: distribution?.notes || "",
  })

  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadDepartments()
    }
  }, [open])

  const loadDepartments = async () => {
    try {
      const data = await getDepartments()
      setDepartments(data)
    } catch (error) {
      console.error("Failed to load departments:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        collection_id: parseInt(formData.collection_id),
        department_id: parseInt(formData.department_id),
        allocated_amount: parseFloat(formData.allocated_amount),
        percentage: formData.percentage ? parseFloat(formData.percentage) : undefined,
        distributed_by: 1, // TODO: Get current user ID
        notes: formData.notes,
      }

      if (distribution) {
        await updateDistribution({ id: distribution.id, ...data })
      } else {
        await createDistribution(data)
      }
      onOpenChange(true) // refresh data
    } catch (error) {
      console.error("Failed to save distribution:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{distribution ? "Edit Distribution" : "Allocate Funds"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="collection_id">Collection</Label>
            <Select value={formData.collection_id} onValueChange={(value) => handleChange("collection_id", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select reconciled collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id.toString()}>
                    {collection.collection_number} - GHS {parseFloat(collection.amount).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department_id">Department</Label>
            <Select value={formData.department_id} onValueChange={(value) => handleChange("department_id", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name} ({dept.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="allocated_amount">Allocated Amount</Label>
              <Input
                id="allocated_amount"
                type="number"
                step="0.01"
                value={formData.allocated_amount}
                onChange={(e) => handleChange("allocated_amount", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage (Optional)</Label>
              <Input
                id="percentage"
                type="number"
                step="0.01"
                value={formData.percentage}
                onChange={(e) => handleChange("percentage", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {distribution ? "Update" : "Allocate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
