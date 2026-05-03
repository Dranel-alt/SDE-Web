import { z } from 'zod';

export const UserRoleSchema = z.enum(['resident', 'official', 'admin']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().trim().min(1).optional(),
});
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginDTO = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const UserPublicSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  role: UserRoleSchema,
  emailVerified: z.boolean(),
  createdAt: z.string(),
});
export type UserPublic = z.infer<typeof UserPublicSchema>;

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: UserRole;
  email_verified: boolean;
  failed_login_attempts: number;
  locked_until: Date | null;
  created_at?: Date;
}

export function toPublicUser(user: UserRow): UserPublic {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    emailVerified: user.email_verified,
    createdAt: user.created_at?.toISOString() ?? new Date().toISOString(),
  };
}
