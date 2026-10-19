'use client';
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from 'react';
import { IUpload, IX } from './Icons';

type Kind = 'thumbnail' | 'cover' | 'avatar';
const MAX: Record<Kind, number> = { thumbnail: 4, cover: 8, avatar: 2 };

export function ImageField({
  name, kind, value, onChange, shape = 'default', error, testId,
}: { name: string; kind: Kind; value: string; onChange: (v: string) => void; shape?: 'default' | 'wide' | 'round'; error?: string; testId?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  const upload = (file: File | undefined) => {
    if (!file) return;
    setMsg(null);
    if (!file.type.startsWith('image/')) return setMsg('That is not an image.');
    if (file.size > MAX[kind] * 1024 * 1024) return setMsg(`Max ${MAX[kind]} MB.`);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('kind', kind);
    // XHR for real upload progress
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.max(4, Math.round((e.loaded / e.total) * 92)));
    xhr.onload = () => {
      let body: { url?: string; error?: string } = {};
      try { body = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300 && body.url) {
        setProgress(100);
        onChange(body.url);
        setTimeout(() => setProgress(0), 500);
      } else {
        setProgress(0);
        setMsg(body.error || 'Upload failed.');
      }
    };
    xhr.onerror = () => { setProgress(0); setMsg('Network error. Try again.'); };
    setProgress(4);
    xhr.send(fd);
  };

  const cls = shape === 'wide' ? 'wide' : shape === 'round' ? 'round' : '';
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <input type="hidden" name={name} value={value} />
      <div
        className={`drop ${cls} ${over ? 'is-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files?.[0]); }}
        data-testid={testId}
      >
        {value ? <img src={value} alt="" /> : null}
        {value ? (
          <div className="over">
            <button type="button" className="icon-btn" aria-label="Replace image" onClick={() => input.current?.click()}><IUpload size={14} /></button>
            <button type="button" className="icon-btn danger" aria-label="Remove image" onClick={() => onChange('')}><IX size={14} /></button>
          </div>
        ) : (
          <button type="button" className="pick" onClick={() => input.current?.click()}>
            <IUpload size={20} />
            <b>{shape === 'round' ? 'Upload' : 'Drop an image or browse'}</b>
            {shape === 'round' ? null : <span className="hint">PNG, JPG, WEBP, AVIF · max {MAX[kind]} MB</span>}
          </button>
        )}
        {progress > 0 ? <span className="bar" style={{ width: `${progress}%` }} /> : null}
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/gif" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ''; }} data-testid={testId ? `${testId}-file` : undefined} />
      </div>
      {shape === 'round' ? null : (
        <div className="img-url">
          <input className="in" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="or paste an image link" inputMode="url" aria-label="Image link"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (url.trim()) { onChange(url.trim()); setUrl(''); } } }} />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { if (url.trim()) { onChange(url.trim()); setUrl(''); } }}>Use</button>
        </div>
      )}
      {msg || error ? <span className="msg" style={{ fontSize: 12, color: 'var(--signal)' }}>{msg || error}</span> : null}
    </div>
  );
}
