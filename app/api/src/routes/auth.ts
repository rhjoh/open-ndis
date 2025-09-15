import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { createUser, verifyPassword, sessions, setSessionCookie, clearSessionCookie, getSession, users, SESSION_TTL_MS } from '../services/auth';

const router = Router();

// Seed a demo admin user (email: admin@example.com, password: password123)
if (!users.has('admin@example.com')) {
  createUser('admin@example.com', 'password123', 'admin');
}

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'invalid_request' });
  }
  const user = users.get(email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = verifyPassword(user, password);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const sid = crypto.randomUUID?.() ?? crypto.randomBytes(16).toString('hex');
  sessions.set(sid, { userId: user.id, expiresAt: Date.now() + SESSION_TTL_MS });
  setSessionCookie(res, sid);
  return res.json({ id: user.id, email: user.email, role: user.role });
});

router.post('/logout', (req: Request, res: Response) => {
  const s = getSession(req);
  if (s) sessions.delete(s.sid);
  clearSessionCookie(res);
  return res.status(204).end();
});

router.get('/session', (req: Request, res: Response) => {
  const s = getSession(req);
  if (!s) return res.status(401).json({ error: 'unauthorized' });
  const user = Array.from(users.values()).find(u => u.id === s.userId);
  if (!user) return res.status(401).json({ error: 'unauthorized' });
  return res.json({ id: user.id, email: user.email, role: user.role });
});

export default router;
