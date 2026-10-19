/** The only Google account allowed into the dashboard. */
export const AUTHORIZED_EMAIL = (process.env.ADMIN_EMAIL || 'muhammadahsanjaved09@gmail.com').trim().toLowerCase();

export const SESSION_COOKIE = 'anorix_dash_session';
/** Old unsigned cookie from the previous dashboard. Always cleared, never trusted. */
export const LEGACY_COOKIE = 'anorent_session_user';
export const SESSION_DAYS = 180;
