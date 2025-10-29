"use server"

import { db } from "@/lib/database/drizzle"
import { reconciliationTable, collectionsTable } from "@/lib/database/schema/collections"
import { eq } from "drizzle-orm"

export interface CreateReconciliationData {
  collection_id: number
  transaction_reference: string
  payment_source?: string
  reconciled_amount: number
  currency?: string
  status?: typeof import("@/lib/database/schema/collections").reconciliationStatusEnum.enumValues[number]
  discrepancy_amount?: number
  discrepancy_reason?: string
  reconciled_by: number
  reconciled_at?: Date
  notes?: string
}

export async function createReconciliation(data: CreateReconciliationData) {
  // Verify that the collection exists
  const [collection] = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.id, data.collection_id))
    .limit(1)

  if (!collection) {
    throw new Error(`Collection with ID ${data.collection_id} not found`)
  }

  // Check if reconciliation already exists for this collection
  const [existing] = await db
    .select()
    .from(reconciliationTable)
    .where(eq(reconciliationTable.collection_id, data.collection_id))
    .limit(1)

  if (existing) {
    throw new Error(`Reconciliation already exists for collection ${data.collection_id}`)
  }

  const newReconciliation = {
    collection_id: data.collection_id,
    transaction_reference: data.transaction_reference,
    payment_source: data.payment_source,
    reconciled_amount: data.reconciled_amount.toString(),
    currency: data.currency || 'GHS',
    status: data.status || 'pending',
    discrepancy_amount: data.discrepancy_amount ? data.discrepancy_amount.toString() : undefined,
    discrepancy_reason: data.discrepancy_reason,
    reconciled_by: data.reconciled_by,
    reconciled_at: data.reconciled_at || new Date(),
    notes: data.notes,
  }

  const [reconciliation] = await db
    .insert(reconciliationTable)
    .values(newReconciliation)
    .returning()

  // If the reconciliation status is 'matched', update the collection to be reconciled
  if (newReconciliation.status === 'matched') {
    await db
      .update(collectionsTable)
      .set({
        reconciled: true,
        reconciled_at: newReconciliation.reconciled_at,
        reconciled_by: newReconciliation.reconciled_by,
        updated_at: new Date()
      })
      .where(eq(collectionsTable.id, data.collection_id))
  }

  return reconciliation
}

export interface UpdateReconciliationData {
  transaction_reference?: string
  payment_source?: string
  reconciled_amount?: number
  currency?: string
  status?: typeof import("@/lib/database/schema/collections").reconciliationStatusEnum.enumValues[number]
  discrepancy_amount?: number
  discrepancy_reason?: string
  reconciled_at?: Date
  notes?: string
}

export async function updateReconciliation(id: number, data: UpdateReconciliationData, updatedBy?: number) {
  const updateData: any = {
    ...data,
    updated_at: new Date()
  }

  // Handle decimal fields conversion
  if (data.reconciled_amount !== undefined) {
    updateData.reconciled_amount = data.reconciled_amount.toString()
  }
  if (data.discrepancy_amount !== undefined) {
    updateData.discrepancy_amount = data.discrepancy_amount ? data.discrepancy_amount.toString() : null
  }

  const [reconciliation] = await db
    .update(reconciliationTable)
    .set(updateData)
    .where(eq(reconciliationTable.id, id))
    .returning()

  // If the reconciliation status is 'matched', update the collection to be reconciled
  if (data.status === 'matched' && reconciliation) {
    await db
      .update(collectionsTable)
      .set({
        reconciled: true,
        reconciled_at: new Date(),
        reconciled_by: reconciliation.reconciled_by,
        updated_at: new Date()
      })
      .where(eq(collectionsTable.id, reconciliation.collection_id))
  }

  return reconciliation || null
}

export async function deleteReconciliation(id: number) {
  const [reconciliation] = await db
    .delete(reconciliationTable)
    .where(eq(reconciliationTable.id, id))
    .returning()

  return reconciliation || null
}

export async function checkTransactionExists(transactionReference: string): Promise<boolean> {
  if (!transactionReference.trim()) {
    return false
  }

  const [existing] = await db
    .select()
    .from(reconciliationTable)
    .where(eq(reconciliationTable.transaction_reference, transactionReference))
    .limit(1)

  return !!existing
}