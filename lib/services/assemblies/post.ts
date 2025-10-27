"use server"

import { z } from 'zod';
import { db } from '@/lib/database/drizzle';
import { assembliesTable } from '@/lib/database/schema/assemblies';
import {
  createAssemblySchema,
  findAssemblyByCode,
  findAssemblyByName,
  validateAssemblyLeadership,
  successResponse,
  errorResponse,
  handleServiceError,
  ServiceResponse,
} from './utils';

export async function createAssembly(input: z.infer<typeof createAssemblySchema>): Promise<ServiceResponse> {
  try {
    const validatedData = createAssemblySchema.parse(input);

    // Check for existing assemblies
    const existingCode = await findAssemblyByCode(validatedData.code);
    if (existingCode) return errorResponse('Assembly with this code already exists');

    const existingName = await findAssemblyByName(validatedData.name);
    if (existingName) return errorResponse('Assembly with this name already exists');

    // Validate leadership if provided
    await validateAssemblyLeadership(validatedData.assembly_head_id, validatedData.deputy_head_id);

    // Create assembly
    const [newAssembly] = await db
      .insert(assembliesTable)
      .values({
        code: validatedData.code,
        name: validatedData.name,
        district: validatedData.district,
        region: validatedData.region,
        population: validatedData.population,
        area_sq_km: validatedData.area_sq_km,
        address: validatedData.address,
        phone: validatedData.phone,
        email: validatedData.email,
        assembly_head_id: validatedData.assembly_head_id,
        deputy_head_id: validatedData.deputy_head_id,
        collection_target: validatedData.collection_target,
        description: validatedData.description,
        notes: validatedData.notes,
        is_active: true,
      })
      .returning({
        id: assembliesTable.id,
        code: assembliesTable.code,
        name: assembliesTable.name,
        district: assembliesTable.district,
        region: assembliesTable.region,
        is_active: assembliesTable.is_active,
        created_at: assembliesTable.created_at,
      });

    return successResponse({ assembly: newAssembly });
  } catch (error) {
    return handleServiceError(error);
  }
}