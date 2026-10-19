import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

const MIME: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif' };

/** Serves files written by UPLOAD_DRIVER=local (offline QA only). 404 otherwise. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  if (process.env.UPLOAD_DRIVER !== 'local') return new NextResponse(null, { status: 404 });
  const { name } = await params;
  if (!/^[a-z]+-\d+-[a-f0-9]{8}\.(png|jpg|webp|avif|gif)$/.test(name)) return new NextResponse(null, { status: 404 });
  try {
    const buf = await readFile(path.join(process.cwd(), '.local-uploads', name));
    return new NextResponse(new Uint8Array(buf), { headers: { 'Content-Type': MIME[name.split('.').pop()!], 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
