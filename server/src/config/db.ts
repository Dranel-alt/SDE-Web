import { Pool } from 'pg';

import { env } from './env';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export async function checkDatabaseConnection() {
  await pool.query('select 1');
}

export async function closeDatabaseConnection() {
  await pool.end();
}
