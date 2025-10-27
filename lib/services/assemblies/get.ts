import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/database/drizzle';
import { assembliesTable } from '@/lib/database/schema/assemblies';
import { successResponse, errorResponse, handleServiceError, ServiceResponse } from './utils';

export async function getAssemblyById(id: number): Promise<ServiceResponse> {
  try {
    const [assembly] = await db
      .select({
        id: assembliesTable.id,
        code: assembliesTable.code,
        name: assembliesTable.name,
        district: assembliesTable.district,
        region: assembliesTable.region,
        population: assembliesTable.population,
        area_sq_km: assembliesTable.area_sq_km,
        address: assembliesTable.address,
        phone: assembliesTable.phone,
        email: assembliesTable.email,
        assembly_head_id: assembliesTable.assembly_head_id,
        deputy_head_id: assembliesTable.deputy_head_id,
        is_active: assembliesTable.is_active,
        collection_target: assembliesTable.collection_target,
        description: assembliesTable.description,
        notes: assembliesTable.notes,
        created_at: assembliesTable.created_at,
        updated_at: assembliesTable.updated_at,
        created_by: assembliesTable.created_by,
      })
      .from(assembliesTable)
      .where(eq(assembliesTable.id, id))
      .limit(1);

    if (!assembly) {
      return errorResponse('Assembly not found');
    }

    return successResponse({ assembly });
  } catch (error) {
    return handleServiceError(error);
  }
}

export async function getAssemblies(options?: {
  limit?: number;
  offset?: number;
  is_active?: boolean;
  district?: string;
  region?: string;
}): Promise<ServiceResponse> {
  try {
    const {
      limit = 50,
      offset = 0,
      is_active,
      district,
      region,
    } = options || {};

    let whereClause = undefined;
    const conditions = [];

    if (is_active !== undefined) {
      conditions.push(eq(assembliesTable.is_active, is_active));
    }
    if (district) {
      conditions.push(eq(assembliesTable.district, district));
    }
    if (region) {
      conditions.push(eq(assembliesTable.region, region));
    }

    if (conditions.length > 0) {
      whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
    }

    const assemblies = await db
      .select({
        id: assembliesTable.id,
        code: assembliesTable.code,
        name: assembliesTable.name,
        district: assembliesTable.district,
        region: assembliesTable.region,
        population: assembliesTable.population,
        is_active: assembliesTable.is_active,
        collection_target: assembliesTable.collection_target,
        created_at: assembliesTable.created_at,
        updated_at: assembliesTable.updated_at,
      })
      .from(assembliesTable)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(assembliesTable.name);

    return successResponse({
      assemblies,
      pagination: {
        limit,
        offset,
        hasMore: assemblies.length === limit,
      },
    });
  } catch (error) {
    return handleServiceError(error);
  }
}
