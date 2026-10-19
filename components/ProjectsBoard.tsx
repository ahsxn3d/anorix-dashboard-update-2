'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { useMemo, useOptimistic, useState, useTransition } from 'react';
import type { ProjectView } from '@/lib/projects';
import { STATUS_LABEL } from '@/lib/projects';
import { deleteProject, togglePublished } from '@/app/actions';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './Toast';
import { IGrid, IPlus, ISearch, IStar, ITrash } from './Icons';

type Filter = 'all' | 'live' | 'draft' | 'featured';

export function ProjectsBoard({ projects }: { projects: ProjectView[] }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [pending, startTransition] = useTransition();
  const [doomed, setDoomed] = useState<ProjectView | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast, node } = useToast();

  const [items, applyOptimistic] = useOptimistic(
    projects,
    (state, a: { type: 'pub'; id: string; v: boolean } | { type: 'del'; id: string }) =>
      a.type === 'del' ? state.filter((p) => p.id !== a.id) : state.map((p) => (p.id === a.id ? { ...p, isPublished: a.v } : p)),
  );

  const counts = useMemo(
    () => ({
      all: items.length,
      live: items.filter((p) => p.isPublished).length,
      draft: items.filter((p) => !p.isPublished).length,
      featured: items.filter((p) => p.isFeatured).length,
    }),
    [items],
  );

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((p) => {
      if (filter === 'live' && !p.isPublished) return false;
      if (filter === 'draft' && p.isPublished) return false;
      if (filter === 'featured' && !p.isFeatured) return false;
      if (!needle) return true;
      return [p.title, p.category, p.slug, p.client ?? '', ...p.techStack, ...p.tags].join(' ').toLowerCase().includes(needle);
    });
  }, [items, q, filter]);

  const onToggle = (p: ProjectView, v: boolean) =>
    startTransition(async () => {
      applyOptimistic({ type: 'pub', id: p.id, v });
      const r = await togglePublished(p.id, v);
      toast(r.ok ? (v ? `${p.title} is live` : `${p.title} moved to drafts`) : 'Could not update. Try again.', !r.ok);
    });

  const onDelete = () => {
    if (!doomed) return;
    const target = doomed;
    setBusy(true);
    startTransition(async () => {
      applyOptimistic({ type: 'del', id: target.id });
      const r = await deleteProject(target.id);
      setBusy(false);
      setDoomed(null);
      toast(r.ok ? `Deleted ${target.title}` : r.message, !r.ok);
    });
  };

  const FILTERS: [Filter, string][] = [['all', 'All'], ['live', 'Live'], ['draft', 'Drafts'], ['featured', 'Featured']];

  return (
    <>
      <div className="toolbar rise" style={{ '--i': 5 } as React.CSSProperties}>
        <label className="search">
          <ISearch />
          <span className="sr">Search projects</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, category, stack" type="search" data-testid="search" />
        </label>
        <div className="seg" role="group" aria-label="Filter">
          {FILTERS.map(([k, label]) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {label} <span className="c">{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="empty">
          <IGrid size={22} />
          <h2 className="h2">{items.length === 0 ? 'No projects yet' : 'Nothing matches'}</h2>
          <p style={{ margin: 0 }}>{items.length === 0 ? 'Add your first case study and it will appear on the main site.' : 'Try another word or clear the filter.'}</p>
          {items.length === 0 ? (
            <Link href="/projects/new" className="btn">New project <span className="ic"><IPlus size={14} /></span></Link>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => { setQ(''); setFilter('all'); }}>Clear</button>
          )}
        </div>
      ) : (
        <div className="grid" aria-busy={pending}>
          {shown.map((p, i) => (
            <article key={p.id} className="card rise" style={{ '--i': Math.min(i, 8) + 6 } as React.CSSProperties} data-testid="project-card" data-slug={p.slug}>
              <Link href={`/projects/${p.id}`} className="card-link" aria-label={`Edit ${p.title}`} />
              <div className="card-media">
                {p.thumbnailUrl ? <img src={p.thumbnailUrl} alt="" loading={i < 6 ? 'eager' : 'lazy'} decoding="async" /> : <span className="ph"><IGrid /></span>}
                <div className="card-flags">
                  <span className="chip"><span className={`dot ${p.status === 'PRODUCTION' ? '' : p.status === 'ARCHIVED' ? 'off' : 'warn'}`} />{STATUS_LABEL[p.status]}</span>
                  {p.isFeatured ? <span className="chip coral"><IStar size={11} />Featured</span> : null}
                </div>
              </div>
              <div className="card-body">
                <span className="mono">{String(p.displayOrder).padStart(2, '0')} · {p.category}</span>
                <h3 className="card-title" style={{ margin: 0 }}><span>{p.title}</span></h3>
                <p className="card-desc" style={{ margin: 0 }}>{p.shortDescription}</p>
              </div>
              <div className="card-foot">
                <label className="switch sm z" title={p.isPublished ? 'Visible on the main site' : 'Hidden from the main site'}>
                  <input type="checkbox" checked={p.isPublished} onChange={(e) => onToggle(p, e.target.checked)} data-testid="toggle-publish" />
                  <span className="track" />
                  <span style={{ fontSize: 13, color: 'var(--dim)' }}>{p.isPublished ? 'Live' : 'Draft'}</span>
                </label>
                <span className="grow" />
                <button type="button" className="icon-btn danger z" aria-label={`Delete ${p.title}`} onClick={() => setDoomed(p)} data-testid="card-delete">
                  <ITrash size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!doomed}
        busy={busy}
        title={`Delete ${doomed?.title ?? 'project'}?`}
        body="It disappears from the main site right away. This cannot be undone."
        onCancel={() => setDoomed(null)}
        onConfirm={onDelete}
      />
      {node}
    </>
  );
}
