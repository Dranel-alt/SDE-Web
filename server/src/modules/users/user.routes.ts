import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env';
import { requireAuth } from '../../middleware/auth';
import { HttpError } from '../../middleware/errors';
import {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
} from './user.model';
import {
  CreateUserSchema,
  LoginSchema,
  RefreshTokenSchema,
  toPublicUser,
  type UserRow,
} from './user.schema';

export const userRouter = Router();

function signAccessToken(user: Pick<UserRow, 'id' | 'role'>) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '15m' });
}

function signRefreshToken(user: Pick<UserRow, 'id'>) {
  return jwt.sign({ sub: user.id }, env.REFRESH_SECRET, { expiresIn: '7d' });
}

function issueTokens(user: UserRow) {
  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  };
}

userRouter.post('/signup', async (req, res, next) => {
  try {
    const parsed = CreateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'validation_failed', issues: parsed.error.issues });
      return;
    }

    const existing = await findUserByEmail(parsed.data.email);
    if (existing) {
      res.status(409).json({ error: 'email_exists' });
      return;
    }

    const user = await createUser(parsed.data);
    res.status(201).json({ user: toPublicUser(user), ...issueTokens(user) });
  } catch (err) {
    next(err);
  }
});

userRouter.post('/login', async (req, res, next) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'validation_failed', issues: parsed.error.issues });
      return;
    }

    const user = await findUserByEmail(parsed.data.email);
    if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
      res.status(401).json({ error: 'invalid_credentials' });
      return;
    }

    res.json({ user: toPublicUser(user), ...issueTokens(user) });
  } catch (err) {
    next(err);
  }
});

userRouter.post('/refresh', async (req, res, next) => {
  try {
    const parsed = RefreshTokenSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'validation_failed', issues: parsed.error.issues });
      return;
    }

    const payload = jwt.verify(parsed.data.refreshToken, env.REFRESH_SECRET);
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      throw new HttpError(401, 'invalid_refresh_token');
    }

    const user = await findUserById(payload.sub);
    if (!user) {
      throw new HttpError(401, 'invalid_refresh_token');
    }

    res.json({ user: toPublicUser(user), ...issueTokens(user) });
  } catch (err) {
    next(err instanceof jwt.JsonWebTokenError ? new HttpError(401, 'invalid_refresh_token') : err);
  }
});

userRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await findUserById(req.user!.sub);
    if (!user) {
      res.status(404).json({ error: 'user_not_found' });
      return;
    }

    res.json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
});
