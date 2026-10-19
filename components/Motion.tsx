'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Monogram } from './Logo';

/**
 * The anorent main-site motion language, scaled down for the dashboard:
 * - Lenis smooth wheel on fine pointers (touch keeps native scroll), one rAF
 * - magnetic buttons ([data-magnetic]): JS only writes the `translate` property on rAF, reset on leave/blur/scroll
 * - IntersectionObserver reveals for [data-r] (adds .is-in), with a sweep for jumps
 * - cursor-follow "Edit" chip on project card media (CSS :hover decides visibility, so nothing sticks)
 * - route curtain on client navigations (never on first load)
 * Everything is off under prefers-reduced-motion.
 */
export function Motion() {
  const path = usePathname();
  const first = useRef(true);
  const [run, setRun] = useState(0);
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // smooth scroll + magnetic + cursor chip (once)
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.js = '';
    if (reduce()) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    html.dataset.fine = '';
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let lraf = 0;
    let dead = false;
    import('lenis').then(({ default: L }) => {
      if (dead) return;
      lenis = new L({ duration: 0.8, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, syncTouch: false });
      const loop = (t: number) => { lenis?.raf(t); lraf = requestAnimationFrame(loop); };
      lraf = requestAnimationFrame(loop);
    });

    let mag: HTMLElement | null = null;
    let raf = 0;
    let x = 0, y = 0;
    const release = () => { if (mag) { mag.style.translate = ''; mag.classList.remove('is-mag'); mag = null; } };
    const paint = () => {
      raf = 0;
      const hit = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (hit !== mag) release();
      if (hit) {
        const r = hit.getBoundingClientRect();
        const dx = (x - (r.left + r.width / 2)) / r.width;
        const dy = (y - (r.top + r.height / 2)) / r.height;
        hit.style.translate = `${(dx * 10).toFixed(1)}px ${(dy * 8).toFixed(1)}px`;
        hit.classList.add('is-mag');
        mag = hit;
      }
      const card = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>('.card')?.querySelector<HTMLElement>('.card-media') ?? null;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--cx', `${(x - r.left).toFixed(1)}px`);
        card.style.setProperty('--cy', `${(y - r.top).toFixed(1)}px`);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget) release(); };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });
    window.addEventListener('blur', release);
    window.addEventListener('scroll', release, { passive: true });
    return () => {
      dead = true;
      cancelAnimationFrame(lraf); cancelAnimationFrame(raf);
      lenis?.destroy();
      release();
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
      window.removeEventListener('blur', release);
      window.removeEventListener('scroll', release);
      delete html.dataset.fine;
    };
  }, []);

  // reveals (per route; MutationObserver picks up filtered/added rows)
  useEffect(() => {
    const SEL = '[data-r]:not(.is-in)';
    if (reduce()) {
      const all = () => document.querySelectorAll(SEL).forEach((el) => el.classList.add('is-in'));
      all();
      const mo = new MutationObserver(all);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting || e.boundingClientRect.bottom < 0) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    const scan = () => document.querySelectorAll(SEL).forEach((el) => io.observe(el));
    scan();
    let r = 0;
    const mo = new MutationObserver(() => { if (!r) r = requestAnimationFrame(() => { r = 0; scan(); }); });
    mo.observe(document.body, { childList: true, subtree: true });
    let t = 0;
    const sweep = () => { clearTimeout(t); t = window.setTimeout(() => {
      const vh = window.innerHeight;
      document.querySelectorAll(SEL).forEach((el) => { if (el.getBoundingClientRect().top < vh * 0.94) el.classList.add('is-in'); });
    }, 120); };
    window.addEventListener('scroll', sweep, { passive: true });
    return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(r); clearTimeout(t); window.removeEventListener('scroll', sweep); };
  }, [path]);

  // route curtain
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
    if (reduce()) return;
    setRun((n) => n + 1);
  }, [path]);
  useEffect(() => {
    if (!run) return;
    const t = window.setTimeout(() => setRun(0), 1100);
    return () => clearTimeout(t);
  }, [run]);

  return run ? (
    <div key={run} className="curtain" aria-hidden="true" onAnimationEnd={(e) => e.target === e.currentTarget && setRun(0)}>
      <Monogram />
    </div>
  ) : null;
}
