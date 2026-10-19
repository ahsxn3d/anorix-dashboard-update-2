import type { Metadata } from 'next';
import Link from 'next/link';
import { getProfile } from '@/lib/data';
import { requireSession } from '@/lib/session';
import { fmtDate, fmtDateTime } from '@/lib/format';
import { BlurTitle } from '@/components/BlurTitle';
import { Avatar } from '@/components/Avatar';
import { Monogram } from '@/components/Logo';
import { ProfileForm } from '@/components/ProfileForm';
import { signOut } from '@/app/actions';
import { IOut } from '@/components/Icons';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const s = await requireSession();
  const { user, stats, latest } = await getProfile();
  const name = user?.name || s.name;
  const image = user?.image || s.avatar;
  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow rise">(02) Profile</span>
          <BlurTitle text="Your studio profile" serif={['studio']} />
        </div>
        <form action={signOut}>
          <button type="submit" className="btn btn-ghost rise" data-magnetic style={{ '--i': 3 } as React.CSSProperties}><IOut size={14} /> Sign out</button>
        </form>
      </div>

      <div className="stats rise" style={{ '--i': 4 } as React.CSSProperties}>
        <div className="stat"><span className="mono">Projects</span><b data-testid="stat-total">{stats.total}</b></div>
        <div className="stat"><span className="mono">Live</span><b>{stats.published}</b></div>
        <div className="stat"><span className="mono">Drafts</span><b>{stats.drafts}</b></div>
        <div className="stat"><span className="mono">Featured</span><b>{stats.featured}</b></div>
      </div>

      <div className="profile">
        <section className="id-card rise" style={{ '--i': 5 } as React.CSSProperties} data-testid="id-card">
          <div className="id-top">
            <Avatar src={image} name={name} className="avatar-xl" />
            <Monogram />
          </div>
          <h2 className="id-name">{name}</h2>
          <div className="id-row">
            <span>{s.email}</span>
            <span>Studio owner</span>
            {user?.createdAt ? <span>Since {fmtDate(user.createdAt)}</span> : null}
          </div>
          <span className="mono">
            {latest ? <>Last edit: <Link className="link" href={`/projects/${latest.id}`}>{latest.title}</Link>, {fmtDateTime(latest.updatedAt)}</> : 'No projects yet'}
          </span>
        </section>
        <section className="sect rise" style={{ '--i': 6, marginBottom: 0 } as React.CSSProperties}>
          <div className="sect-head"><span className="mono">Edit</span><h2 className="h2">Name & avatar</h2></div>
          <ProfileForm name={name} image={image ?? ''} email={s.email} />
        </section>
      </div>
    </>
  );
}
