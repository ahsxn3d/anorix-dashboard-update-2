'use client';

import { useActionState, useEffect, useState } from 'react';
import { updateProfile, type FormState } from '@/app/actions';
import { ImageField } from './ImageField';
import { useToast } from './Toast';
import { IArrow } from './Icons';

export function ProfileForm({ name, image, email }: { name: string; image: string; email: string }) {
  const [n, setN] = useState(name);
  const [img, setImg] = useState(image);
  const [state, action, saving] = useActionState(updateProfile, { ok: false, message: '' } as FormState);
  const { toast, node } = useToast();
  useEffect(() => { if (state.at) toast(state.message, !state.ok); }, [state.at]); // eslint-disable-line react-hooks/exhaustive-deps
  const dirty = n !== name || img !== image;
  return (
    <form action={action} className="fields" style={{ gridTemplateColumns: 'auto minmax(0, 1fr)', alignItems: 'center' }}>
      <ImageField name="image" kind="avatar" value={img} onChange={setImg} shape="round" testId="avatar" />
      <div style={{ display: 'grid', gap: 14 }}>
        <div className="f">
          <label htmlFor="p-name">Display name</label>
          <input id="p-name" className="in" name="name" value={n} maxLength={80} onChange={(e) => setN(e.target.value)} data-testid="p-name" />
        </div>
        <div className="f">
          <span className="lbl">Sign-in email<em>Google</em></span>
          <input className="in" value={email} readOnly aria-readonly="true" style={{ color: 'var(--dim)' }} />
        </div>
      </div>
      <div className="full" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn" data-magnetic disabled={saving || !dirty} data-testid="p-save">
          {saving ? 'Saving…' : 'Save profile'} <span className="ic"><IArrow size={14} /></span>
        </button>
      </div>
      {node}
    </form>
  );
}
