import React from 'react';

/** Anorix wordmark + AX monogram (same geometry as the main site's site/Logo.tsx). */
type Props = { className?: string; title?: string };

export function Wordmark({ className = '', title = 'Anorix' }: Props) {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg className={`wm ${className}`} viewBox="-2 4 136 38" fill="none" role="img" aria-label={title}>
      <defs>
        <clipPath id={`${uid}a`}><rect x="-4" y="6" width="34" height="34" /></clipPath>
        <clipPath id={`${uid}x`}><rect x="108" y="16" width="28" height="24" /></clipPath>
      </defs>
      <g stroke="currentColor" strokeWidth="4.4" strokeMiterlimit="10">
        <path pathLength={1} style={{ '--i': 0 } as React.CSSProperties} clipPath={`url(#${uid}a)`} d="M-0.8,44 L13,4.2 L26.8,44" />
        <path pathLength={1} style={{ '--i': 1 } as React.CSSProperties} d="M33,16 V40 M33,25 A8,8 0 0 1 49,25 V40" />
        <path pathLength={1} style={{ '--i': 2 } as React.CSSProperties} d="M68.4,16.2 A11.8,11.8 0 1 0 68.4,39.8 A11.8,11.8 0 1 0 68.4,16.2" />
        <path pathLength={1} style={{ '--i': 3 } as React.CSSProperties} d="M88,16 V40 M88,27 A11,11 0 0 1 99,16 H101" />
        <path pathLength={1} style={{ '--i': 4 } as React.CSSProperties} d="M107,16 V40" />
        <path pathLength={1} style={{ '--i': 5 } as React.CSSProperties} clipPath={`url(#${uid}x)`} d="M111.5,13 L132.5,43 M132.5,13 L111.5,43" />
      </g>
      <rect className="wm-dot" x="10.8" y="28" width="4.4" height="4.4" />
      <rect className="wm-dot" x="104.8" y="6" width="4.4" height="4.4" />
    </svg>
  );
}

export function Monogram({ className = '', title = 'Anorix' }: Props) {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg className={`ax ${className}`} viewBox="0 0 64 64" fill="none" role="img" aria-label={title}>
      <defs>
        <clipPath id={`${uid}m`}><rect x="0" y="14" width="64" height="36" /></clipPath>
      </defs>
      <g clipPath={`url(#${uid}m)`} strokeWidth="4.6" strokeMiterlimit="10">
        <path stroke="currentColor" d="M8.7,56 L22.5,8.6 L36.3,56" />
        <path stroke="currentColor" d="M32.1,56 L54.1,8" />
        <path className="ax-acc" d="M32.1,8 L54.1,56" />
      </g>
      <rect className="wm-dot" x="20.3" y="37" width="4.6" height="4.6" />
    </svg>
  );
}
