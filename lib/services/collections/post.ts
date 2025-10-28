"use server"

import { db } from "@/lib/database/drizzle"
import { collectionsTable } from "@/lib/database/schema/collections"
import { eq, and } from "drizzle-orm"

// Generate collection number utility function
async function generateCollectionNumber(): Promise<string> {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  // Get the count of collections for today
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(collectionsTable)
    .where(and(
      gte(collectionsTable.created_at, startOfDay),
      lt(collectionsTable.created_at, endOfDay)
    ))

  const sequence = String(count + 1).padStart(4, '0')
  return `COL-${year}${month}${day}-${sequence}`
}

import { sql, gte, lt } from "drizzle-orm"

export interface CreateCollectionData {
  collector_id: number
  taxpayer_id?: number
  type: 'revenue' | 'permit' | 'license' | 'fee' | 'fine'
  amount: number
  currency?: string
  payment_method: 'cash' | 'mobile_money' | 'bank_transfer' | 'card' | 'check'
  transaction_reference?: string
  payment_date: Date
  notes?: string
  revenue_source_id?: number // Reference to revenue_sources table
  assembly_ward?: string
  location_details?: string
  created_by?: number
}

export async function createCollection(data: CreateCollectionData) {
  // Generate collection number
  const collectionNumber = await generateCollectionNumber()

  const newCollection = {
    collection_number: collectionNumber,
    collector_id: data.collector_id,
    taxpayer_id: data.taxpayer_id,
    type: data.type,
    amount: data.amount.toString(), // Decimal as string
    currency: data.currency || 'GHS',
    payment_method: data.payment_method,
    transaction_reference: data.transaction_reference,
    payment_date: data.payment_date,
    notes: data.notes,
    revenue_source_id: data.revenue_source_id,
    assembly_ward: data.assembly_ward,
    location_details: data.location_details,
    created_by: data.created_by,
    status: 'pending' as const,
    reconciled: false
  }

  const [collection] = await db
    .insert(collectionsTable)
    .values(newCollection)
    .returning()

  return collection
}

export interface UpdateCollectionData {
  taxpayer_id?: number
  type?: 'revenue' | 'permit' | 'license' | 'fee' | 'fine'
  amount?: number
  currency?: string
  payment_method?: 'cash' | 'mobile_money' | 'bank_transfer' | 'card' | 'check'
  transaction_reference?: string
  payment_date?: Date
  notes?: string
  revenue_source_id?: number // Reference to revenue_sources table
  assembly_ward?: string
  location_details?: string
}

export async function updateCollection(id: number, data: UpdateCollectionData, updatedBy?: number) {
  const updateData: any = {
    ...data,
    updated_at: new Date()
  }

  if (data.amount !== undefined) {
    updateData.amount = data.amount.toString()
  }

  if (updatedBy) {
    updateData.updated_by = updatedBy
  }

  const [collection] = await db
    .update(collectionsTable)
    .set(updateData)
    .where(eq(collectionsTable.id, id))
    .returning()

  return collection || null
}

export async function approveCollection(id: number, approvedBy: number) {
  const [collection] = await db
    .update(collectionsTable)
    .set({
      status: 'completed',
      approved_by: approvedBy,
      approved_at: new Date(),
      updated_at: new Date()
    })
    .where(and(
      eq(collectionsTable.id, id),
      eq(collectionsTable.status, 'pending')
    ))
    .returning()

  return collection || null
}

export async function reconcileCollection(id: number, reconciledBy: number) {
  const [collection] = await db
    .update(collectionsTable)
    .set({
      reconciled: true,
      reconciled_at: new Date(),
      reconciled_by: reconciledBy,
      updated_at: new Date()
    })
    .where(eq(collectionsTable.id, id))
    .returning()

  return collection || null
}

export async function cancelCollection(id: number, cancelledBy: number, reason?: string) {
  const [collection] = await db
    .update(collectionsTable)
    .set({
      status: 'cancelled',
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled',
      updated_at: new Date()
    })
    .where(and(
      eq(collectionsTable.id, id),
      eq(collectionsTable.status, 'pending')
    ))
    .returning()

  return collection || null
}

export async function refundCollection(id: number, refundedBy: number, reason?: string) {
  const [collection] = await db
    .update(collectionsTable)
    .set({
      status: 'refunded',
      notes: reason ? `Refunded: ${reason}` : 'Refunded',
      updated_at: new Date()
    })
    .where(eq(collectionsTable.id, id))
    .returning()

  return collection || null
}

export async function getCollection(id: number) {
  const [collection] = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.id, id))
    .limit(1)

  return collection || null
}