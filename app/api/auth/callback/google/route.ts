import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/baseUrl';
import { AUTHORIZED_EMAIL, LEGACY_COOKIE, SESSION_COOKIE } from '@/lib/constants';
import { createSessionToken, sessionCookieOptions } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const base = getBaseUrl(request);
  const fail = (msg: string) => {
    const r = NextResponse.redirect(`${base}/login?error=${encodeURIComponent(msg)}`);
    r.cookies.delete('anorix_oauth_state');
    return r;
  };

  const sp = request.nextUrl.searchParams;
  const code = sp.get('code');
  if (sp.get('error') || !code) return fail('Sign-in was cancelled.');
  const state = sp.get('state');
  if (!state || state !== request.cookies.get('anorix_oauth_state')?.value) return fail('Sign-in expired. Try again.');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail('Google sign-in is not configured.');

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${base}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });
    const token = await tokenRes.json();
    if (!tokenRes.ok || !token.access_token) return fail(token.error_description || 'Google token exchange failed.');

    const meRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const me = await meRes.json();
    const email = String(me.email || '').toLowerCase();
    if (!email || me.verified_email === false) return fail('Google did not return a verified email.');
    if (email !== AUTHORIZED_EMAIL) return fail('This Google account is not allowed into the dashboard.');

    let name: string = me.name || 'Ahsan';
    let avatar: string | null = me.picture || null;
    try {
      // first sign-in creates the owner row; later sign-ins keep the name/avatar edited on the Profile page
      const user = await prisma.user.upsert({
        where: { email: AUTHORIZED_EMAIL },
        update: {},
        create: { email: AUTHORIZED_EMAIL, name, image: avatar, role: 'ADMIN' },
        select: { name: true, image: true },
      });
      name = user.name || name;
      avatar = user.image || avatar;
    } catch (e) {
      console.warn('[auth] owner upsert skipped', e);
    }

    const res = NextResponse.redirect(`${base}/projects`);
    res.cookies.set(SESSION_COOKIE, createSessionToken({ email, name, avatar }), sessionCookieOptions);
    res.cookies.delete(LEGACY_COOKIE);
    res.cookies.delete('anorix_oauth_state');
    return res;
  } catch (e) {
    console.error('[auth] callback error', e);
    return fail('Sign-in failed. Try again.');
  }
}
