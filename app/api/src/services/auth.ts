import crypto from 'crypto';
import type { User, Role } from '../types/auth';

export const users = new Map<string, User>(); // key: email (lowercased)
export const sessions = new Map<string, { userId: string; expiresAt: number }>();

export const COOKIE_NAME = 'sid';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function hashPassword(password: string, salt: string): string {
  const key = crypto.scryptSync(password, salt, 32);
  return key.toString('hex');
}

export function createUser(email: string, password: string, role: Role) {
  const id = crypto.randomUUID?.() ?? crypto.randomBytes(16).toString('hex');
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const user: User = { id, email: email.toLowerCase(), role, passwordHash, salt };
  users.set(user.email, user);
  return user;
}

export function verifyPassword(user: User, password: string): boolean {
  const candidate = hashPassword(password, user.salt);
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(user.passwordHash, 'hex');
  const max = Math.max(a.length, b.length);
  const pa = Buffer.concat([a, Buffer.alloc(Math.max(0, max - a.length))]);
  const pb = Buffer.concat([b, Buffer.alloc(Math.max(0, max - b.length))]);
  return crypto.timingSafeEqual(pa, pb);
}

export function parseCookies(header?: string): Record<string, string> {
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

export function setSessionCookie(res: import('express').Response, sid: string) {
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

export function clearSessionCookie(res: import('express').Response) {
  const isProd = process.env.NODE_ENV === 'production';
  const attrs = [
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    isProd ? 'Secure' : undefined,
  ].filter(Boolean);
  res.setHeader('Set-Cookie', attrs.join('; '));
}

export function getSession(req: import('express').Request) {
  const cookies = parseCookies(req.headers.cookie);
  const sid = cookies[COOKIE_NAME];
  if (!sid) return null as const;
  const session = sessions.get(sid);
  if (!session) return null as const;
  if (Date.now() > session.expiresAt) {
    sessions.delete(sid);
    return null as const;
  }
  return { sid, ...session };
}

