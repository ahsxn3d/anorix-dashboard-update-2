import type { NextRequest } from 'next/server';

/** Public origin used for the Google redirect URI (must match the URI registered in Google Cloud). */
export function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    return `${proto}://${host}`;
  }
  if (process.env.DASHBOARD_URL) return process.env.DASHBOARD_URL.replace(/\/$/, '');
  return new URL(request.url).origin;
}
