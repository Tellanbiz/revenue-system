"use server"

import { db } from "@/lib/database/drizzle"
import { collectionsTable } from "@/lib/database/schema/collections"
import { eq, desc, sql, like, or, gte, lte, and } from "drizzle-orm"
import { CollectionFilters, CollectionStats } from "./actions"

export async function getCollections(limit = 50) {
  const collections = await db
    .select()
    .from(collectionsTable)
    .orderBy(desc(collectionsTable.created_at))
    .limit(limit)

  return collections
}

export async function getCollectionById(id: number) {
  const [collection] = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.id, id))

  return collection || null
}

export async function getCollectionsByCollector(collectorId: number, limit = 50) {
  const collections = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.collector_id, collectorId))
    .orderBy(desc(collectionsTable.created_at))
    .limit(limit)

  return collections
}

export async function getCollectionsByStatus(status: 'pending' | 'completed' | 'cancelled' | 'refunded', limit = 50) {
  const collections = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.status, status))
    .orderBy(desc(collectionsTable.created_at))
    .limit(limit)

  return collections
}

export async function getCollectionStats() {
  const result = await db
    .select({
      totalCollections: sql<number>`count(*)`,
      totalAmount: sql<number>`sum(${collectionsTable.amount})`,
      pendingCollections: sql<number>`count(case when ${collectionsTable.status} = 'pending' then 1 end)`,
      completedCollections: sql<number>`count(case when ${collectionsTable.status} = 'completed' then 1 end)`,
      cancelledCollections: sql<number>`count(case when ${collectionsTable.status} = 'cancelled' then 1 end)`,
      reconciledCollections: sql<number>`count(case when ${collectionsTable.reconciled} = true then 1 end)`
    })
    .from(collectionsTable)

  return result[0]
}

export async function getCollectionsByRevenueSource(revenueSourceId: number, limit = 50) {
  const collections = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.revenue_source_id, revenueSourceId))
    .orderBy(desc(collectionsTable.created_at))
    .limit(limit)

  return collections
}

export async function getCollectionsByAssembly(assemblyWard: string, limit = 50) {
  const collections = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.assembly_ward, assemblyWard))
    .orderBy(desc(collectionsTable.created_at))
    .limit(limit)

  return collections
}

export async function searchCollections(searchTerm: string, limit = 50) {
  const collections = await db
    .select()
    .from(collectionsTable)
    .where(sql`
      ${collectionsTable.collection_number} ILIKE ${`%${searchTerm}%`} OR
      ${collectionsTable.transaction_reference} ILIKE ${`%${searchTerm}%`} OR
      ${collectionsTable.assembly_ward} ILIKE ${`%${searchTerm}%`} OR
      ${collectionsTable.notes} ILIKE ${`%${searchTerm}%`}
    `)
    .orderBy(desc(collectionsTable.created_at))
    .limit(limit)

  return collections
}

export async function getCollectionsWithFilters(filters: CollectionFilters, page = 1, limit = 50) {
  const offset = (page - 1) * limit

  // Build where conditions
  const whereConditions = []

  if (filters.status?.length) {
    whereConditions.push(sql`${collectionsTable.status} = ANY(${filters.status})`)
  }

  if (filters.type?.length) {
    whereConditions.push(sql`${collectionsTable.type} = ANY(${filters.type})`)
  }

  if (filters.paymentMethod?.length) {
    whereConditions.push(sql`${collectionsTable.payment_method} = ANY(${filters.paymentMethod})`)
  }

  if (filters.collectorId) {
    whereConditions.push(eq(collectionsTable.collector_id, filters.collectorId))
  }

  if (filters.revenueSourceId) {
    whereConditions.push(eq(collectionsTable.revenue_source_id, filters.revenueSourceId))
  }

  if (filters.assemblyWard) {
    whereConditions.push(like(collectionsTable.assembly_ward, `%${filters.assemblyWard}%`))
  }

  if (filters.dateFrom) {
    whereConditions.push(gte(collectionsTable.payment_date, filters.dateFrom))
  }

  if (filters.dateTo) {
    whereConditions.push(lte(collectionsTable.payment_date, filters.dateTo))
  }

  if (filters.amountMin) {
    whereConditions.push(gte(collectionsTable.amount, filters.amountMin.toString()))
  }

  if (filters.amountMax) {
    whereConditions.push(lte(collectionsTable.amount, filters.amountMax.toString()))
  }

  if (filters.search) {
    whereConditions.push(
      or(
        like(collectionsTable.collection_number, `%${filters.search}%`),
        like(collectionsTable.transaction_reference, `%${filters.search}%`),
        like(collectionsTable.assembly_ward, `%${filters.search}%`),
        like(collectionsTable.notes, `%${filters.search}%`)
      )
    )
  }

  if (filters.reconciled !== undefined) {
    whereConditions.push(eq(collectionsTable.reconciled, filters.reconciled))
  }

  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

  // Get collections with count
  const [collections, [{ count }]] = await Promise.all([
    db
      .select()
      .from(collectionsTable)
      .where(whereClause)
      .orderBy(desc(collectionsTable.created_at))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(collectionsTable)
      .where(whereClause)
  ])

  return {
    collections,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    hasNextPage: page * limit < count,
    hasPrevPage: page > 1
  }
}

export async function getCollectionSummary(collectorId?: number) {
  const whereClause = collectorId ? eq(collectionsTable.collector_id, collectorId) : undefined

  const result = await db
    .select({
      totalCollections: sql<number>`count(*)`,
      totalAmount: sql<number>`sum(${collectionsTable.amount})`,
      pendingCollections: sql<number>`count(case when ${collectionsTable.status} = 'pending' then 1 end)`,
      pendingAmount: sql<number>`sum(case when ${collectionsTable.status} = 'pending' then ${collectionsTable.amount} else 0 end)`,
      completedCollections: sql<number>`count(case when ${collectionsTable.status} = 'completed' then 1 end)`,
      completedAmount: sql<number>`sum(case when ${collectionsTable.status} = 'completed' then ${collectionsTable.amount} else 0 end)`,
      cancelledCollections: sql<number>`count(case when ${collectionsTable.status} = 'cancelled' then 1 end)`,
      cancelledAmount: sql<number>`sum(case when ${collectionsTable.status} = 'cancelled' then ${collectionsTable.amount} else 0 end)`
    })
    .from(collectionsTable)
    .where(whereClause)

  return result[0] as CollectionStats
}