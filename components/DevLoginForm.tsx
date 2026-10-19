'use client';

import { useActionState } from 'react';
import { devSignIn } from '@/app/actions';
import { IArrow } from './Icons';

export function DevLoginForm() {
  const [state, action, pending] = useActionState(devSignIn, { error: '' });
  return (
    <form action={action} className="devlogin" data-testid="dev-login">
      <span className="mono">Local preview login · dev only</span>
      <div className="devlogin-row">
        <input className="in" name="email" type="email" autoComplete="username" placeholder="Admin email" required aria-label="Admin email" />
        <input className="in" name="password" type="password" autoComplete="current-password" placeholder="ADMIN_DEV_PASSWORD" required aria-label="Password" />
        <button type="submit" className="btn btn-ghost" disabled={pending}>
          {pending ? 'Checking…' : 'Enter'} <IArrow size={14} />
        </button>
      </div>
      {state.error ? <span className="msg" role="alert">{state.error}</span> : null}
    </form>
  );
}
