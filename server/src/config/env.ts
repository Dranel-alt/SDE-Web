import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  REFRESH_SECRET: z.string().min(32, 'REFRESH_SECRET must be at least 32 characters'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  CORS_ORIGIN: z.string().default('http://127.0.0.1:8080,http://localhost:8080'),
  SUPABASE_URL: optionalEnv(z.string().url()),
  SUPABASE_ANON_KEY: optionalEnv(z.string().min(1)),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid backend environment:');
  console.error(z.prettifyError(parsed.error));
  throw new Error('Backend environment validation failed');
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function optionalEnv<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => (value === '' ? undefined : value), schema.optional());
}
