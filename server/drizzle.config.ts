import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/shared/infrastructure/database/postgres/schema/*.schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.POSTGRES_DB_URL!,
  },
});
