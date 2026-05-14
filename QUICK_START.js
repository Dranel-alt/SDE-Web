#!/usr/bin/env node

/**
 * Quick Setup for E-Reklamo Database
 * Run this to test your Supabase connection
 */

const ENV_TEMPLATE = `
# Copy this to your server/.env file and fill in YOUR values

NODE_ENV=development
PORT=3000

# FROM SUPABASE DASHBOARD: Settings >Database >Connection Strings
# Replace [PASSWORD] with your database password
# Replace [PROJECT-ID] with your project ID
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres

# Generate these with a strong random string (32+ characters)
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REFRESH_SECRET=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy

BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000,http://localhost:8080,http://127.0.0.1:8080
`;

const COMMANDS = [
  { step: 1, command: 'npm install', desc: 'Install dependencies' },
  { step: 2, command: 'npm run migrate:api', desc: 'Create database tables' },
  { step: 3, command: 'npm run dev:api', desc: 'Start backend server' },
  { step: 4, command: 'npm run dev:web', desc: 'Start frontend (in another terminal)' },
];

console.log(`

         E-REKLAMO DATABASE SETUP - QUICK GUIDE             


 BEFORE YOU START:
   1. Create Supabase project at https://supabase.com
   2. Get your connection string from Settings >Database
   3. Add it to server/.env as DATABASE_URL

${ENV_TEMPLATE}

 SETUP COMMANDS (run in order):
${COMMANDS.map((c) => `   ${c.step}. npm run ${c.command.split(' ')[2] || 'install'}  ${c.desc}`).join('\n')}

 VERIFY SETUP:
    Backend: http://localhost:3000/api/health (should return {"ok": true})
    Frontend: http://localhost:8080 (should load e-Reklamo website)
    Complaint submission should now use database, not localStorage

 MORE INFO:
   See DATABASE_SETUP.md for detailed instructions and troubleshooting
`);
