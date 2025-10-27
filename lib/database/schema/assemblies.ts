import { integer, pgTable, varchar, timestamp, text, boolean, serial } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const assembliesTable = pgTable("assemblies", {
  id: serial().primaryKey(),
  code: varchar({ length: 50 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),

  // Location and administrative details
  district: varchar({ length: 255 }),
  region: varchar({ length: 255 }),
  population: integer(),
  area_sq_km: integer(),

  // Contact information
  address: text(),
  phone: varchar({ length: 255 }),
  email: varchar({ length: 255 }),

  // Leadership
  assembly_head_id: integer().references(() => usersTable.id),
  deputy_head_id: integer().references(() => usersTable.id),

  // Status and configuration
  is_active: boolean().default(true).notNull(),
  collection_target: varchar({ length: 255 }), // Monthly/annual targets

  // System fields
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  created_by: integer().references(() => usersTable.id),

  // Additional information
  description: text(),
  notes: text(),
});
