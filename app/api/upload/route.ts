import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { UTApi } from 'uploadthing/server';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const LIMITS: Record<string, number> = { thumbnail: 4, cover: 8, avatar: 2 }; // MB
const TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

/**
 * Authenticated image upload. Files go to UploadThing (UPLOADTHING_TOKEN), so the
 * main site can load them from the CDN. UPLOAD_DRIVER=local writes to .local-uploads/
 * instead; that is for offline QA only (the main site cannot see those files).
 */
export async function POST(request: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: 'Sign in again.' }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Send the image as form data.' }, { status: 400 });
  }
  const file = form.get('file');
  const kind = String(form.get('kind') || 'thumbnail');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: 'Use PNG, JPG, WEBP, AVIF or GIF.' }, { status: 415 });
  const maxMb = LIMITS[kind] ?? 4;
  if (file.size > maxMb * 1024 * 1024) return NextResponse.json({ error: `Max ${maxMb} MB for this image.` }, { status: 413 });

  const name = `${kind}-${Date.now()}-${randomBytes(4).toString('hex')}.${ext}`;

  if (process.env.UPLOAD_DRIVER === 'local') {
    const dir = path.join(process.cwd(), '.local-uploads');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/api/upload/${name}` });
  }

  if (!process.env.UPLOADTHING_TOKEN) {
    return NextResponse.json({ error: 'Uploads are not configured (UPLOADTHING_TOKEN). Paste an image link instead.' }, { status: 503 });
  }
  try {
    const utapi = new UTApi();
    const res = await utapi.uploadFiles(new File([await file.arrayBuffer()], name, { type: file.type }));
    if (res.error || !res.data) throw res.error ?? new Error('empty upload response');
    return NextResponse.json({ url: res.data.ufsUrl || res.data.url });
  } catch (e) {
    console.error('[upload]', e);
    return NextResponse.json({ error: 'Upload failed. Try again or paste an image link.' }, { status: 502 });
  }
}
