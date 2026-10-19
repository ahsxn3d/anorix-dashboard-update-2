import React from 'react';

type P = { size?: number; className?: string };
const S = ({ size = 16, className = '', children }: P & { children: React.ReactNode }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const IArrow = (p: P) => <S {...p}><path d="M3.5 12.5l9-9M12.5 3.5H5.5M12.5 3.5v7" /></S>;
export const IBack = (p: P) => <S {...p}><path d="M10 3L5 8l5 5" /></S>;
export const IPlus = (p: P) => <S {...p}><path d="M8 3v10M3 8h10" /></S>;
export const IX = (p: P) => <S {...p}><path d="M4 4l8 8M12 4l-8 8" /></S>;
export const ISearch = (p: P) => <S {...p}><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></S>;
export const ITrash = (p: P) => <S {...p}><path d="M2.5 4h11M6 4V2.5h4V4M4 4l.7 9.5h6.6L12 4" /></S>;
export const IUpload = (p: P) => <S {...p}><path d="M8 11V3M4.5 6.5L8 3l3.5 3.5M3 13h10" /></S>;
export const IStar = (p: P) => <S {...p}><path d="M8 2l1.8 3.8 4.2.5-3.1 2.9.8 4.1L8 11.3l-3.7 2 .8-4.1L2 6.3l4.2-.5z" /></S>;
export const IGrid = (p: P) => <S {...p}><rect x="2.5" y="2.5" width="4.5" height="4.5" /><rect x="9" y="2.5" width="4.5" height="4.5" /><rect x="2.5" y="9" width="4.5" height="4.5" /><rect x="9" y="9" width="4.5" height="4.5" /></S>;
export const IUser = (p: P) => <S {...p}><circle cx="8" cy="5.5" r="2.8" /><path d="M2.8 14c.6-2.8 2.7-4.3 5.2-4.3s4.6 1.5 5.2 4.3" /></S>;
export const IOut = (p: P) => <S {...p}><path d="M6 13.5H3V2.5h3M10 11l3-3-3-3M13 8H6" /></S>;
export const IEye = (p: P) => <S {...p}><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="2" /></S>;
export const ICheck = (p: P) => <S {...p}><path d="M3 8.5l3 3 7-7" /></S>;
