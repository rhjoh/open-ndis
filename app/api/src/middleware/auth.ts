import type { NextFunction, Request, Response } from 'express';
import type { User } from '../types/auth';
import { getSession, users } from '../services/auth';

export function authOptional(req: Request & { user?: User }, _res: Response, next: NextFunction) {
  const s = getSession(req);
  if (s) {
    const u = Array.from(users.values()).find(u => u.id === s.userId);
    if (u) req.user = u;
  }
  next();
}

export function authRequired(req: Request & { user?: User }, res: Response, next: NextFunction) {
  authOptional(req, res, () => {
    if (!req.user) return res.status(401).json({ error: 'unauthorized' });
    next();
  });
}

