import { integer, pgTable, varchar, timestamp, boolean, text, serial } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const departmentsTable = pgTable("departments", {
  id: serial().primaryKey(),
  code: varchar({ length: 50 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  is_active: boolean().default(true).notNull(),
  head_id: integer().references(() => usersTable.id),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  created_by: integer().references(() => usersTable.id),
  notes: text(),
});
