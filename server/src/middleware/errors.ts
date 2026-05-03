import type { ErrorRequestHandler, RequestHandler } from 'express';

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message = code,
  ) {
    super(message);
  }
}

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'not_found' });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.code });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'internal_server_error' });
};
