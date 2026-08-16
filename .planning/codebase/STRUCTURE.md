# Codebase Structure

**Analysis Date:** 2026-08-15

## Directory Layout

```text
erp-app/
├── src/
│   ├── app/                 # Next.js App Router shell, route, UI components
│   ├── lib/supabase/        # Supabase client factories
│   ├── modules/             # Domain boundary markers and module notes
│   └── types/               # Generated Supabase TypeScript schema
├── supabase/
│   ├── migrations/          # Numbered schema, functions, views, grants, seed changes
│   └── config.toml          # Local Supabase configuration
├── .planning/codebase/      # Generated architecture/codebase maps
├── package.json             # Scripts and dependencies
├── tsconfig.json            # Strict TypeScript and `@/*` alias configuration
├── next.config.ts           # Next.js runtime settings
└── eslint.config.mjs        # ESLint configuration
```

## Directory Purposes

**`src/app/`:**
- Purpose: App Router entry point and current ERP presentation/application layer.
- Contains: `layout.tsx`, `page.tsx`, global CSS, field groups, table rows, and product/location/customer UI components.
- Key files: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`.

**`src/lib/supabase/`:**
- Purpose: Infrastructure adapters for Supabase clients.
- Contains: `src/lib/supabase/admin.ts` and `src/lib/supabase/server.ts`.
- Key files: `src/lib/supabase/admin.ts` for privileged server operations; `src/lib/supabase/server.ts` for cookie-aware SSR.

**`src/modules/`:**
- Purpose: Intended ERP domain boundaries and implementation roadmap markers.
- Contains: README-only boundaries for `admin`, `ar`, `customer`, `foundation`, `inventory`, `order`, `product`, `purchasing`, `reports`, `rga`, and `shipping`.
- Key files: `src/modules/customer/README.md`, `src/modules/product/README.md`, and the other domain READMEs.

**`src/types/`:**
- Purpose: Shared schema types generated from Supabase.
- Contains: `src/types/supabase.ts`.
- Key file: `src/types/supabase.ts`; regenerate via the `supabase:types` scripts in `package.json`.

**`supabase/migrations/`:**
- Purpose: Authoritative database/domain implementation.
- Contains: Foundation and domain schema migrations, PostgreSQL functions/triggers/views, policy/grant changes, storage changes, and seed data.
- Key files: `202608080001_foundation.sql`, `202608080002_customer_master.sql`, `202608080003_product_master.sql`, `202608080004_inventory_warehouse.sql`, `202608080005_purchasing_receiving.sql`, `202608080006_order_entry.sql`, `202608080007_shipping_packing_invoice.sql`, `202608080008_payments_ar.sql`, `202608080009_rga_credit_memo.sql`, and `202608080014_posting_service_functions.sql`.

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML, metadata, and global stylesheet entry.
- `src/app/page.tsx`: Root route, query-string module dispatcher, loaders, server actions, and current page implementations.

**Configuration:**
- `package.json`: Runtime scripts and package dependencies.
- `tsconfig.json`: Strict TypeScript configuration and `@/*` → `src/*` alias.
- `next.config.ts`: React strict mode and 25 MB Server Action body limit.
- `supabase/config.toml`: Supabase local project configuration.
- `.env.example`: Environment variable shape only; secret-bearing `.env` files are not read.

**Core Logic:**
- `src/app/page.tsx`: Current application logic and domain read/write orchestration.
- `src/lib/supabase/admin.ts`: Privileged Supabase client.
- `src/types/supabase.ts`: Database contract.
- `supabase/migrations/`: Persistent domain rules and workflows.

**Testing:**
- No dedicated test directory or test files were detected under the scoped repository.
- Static checks are configured through `package.json` scripts: `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

## Naming Conventions

**Files:**
- Use lowercase kebab-case for React component files, e.g. `product-detail-parts-table.tsx` and `customer-terms-fields.tsx`.
- Use lowercase subdirectories for infrastructure and domain names, e.g. `src/lib/supabase` and `src/modules/customer`.
- Use numbered date-prefixed snake_case names for migrations, e.g. `supabase/migrations/202608080006_order_entry.sql`.

**Directories:**
- Keep Next.js route files in `src/app/`.
- Keep cross-cutting infrastructure in `src/lib/` and database contracts in `src/types/`.
- Use one directory under `src/modules/` per ERP domain; place future domain implementation alongside its existing README.

## Where to Add New Code

**New Feature:**
- Primary code: Add domain services/loaders/actions under the owning `src/modules/<domain>/` directory, then compose them from `src/app/page.tsx` or a dedicated App Router route.
- Tests: Add a test directory colocated with the feature once a test runner is introduced; no existing test convention is available.
- Database changes: Add a new date-prefixed migration under `supabase/migrations/` and update `src/types/supabase.ts` through the package script when schema changes.

**New Component/Module:**
- Implementation: Reusable UI belongs in `src/app/` while it remains route-specific; domain-specific implementation should go in `src/modules/<domain>/` to establish the boundary documented by `src/modules/*/README.md`.
- Route entry: Keep root query-string dispatch additions centralized in `src/app/page.tsx`, or add a route segment under `src/app/` if the feature needs an independent URL lifecycle.

**Utilities:**
- Shared helpers: Put reusable infrastructure/domain helpers in `src/lib/`; keep presentation-only formatters near the consuming component until they are reused.

## Special Directories

**`.planning/codebase/`:**
- Purpose: Generated architecture and codebase analysis documents.
- Generated: Yes.
- Committed: Intended for project planning history; do not place application runtime code here.

**`node_modules/`, `.next/`, and build output:**
- Purpose: Dependencies and generated Next.js artifacts.
- Generated: Yes.
- Committed: No, per `.gitignore`; exclude from structural scans.

**`supabase/migrations/`:**
- Purpose: Ordered database evolution and domain behavior.
- Generated: No.
- Committed: Yes; preserve chronological ordering and additive migration history.

---

*Structure analysis: 2026-08-15*
