"use server"

import { db } from "@/lib/database/drizzle"
import { revenueSourcesTable } from "@/lib/database/schema/revenue-sources"
import { eq, and, gte, lt, sql } from "drizzle-orm"

export interface CreateRevenueSourceData {
  code?: string // Auto-generated if not provided
  name: string
  type: 'market' | 'permit' | 'license' | 'property' | 'utility' | 'fine' | 'other'
  category?: string
  subcategory?: string
  description?: string
  requirements?: string
  applicable_to?: string
  responsible_department?: string
  applicable_assemblies?: string
  standard_rate?: number
  minimum_amount?: number
  maximum_amount?: number
  currency?: string
  frequency?: 'one_time' | 'monthly' | 'quarterly' | 'annually'
  notes?: string
  effective_date?: Date
  expiry_date?: Date
  created_by?: number
}

export async function createRevenueSource(data: CreateRevenueSourceData) {
  // Check if source with this name already exists
  const existing = await db
    .select()
    .from(revenueSourcesTable)
    .where(eq(revenueSourcesTable.name, data.name))
    .limit(1)

  if (existing.length > 0) {
    throw new Error(`Revenue source with name "${data.name}" already exists`)
  }

  // Generate unique code if not provided
  const code = data.code || await generateRevenueSourceCode()

  const newSource = {
    code,
    name: data.name,
    type: data.type,
    category: data.category,
    subcategory: data.subcategory,
    description: data.description,
    requirements: data.requirements,
    applicable_to: data.applicable_to,
    responsible_department: data.responsible_department,
    applicable_assemblies: data.applicable_assemblies,
    standard_rate: data.standard_rate ? data.standard_rate.toString() : undefined,
    minimum_amount: data.minimum_amount ? data.minimum_amount.toString() : undefined,
    maximum_amount: data.maximum_amount ? data.maximum_amount.toString() : undefined,
    currency: data.currency || 'GHS',
    frequency: data.frequency || 'one_time',
    notes: data.notes,
    effective_date: data.effective_date || new Date(),
    expiry_date: data.expiry_date,
    created_by: data.created_by
  }

  const [source] = await db
    .insert(revenueSourcesTable)
    .values(newSource)
    .returning()

  return source
}

// Generate unique revenue source code
async function generateRevenueSourceCode(): Promise<string> {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2) // Last 2 digits of year
  const month = String(now.getMonth() + 1).padStart(2, '0')

  // Get the count of sources created this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(revenueSourcesTable)
    .where(and(
      gte(revenueSourcesTable.created_at, startOfMonth),
      lt(revenueSourcesTable.created_at, endOfMonth)
    ))

  const sequence = String(count + 1).padStart(4, '0')
  return `RS-${year}${month}-${sequence}`
}

export interface UpdateRevenueSourceData {
  name?: string
  type?: 'market' | 'permit' | 'license' | 'property' | 'utility' | 'fine' | 'other'
  category?: string
  subcategory?: string
  description?: string
  requirements?: string
  applicable_to?: string
  responsible_department?: string
  applicable_assemblies?: string
  standard_rate?: number
  minimum_amount?: number
  maximum_amount?: number
  currency?: string
  frequency?: 'one_time' | 'monthly' | 'quarterly' | 'annually'
  is_active?: boolean
  notes?: string
  effective_date?: Date
  expiry_date?: Date
}

export async function updateRevenueSource(id: number, data: UpdateRevenueSourceData, updatedBy?: number) {
  const updateData: any = {
    ...data,
    updated_at: new Date()
  }

  // Handle decimal fields conversion
  if (data.standard_rate !== undefined) {
    updateData.standard_rate = data.standard_rate ? data.standard_rate.toString() : null
  }
  if (data.minimum_amount !== undefined) {
    updateData.minimum_amount = data.minimum_amount ? data.minimum_amount.toString() : null
  }
  if (data.maximum_amount !== undefined) {
    updateData.maximum_amount = data.maximum_amount ? data.maximum_amount.toString() : null
  }

  // Set updated_by if provided
  if (updatedBy) {
    updateData.updated_by = updatedBy
  }

  // If updating name, check for uniqueness
  if (data.name) {
    const existing = await db
      .select()
      .from(revenueSourcesTable)
      .where(eq(revenueSourcesTable.name, data.name))
      .limit(1)

    if (existing.length > 0 && existing[0].id !== id) {
      throw new Error(`Revenue source with name "${data.name}" already exists`)
    }
  }

  const [source] = await db
    .update(revenueSourcesTable)
    .set(updateData)
    .where(eq(revenueSourcesTable.id, id))
    .returning()

  return source || null
}

export async function deleteRevenueSource(id: number) {
  const [source] = await db
    .delete(revenueSourcesTable)
    .where(eq(revenueSourcesTable.id, id))
    .returning()

  return source || null
}