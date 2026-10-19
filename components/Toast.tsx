'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/** Toast rendered into <body> so animated (transformed) ancestors never trap its fixed position. */
export function useToast() {
  const [t, setT] = useState<{ msg: string; bad?: boolean; show: boolean }>({ msg: '', show: false });
  const [mounted, setMounted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setMounted(true);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);
  const toast = useCallback((msg: string, bad = false) => {
    if (timer.current) clearTimeout(timer.current);
    setT({ msg, bad, show: true });
    timer.current = setTimeout(() => setT((p) => ({ ...p, show: false })), 2600);
  }, []);
  const node = mounted
    ? createPortal(
        <div className={`toast ${t.show ? 'show' : ''} ${t.bad ? 'bad' : ''}`} role="status" aria-live="polite">{t.msg}</div>,
        document.body,
      )
    : null;
  return { toast, node };
}
