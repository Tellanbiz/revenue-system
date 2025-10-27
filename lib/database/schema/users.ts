import { integer, pgTable, varchar, timestamp, boolean, text, pgEnum } from "drizzle-orm/pg-core";

// Enums for user roles and status
export const userRoleEnum = pgEnum('user_role', ['admin', 'supervisor', 'collector', 'department_head']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended']);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  phone_number: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),

  // Role and permissions
  role: userRoleEnum().notNull().default('collector'),
  status: userStatusEnum().notNull().default('active'),

  // Profile information
  employee_id: varchar({ length: 50 }).unique(),
  department: varchar({ length: 255 }),
  assembly_ward: varchar({ length: 255 }),

  // Additional contact info
  address: text(),
  emergency_contact: varchar({ length: 255 }),
  emergency_phone: varchar({ length: 255 }),

  // System fields
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  last_login_at: timestamp(),
  is_email_verified: boolean().default(false).notNull(),
  is_phone_verified: boolean().default(false).notNull(),

  // Profile picture and notes
  profile_picture_url: varchar({ length: 500 }),
  notes: text(),
});