import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { createRevenueSource, CreateRevenueSourceData } from "@/lib/services/sources/actions"

interface SourceSubmitDialogProps {
  onSourceCreated?: () => void
  trigger?: React.ReactNode
}

export function SourceSubmitDialog({ onSourceCreated, trigger }: SourceSubmitDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "" as 'market' | 'permit' | 'license' | 'property' | 'utility' | 'fine' | 'other' | "",
    category: "",
    description: "",
    standard_rate: "",
    minimum_amount: "",
    maximum_amount: "",
    frequency: "one_time" as 'one_time' | 'monthly' | 'quarterly' | 'annually',
    applicable_to: "",
    responsible_department: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("Source name is required")
      return
    }

    if (!formData.type) {
      alert("Source type is required")
      return
    }

    try {
      setIsSubmitting(true)

      const sourceData: CreateRevenueSourceData = {
        name: formData.name.trim(),
        type: formData.type as 'market' | 'permit' | 'license' | 'property' | 'utility' | 'fine' | 'other',
        category: formData.category.trim() || undefined,
        description: formData.description.trim() || undefined,
        standard_rate: formData.standard_rate ? parseFloat(formData.standard_rate) : undefined,
        minimum_amount: formData.minimum_amount ? parseFloat(formData.minimum_amount) : undefined,
        maximum_amount: formData.maximum_amount ? parseFloat(formData.maximum_amount) : undefined,
        frequency: formData.frequency as 'one_time' | 'monthly' | 'quarterly' | 'annually',
        applicable_to: formData.applicable_to.trim() || undefined,
        responsible_department: formData.responsible_department.trim() || undefined,
        created_by: 1 // TODO: Get from authenticated user
      }

      const result = await createRevenueSource(sourceData)

      if (result) {
        alert(`Revenue source "${result.name}" created successfully!`)
        setFormData({
          name: "",
          type: "",
          category: "",
          description: "",
          standard_rate: "",
          minimum_amount: "",
          maximum_amount: "",
          frequency: "one_time",
          applicable_to: "",
          responsible_department: "",
        })
        setOpen(false)
        onSourceCreated?.()
      }
    } catch (error: any) {
      console.error("Error creating revenue source:", error)
      alert(error.message || "Failed to create revenue source. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="h-4 w-4" />
      Add Revenue Source
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Revenue Source
          </DialogTitle>
          <DialogDescription>
            Add a new revenue source for Ghana's revenue collection system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Source Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Market Fees, Property Rates"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Type *
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="permit">Permit</SelectItem>
                  <SelectItem value="license">License</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="utility">Utility</SelectItem>
                  <SelectItem value="fine">Fine</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Input
                id="category"
                placeholder="e.g., Stall Fees"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this revenue source covers..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Standard Rate */}
            <div className="space-y-2">
              <Label htmlFor="standard_rate" className="text-sm font-medium">
                Standard Rate (GHS)
              </Label>
              <Input
                id="standard_rate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.standard_rate}
                onChange={(e) => handleInputChange("standard_rate", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Minimum Amount */}
            <div className="space-y-2">
              <Label htmlFor="minimum_amount" className="text-sm font-medium">
                Min Amount (GHS)
              </Label>
              <Input
                id="minimum_amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.minimum_amount}
                onChange={(e) => handleInputChange("minimum_amount", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Maximum Amount */}
            <div className="space-y-2">
              <Label htmlFor="maximum_amount" className="text-sm font-medium">
                Max Amount (GHS)
              </Label>
              <Input
                id="maximum_amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.maximum_amount}
                onChange={(e) => handleInputChange("maximum_amount", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency" className="text-sm font-medium">
                Frequency
              </Label>
              <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One Time</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applicable To */}
            <div className="space-y-2">
              <Label htmlFor="applicable_to" className="text-sm font-medium">
                Applicable To
              </Label>
              <Input
                id="applicable_to"
                placeholder="e.g., businesses, individuals"
                value={formData.applicable_to}
                onChange={(e) => handleInputChange("applicable_to", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Responsible Department */}
          <div className="space-y-2">
            <Label htmlFor="responsible_department" className="text-sm font-medium">
              Responsible Department
            </Label>
            <Input
              id="responsible_department"
              placeholder="e.g., Revenue Department, Local Government"
              value={formData.responsible_department}
              onChange={(e) => handleInputChange("responsible_department", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Source
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}