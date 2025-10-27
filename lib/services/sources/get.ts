"use server"

import { db } from "@/lib/database/drizzle"
import { revenueSourcesTable } from "@/lib/database/schema/revenue-sources"
import { eq, desc, like } from "drizzle-orm"

export async function getRevenueSources(limit = 50) {
  const sources = await db
    .select()
    .from(revenueSourcesTable)
    .orderBy(desc(revenueSourcesTable.created_at))
    .limit(limit)

  return sources
}

export async function getRevenueSourceById(id: number) {
  const [source] = await db
    .select()
    .from(revenueSourcesTable)
    .where(eq(revenueSourcesTable.id, id))

  return source || null
}

export async function getRevenueSourcesByCreator(creatorId: number, limit = 50) {
  const sources = await db
    .select()
    .from(revenueSourcesTable)
    .where(eq(revenueSourcesTable.created_by, creatorId))
    .orderBy(desc(revenueSourcesTable.created_at))
    .limit(limit)

  return sources
}

export async function searchRevenueSources(searchTerm: string, limit = 50) {
  const sources = await db
    .select()
    .from(revenueSourcesTable)
    .where(like(revenueSourcesTable.name, `%${searchTerm}%`))
    .orderBy(desc(revenueSourcesTable.created_at))
    .limit(limit)

  return sources
}

export async function getRevenueSourceByName(name: string) {
  const [source] = await db
    .select()
    .from(revenueSourcesTable)
    .where(eq(revenueSourcesTable.name, name))

  return source || null
}