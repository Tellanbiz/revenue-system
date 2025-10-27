"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { createCollection } from "@/lib/services/collections/post"
import { getRevenueSources } from "@/lib/services/sources/actions"
import { ghanaAssemblies, ghanaPaymentMethods, collectionTypes } from "@/components/features/collection/data"
import { TopNavigation } from "@/components/navigation/top-navigation"

export default function NewCollectionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [revenueSources, setRevenueSources] = useState<any[]>([])
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    payment_method: "",
    transaction_reference: "",
    payment_date: new Date().toISOString().split('T')[0],
    revenue_source_id: "",
    assembly_ward: "",
    location_details: "",
    notes: "",
  })

  // Load revenue sources on component mount
  useEffect(() => {
    const loadRevenueSources = async () => {
      try {
        const sources = await getRevenueSources()
        if (sources && sources.length > 0) {
          setRevenueSources(sources)
        }
      } catch (error) {
        console.error("Failed to load revenue sources:", error)
        // Keep fallback sources
      }
    }
    loadRevenueSources()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    await handleSubmit()
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()

    // Basic validation
    if (!formData.type || !formData.amount || !formData.payment_method || !formData.payment_date || !formData.revenue_source_id) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)

      const collectionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        payment_date: new Date(formData.payment_date),
        collector_id: 1, // TODO: Get from authenticated user
        created_by: 1, // TODO: Get from authenticated user
        currency: "GHS",
        type: formData.type as "revenue" | "permit" | "license" | "fee" | "fine",
        payment_method: formData.payment_method as "cash" | "mobile_money" | "bank_transfer" | "card" | "check",
        revenue_source_id: formData.revenue_source_id ? parseInt(formData.revenue_source_id) : undefined
      }

      const result = await createCollection(collectionData)

      if (result) {
        alert(`Collection created successfully! Collection ${result.collection_number} has been recorded.`)
        router.push(`/dashboard/collections`)
      } else {
        alert("Failed to create collection")
      }
    } catch (error) {
      console.error("Error creating collection:", error)
      alert("Failed to create collection. Please check your input and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation/>
      {/* Top Navigation with Save Button */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold">New Collection</h1>
                <p className="text-sm text-muted-foreground">Record a new revenue collection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">

              <Button onClick={handleSave} disabled={isSubmitting} className="gap-2">
                Save
                {isSubmitting ? "Saving..." : "Save Collection"}
              </Button>
            </div>
          </div>
        </div>
        {/* Full-width bottom border extension */}
        <div className="w-full h-px bg-border"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-6">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Collection Details Section */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>
                Collection Details
              </CardTitle>
              <CardDescription>
                Basic information about this revenue collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Collection Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Collection Type *
                  </label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {collectionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Amount (GHS) *
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-4"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                    />
                  </div>
                </div>

                {/* Payment Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Payment Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => handleInputChange("payment_date", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information Section */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>
                Payment Information
              </CardTitle>
              <CardDescription>
                Details about how the payment was made
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method *</label>
                  <Select value={formData.payment_method} onValueChange={(value) => handleInputChange("payment_method", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {ghanaPaymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Revenue Source */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Revenue Source *</label>
                  <Select value={formData.revenue_source_id} onValueChange={(value) => handleInputChange("revenue_source_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select revenue source" />
                    </SelectTrigger>
                    <SelectContent>
                      {revenueSources.map((source) => (
                        <SelectItem key={source.id} value={source.id.toString()}>
                          <div className="flex flex-col">
                            <span>{source.name} <span className="text-xs text-muted-foreground">
                              ({source.code ? `Code: ${source.code}` : source.description})
                            </span></span>
                         
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transaction Reference */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transaction Reference</label>
                  <Input
                    placeholder="e.g., TXN-123456, REF-789012"
                    value={formData.transaction_reference}
                    onChange={(e) => handleInputChange("transaction_reference", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Reference number from payment provider</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>
                Location Information
              </CardTitle>
              <CardDescription>
                Where the collection took place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assembly/Ward */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Assembly/Ward</label>
                <Select value={formData.assembly_ward} onValueChange={(value) => handleInputChange("assembly_ward", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assembly/ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {ghanaAssemblies.slice(0, 50).map((assembly) => (
                      <SelectItem key={assembly} value={assembly}>
                        {assembly}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Administrative area where collection occurred</p>
              </div>

              {/* Location Details */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location Details</label>
                <textarea
                  placeholder="Specific location, landmark, or address details..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  value={formData.location_details}
                  onChange={(e) => handleInputChange("location_details", e.target.value)}
                />
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
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  placeholder="Any additional notes, comments, or special circumstances..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

   
        </div>
      </div>
    </div>
  )
}