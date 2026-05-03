import { env } from './config/env';
import { checkDatabaseConnection } from './config/db';
import { createApp } from './app';

async function main() {
  await checkDatabaseConnection();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`API server listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start API server');
  console.error(err);
  process.exit(1);
});
