"use server"

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/database/drizzle';
import { usersTable } from '@/lib/database/schema/users';
import {
  createUserSchema,
  authorizeUserSchema,
  hashPassword,
  verifyPassword,
  generateJWT,
  findUserByEmail,
  findUserByPhone,
  successResponse,
  errorResponse,
  handleServiceError,
  ServiceResponse,
} from './utils';

export async function createUser(input: z.infer<typeof createUserSchema>): Promise<ServiceResponse> {
  try {
    const validatedData = createUserSchema.parse(input);

    // Check for existing users
    const existingEmail = await findUserByEmail(validatedData.email);
    if (existingEmail) return await errorResponse('User with this email already exists');

    const existingPhone = await findUserByPhone(validatedData.phone_number);
    if (existingPhone) return await errorResponse('User with this phone number already exists');

    // Create user
    const hashedPassword = await hashPassword(validatedData.password);
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: validatedData.name,
        phone_number: validatedData.phone_number,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        employee_id: validatedData.employee_id,
        department: validatedData.department,
        assembly_ward: validatedData.assembly_ward,
        address: validatedData.address,
        emergency_contact: validatedData.emergency_contact,
        emergency_phone: validatedData.emergency_phone,
        is_email_verified: false,
        is_phone_verified: false,
      })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone_number: usersTable.phone_number,
        role: usersTable.role,
        status: usersTable.status,
        created_at: usersTable.created_at,
      });

    return await successResponse({ user: newUser });
  } catch (error) {
    return await handleServiceError(error);
  }
}

export async function authorizeUser(input: z.infer<typeof authorizeUserSchema>): Promise<ServiceResponse> {
  try {
    const validatedData = authorizeUserSchema.parse(input);

    // Find and validate user
    const user = await findUserByEmail(validatedData.email);
    if (!user) return await errorResponse('Invalid email or password');
    if (user.status !== 'active') return await errorResponse('Account is not active');

    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.password);
    if (!isValidPassword) return await errorResponse('Invalid email or password');

    // Update last login
    await db
      .update(usersTable)
      .set({ last_login_at: new Date(), updated_at: new Date() })
      .where(eq(usersTable.id, user.id));

    // Generate token
    const token = await generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Automatically save token to secure httpOnly cookie
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.set('authToken', token, {
      httpOnly: true, // Prevents client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return await successResponse({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        department: user.department,
        assembly_ward: user.assembly_ward,
        last_login_at: user.last_login_at,
      },
    });
  } catch (error) {
    return await handleServiceError(error);
  }
}