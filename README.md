# Lighting ERP

Phase 1 ERP implementation scaffold for Terracotta Designs and Kanova & Co.

## Stack

- Next.js / React / TypeScript
- Vercel web app hosting
- Supabase PostgreSQL/Auth/Storage
- Supabase CLI migrations with SQL-first schema
- Generated TypeScript database types

## Early Setup

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local` and fill Supabase keys.
3. Start local development with `pnpm dev`.
4. Manage database schema through `supabase/migrations`.
5. Push migrations with Supabase CLI. During early setup, use direct database URL/password if project linking is blocked by Supabase API key metadata.
6. Generate database types with `pnpm supabase:types` after `SUPABASE_ACCESS_TOKEN` is available in the shell.

## Project Shape

- `src/app`: Next.js routes and pages.
- `src/components`: shared UI components.
- `src/lib`: shared infrastructure clients and helpers.
- `src/modules`: ERP module service boundaries.
- `supabase/migrations`: SQL-first schema migrations.
