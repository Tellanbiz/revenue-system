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
export function generateJWT(payload: { userId: number; email: string; role: string; name: string }): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');

  return jwt.sign(payload, secret, {
    expiresIn: '24h',
    issuer: 'revenue-system',
    audience: 'revenue-system-users',
  });
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