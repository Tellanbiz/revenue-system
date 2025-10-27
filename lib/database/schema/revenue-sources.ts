import { integer, pgTable, varchar, timestamp, decimal, text, boolean, serial, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

// Enums for revenue sources
export const revenueSourceTypeEnum = pgEnum('revenue_source_type', ['market', 'permit', 'license', 'property', 'utility', 'fine', 'other']);
export const frequencyEnum = pgEnum('frequency', ['one_time', 'monthly', 'quarterly', 'annually']);

export const revenueSourcesTable = pgTable("revenue_sources", {
  id: serial().primaryKey(),
  code: varchar({ length: 50 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),

  // Classification
  type: revenueSourceTypeEnum().notNull(),
  category: varchar({ length: 255 }),
  subcategory: varchar({ length: 255 }),

  // Financial details
  standard_rate: decimal({ precision: 15, scale: 2 }),
  minimum_amount: decimal({ precision: 15, scale: 2 }),
  maximum_amount: decimal({ precision: 15, scale: 2 }),
  currency: varchar({ length: 3 }).default('GHS').notNull(),

  // Collection details
  frequency: frequencyEnum().default('one_time'),
  is_active: boolean().default(true).notNull(),

  // Description and requirements
  description: text(),
  requirements: text(),
  applicable_to: varchar({ length: 255 }), // e.g., "businesses", "individuals", "properties"

  // Department and assembly
  responsible_department: varchar({ length: 255 }),
  applicable_assemblies: varchar({ length: 500 }), // JSON array of assembly IDs

  // System fields
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  created_by: integer().references(() => usersTable.id),
  updated_by: integer().references(() => usersTable.id),

  // Additional metadata
  notes: text(),
  effective_date: timestamp().defaultNow().notNull(),
  expiry_date: timestamp(),
});
