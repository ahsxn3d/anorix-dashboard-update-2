'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/projects', label: 'Projects', n: '01' },
  { href: '/profile', label: 'Profile', n: '02' },
];

export function Nav({ label = true }: { label?: boolean }) {
  const path = usePathname() || '';
  return (
    <nav className="nav" aria-label="Dashboard">
      {label ? <span className="nav-label mono">Studio</span> : null}
      {ITEMS.map((it) => {
        const active = path === it.href || path.startsWith(`${it.href}/`);
        return (
          <Link key={it.href} href={it.href} aria-current={active ? 'page' : undefined} prefetch>
            <span className="n">{it.n}</span>
            <span className="t">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
