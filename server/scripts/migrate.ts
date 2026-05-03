import fs from 'node:fs/promises';
import path from 'node:path';

import { closeDatabaseConnection, pool } from '../src/config/db';

async function main() {
  const migrationsDir = path.resolve(process.cwd(), 'server', 'migrations');
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    console.log(`Running migration ${file}`);
    await pool.query(sql);
  }

  console.log('Migrations complete');
}

main()
  .catch((err) => {
    console.error('Migration failed');
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabaseConnection();
  });
