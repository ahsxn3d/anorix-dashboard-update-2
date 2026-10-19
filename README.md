# Anorix Studio dashboard

Owner-only dashboard for the anorent / Anorix main site. Two sections:

- **Projects**: list, create, edit, delete `DeploymentProduct` rows (the catalog the main site reads), with image upload.
- **Profile**: your account (name, avatar), catalog stats, sign out.

Runs on http://localhost:3001 (`npm run dev`). Sign in with the Google account in `ADMIN_EMAIL`.

Env (`.env`, never committed): `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAIL`, `UPLOADTHING_TOKEN`.

`prisma/schema.prisma` mirrors the live database. Do not run `prisma db push` or `migrate` from here.
