import Link from 'next/link';
import { requireSession } from '@/lib/session';
import { signOut } from '@/app/actions';
import { Monogram, Wordmark } from '@/components/Logo';
import { Nav } from '@/components/Nav';
import { Avatar } from '@/components/Avatar';
import { IOut } from '@/components/Icons';

export const dynamic = 'force-dynamic';

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const s = await requireSession();
  return (
    <div className="shell">
      <aside className="rail">
        <Link href="/projects" className="rail-logo" aria-label="Anorix Studio home"><Wordmark /></Link>
        <Nav />
        <div className="rail-foot">
          <Link href="/profile" className="me" data-testid="rail-me">
            <Avatar src={s.avatar} name={s.name} />
            <span className="me-txt">
              <span className="me-name" style={{ display: 'block' }}>{s.name}</span>
              <span className="me-mail" style={{ display: 'block' }}>{s.email}</span>
            </span>
          </Link>
          <form action={signOut}>
            <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} type="submit">
              <IOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <header className="topbar">
        <Link href="/projects" aria-label="Anorix Studio home"><Monogram /></Link>
        <Nav label={false} />
        <Link href="/profile" aria-label="Your profile"><Avatar src={s.avatar} name={s.name} /></Link>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
