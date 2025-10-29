"use server"

import { db } from "@/lib/database/drizzle"
import { distributionsTable, departmentsTable, usersTable, collectionsTable } from "@/lib/database/schema"
import { eq, desc } from "drizzle-orm"

export async function getDistributions() {
  return await db
    .select({
      id: distributionsTable.id,
      collection_id: distributionsTable.collection_id,
      department_id: distributionsTable.department_id,
      allocated_amount: distributionsTable.allocated_amount,
      percentage: distributionsTable.percentage,
      distributed_by: distributionsTable.distributed_by,
      distributed_at: distributionsTable.distributed_at,
      notes: distributionsTable.notes,
      created_at: distributionsTable.created_at,
      collection_number: collectionsTable.collection_number,
      collection: {
        collection_number: collectionsTable.collection_number,
        amount: collectionsTable.amount,
      },
      department: {
        name: departmentsTable.name,
        code: departmentsTable.code,
      },
      distributor: {
        name: usersTable.name,
      },
    })
    .from(distributionsTable)
    .leftJoin(collectionsTable, eq(distributionsTable.collection_id, collectionsTable.id))
    .leftJoin(departmentsTable, eq(distributionsTable.department_id, departmentsTable.id))
    .leftJoin(usersTable, eq(distributionsTable.distributed_by, usersTable.id))
    .orderBy(desc(distributionsTable.created_at))
}

export async function getDistributionById(id: number) {
  const result = await db
    .select({
      id: distributionsTable.id,
      collection_id: distributionsTable.collection_id,
      department_id: distributionsTable.department_id,
      allocated_amount: distributionsTable.allocated_amount,
      percentage: distributionsTable.percentage,
      distributed_by: distributionsTable.distributed_by,
      distributed_at: distributionsTable.distributed_at,
      notes: distributionsTable.notes,
      created_at: distributionsTable.created_at,
      updated_at: distributionsTable.updated_at,
      collection_number: collectionsTable.collection_number,
      collection: {
        collection_number: collectionsTable.collection_number,
        amount: collectionsTable.amount,
      },
      department: {
        name: departmentsTable.name,
        code: departmentsTable.code,
      },
      distributor: {
        name: usersTable.name,
      },
    })
    .from(distributionsTable)
    .leftJoin(collectionsTable, eq(distributionsTable.collection_id, collectionsTable.id))
    .leftJoin(departmentsTable, eq(distributionsTable.department_id, departmentsTable.id))
    .leftJoin(usersTable, eq(distributionsTable.distributed_by, usersTable.id))
    .where(eq(distributionsTable.id, id))
    .limit(1)

  return result[0] || null
}

export async function getDistributionsByCollection(collectionId: number) {
  return await db
    .select({
      id: distributionsTable.id,
      collection_id: distributionsTable.collection_id,
      department_id: distributionsTable.department_id,
      allocated_amount: distributionsTable.allocated_amount,
      percentage: distributionsTable.percentage,
      distributed_by: distributionsTable.distributed_by,
      distributed_at: distributionsTable.distributed_at,
      notes: distributionsTable.notes,
      created_at: distributionsTable.created_at,
      collection_number: collectionsTable.collection_number,
      collection: {
        collection_number: collectionsTable.collection_number,
        amount: collectionsTable.amount,
      },
      department: {
        name: departmentsTable.name,
        code: departmentsTable.code,
      },
      distributor: {
        name: usersTable.name,
      },
    })
    .from(distributionsTable)
    .leftJoin(collectionsTable, eq(distributionsTable.collection_id, collectionsTable.id))
    .leftJoin(departmentsTable, eq(distributionsTable.department_id, departmentsTable.id))
    .leftJoin(usersTable, eq(distributionsTable.distributed_by, usersTable.id))
    .where(eq(distributionsTable.collection_id, collectionId))
    .orderBy(desc(distributionsTable.created_at))
}

export async function getDepartments() {
  return await db
    .select({
      id: departmentsTable.id,
      code: departmentsTable.code,
      name: departmentsTable.name,
      description: departmentsTable.description,
      is_active: departmentsTable.is_active,
      head_id: departmentsTable.head_id,
      created_at: departmentsTable.created_at,
      updated_at: departmentsTable.updated_at,
      created_by: departmentsTable.created_by,
      notes: departmentsTable.notes,
      head: {
        name: usersTable.name,
      },
    })
    .from(departmentsTable)
    .leftJoin(usersTable, eq(departmentsTable.head_id, usersTable.id))
    .orderBy(desc(departmentsTable.created_at))
}

export async function getDepartmentById(id: number) {
  const result = await db
    .select({
      id: departmentsTable.id,
      code: departmentsTable.code,
      name: departmentsTable.name,
      description: departmentsTable.description,
      is_active: departmentsTable.is_active,
      head_id: departmentsTable.head_id,
      created_at: departmentsTable.created_at,
      updated_at: departmentsTable.updated_at,
      created_by: departmentsTable.created_by,
      notes: departmentsTable.notes,
      head: {
        name: usersTable.name,
        email: usersTable.email,
      },
    })
    .from(departmentsTable)
    .leftJoin(usersTable, eq(departmentsTable.head_id, usersTable.id))
    .where(eq(departmentsTable.id, id))
    .limit(1)

  return result[0] || null
}

export async function getCollections() {
  const collections = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.reconciled, true))
    .orderBy(desc(collectionsTable.created_at))
    .limit(10)

  console.log(`Found ${collections.length} reconciled collections`)
  return collections
}