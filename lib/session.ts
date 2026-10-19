import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTHORIZED_EMAIL, SESSION_COOKIE, SESSION_DAYS } from './constants';

export type Session = { email: string; name: string; avatar: string | null; exp: number };

function secret(): string {
  const s = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!s || s.length < 16) throw new Error('AUTH_SECRET is missing (needed to sign the dashboard session).');
  return s;
}

const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

/** HMAC-signed, expiring token. The cookie is httpOnly, so the browser can neither read nor forge it. */
export function createSessionToken(user: { email: string; name?: string | null; avatar?: string | null }): string {
  const session: Session = {
    email: user.email.toLowerCase(),
    name: user.name || 'Ahsan',
    avatar: user.avatar || null,
    exp: Date.now() + SESSION_DAYS * 86400_000,
  };
  const payload = b64(JSON.stringify(session));
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): Session | null {
  if (!token) return null;
  const [payload, mac] = token.split('.');
  if (!payload || !mac) return null;
  try {
    const expected = Buffer.from(sign(payload));
    const given = Buffer.from(mac);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    const s = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Session;
    if (!s?.email || s.email !== AUTHORIZED_EMAIL || typeof s.exp !== 'number' || s.exp < Date.now()) return null;
    return s;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_DAYS * 86400,
};

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

/** Pages: bounce to /login when signed out. */
export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) redirect('/login');
  return s;
}

/** Actions and route handlers: fail loudly when signed out. */
export async function assertSession(): Promise<Session> {
  const s = await getSession();
  if (!s) throw new Error('UNAUTHORIZED');
  return s;
}
