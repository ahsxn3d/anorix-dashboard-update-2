import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { Wordmark } from '@/components/Logo';
import { BlurTitle } from '@/components/BlurTitle';
import { IArrow } from '@/components/Icons';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getSession()) redirect('/projects');
  const { error } = await searchParams;
  return (
    <main className="login">
      <header><Wordmark /></header>
      <section className="login-mid">
        <span className="eyebrow rise">Studio dashboard</span>
        <BlurTitle text="Ship the next case study" serif={['next', 'case']} />
        <p className="lede rise" style={{ '--i': 3 } as React.CSSProperties}>
          Your projects and deployments, in one quiet place. Everything you publish here shows up on anorix.
        </p>
        {error ? <div className="alert" role="alert">{error}</div> : null}
        <a href="/api/auth/google" className="btn rise" style={{ '--i': 5 } as React.CSSProperties} data-testid="google-signin">
          <span className="g-mark" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 48 48"><path fill="#FF6B4C" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/></svg>
          </span>
          Continue with Google
          <span className="ic"><IArrow size={14} /></span>
        </a>
      </section>
      <footer className="login-foot mono">
        <span>Owner access only</span>
        <span>Anorix © {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
