
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/database/drizzle';
import { usersTable } from '@/lib/database/schema/users';

// Common response types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT utilities
export async function generateJWT(payload: { userId: number; email: string; role: string; name: string }): Promise<string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');

  return jwt.sign(payload, secret, {
    expiresIn: '24h',
    issuer: 'revenue-system',
    audience: 'revenue-system-users',
  });
}

export async function verifyJWT(token: string): Promise<{ userId: number; email: string; role: string; name: string }> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'revenue-system',
      audience: 'revenue-system-users',
    }) as { userId: number; email: string; role: string; name: string };

    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2).max(255),
  phone_number: z.string().min(10).max(255),
  email: z.string().email().max(255),
  password: z.string().min(8),
  role: z.enum(['admin', 'supervisor', 'collector', 'department_head']).optional().default('collector'),
  employee_id: z.string().max(50).optional(),
  department: z.string().max(255).optional(),
  assembly_ward: z.string().max(255).optional(),
  address: z.string().optional(),
  emergency_contact: z.string().max(255).optional(),
  emergency_phone: z.string().max(255).optional(),
});

export const authorizeUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// User lookup utilities
export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  return user;
}

export async function findUserByPhone(phone: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.phone_number, phone))
    .limit(1);
  return user;
}

// Response helpers
export async function successResponse<T>(data: T): Promise<ServiceResponse<T>> {
  return { success: true, data };
}

export async function errorResponse(error: string, details?: any): Promise<ServiceResponse> {
  return { success: false, error, details };
}

export async function validationErrorResponse(error: z.ZodError): Promise<ServiceResponse> {
  return {
    success: false,
    error: 'Invalid input data',
    details: error.issues,
  };
}

// Common error handler
export async function handleServiceError(error: unknown): Promise<ServiceResponse> {
  if (error instanceof z.ZodError) {
    return await validationErrorResponse(error);
  }
  return await errorResponse(error instanceof Error ? error.message : 'An unexpected error occurred');
}