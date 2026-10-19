import React from 'react';

/** Display heading whose words blur, rise and sharpen in (CSS only, same feel as the main site's BlurText). */
export function BlurTitle({ text, serif = [], as = 'h1', className = 'h-display' }: { text: string; serif?: string[]; as?: 'h1' | 'h2'; className?: string }) {
  const Tag = as;
  const words = text.split(/\s+/).filter(Boolean);
  const isSerif = (w: string) => serif.some((s) => s.toLowerCase() === w.toLowerCase().replace(/[^a-z&]/gi, ''));
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <React.Fragment key={`${w}-${i}`}>
          <span aria-hidden="true" className={`bt-w ${isSerif(w) ? 'serif' : ''}`} style={{ '--i': i } as React.CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}
