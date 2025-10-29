"use server"

import { db } from "@/lib/database/drizzle"
import { collectionsTable, reconciliationTable } from "@/lib/database/schema/collections"
import { usersTable } from "@/lib/database/schema/users"
import { departmentsTable } from "@/lib/database/schema/departments"
import { assembliesTable } from "@/lib/database/schema/assemblies"
import { revenueSourcesTable } from "@/lib/database/schema/revenue-sources"
import { sql, desc, eq, count } from "drizzle-orm"

export async function getDashboardStats() {
  // Get collection stats
  const collectionStats = await db
    .select({
      totalCollections: sql<number>`count(*)`,
      totalAmount: sql<number>`sum(CAST(${collectionsTable.amount} AS DECIMAL))`,
      pendingCollections: sql<number>`count(case when ${collectionsTable.status} = 'pending' then 1 end)`,
      completedCollections: sql<number>`count(case when ${collectionsTable.status} = 'completed' then 1 end)`,
      reconciledCollections: sql<number>`count(case when ${collectionsTable.reconciled} = true then 1 end)`
    })
    .from(collectionsTable)

  // Get user stats
  const userStats = await db
    .select({
      totalUsers: sql<number>`count(*)`,
      activeUsers: sql<number>`count(case when ${usersTable.status} = 'active' then 1 end)`,
      collectors: sql<number>`count(case when ${usersTable.role} = 'collector' then 1 end)`,
      admins: sql<number>`count(case when ${usersTable.role} = 'admin' then 1 end)`,
      supervisors: sql<number>`count(case when ${usersTable.role} = 'supervisor' then 1 end)`
    })
    .from(usersTable)

  // Get department and assembly stats
  const [departmentCount] = await db.select({ count: count() }).from(departmentsTable)
  const [assemblyCount] = await db.select({ count: count() }).from(assembliesTable)
  const [revenueSourceCount] = await db.select({ count: count() }).from(revenueSourcesTable)

  // Get reconciliation stats
  const reconciliationStats = await db
    .select({
      totalReconciliations: sql<number>`count(*)`,
      matched: sql<number>`count(case when ${reconciliationTable.status} = 'matched' then 1 end)`,
      discrepancy: sql<number>`count(case when ${reconciliationTable.status} = 'discrepancy' then 1 end)`,
      unmatched: sql<number>`count(case when ${reconciliationTable.status} = 'unmatched' then 1 end)`
    })
    .from(reconciliationTable)

  // Get recent collections (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentCollections = await db
    .select({
      date: sql<string>`DATE(${collectionsTable.created_at})`,
      amount: sql<number>`sum(CAST(${collectionsTable.amount} AS DECIMAL))`,
      count: sql<number>`count(*)`
    })
    .from(collectionsTable)
    .where(sql`${collectionsTable.created_at} >= ${sevenDaysAgo}`)
    .groupBy(sql`DATE(${collectionsTable.created_at})`)
    .orderBy(sql`DATE(${collectionsTable.created_at})`)

  // Get top performing assemblies
  const topAssemblies = await db
    .select({
      assembly_ward: collectionsTable.assembly_ward,
      totalAmount: sql<number>`sum(CAST(${collectionsTable.amount} AS DECIMAL))`,
      collectionCount: sql<number>`count(*)`
    })
    .from(collectionsTable)
    .where(sql`${collectionsTable.status} = 'completed'`)
    .groupBy(collectionsTable.assembly_ward)
    .orderBy(desc(sql`sum(CAST(${collectionsTable.amount} AS DECIMAL))`))
    .limit(5)

  return {
    collections: collectionStats[0],
    users: userStats[0],
    departments: departmentCount.count,
    assemblies: assemblyCount.count,
    revenueSources: revenueSourceCount.count,
    reconciliations: reconciliationStats[0],
    recentCollections,
    topAssemblies
  }
}
