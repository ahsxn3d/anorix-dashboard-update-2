import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Local preview login (email + password). Only exists when ALL hold:
 *  - NODE_ENV === 'development' (next dev; never in next start / production builds)
 *  - ADMIN_DEV_PASSWORD is set in .env.local and at least 12 characters
 *  - the request Host is a loopback name (and `npm run dev` binds to 127.0.0.1 only)
 * Unset ADMIN_DEV_PASSWORD and it is gone.
 */
export const DEV_MIN_LEN = 12;

export function devLoginEnabled(): boolean {
  return process.env.NODE_ENV === 'development' && (process.env.ADMIN_DEV_PASSWORD?.length ?? 0) >= DEV_MIN_LEN;
}

export function isLoopbackHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const h = host.toLowerCase().replace(/:\d+$/, '');
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
}

export function devPasswordMatches(given: string): boolean {
  const want = process.env.ADMIN_DEV_PASSWORD;
  if (!want) return false;
  const a = createHash('sha256').update(given, 'utf8').digest();
  const b = createHash('sha256').update(want, 'utf8').digest();
  return timingSafeEqual(a, b);
}

// tiny in-memory brake: 5 misses -> 60 s lockout (per dev server process)
let misses = 0;
let lockedUntil = 0;
export function devLocked(): boolean {
  return Date.now() < lockedUntil;
}
export function devMiss() {
  misses += 1;
  if (misses >= 5) { lockedUntil = Date.now() + 60_000; misses = 0; }
}
export function devHit() { misses = 0; }
