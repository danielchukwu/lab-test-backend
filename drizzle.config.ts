import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DRIZZLE_DATABASE_URL!,
  },
} satisfies Config;