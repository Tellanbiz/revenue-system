import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './lib/database/migrations',
  schema: './lib/database/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEXT_DATABASE_URL!,
  },
});
