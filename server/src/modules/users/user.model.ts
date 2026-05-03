import bcrypt from 'bcryptjs';

import { pool } from '../../config/db';
import { env } from '../../config/env';
import type { CreateUserDTO, UserRow } from './user.schema';

const userColumns = `
  id,
  email,
  password_hash,
  full_name,
  role,
  email_verified,
  failed_login_attempts,
  locked_until,
  created_at
`;

export async function createUser(dto: CreateUserDTO): Promise<UserRow> {
  const hashed = await bcrypt.hash(dto.password, env.BCRYPT_SALT_ROUNDS);
  const result = await pool.query<UserRow>(
    `insert into users (email, password_hash, full_name)
     values ($1, $2, $3)
     returning ${userColumns}`,
    [dto.email.toLowerCase(), hashed, dto.fullName ?? null],
  );

  return result.rows[0];
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const result = await pool.query<UserRow>(
    `select ${userColumns}
     from users
     where email = $1`,
    [email.toLowerCase()],
  );

  return result.rows[0] ?? null;
}

export async function findUserById(userId: string): Promise<UserRow | null> {
  const result = await pool.query<UserRow>(
    `select ${userColumns}
     from users
     where id = $1`,
    [userId],
  );

  return result.rows[0] ?? null;
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function setPassword(userId: string, newPassword: string) {
  const hashed = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
  await pool.query('update users set password_hash = $1, updated_at = now() where id = $2', [
    hashed,
    userId,
  ]);
}
