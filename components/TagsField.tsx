'use client';

import { useRef, useState } from 'react';
import { IX } from './Icons';

export function TagsField({ name, value, onChange, placeholder, id }: { name: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; id?: string }) {
  const [draft, setDraft] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const add = (raw: string) => {
    const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...value];
    for (const p of parts) if (!next.some((x) => x.toLowerCase() === p.toLowerCase())) next.push(p);
    onChange(next.slice(0, 40));
    setDraft('');
  };
  return (
    <div className="tags" onClick={() => ref.current?.focus()}>
      <input type="hidden" name={name} value={JSON.stringify(value)} />
      {value.map((t) => (
        <span key={t} className="tag">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={(e) => { e.stopPropagation(); onChange(value.filter((x) => x !== t)); }}><IX size={11} /></button>
        </span>
      ))}
      <input
        id={id}
        ref={ref}
        value={draft}
        placeholder={value.length ? '' : placeholder}
        onChange={(e) => { const v = e.target.value; if (v.includes(',')) add(v); else setDraft(v); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); add(draft); }
          else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={() => add(draft)}
      />
    </div>
  );
}
