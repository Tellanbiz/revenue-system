"use server"

import { db } from "@/lib/database/drizzle"
import { reconciliationTable, reconciliationStatusEnum } from "@/lib/database/schema/collections"
import { usersTable } from "@/lib/database/schema/users"
import { eq, desc, and, like } from "drizzle-orm"

export async function getReconciliations(limit = 50) {
  const reconciliations = await db
    .select({
      id: reconciliationTable.id,
      collection_id: reconciliationTable.collection_id,
      transaction_reference: reconciliationTable.transaction_reference,
      payment_source: reconciliationTable.payment_source,
      reconciled_amount: reconciliationTable.reconciled_amount,
      currency: reconciliationTable.currency,
      status: reconciliationTable.status,
      discrepancy_amount: reconciliationTable.discrepancy_amount,
      discrepancy_reason: reconciliationTable.discrepancy_reason,
      reconciled_at: reconciliationTable.reconciled_at,
      notes: reconciliationTable.notes,
      created_at: reconciliationTable.created_at,
      updated_at: reconciliationTable.updated_at,
      reconciled_by_user: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(reconciliationTable)
    .leftJoin(usersTable, eq(reconciliationTable.reconciled_by, usersTable.id))
    .orderBy(desc(reconciliationTable.created_at))
    .limit(limit)

  return reconciliations
}

export async function getReconciliationById(id: number) {
  const [reconciliation] = await db
    .select({
      id: reconciliationTable.id,
      collection_id: reconciliationTable.collection_id,
      transaction_reference: reconciliationTable.transaction_reference,
      payment_source: reconciliationTable.payment_source,
      reconciled_amount: reconciliationTable.reconciled_amount,
      currency: reconciliationTable.currency,
      status: reconciliationTable.status,
      discrepancy_amount: reconciliationTable.discrepancy_amount,
      discrepancy_reason: reconciliationTable.discrepancy_reason,
      reconciled_at: reconciliationTable.reconciled_at,
      notes: reconciliationTable.notes,
      created_at: reconciliationTable.created_at,
      updated_at: reconciliationTable.updated_at,
      reconciled_by_user: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(reconciliationTable)
    .leftJoin(usersTable, eq(reconciliationTable.reconciled_by, usersTable.id))
    .where(eq(reconciliationTable.id, id))

  return reconciliation || null
}

export async function getReconciliationsByCollection(collectionId: number) {
  const reconciliations = await db
    .select({
      id: reconciliationTable.id,
      collection_id: reconciliationTable.collection_id,
      transaction_reference: reconciliationTable.transaction_reference,
      payment_source: reconciliationTable.payment_source,
      reconciled_amount: reconciliationTable.reconciled_amount,
      currency: reconciliationTable.currency,
      status: reconciliationTable.status,
      discrepancy_amount: reconciliationTable.discrepancy_amount,
      discrepancy_reason: reconciliationTable.discrepancy_reason,
      reconciled_at: reconciliationTable.reconciled_at,
      notes: reconciliationTable.notes,
      created_at: reconciliationTable.created_at,
      updated_at: reconciliationTable.updated_at,
      reconciled_by_user: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(reconciliationTable)
    .leftJoin(usersTable, eq(reconciliationTable.reconciled_by, usersTable.id))
    .where(eq(reconciliationTable.collection_id, collectionId))
    .orderBy(desc(reconciliationTable.created_at))

  return reconciliations
}

export async function getReconciliationsByStatus(status: typeof reconciliationStatusEnum.enumValues[number], limit = 50) {
  const reconciliations = await db
    .select({
      id: reconciliationTable.id,
      collection_id: reconciliationTable.collection_id,
      transaction_reference: reconciliationTable.transaction_reference,
      payment_source: reconciliationTable.payment_source,
      reconciled_amount: reconciliationTable.reconciled_amount,
      currency: reconciliationTable.currency,
      status: reconciliationTable.status,
      discrepancy_amount: reconciliationTable.discrepancy_amount,
      discrepancy_reason: reconciliationTable.discrepancy_reason,
      reconciled_at: reconciliationTable.reconciled_at,
      notes: reconciliationTable.notes,
      created_at: reconciliationTable.created_at,
      updated_at: reconciliationTable.updated_at,
      reconciled_by_user: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(reconciliationTable)
    .leftJoin(usersTable, eq(reconciliationTable.reconciled_by, usersTable.id))
    .where(eq(reconciliationTable.status, status))
    .orderBy(desc(reconciliationTable.created_at))
    .limit(limit)

  return reconciliations
}

export async function searchReconciliations(searchTerm: string, limit = 50) {
  const reconciliations = await db
    .select({
      id: reconciliationTable.id,
      collection_id: reconciliationTable.collection_id,
      transaction_reference: reconciliationTable.transaction_reference,
      payment_source: reconciliationTable.payment_source,
      reconciled_amount: reconciliationTable.reconciled_amount,
      currency: reconciliationTable.currency,
      status: reconciliationTable.status,
      discrepancy_amount: reconciliationTable.discrepancy_amount,
      discrepancy_reason: reconciliationTable.discrepancy_reason,
      reconciled_at: reconciliationTable.reconciled_at,
      notes: reconciliationTable.notes,
      created_at: reconciliationTable.created_at,
      updated_at: reconciliationTable.updated_at,
      reconciled_by_user: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(reconciliationTable)
    .leftJoin(usersTable, eq(reconciliationTable.reconciled_by, usersTable.id))
    .where(like(reconciliationTable.transaction_reference, `%${searchTerm}%`))
    .orderBy(desc(reconciliationTable.created_at))
    .limit(limit)

  return reconciliations
}