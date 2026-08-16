# External Integrations

**Analysis Date:** 2026-08-15

## APIs & External Services

**Backend platform:**
- Supabase - PostgreSQL data API, authentication integration, and object storage for ERP data and product/customer attachments.
  - SDK/Client: `@supabase/supabase-js` and `@supabase/ssr` in `src/lib/supabase/admin.ts` and `src/lib/supabase/server.ts`.
  - Auth: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

**Developer tooling:**
- Supabase CLI - applies SQL-first migrations under `supabase/migrations/` and generates `src/types/supabase.ts`.
  - Auth: `SUPABASE_ACCESS_TOKEN` is required by the documented type-generation workflow (`README.md`).

## Data Storage

**Databases:**
- Supabase PostgreSQL, including `public`, `auth`, `storage`, and `graphql_public` schemas configured in `supabase/config.toml`.
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` plus Supabase API keys; local database is configured on port `54322`.
  - Client: typed `createClient<Database>` in `src/lib/supabase/admin.ts` and `createServerClient<Database>` in `src/lib/supabase/server.ts`.
  - Schema: SQL migrations in `supabase/migrations/`; `src/types/supabase.ts` is generated from the schema.

**File Storage:**
- Supabase Storage - private buckets for product documents/images and attachment records; uploads and signed/public URLs are handled in `src/app/page.tsx`.

**Caching:**
- None detected.

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - enabled in `supabase/config.toml`, with ERP user linkage through `auth.users` in `supabase/migrations/202608080001_foundation.sql`.
  - Implementation: cookie-aware server client in `src/lib/supabase/server.ts`; application data mutations currently use the service-role client from `src/lib/supabase/admin.ts`.

## Monitoring & Observability

**Error Tracking:**
- None detected.

**Logs:**
- Next.js development/server logs are represented by repository log files; no structured logging or external log service is configured.

## CI/CD & Deployment

**Hosting:**
- Vercel is documented as the web hosting target in `README.md`.

**CI Pipeline:**
- None detected.

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ACCESS_TOKEN` for the documented remote type-generation command

**Secrets location:**
- `.env.local` is present for local configuration; its contents were not read. `.env.example` is the non-secret setup reference.

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- None detected.

---

*Integration audit: 2026-08-15*
