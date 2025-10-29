"use server"

import { db } from "@/lib/database/drizzle"
import { distributionsTable, departmentsTable } from "@/lib/database/schema"
import { eq } from "drizzle-orm"

export interface UpdateDistributionData {
  id: number
  allocated_amount?: number
  percentage?: number
  notes?: string
}

export async function updateDistribution(data: UpdateDistributionData) {
  const updateData: any = {}

  if (data.allocated_amount !== undefined) {
    updateData.allocated_amount = data.allocated_amount.toString()
  }
  if (data.percentage !== undefined) {
    updateData.percentage = data.percentage ? data.percentage.toString() : null
  }
  if (data.notes !== undefined) {
    updateData.notes = data.notes
  }

  updateData.updated_at = new Date()

  const [updatedDistribution] = await db
    .update(distributionsTable)
    .set(updateData)
    .where(eq(distributionsTable.id, data.id))
    .returning()

  return updatedDistribution
}

export async function deleteDistribution(id: number) {
  const [deletedDistribution] = await db
    .delete(distributionsTable)
    .where(eq(distributionsTable.id, id))
    .returning()

  return deletedDistribution
}

export interface UpdateDepartmentData {
  id: number
  code?: string
  name?: string
  description?: string
  head_id?: number
  notes?: string
}

export async function updateDepartment(data: UpdateDepartmentData) {
  const updateData: any = {}

  if (data.code !== undefined) updateData.code = data.code
  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description
  if (data.head_id !== undefined) updateData.head_id = data.head_id
  if (data.notes !== undefined) updateData.notes = data.notes

  updateData.updated_at = new Date()

  const [updatedDepartment] = await db
    .update(departmentsTable)
    .set(updateData)
    .where(eq(departmentsTable.id, data.id))
    .returning()

  return updatedDepartment
}

export async function deleteDepartment(id: number) {
  const [deletedDepartment] = await db
    .delete(departmentsTable)
    .where(eq(departmentsTable.id, id))
    .returning()

  return deletedDepartment
}