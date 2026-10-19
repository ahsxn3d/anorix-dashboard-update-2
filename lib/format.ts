/** Deterministic (server == browser) date formatting, Pakistan time. */
const dt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Karachi' });
const d = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Karachi' });
export const fmtDateTime = (iso: string | Date) => `${dt.format(new Date(iso))} PKT`;
export const fmtDate = (iso: string | Date) => d.format(new Date(iso));
