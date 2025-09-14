import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// In-memory stores (replace with DB later)
type Role = 'admin' | 'carer' | 'family';
type User = { id: string; email: string; role: Role; passwordHash: string; salt: string };
const users = new Map<string, User>(); // key: email
const sessions = new Map<string, { userId: string; expiresAt: number }>();

// Utilities
function hashPassword(password: string, salt: string): string {
  const key = crypto.scryptSync(password, salt, 32);
  return key.toString('hex');
}

function createUser(email: string, password: string, role: Role) {
  const id = crypto.randomUUID?.() ?? crypto.randomBytes(16).toString('hex');
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const user: User = { id, email: email.toLowerCase(), role, passwordHash, salt };
  users.set(user.email, user);
  return user;
}

function verifyPassword(user: User, password: string): boolean {
  const candidate = hashPassword(password, user.salt);
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(user.passwordHash, 'hex');
  // Ensure buffers are same length for timingSafeEqual
  const max = Math.max(a.length, b.length);
  const pa = Buffer.concat([a, Buffer.alloc(Math.max(0, max - a.length))]);
  const pb = Buffer.concat([b, Buffer.alloc(Math.max(0, max - b.length))]);
  return crypto.timingSafeEqual(pa, pb);
}

function parseCookies(header?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!header) return list;
  header.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const key = parts.shift()?.trim();
    if (!key) return;
    const value = decodeURIComponent(parts.join('=').trim());
    list[key] = value;
  });
  return list;
}

const COOKIE_NAME = 'sid';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function setSessionCookie(res: Response, sid: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const attrs = [
    `${COOKIE_NAME}=${sid}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
    isProd ? 'Secure' : undefined,
  ].filter(Boolean);
  res.setHeader('Set-Cookie', attrs.join('; '));
}

function clearSessionCookie(res: Response) {
  const isProd = process.env.NODE_ENV === 'production';
  const attrs = [
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    isProd ? 'Secure' : undefined,
  ].filter(Boolean);
  res.setHeader('Set-Cookie', attrs.join('; '));
}

// Seed a demo admin user (email: admin@example.com, password: password123)
if (!users.has('admin@example.com')) {
  createUser('admin@example.com', 'password123', 'admin');
}

// Auth helpers
function getSession(req: Request) {
  const cookies = parseCookies(req.headers.cookie);
  const sid = cookies[COOKIE_NAME];
  if (!sid) return null;
  const session = sessions.get(sid);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(sid);
    return null;
  }
  return { sid, ...session };
}

function authOptional(req: Request & { user?: User }, _res: Response, next: NextFunction) {
  const s = getSession(req);
  if (s) {
    const u = Array.from(users.values()).find(u => u.id === s.userId);
    if (u) req.user = u;
  }
  next();
}

function authRequired(req: Request & { user?: User }, res: Response, next: NextFunction) {
  authOptional(req, res, () => {
    if (!req.user) return res.status(401).json({ error: 'unauthorized' });
    next();
  });
}

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'ndis-api' });
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'invalid_request' });
  }
  const user = users.get(email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = verifyPassword(user, password);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  // Create session
  const sid = crypto.randomUUID?.() ?? crypto.randomBytes(16).toString('hex');
  sessions.set(sid, { userId: user.id, expiresAt: Date.now() + SESSION_TTL_MS });
  setSessionCookie(res, sid);
  return res.json({ id: user.id, email: user.email, role: user.role });
});

app.post('/auth/logout', (req: Request, res: Response) => {
  const cookies = parseCookies(req.headers.cookie);
  const sid = cookies[COOKIE_NAME];
  if (sid) sessions.delete(sid);
  clearSessionCookie(res);
  return res.status(204).end();
});

app.get('/auth/session', (req: Request, res: Response) => {
  const s = getSession(req);
  if (!s) return res.status(401).json({ error: 'unauthorized' });
  const user = Array.from(users.values()).find(u => u.id === s.userId);
  if (!user) return res.status(401).json({ error: 'unauthorized' });
  return res.json({ id: user.id, email: user.email, role: user.role });
});

// Example protected route
app.get('/me', authRequired, (req: Request & { user?: User }, res: Response) => {
  const user = req.user!;
  res.json({ id: user.id, email: user.email, role: user.role });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on http://localhost:${port}`);
});
