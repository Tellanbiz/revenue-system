"use server"

import { db } from "@/lib/database/drizzle"
import { distributionsTable, collectionsTable, departmentsTable } from "@/lib/database/schema"
import { eq } from "drizzle-orm"

export interface CreateDistributionData {
  collection_id: number
  department_id: number
  allocated_amount: number
  percentage?: number
  distributed_by: number
  notes?: string
}

export async function createDistribution(data: CreateDistributionData) {
  // Validate that the collection is reconciled
  // const collection = await db
  //   .select()
  //   .from(collectionsTable)
  //   .where(eq(collectionsTable.id, data.collection_id))
  //   .limit(1)

  // if (!collection[0] || !collection[0].reconciled) {
  //   throw new Error("Cannot distribute funds from an unreconciled collection")
  // }

  // Insert the distribution
  const [newDistribution] = await db
    .insert(distributionsTable)
    .values({
      collection_id: data.collection_id,
      department_id: data.department_id,
      allocated_amount: data.allocated_amount.toString(),
      percentage: data.percentage ? data.percentage.toString() : null,
      distributed_by: data.distributed_by,
      notes: data.notes,
    })
    .returning()

  return newDistribution
}

export interface CreateDepartmentData {
  code: string
  name: string
  description?: string
  head_id?: number
  created_by?: number
  notes?: string
}

export async function createDepartment(data: CreateDepartmentData) {
  // Insert the department
  const [newDepartment] = await db
    .insert(departmentsTable)
    .values({
      code: data.code,
      name: data.name,
      description: data.description,
      head_id: data.head_id,
      created_by: data.created_by,
      notes: data.notes,
    })
    .returning()

  return newDepartment
}