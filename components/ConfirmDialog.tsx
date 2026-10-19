'use client';

import { useEffect, useRef } from 'react';

export function ConfirmDialog({
  open, title, body, confirmLabel = 'Delete', busy, onCancel, onConfirm,
}: { open: boolean; title: string; body: string; confirmLabel?: string; busy?: boolean; onCancel: () => void; onConfirm: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="confirm" onCancel={(e) => { e.preventDefault(); if (!busy) onCancel(); }} onClick={(e) => { if (e.target === ref.current && !busy) onCancel(); }}>
      <h2 className="h2">{title}</h2>
      <p>{body}</p>
      <div className="row">
        <button type="button" className="btn btn-ghost" data-magnetic onClick={onCancel} disabled={busy}>Keep it</button>
        <button type="button" className="btn btn-danger" data-magnetic onClick={onConfirm} disabled={busy} data-testid="confirm-delete">
          {busy ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
