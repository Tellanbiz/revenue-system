import { integer, pgTable, varchar, timestamp, decimal, text, pgEnum, boolean, serial } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { revenueSourcesTable } from "./revenue-sources";

export const collectionStatusEnum = pgEnum('collection_status', ['pending', 'completed', 'cancelled', 'refunded']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'mobile_money', 'bank_transfer', 'card', 'check']);
export const collectionTypeEnum = pgEnum('collection_type', ['revenue', 'permit', 'license', 'fee', 'fine']);

export const reconciliationStatusEnum = pgEnum('reconciliation_status', ['pending', 'matched', 'unmatched', 'discrepancy', 'investigating']);

export const collectionsTable = pgTable("collections", {
  id: serial().primaryKey(),
  collection_number: varchar({ length: 50 }).notNull().unique(),
  collector_id: integer().references(() => usersTable.id).notNull(),
  taxpayer_id: integer(),
  type: collectionTypeEnum().notNull(),
  amount: decimal({ precision: 15, scale: 2 }).notNull(),
  currency: varchar({ length: 3 }).default('GHS').notNull(),
  payment_method: paymentMethodEnum().notNull(),
  transaction_reference: varchar({ length: 255 }),
  payment_date: timestamp().notNull(),
  status: collectionStatusEnum().notNull().default('pending'),
  notes: text(),
  revenue_source_id: integer().references(() => revenueSourcesTable.id),
  assembly_ward: varchar({ length: 255 }),
  location_details: text(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  created_by: integer().references(() => usersTable.id),
  approved_by: integer().references(() => usersTable.id),
  approved_at: timestamp(),
  reconciled: boolean().default(false).notNull(),
  reconciled_at: timestamp(),
  reconciled_by: integer().references(() => usersTable.id),
});

export const reconciliationTable = pgTable("reconciliation", {
  id: serial().primaryKey(),
  collection_id: integer().references(() => collectionsTable.id).notNull(),
  transaction_reference: varchar({ length: 255 }).notNull(),
  payment_source: varchar({ length: 50 }),
  reconciled_amount: decimal({ precision: 15, scale: 2 }).notNull(),
  currency: varchar({ length: 3 }).default('GHS').notNull(),
  status: reconciliationStatusEnum().notNull().default('pending'),
  discrepancy_amount: decimal({ precision: 15, scale: 2 }),
  discrepancy_reason: text(),
  reconciled_by: integer().references(() => usersTable.id).notNull(),
  reconciled_at: timestamp().notNull(),
  notes: text(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
