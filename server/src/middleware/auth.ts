import type { RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { env } from '../config/env';
import type { UserRole } from '../modules/users/user.schema';

export interface AuthTokenPayload extends JwtPayload {
  sub: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (!isAuthTokenPayload(payload)) {
      res.status(401).json({ error: 'invalid_token' });
      return;
    }

    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'invalid_token' });
  }
};

function isAuthTokenPayload(payload: string | JwtPayload): payload is AuthTokenPayload {
  return (
    typeof payload !== 'string' &&
    typeof payload.sub === 'string' &&
    (payload.role === 'resident' || payload.role === 'official' || payload.role === 'admin')
  );
}
