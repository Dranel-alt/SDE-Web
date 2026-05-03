import cors from 'cors';
import express from 'express';

import { corsOrigins } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errors';
import { userRouter } from './modules/users/user.routes';

export function createApp() {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        if (!origin || corsOrigins.includes('*') || corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Not allowed by CORS'));
      },
    }),
  );
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', userRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
