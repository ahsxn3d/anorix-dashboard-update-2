/* eslint-disable @next/next/no-img-element */
export function Avatar({ src, name, className = '' }: { src?: string | null; name?: string | null; className?: string }) {
  const initial = (name || 'A').trim().charAt(0).toUpperCase();
  if (src) return <img className={`avatar ${className}`} src={src} alt="" referrerPolicy="no-referrer" loading="lazy" decoding="async" />;
  return <span className={`avatar ${className}`} aria-hidden="true">{initial}</span>;
}
