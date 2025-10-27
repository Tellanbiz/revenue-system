"use server"

import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/database/drizzle';
import { usersTable } from '@/lib/database/schema/users';
import { verifyJWT } from './utils';
import { getAccessToken } from '../shared/utils';

export async function getUserById(id: number) {
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        phone_number: usersTable.phone_number,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        employee_id: usersTable.employee_id,
        department: usersTable.department,
        assembly_ward: usersTable.assembly_ward,
        address: usersTable.address,
        emergency_contact: usersTable.emergency_contact,
        emergency_phone: usersTable.emergency_phone,
        is_email_verified: usersTable.is_email_verified,
        is_phone_verified: usersTable.is_phone_verified,
        profile_picture_url: usersTable.profile_picture_url,
        notes: usersTable.notes,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        last_login_at: usersTable.last_login_at,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        department: user.department,
        assembly_ward: user.assembly_ward,
        avatar: user.profile_picture_url,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get current user',
    };
  }
}

export async function getUsers(options?: {
  limit?: number;
  offset?: number;
  role?: string;
  status?: string;
  department?: string;
}) {
  try {
    const {
      limit = 50,
      offset = 0,
      role,
      status,
      department,
    } = options || {};

    let whereClause = undefined;

    // Apply filters if provided
    const conditions = [];
    if (role) {
      conditions.push(eq(usersTable.role, role as any));
    }
    if (status) {
      conditions.push(eq(usersTable.status, status as any));
    }
    if (department) {
      conditions.push(eq(usersTable.department, department));
    }

    if (conditions.length > 0) {
      whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
    }

    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        phone_number: usersTable.phone_number,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        employee_id: usersTable.employee_id,
        department: usersTable.department,
        assembly_ward: usersTable.assembly_ward,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        last_login_at: usersTable.last_login_at,
      })
      .from(usersTable)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      users,
      pagination: {
        limit,
        offset,
        hasMore: users.length === limit,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get users',
    };
  }
}

export async function getCurrentUser() {
  try {

    var token =await getAccessToken()
    if (!token) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    // Verify and decode the JWT token to get user information
    const decodedToken = await verifyJWT(token);

    // Extract user ID from the decoded token
    const userId = decodedToken.userId;

    const user = await getUserById(userId);

    if (!user.success || !user.user) {
      return {
        success: false,
        error: user.error || 'User not found',
      };
    }

    return {
      success: true,
      user: {
        id: user.user.id,
        name: user.user.name,
        email: user.user.email,
        phone_number: user.user.phone_number,
        role: user.user.role,
        department: user.user.department,
        assembly_ward: user.user.assembly_ward,
        avatar: user.user.avatar,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get current user',
    };
  }
}