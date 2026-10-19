'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { assertSession, createSessionToken, sessionCookieOptions } from '@/lib/session';
import { AUTHORIZED_EMAIL, LEGACY_COOKIE, SESSION_COOKIE } from '@/lib/constants';
import { parseProjectForm, type FieldErrors } from '@/lib/projects';
import { devHit, devLocked, devLoginEnabled, devMiss, devPasswordMatches, isLoopbackHost } from '@/lib/devLogin';

export type FormState = { ok: boolean; message: string; errors?: FieldErrors; id?: string; at?: number };

export async function saveProject(_prev: FormState, fd: FormData): Promise<FormState> {
  await assertSession();
  const id = typeof fd.get('id') === 'string' ? String(fd.get('id')) : '';
  const { data, errors } = parseProjectForm(fd);
  if (Object.keys(errors).length) return { ok: false, message: 'Fix the highlighted fields.', errors, at: Date.now() };

  const clash = await prisma.deploymentProduct.findFirst({
    where: { slug: data.slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (clash) return { ok: false, message: 'That URL slug is taken.', errors: { slug: 'Another project already uses this slug.' }, at: Date.now() };

  let savedId = id;
  try {
    if (id) {
      await prisma.deploymentProduct.update({ where: { id }, data });
    } else {
      const created = await prisma.deploymentProduct.create({ data, select: { id: true } });
      savedId = created.id;
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return { ok: false, message: 'This project no longer exists.', at: Date.now() };
    }
    console.error('[saveProject]', e);
    return { ok: false, message: 'Could not save. Check the database connection and try again.', at: Date.now() };
  }

  revalidatePath('/projects');
  revalidatePath('/profile');
  if (!id) redirect(`/projects/${savedId}?saved=1`);
  revalidatePath(`/projects/${savedId}`);
  return { ok: true, message: 'Saved. The main site picks it up on the next load.', id: savedId, at: Date.now() };
}

export async function deleteProject(id: string): Promise<{ ok: boolean; message: string }> {
  await assertSession();
  if (!id) return { ok: false, message: 'Missing project.' };
  try {
    await prisma.deploymentProduct.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') return { ok: true, message: 'Already deleted.' };
    console.error('[deleteProject]', e);
    return { ok: false, message: 'Could not delete. Try again.' };
  }
  revalidatePath('/projects');
  revalidatePath('/profile');
  return { ok: true, message: 'Project deleted.' };
}

export async function togglePublished(id: string, value: boolean): Promise<{ ok: boolean }> {
  await assertSession();
  try {
    await prisma.deploymentProduct.update({ where: { id }, data: { isPublished: value } });
  } catch (e) {
    console.error('[togglePublished]', e);
    return { ok: false };
  }
  revalidatePath('/projects');
  revalidatePath('/profile');
  return { ok: true };
}

export async function updateProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  const s = await assertSession();
  const name = String(fd.get('name') || '').trim().slice(0, 80);
  const image = String(fd.get('image') || '').trim();
  if (!name) return { ok: false, message: 'Your name cannot be empty.', errors: {}, at: Date.now() };
  if (image && !/^https?:\/\//i.test(image) && !image.startsWith('/')) {
    return { ok: false, message: 'Avatar must be an uploaded image or an https link.', at: Date.now() };
  }
  try {
    await prisma.user.upsert({
      where: { email: AUTHORIZED_EMAIL },
      update: { name, image: image || null },
      create: { email: AUTHORIZED_EMAIL, name, image: image || null, role: 'ADMIN' },
    });
  } catch (e) {
    console.error('[updateProfile]', e);
    return { ok: false, message: 'Could not save your profile.', at: Date.now() };
  }
  // keep the signed session label in sync with the new name / avatar
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken({ email: s.email, name, avatar: image || s.avatar }), sessionCookieOptions);
  revalidatePath('/', 'layout');
  return { ok: true, message: 'Profile updated.', at: Date.now() };
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(LEGACY_COOKIE);
  redirect('/login');
}

/** Local preview login. See lib/devLogin.ts for every gate. */
export async function devSignIn(_prev: { error: string }, fd: FormData): Promise<{ error: string }> {
  const h = await headers();
  if (!devLoginEnabled() || !isLoopbackHost(h.get('host'))) return { error: 'Local login is off.' };
  if (devLocked()) return { error: 'Too many tries. Wait a minute.' };
  const email = String(fd.get('email') || '').trim().toLowerCase();
  const password = String(fd.get('password') || '');
  const good = devPasswordMatches(password) && email === AUTHORIZED_EMAIL;
  if (!good) {
    devMiss();
    await new Promise((r) => setTimeout(r, 700));
    return { error: 'Wrong email or password.' };
  }
  devHit();
  let name = 'Ahsan';
  let avatar: string | null = null;
  try {
    const u = await prisma.user.findUnique({ where: { email: AUTHORIZED_EMAIL }, select: { name: true, image: true } });
    name = u?.name || name;
    avatar = u?.image || null;
  } catch {
    /* DB optional for the preview session */
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken({ email: AUTHORIZED_EMAIL, name, avatar }), sessionCookieOptions);
  redirect('/projects');
}
