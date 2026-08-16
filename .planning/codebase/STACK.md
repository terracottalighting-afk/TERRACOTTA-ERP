# Technology Stack

**Analysis Date:** 2026-08-15

## Languages

**Primary:**
- TypeScript 6.x - application code, typed Next.js pages/components, Supabase client wrappers, and generated database types in `src/`.
- SQL - schema, grants, seed data, functions, and Supabase migrations in `supabase/migrations/`.

**Secondary:**
- CSS - global application styling in `src/app/globals.css`.

## Runtime

**Environment:**
- Node.js runtime required by Next.js (exact version not pinned; no `.nvmrc` detected).

**Package Manager:**
- pnpm (workspace configuration in `pnpm-workspace.yaml`).
- Lockfile: present as `pnpm-lock.yaml`; dependency internals are not analyzed.

## Frameworks

**Core:**
- Next.js `latest` - App Router web application, server-rendered page, and Server Actions in `src/app/page.tsx`.
- React `latest` / React DOM `latest` - UI rendering and client components in `src/app/`.

**Testing:**
- Not detected; `package.json` has no test runner or test script.

**Build/Dev:**
- TypeScript `^6.0.0` - strict type checking via `pnpm typecheck`.
- ESLint `^9.0.0` with `eslint-config-next` - linting via `pnpm lint`.
- Supabase CLI `latest` - local services, migrations, and generated types.

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` `latest` - typed Supabase admin client and database/storage access in `src/lib/supabase/admin.ts`.
- `@supabase/ssr` `latest` - cookie-aware server client in `src/lib/supabase/server.ts`.
- `zod` `latest` - installed validation dependency; no active source usage detected.

**Infrastructure:**
- `@types/node`, `@types/react`, `@types/react-dom` - development type definitions.

## Configuration

**Environment:**
- `.env.local` is present and contains environment configuration; its contents are intentionally not read.
- `.env.example` documents the Supabase setup contract; secret values are supplied through local environment variables.
- Runtime clients require `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and the admin client requires `SUPABASE_SERVICE_ROLE_KEY` (`src/lib/supabase/admin.ts`, `src/lib/supabase/server.ts`).

**Build:**
- `next.config.ts` enables React strict mode and raises Server Action body size to `25mb` for uploads.
- `tsconfig.json` uses strict TypeScript, ES2022, bundler resolution, JSX transform, incremental compilation, and `@/*` → `src/*` aliasing.
- `eslint.config.mjs` extends Next.js rules and ignores generated Supabase types.

## Platform Requirements

**Development:**
- Node.js, pnpm, and Supabase CLI; local Supabase services use ports 54321–54323 as configured in `supabase/config.toml`.

**Production:**
- Vercel web app hosting is documented in `README.md`; a reachable Supabase project is required for PostgreSQL, Auth, and Storage.

---

*Stack analysis: 2026-08-15*
