import { integer, pgTable, varchar, timestamp, decimal, text, pgEnum, boolean, serial } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { revenueSourcesTable } from "./revenue-sources";

// Enums for collections
export const collectionStatusEnum = pgEnum('collection_status', ['pending', 'completed', 'cancelled', 'refunded']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'mobile_money', 'bank_transfer', 'card', 'check']);
export const collectionTypeEnum = pgEnum('collection_type', ['revenue', 'permit', 'license', 'fee', 'fine']);

export const collectionsTable = pgTable("collections", {
  id: serial().primaryKey(),
  collection_number: varchar({ length: 50 }).notNull().unique(),

  // Relationships
  collector_id: integer().references(() => usersTable.id).notNull(),
  taxpayer_id: integer(), // Could reference a taxpayers table when created

  // Collection details
  type: collectionTypeEnum().notNull(),
  amount: decimal({ precision: 15, scale: 2 }).notNull(),
  currency: varchar({ length: 3 }).default('GHS').notNull(),

  // Payment information
  payment_method: paymentMethodEnum().notNull(),
  transaction_reference: varchar({ length: 255 }),
  payment_date: timestamp().notNull(),

  // Status and tracking
  status: collectionStatusEnum().notNull().default('pending'),
  notes: text(),

  // Revenue source (reference to revenue_sources table)
  revenue_source_id: integer().references(() => revenueSourcesTable.id),

  // Location and assembly info
  assembly_ward: varchar({ length: 255 }),
  location_details: text(),

  // System fields
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  created_by: integer().references(() => usersTable.id),
  approved_by: integer().references(() => usersTable.id),
  approved_at: timestamp(),

  // Reconciliation
  reconciled: boolean().default(false).notNull(),
  reconciled_at: timestamp(),
  reconciled_by: integer().references(() => usersTable.id),
});
