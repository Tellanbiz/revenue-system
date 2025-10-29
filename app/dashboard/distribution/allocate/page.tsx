"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createDistribution } from "@/lib/services/distribution/post"
import { getDepartments } from "@/lib/services/distribution/get"
import { getReconciliationsByStatus } from "@/lib/services/reconciliation/actions"
import { TopNavigation } from "@/components/navigation/top-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Save, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AllocateFundsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    collection_id: "",
    department_id: "",
    allocated_amount: "",
    percentage: "",
    notes: "",
  })

  const [collections, setCollections] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [showCollectionDialog, setShowCollectionDialog] = useState(false)
  const [collectionSearch, setCollectionSearch] = useState("")

  const selectedCollection = collections.find(c => c.id.toString() === formData.collection_id)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoadingData(true)

      // Get matched reconciliations - exactly as in the matched page
      const matched = await getReconciliationsByStatus('matched', 100)

      // Map reconciliations to collection-like objects for the UI
      const collectionsData = matched.map(reconciliation => ({
        id: reconciliation.collection_id,
        collection_number: `COLL-${reconciliation.collection_id}`,
        amount: reconciliation.reconciled_amount.toString(),
        reconciled: true,
        created_at: reconciliation.created_at,
        transaction_reference: reconciliation.transaction_reference,
      }))

      // Get departments
      const departmentsData = await getDepartments()

      console.log("Matched reconciliations:", matched.length)
      console.log("Collections from reconciliations:", collectionsData.length)
      setCollections(collectionsData)
      setDepartments(departmentsData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validation: Check if allocated amount exceeds collection amount
      if (formData.collection_id && formData.allocated_amount) {
        const selectedCollection = collections.find(c => c.id.toString() === formData.collection_id)
        if (selectedCollection) {
          const collectionAmount = parseFloat(selectedCollection.amount)
          const allocatedAmount = parseFloat(formData.allocated_amount)
          
          if (allocatedAmount > collectionAmount) {
            alert(`Cannot allocate GHS ${allocatedAmount.toFixed(2)}. Collection only has GHS ${collectionAmount.toFixed(2)} available.`)
            setLoading(false)
            return
          }
        }
      }

      const data = {
        collection_id: parseInt(formData.collection_id),
        department_id: parseInt(formData.department_id),
        allocated_amount: parseFloat(formData.allocated_amount),
        percentage: formData.percentage ? parseFloat(formData.percentage) : undefined,
        distributed_by: 1, // TODO: Get current user ID
        notes: formData.notes,
      }

      await createDistribution(data)
      router.push("/dashboard/distribution")
    } catch (error) {
      console.error("Failed to allocate funds:", error)
      alert("Failed to allocate funds. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Auto-calculate percentage when allocated amount changes (only if collection is selected)
    if (field === "allocated_amount" && value && formData.collection_id) {
      const selectedCollection = collections.find(c => c.id.toString() === formData.collection_id)
      if (selectedCollection) {
        const collectionAmount = parseFloat(selectedCollection.amount)
        const allocatedAmount = parseFloat(value)
        if (collectionAmount > 0 && allocatedAmount > 0) {
          const percentage = (allocatedAmount / collectionAmount) * 100
          setFormData(prev => ({ ...prev, percentage: percentage.toFixed(2) }))
        } else {
          setFormData(prev => ({ ...prev, percentage: "" }))
        }
      }
    }
  }

  const handleCollectionSelect = (collection: any) => {
    handleChange("collection_id", collection.id.toString())
    setShowCollectionDialog(false)
    setCollectionSearch("")
  }

  const filteredCollections = collections.filter(collection =>
    collection.collection_number.toLowerCase().includes(collectionSearch.toLowerCase())
  )

  if (loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation />
        <div className="container mx-auto py-8 px-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      {/* Top Navigation with Allocate Button */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold">Allocate Funds</h1>
                <p className="text-sm text-muted-foreground">Distribute reconciled collection funds to departments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSubmit} disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                {loading ? "Allocating..." : "Allocate Funds"}
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full h-px bg-border"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-6">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Collection Selection Section */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>
                Collection Selection
              </CardTitle>
              <CardDescription>
                Choose which reconciled collection to allocate funds from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="collection_id" className="text-sm font-medium flex items-center gap-2">
                    Collection *
                  </Label>
                  <div className="relative">
                    <Input
                      id="collection_id"
                      value={selectedCollection ? `${selectedCollection.collection_number} - GHS ${parseFloat(selectedCollection.amount).toFixed(2)}` : ""}
                      onClick={() => setShowCollectionDialog(true)}
                      placeholder="Click to select a collection"
                      readOnly
                      required
                      className="cursor-pointer pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowCollectionDialog(true)
                      }}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                    <Dialog 
                      open={showCollectionDialog} 
                      onOpenChange={setShowCollectionDialog}
                    >
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Select Collection</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search collections..."
                              value={collectionSearch}
                              onChange={(e) => setCollectionSearch(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <div className="max-h-64 overflow-y-auto space-y-2">
                            {filteredCollections.map((collection) => (
                              <div
                                key={collection.id}
                                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => handleCollectionSelect(collection)}
                              >
                                <div className="font-medium">{collection.collection_number}</div>
                                <div className="text-sm text-gray-600">
                                  Amount: GHS {parseFloat(collection.amount).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(collection.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                            {filteredCollections.length === 0 && (
                              <div className="text-center text-gray-500 py-8">
                                No collections found
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-xs text-muted-foreground">Collections available for allocation (debugging: showing all)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allocation Details Section */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>
                Allocation Details
              </CardTitle>
              <CardDescription>
                Specify how much to allocate and to which department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Department Selection */}
                <div className="space-y-2">
                  <Label htmlFor="department_id" className="text-sm font-medium flex items-center gap-2">
                    Department *
                  </Label>
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

                {/* Amount and Percentage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="allocated_amount" className="text-sm font-medium flex items-center gap-2">
                      Allocated Amount (GHS) *
                    </Label>
                    <Input
                      id="allocated_amount"
                      type="number"
                      step="0.01"
                      value={formData.allocated_amount}
                      onChange={(e) => handleChange("allocated_amount", e.target.value)}
                      required
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="percentage" className="text-sm font-medium">
                      Percentage (%)
                    </Label>
                    <Input
                      id="percentage"
                      type="number"
                      step="0.01"
                      value={formData.percentage}
                      readOnly
                      placeholder="Auto-calculated"
                      className="bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>
                Additional Information
              </CardTitle>
              <CardDescription>
                Optional notes and additional details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Any additional notes about this allocation..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
