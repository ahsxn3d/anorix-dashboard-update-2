'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { deleteProject, saveProject, type FormState } from '@/app/actions';
import {
  PRODUCT_STATUS, PRODUCT_TYPE, STATUS_LABEL, TYPE_LABEL, slugify,
  type ProjectInput, type ProjectView,
} from '@/lib/projects';
import { fmtDate, fmtDateTime } from '@/lib/format';
import { ImageField } from './ImageField';
import { TagsField } from './TagsField';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './Toast';
import { IArrow, IBack, IGrid, IStar, ITrash } from './Icons';

const INITIAL: FormState = { ok: false, message: '' };

export function ProjectForm({ project, initial, categories }: { project?: ProjectView; initial: ProjectInput; categories: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [v, setV] = useState<ProjectInput>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [state, action, saving] = useActionState(saveProject, INITIAL);
  const [confirm, setConfirm] = useState(false);
  const [deleting, startDelete] = useTransition();
  const { toast, node } = useToast();
  const baseline = useRef(JSON.stringify(initial));
  const dirty = JSON.stringify(v) !== baseline.current;
  // a field's error clears as soon as it is edited after a failed save
  const [fixed, setFixed] = useState<Set<string>>(new Set());
  useEffect(() => setFixed(new Set()), [state.at]);
  const errors = Object.fromEntries(Object.entries(state.errors ?? {}).filter(([k]) => !fixed.has(k))) as typeof state.errors & object;

  const touch = (k: string) => setFixed((f) => (f.has(k) ? f : new Set(f).add(k)));
  const set = <K extends keyof ProjectInput>(k: K, val: ProjectInput[K]) => { touch(k); setV((p) => ({ ...p, [k]: val })); };

  // fresh create lands here with ?saved=1
  useEffect(() => {
    if (params.get('saved') === '1') {
      toast('Project created');
      router.replace(`/projects/${project?.id}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.at) return;
    if (state.ok) { baseline.current = JSON.stringify(v); toast(state.message); }
    else toast(state.message, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.at]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty && !saving) { e.preventDefault(); } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, saving]);

  const onDelete = () =>
    startDelete(async () => {
      if (!project) return;
      const r = await deleteProject(project.id);
      if (r.ok) { baseline.current = JSON.stringify(v); router.push('/projects'); router.refresh(); }
      else { setConfirm(false); toast(r.message, true); }
    });

  const statusLine = useMemo(() => {
    if (saving) return { t: 'Saving…', c: '' };
    if (Object.keys(errors).length && !state.ok) return { t: state.message, c: 'bad' };
    if (state.at && !state.ok && !state.errors) return { t: state.message, c: 'bad' };
    if (dirty) return { t: 'Unsaved changes', c: '' };
    if (project) return { t: `Saved · last update ${fmtDateTime(project.updatedAt)}`, c: 'good' };
    return { t: 'New project. Fill the basics, add a thumbnail, save.', c: '' };
  }, [saving, errors, state, dirty, project]);

  const F = ({ k, label, hint, children, full }: { k: keyof ProjectInput; label: string; hint?: string; children: React.ReactNode; full?: boolean }) => (
    <div className={`f ${full ? 'full' : ''} ${errors[k] ? 'err' : ''}`}>
      <label htmlFor={`f-${k}`}>{label}{hint ? <em>{hint}</em> : null}</label>
      {children}
      {errors[k] ? <span className="msg">{errors[k]}</span> : null}
    </div>
  );

  return (
    <form action={action} noValidate>
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="page-head">
        <div>
          <Link href="/projects" className="back"><IBack size={14} /> All projects</Link>
          <h1 className="h-display" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
            {project ? <>{v.title || 'Untitled'} <span className="serif">edit</span></> : <>New <span className="serif">project</span></>}
          </h1>
        </div>
      </div>

      <div className="editor">
        <div>
          <section className="sect">
            <div className="sect-head"><span className="mono">01</span><h2 className="h2">Basics</h2></div>
            <div className="fields">
              {F({ k: 'title', label: 'Project name', hint: 'required', full: true, children: (
                <input id="f-title" className="in" name="title" value={v.title} maxLength={120} autoComplete="off" data-testid="f-title"
                  onChange={(e) => { const t = e.target.value; touch('title'); if (!slugTouched) touch('slug'); setV((p) => ({ ...p, title: t, slug: slugTouched ? p.slug : slugify(t) })); }} />
              ) })}
              {F({ k: 'slug', label: 'URL slug', hint: 'auto', children: (
                <div className="prefix"><span>/deployments/</span>
                  <input id="f-slug" className="in" name="slug" value={v.slug} autoComplete="off" data-testid="f-slug"
                    onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} />
                </div>
              ) })}
              {F({ k: 'category', label: 'Category', children: (
                <>
                  <input id="f-category" className="in" name="category" list="cats" value={v.category} onChange={(e) => set('category', e.target.value)} />
                  <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
                </>
              ) })}
              {F({ k: 'type', label: 'Type', children: (
                <select id="f-type" name="type" value={v.type} onChange={(e) => set('type', e.target.value as ProjectInput['type'])}>
                  {PRODUCT_TYPE.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                </select>
              ) })}
              {F({ k: 'status', label: 'Status', children: (
                <select id="f-status" name="status" value={v.status} onChange={(e) => set('status', e.target.value as ProjectInput['status'])}>
                  {PRODUCT_STATUS.map((t) => <option key={t} value={t}>{STATUS_LABEL[t]}</option>)}
                </select>
              ) })}
              {F({ k: 'client', label: 'Client', hint: 'optional', children: (
                <input id="f-client" className="in" name="client" value={v.client ?? ''} onChange={(e) => set('client', e.target.value)} />
              ) })}
              {F({ k: 'year', label: 'Year', children: (
                <input id="f-year" className="in" name="year" value={v.year ?? ''} inputMode="numeric" maxLength={9} onChange={(e) => set('year', e.target.value)} />
              ) })}
              {F({ k: 'badge', label: 'Badge', hint: 'optional', children: (
                <input id="f-badge" className="in" name="badge" value={v.badge ?? ''} placeholder="e.g. NEW" onChange={(e) => set('badge', e.target.value)} />
              ) })}
            </div>
          </section>

          <section className="sect">
            <div className="sect-head"><span className="mono">02</span><h2 className="h2">Story</h2></div>
            <div className="fields">
              {F({ k: 'shortDescription', label: 'Short description', hint: `${v.shortDescription.length}/400`, full: true, children: (
                <textarea id="f-shortDescription" name="shortDescription" rows={3} maxLength={400} value={v.shortDescription} data-testid="f-short"
                  placeholder="One or two lines for the catalog card." onChange={(e) => set('shortDescription', e.target.value)} />
              ) })}
              {F({ k: 'fullDescription', label: 'Full case study', hint: 'detail page', full: true, children: (
                <textarea id="f-fullDescription" name="fullDescription" rows={7} value={v.fullDescription ?? ''}
                  placeholder="The challenge, what you built, the result." onChange={(e) => set('fullDescription', e.target.value)} />
              ) })}
            </div>
          </section>

          <section className="sect">
            <div className="sect-head"><span className="mono">03</span><h2 className="h2">Media</h2></div>
            <div className="fields">
              <div className={`f ${errors.thumbnailUrl ? 'err' : ''}`}>
                <span className="lbl">Thumbnail<em>required · card</em></span>
                <ImageField name="thumbnailUrl" kind="thumbnail" value={v.thumbnailUrl} onChange={(u) => set('thumbnailUrl', u)} error={errors.thumbnailUrl} testId="thumb" />
              </div>
              <div className={`f ${errors.coverImageUrl ? 'err' : ''}`}>
                <span className="lbl">Cover<em>detail page</em></span>
                <ImageField name="coverImageUrl" kind="cover" value={v.coverImageUrl ?? ''} onChange={(u) => set('coverImageUrl', u)} error={errors.coverImageUrl} testId="cover" />
              </div>
              {F({ k: 'previewVideoUrl', label: 'Preview video link', hint: 'optional', full: true, children: (
                <input id="f-previewVideoUrl" className="in" name="previewVideoUrl" inputMode="url" placeholder="https://…/preview.mp4" value={v.previewVideoUrl ?? ''} onChange={(e) => set('previewVideoUrl', e.target.value)} />
              ) })}
            </div>
          </section>

          <section className="sect">
            <div className="sect-head"><span className="mono">04</span><h2 className="h2">Links</h2></div>
            <div className="fields">
              {F({ k: 'liveUrl', label: 'Live site', children: (
                <input id="f-liveUrl" className="in" name="liveUrl" inputMode="url" placeholder="https://" value={v.liveUrl === '#' ? '' : v.liveUrl} onChange={(e) => set('liveUrl', e.target.value || '#')} />
              ) })}
              {F({ k: 'demoUrl', label: 'Demo', children: (
                <input id="f-demoUrl" className="in" name="demoUrl" inputMode="url" placeholder="https://" value={v.demoUrl === '#' ? '' : v.demoUrl} onChange={(e) => set('demoUrl', e.target.value || '#')} />
              ) })}
              {F({ k: 'githubUrl', label: 'GitHub', hint: 'optional', children: (
                <input id="f-githubUrl" className="in" name="githubUrl" inputMode="url" placeholder="https://github.com/…" value={v.githubUrl ?? ''} onChange={(e) => set('githubUrl', e.target.value)} />
              ) })}
              {F({ k: 'appLaunchUrl', label: 'App launch link', hint: 'optional', children: (
                <input id="f-appLaunchUrl" className="in" name="appLaunchUrl" inputMode="url" placeholder="https://" value={v.appLaunchUrl ?? ''} onChange={(e) => set('appLaunchUrl', e.target.value)} />
              ) })}
            </div>
          </section>

          <section className="sect">
            <div className="sect-head"><span className="mono">05</span><h2 className="h2">Details</h2></div>
            <div className="fields">
              <div className="f full"><label htmlFor="f-tech">Tech stack<em>enter or comma</em></label>
                <TagsField id="f-tech" name="techStack" value={v.techStack} onChange={(x) => set('techStack', x)} placeholder="Next.js, Three.js, GSAP" /></div>
              <div className="f full"><label htmlFor="f-features">Features</label>
                <TagsField id="f-features" name="features" value={v.features} onChange={(x) => set('features', x)} placeholder="Realtime 3D configurator" /></div>
              <div className="f full"><label htmlFor="f-tags">Tags</label>
                <TagsField id="f-tags" name="tags" value={v.tags} onChange={(x) => set('tags', x)} placeholder="webgl, ecommerce" /></div>
              {F({ k: 'rating', label: 'Rating', hint: '0 to 5', children: (
                <input id="f-rating" className="in" name="rating" type="number" min={0} max={5} step={0.1} value={v.rating} onChange={(e) => set('rating', Number(e.target.value))} />
              ) })}
              {F({ k: 'fpsBenchmark', label: 'FPS benchmark', children: (
                <input id="f-fpsBenchmark" className="in" name="fpsBenchmark" type="number" min={0} max={240} value={v.fpsBenchmark} onChange={(e) => set('fpsBenchmark', Number(e.target.value))} />
              ) })}
              {F({ k: 'auditScore', label: 'Lighthouse score', hint: '0 to 100', children: (
                <input id="f-auditScore" className="in" name="auditScore" type="number" min={0} max={100} value={v.auditScore} onChange={(e) => set('auditScore', Number(e.target.value))} />
              ) })}
            </div>
          </section>

          <section className="sect">
            <div className="sect-head"><span className="mono">06</span><h2 className="h2">Visibility</h2></div>
            <div className="fields">
              <div className="f full">
                <div className="toggles">
                  <label className="switch">
                    <input type="checkbox" name="isPublished" checked={v.isPublished} onChange={(e) => set('isPublished', e.target.checked)} data-testid="f-published" />
                    <span className="track" /> Live on the main site
                  </label>
                  <label className="switch">
                    <input type="checkbox" name="isFeatured" checked={v.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} data-testid="f-featured" />
                    <span className="track" /> Featured on the homepage
                  </label>
                </div>
              </div>
              {F({ k: 'displayOrder', label: 'Order', hint: 'lower shows first', children: (
                <input id="f-displayOrder" className="in" name="displayOrder" type="number" step={1} value={v.displayOrder} onChange={(e) => set('displayOrder', Number(e.target.value))} data-testid="f-order" />
              ) })}
            </div>
          </section>

          <div className="savebar">
            <span className={`grow ${statusLine.c}`} data-testid="save-status">{statusLine.t}</span>
            {project ? (
              <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirm(true)} data-testid="delete-project">
                <ITrash size={14} /> Delete
              </button>
            ) : null}
            <Link href="/projects" className="btn btn-ghost btn-sm">Cancel</Link>
            <button type="submit" className="btn" disabled={saving} data-testid="save-project">
              {saving ? 'Saving…' : project ? 'Save changes' : 'Create project'} <span className="ic"><IArrow size={14} /></span>
            </button>
          </div>
        </div>

        <aside className="aside">
          <span className="mono">Card preview</span>
          <article className="card">
            <div className="card-media">
              {v.thumbnailUrl ? <img src={v.thumbnailUrl} alt="" /> : <span className="ph"><IGrid /></span>}
              <div className="card-flags">
                <span className="chip"><span className={`dot ${v.status === 'PRODUCTION' ? '' : v.status === 'ARCHIVED' ? 'off' : 'warn'}`} />{STATUS_LABEL[v.status]}</span>
                {v.isFeatured ? <span className="chip coral"><IStar size={11} />Featured</span> : null}
              </div>
            </div>
            <div className="card-body">
              <span className="mono">{String(v.displayOrder || 0).padStart(2, '0')} · {v.category || 'Category'}</span>
              <h3 className="card-title" style={{ margin: 0 }}><span>{v.title || 'Project name'}</span></h3>
              <p className="card-desc" style={{ margin: 0 }}>{v.shortDescription || 'Your short description shows here.'}</p>
            </div>
          </article>
          <div className="meta">
            <div>Visibility <b>{v.isPublished ? 'Live' : 'Draft'}</b></div>
            <div>URL <b>/deployments/{v.slug || '…'}</b></div>
            <div>Stack <b>{v.techStack.length ? v.techStack.slice(0, 3).join(', ') : 'Not set'}</b></div>
            {project ? <div>Created <b>{fmtDate(project.createdAt)}</b></div> : null}
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirm}
        busy={deleting}
        title={`Delete ${v.title || 'this project'}?`}
        body="It disappears from the main site right away. This cannot be undone."
        onCancel={() => setConfirm(false)}
        onConfirm={onDelete}
      />
      {node}
    </form>
  );
}
