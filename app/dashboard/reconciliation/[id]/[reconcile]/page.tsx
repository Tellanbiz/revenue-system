"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Calendar,
  CreditCard,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  X,
  AlertTriangle
} from "lucide-react"
import { TopNavigation } from "@/components/navigation/top-navigation"
import { createReconciliation, checkTransactionExists } from "@/lib/services/reconciliation/post"
import { getCollection } from "@/lib/services/collections/post"

export const dynamic = 'force-dynamic'

interface ReconciliationData {
  transaction_reference: string
  reconciled_amount: string
  payment_source: string
  status: 'matched' | 'discrepancy' | 'unmatched'
  discrepancy_amount?: string
  discrepancy_reason?: string
  notes?: string
}

export default function ReconcilePage() {
  const router = useRouter()
  const params = useParams()
  const collectionId = params.id as string

  const [formData, setFormData] = useState<ReconciliationData>({
    transaction_reference: '',
    reconciled_amount: '',
    payment_source: 'bank_transfer',
    status: 'matched',
    discrepancy_amount: '',
    discrepancy_reason: '',
    notes: ''
  })

  const [collection, setCollection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [transactionExists, setTransactionExists] = useState(false)
  const [checkingTransaction, setCheckingTransaction] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchCollection = async () => {
      if (!collectionId) return

      try {
        const collectionData = await getCollection(parseInt(collectionId))
        if (!collectionData) {
          setLoading(false)
          return
        }

        setCollection(collectionData)

        // Auto-set payment source based on collection payment method
        const paymentSource = getPaymentSourceFromMethod(collectionData.payment_method)

        setFormData(prev => ({
          ...prev,
          reconciled_amount: collectionData.amount,
          payment_source: paymentSource
        }))
      } catch (error) {
        console.error('Error fetching collection:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollection()
  }, [collectionId])

  const validateTransactionReference = async (transactionRef: string) => {
    if (!transactionRef.trim()) {
      setTransactionExists(false)
      return
    }

    setCheckingTransaction(true)
    try {
      const exists = await checkTransactionExists(transactionRef)
      setTransactionExists(exists)
    } catch (error) {
      console.error('Error checking transaction:', error)
      setTransactionExists(false)
    } finally {
      setCheckingTransaction(false)
    }
  }

  const handleTransactionReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, transaction_reference: value })
    validateTransactionReference(value)
  }

  const formatCurrency = (amount: string) => {
    return `${collection?.currency || 'GHS'} ${parseFloat(amount || '0').toLocaleString('en-GH', { minimumFractionDigits: 2 })}`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPaymentSourceFromMethod = (paymentMethod: string) => {
    switch (paymentMethod) {
      case 'mobile_money':
        return 'mtn_momo' // Default to MTN, could be enhanced to detect specific provider
      case 'bank_transfer':
        return 'bank_transfer'
      case 'cash':
        return 'cash_deposit'
      case 'card':
        return 'card_payment'
      case 'check':
        return 'bank_transfer' // Checks are typically bank transfers
      default:
        return 'bank_transfer' // Default fallback
    }
  }

  const getPaymentSourceLabel = (paymentSource: string) => {
    switch (paymentSource) {
      case 'mtn_momo':
        return 'MTN Mobile Money'
      case 'airtel_momo':
        return 'Airtel Mobile Money'
      case 'vodafone_momo':
        return 'Vodafone Mobile Money'
      case 'bank_transfer':
        return 'Bank Transfer'
      case 'cash_deposit':
        return 'Cash Deposit'
      case 'card_payment':
        return 'Card Payment'
      default:
        return 'Bank Transfer'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent submission if transaction already exists
    if (transactionExists) {
      alert('Cannot reconcile: This transaction reference already exists in the system.')
      return
    }

    setSubmitting(true)

    try {
      // TODO: Get current user ID from authentication
      const currentUserId = 1 // Hardcoded for now

      const reconciliationData = {
        collection_id: collection.id,
        transaction_reference: formData.transaction_reference,
        payment_source: formData.payment_source,
        reconciled_amount: parseFloat(formData.reconciled_amount),
        currency: collection.currency,
        status: formData.status,
        discrepancy_amount: formData.discrepancy_amount ? parseFloat(formData.discrepancy_amount) : undefined,
        discrepancy_reason: formData.discrepancy_reason || undefined,
        reconciled_by: currentUserId,
        reconciled_at: new Date(),
        notes: formData.notes || undefined
      }

      const result = await createReconciliation(reconciliationData)

      if (result) {
        alert(`Reconciliation completed successfully! Collection ${collection.collection_number} has been reconciled.`)
        router.push('/dashboard/reconciliation/reconcile/pending')
      } else {
        alert('Failed to complete reconciliation. Please try again.')
      }
    } catch (error: any) {
      console.error('Error creating reconciliation:', error)

      if (error.message?.includes('already exists')) {
        alert('This collection has already been reconciled.')
      } else if (error.message?.includes('not found')) {
        alert('Collection not found. Please refresh and try again.')
      } else {
        alert('Failed to complete reconciliation. Please check your input and try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push('/dashboard/reconciliation/records')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'discrepancy':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case 'unmatched':
        return <X className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading collection details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Collection Not Found</h1>
            <p className="text-muted-foreground mb-6">The collection you're trying to reconcile could not be found.</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reconciliations
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      {/* Top Navigation with Complete Button */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Reconcile Collection #{collection.collection_number}</h1>
                <p className="text-sm text-muted-foreground">Match this collection with payment records</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSubmit}
                disabled={transactionExists || submitting}
                className="gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Complete Reconciliation
                  </>
                )}
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
        <Card className="shadow-sm mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Collection Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Collection #</Label>
                <p className="font-medium">#{collection.collection_number}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Date</Label>
                <p className="font-medium">{formatDate(collection.payment_date)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Amount</Label>
                <p className="font-medium text-lg">{formatCurrency(collection.amount)}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Type</Label>
                <Badge variant="secondary" className="capitalize">
                  {collection.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reconciliation Form */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Reconciliation Details
            </CardTitle>
            <CardDescription>
              Enter the payment details that match this collection
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Reference */}
              <div className="space-y-3">
                <Label htmlFor="transaction_reference" className="text-sm font-medium">Transaction Reference</Label>
                <div className="relative">
                  <Input
                    id="transaction_reference"
                    placeholder="Enter transaction reference number"
                    value={formData.transaction_reference}
                    onChange={handleTransactionReferenceChange}
                    required
                    className={`h-11 ${transactionExists ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {checkingTransaction && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                {transactionExists && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    This transaction reference already exists in the system
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Reference number from payment provider</p>
              </div>

              {/* Payment Source - Always Read-Only */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Payment Source</Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {getPaymentSourceLabel(formData.payment_source)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">
                    Automatically determined from collection payment method
                  </span>
                </div>
              </div>

              {/* Reconciled Amount */}
              <div className="space-y-3">
                <Label htmlFor="reconciled_amount" className="text-sm font-medium">Reconciled Amount</Label>
                <Input
                  id="reconciled_amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter reconciled amount"
                  value={formData.reconciled_amount}
                  onChange={(e) => setFormData({ ...formData, reconciled_amount: e.target.value })}
                  required
                  className="h-11"
                />
                <p className="text-sm text-muted-foreground">
                  Original amount: {formatCurrency(collection.amount)}
                </p>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Reconciliation Status</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'matched', label: 'Matched', desc: 'Amounts match exactly' },
                    { value: 'discrepancy', label: 'Discrepancy', desc: 'Amounts differ' },
                    { value: 'unmatched', label: 'Unmatched', desc: 'No matching payment' }
                  ].map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: status.value as any })}
                      className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                        formData.status === status.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(status.value)}
                        <span className="font-medium">{status.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{status.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Discrepancy Fields */}
              {formData.status === 'discrepancy' && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h3 className="font-medium text-sm text-orange-800">Discrepancy Details</h3>

                    <div className="space-y-3">
                      <Label htmlFor="discrepancy_amount" className="text-sm font-medium">Discrepancy Amount</Label>
                      <Input
                        id="discrepancy_amount"
                        type="number"
                        step="0.01"
                        placeholder="Enter discrepancy amount"
                        value={formData.discrepancy_amount}
                        onChange={(e) => setFormData({ ...formData, discrepancy_amount: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="discrepancy_reason" className="text-sm font-medium">Reason for Discrepancy</Label>
                      <Textarea
                        id="discrepancy_reason"
                        placeholder="Explain the discrepancy..."
                        value={formData.discrepancy_reason}
                        onChange={(e) => setFormData({ ...formData, discrepancy_reason: e.target.value })}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Notes */}
              <div className="space-y-3">
                <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this reconciliation..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="resize-none"
                />
              </div>

            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
