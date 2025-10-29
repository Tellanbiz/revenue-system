import { integer, pgTable, decimal, timestamp, text, serial } from "drizzle-orm/pg-core";
import { collectionsTable } from "./collections";
import { departmentsTable } from "./departments";
import { usersTable } from "./users";

export const distributionsTable = pgTable("distributions", {
  id: serial().primaryKey(),
  collection_id: integer().references(() => collectionsTable.id).notNull(),
  department_id: integer().references(() => departmentsTable.id).notNull(),
  allocated_amount: decimal({ precision: 15, scale: 2 }).notNull(),
  percentage: decimal({ precision: 5, scale: 2 }), // e.g., 25.00 for 25%
  distributed_by: integer().references(() => usersTable.id).notNull(),
  distributed_at: timestamp().defaultNow().notNull(),
  notes: text(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
