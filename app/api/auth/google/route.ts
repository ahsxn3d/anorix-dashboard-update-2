import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { getBaseUrl } from '@/lib/baseUrl';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const base = getBaseUrl(request);
  if (!clientId) return NextResponse.redirect(`${base}/login?error=${encodeURIComponent('Google sign-in is not configured (GOOGLE_CLIENT_ID).')}`);

  const state = randomBytes(16).toString('base64url');
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `${base}/api/auth/callback/google`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('prompt', 'select_account');
  url.searchParams.set('state', state);

  const res = NextResponse.redirect(url.toString());
  res.cookies.set('anorix_oauth_state', state, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 600, secure: process.env.NODE_ENV === 'production' });
  return res;
}
