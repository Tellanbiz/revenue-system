import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/database/drizzle';
import { assembliesTable, usersTable } from '@/lib/database/schema';

// Common response types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

// Validation schema for creating assemblies
export const createAssemblySchema = z.object({
  code: z.string().min(2).max(50),
  name: z.string().min(2).max(255),
  district: z.string().max(255).optional(),
  region: z.string().max(255).optional(),
  population: z.number().int().min(0).optional(),
  area_sq_km: z.number().int().min(0).optional(),
  address: z.string().optional(),
  phone: z.string().max(255).optional(),
  email: z.string().email().max(255).optional(),
  assembly_head_id: z.number().int().optional(),
  deputy_head_id: z.number().int().optional(),
  collection_target: z.string().max(255).optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

// Assembly lookup utilities
export async function findAssemblyByCode(code: string) {
  const [assembly] = await db
    .select()
    .from(assembliesTable)
    .where(eq(assembliesTable.code, code))
    .limit(1);
  return assembly;
}

export async function findAssemblyByName(name: string) {
  const [assembly] = await db
    .select()
    .from(assembliesTable)
    .where(eq(assembliesTable.name, name))
    .limit(1);
  return assembly;
}

// Validate that users exist (for assembly head and deputy)
export async function validateAssemblyLeadership(assemblyHeadId?: number, deputyHeadId?: number) {
  if (assemblyHeadId) {
    const [head] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, assemblyHeadId))
      .limit(1);
    if (!head) throw new Error('Assembly head not found');
  }

  if (deputyHeadId) {
    const [deputy] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, deputyHeadId))
      .limit(1);
    if (!deputy) throw new Error('Deputy head not found');
  }
}

// Response helpers
export function successResponse<T>(data: T): ServiceResponse<T> {
  return { success: true, data };
}

export function errorResponse(error: string, details?: any): ServiceResponse {
  return { success: false, error, details };
}

export function validationErrorResponse(error: z.ZodError): ServiceResponse {
  return {
    success: false,
    error: 'Invalid input data',
    details: error.issues,
  };
}

// Common error handler
export function handleServiceError(error: unknown): ServiceResponse {
  if (error instanceof z.ZodError) {
    return validationErrorResponse(error);
  }
  return errorResponse(error instanceof Error ? error.message : 'An unexpected error occurred');
}
