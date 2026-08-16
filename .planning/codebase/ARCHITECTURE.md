<!-- refreshed: 2026-08-15 -->
# Architecture

**Analysis Date:** 2026-08-15

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                       │
│  `src/app/layout.tsx`  `src/app/page.tsx`                   │
│  Query-string module routing and server-rendered UI          │
└───────────────┬──────────────────┬──────────────────────────┘
                │                  │
                ▼                  ▼
┌──────────────────────┐  ┌───────────────────────────────────┐
│ UI components         │  │ Server actions / data loaders     │
│ `src/app/*.tsx`       │  │ `src/app/page.tsx`                │
└──────────┬───────────┘  └────────────────┬──────────────────┘
           │                               │
           ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Supabase client adapters                                     │
│ `src/lib/supabase/admin.ts`, `src/lib/supabase/server.ts`    │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Supabase PostgreSQL, Storage, views, triggers, RPC functions  │
│ `supabase/migrations/*.sql`                                  │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root layout | Global metadata, stylesheet, HTML/body shell | `src/app/layout.tsx` |
| Home route/controller | Query-string routing, server data loading, server actions, forms, dashboards, and page composition | `src/app/page.tsx` |
| Presentational/client fields | Interactive field groups and table row UI used by the route | `src/app/customer-terms-fields.tsx`, `src/app/product-*.tsx`, `src/app/location-*.tsx` |
| Supabase admin adapter | Service-role database and Storage client for server actions/loaders | `src/lib/supabase/admin.ts` |
| Supabase SSR adapter | Cookie-aware server client for authenticated SSR contexts | `src/lib/supabase/server.ts` |
| Generated database types | TypeScript representation of the Supabase `public` schema | `src/types/supabase.ts` |
| Domain boundaries | Intended ownership map for ERP domains; currently mostly README markers | `src/modules/*/README.md` |
| Database domain layer | Tables, views, constraints, triggers, RPCs, grants, and seed data | `supabase/migrations/*.sql` |

## Pattern Overview

**Overall:** Server-rendered Next.js monolith with a query-string-driven module shell and database-centric domain logic.

**Key Characteristics:**
- `src/app/page.tsx` is both the route entry point and the application service/controller for customer, product, inventory, purchasing, order, shipping, AR, RGA, and reporting views.
- Forms use inline Server Actions declared with `"use server"`; actions write through Supabase and redirect back to a query-string URL with `error` or `notice` parameters.
- Read models are assembled by dedicated async functions such as `getCustomerDashboard`, `getProductDetail`, and search functions, generally from Supabase table/view queries.
- The database owns substantial invariants and workflows through PostgreSQL functions, triggers, views, and RLS/grant migrations.
- Some UI is split into nearby components, but domain services, DTO-like types, and most page components remain colocated in `src/app/page.tsx`.

## Layers

**Presentation and route composition:**
- Purpose: Render the ERP shell, dashboards, lists, forms, and module placeholders.
- Location: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/*.tsx`
- Contains: React components, form markup, links, query-string state, formatting helpers, and view model types.
- Depends on: Server data loaders/actions and Supabase adapters.
- Used by: Next.js App Router.

**Application/data-access layer:**
- Purpose: Translate form submissions and URL parameters into database reads/writes and redirects.
- Location: Inline functions in `src/app/page.tsx` (approximately `543-3910` for loaders/actions and later page-specific loaders).
- Contains: Lookup loaders, search functions, dashboard assemblers, mutations, file uploads, validation, and redirect/error handling.
- Depends on: `src/lib/supabase/admin.ts`, generated `Database` types, and PostgreSQL schema contracts.
- Used by: Route components and HTML forms in `src/app/page.tsx`.

**Infrastructure adapters:**
- Purpose: Configure Supabase clients for server-side database and Storage access.
- Location: `src/lib/supabase/admin.ts`, `src/lib/supabase/server.ts`
- Contains: Admin/service-role client and cookie-aware SSR client factories.
- Depends on: `@supabase/supabase-js`, `@supabase/ssr`, environment configuration.
- Used by: Server-side route code; the admin adapter is the currently observed path in `src/app/page.tsx`.

**Database/domain layer:**
- Purpose: Persist ERP entities and enforce cross-domain behavior.
- Location: `supabase/migrations/202608080001_foundation.sql` through later numbered migrations.
- Contains: Foundation, customer, product, inventory, purchasing, orders, shipping, AR, RGA, reporting, admin, document, and grant changes.
- Depends on: PostgreSQL and Supabase Storage/auth facilities.
- Used by: Supabase clients and generated types.

## Data Flow

### Primary Request Path

1. Next.js invokes the async home page at `src/app/page.tsx:8474` with `searchParams`.
2. The page parses module/entity/tab/query parameters and selects a dashboard, list, edit form, or placeholder.
3. Selected async loaders such as `getCustomerDashboard` (`src/app/page.tsx:3765`) or `getProductDetail` (`src/app/page.tsx:3286`) create a Supabase client and query tables/views.
4. The route maps database rows into local view-model types declared near the top of `src/app/page.tsx`.
5. React server components render HTML and pass form actions to nearby field/table components.

### Mutation and Upload Flow

1. A form in `src/app/page.tsx` or a child component submits to an inline Server Action.
2. The action validates required fields and parses values, commonly with `zod` or explicit checks.
3. The action writes through `createSupabaseAdminClient` from `src/lib/supabase/admin.ts`; file actions also use Supabase Storage.
4. Database triggers/RPC functions enforce numbering, snapshots, totals, inventory effects, and cross-entity validation.
5. The action redirects to the relevant query-string route with encoded error/notice state.

**State Management:** URL search parameters are the primary navigation and selection state. Persistent state lives in Supabase; local React state is used by interactive child components such as `src/app/product-list-rows.tsx`.

## Key Abstractions

**Query-string module router:**
- Purpose: Select ERP views without separate route segments.
- Examples: `src/app/page.tsx` search parameter type and `Home` dispatch logic.
- Pattern: `module`, entity IDs, `tab`, and action parameters are encoded in links/forms and interpreted by the single page.

**Domain read models:**
- Purpose: Shape multi-table data for dashboards and detail views.
- Examples: `getCustomerDashboard` and `getProductDetail` in `src/app/page.tsx`.
- Pattern: Explicit local TypeScript types aggregate related records, lookup labels, inventory, documents, parts, vendors, and financial records.

**Supabase client factories:**
- Purpose: Keep client initialization/configuration in one place.
- Examples: `src/lib/supabase/admin.ts`, `src/lib/supabase/server.ts`.
- Pattern: Import a factory and create a request-scoped client inside server loaders/actions.

**Database workflow functions:**
- Purpose: Centralize business invariants and derived values close to persisted data.
- Examples: `supabase/migrations/202608080014_posting_service_functions.sql`, `supabase/migrations/202608080006_order_entry.sql`, `supabase/migrations/202608080008_payments_ar.sql`.
- Pattern: PostgreSQL triggers/RPCs maintain snapshots, totals, numbering, posting, and validation.

## Entry Points

**Web application:**
- Location: `src/app/layout.tsx` and `src/app/page.tsx`
- Triggers: Browser requests to the Next.js root route.
- Responsibilities: Global shell plus all currently implemented ERP route views and mutations.

**Development/build commands:**
- Location: `package.json`
- Triggers: `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm typecheck`, and `pnpm lint`.
- Responsibilities: Run the Next.js app and static checks.

**Database evolution:**
- Location: `supabase/migrations/`
- Triggers: Supabase CLI migration workflow.
- Responsibilities: Apply schema, seed, function, policy, grant, and storage changes in numbered order.

## Architectural Constraints

- **Threading:** Next.js server execution and React server rendering; no application-managed worker/thread layer detected.
- **Global state:** Formatting constants and option arrays are module-level in `src/app/page.tsx`; Supabase clients are created per operation.
- **Circular imports:** No circular dependency chain detected in the small TypeScript module graph; `src/app/page.tsx` imports child components and the admin adapter only.
- **Routing:** New root-level ERP views must fit the query-string dispatch in `src/app/page.tsx` unless a route-segment architecture is introduced.
- **Database authority:** Cross-record invariants may be enforced by PostgreSQL functions/triggers rather than TypeScript alone; preserve migration contracts when changing writes.

## Anti-Patterns

### God Route Module

**What happens:** `src/app/page.tsx` contains roughly 9,274 lines spanning types, loaders, mutations, forms, dashboards, and routing.
**Why it's wrong:** Domain changes have a large blast radius and make ownership, testing, and reuse difficult.
**Do this instead:** Put new domain data access and actions under a domain-specific module/service path, then keep `src/app/page.tsx` as a thin route composer; preserve existing URL contracts during extraction.

### Service-Role Access in UI Route Code

**What happens:** Most observed route loaders/actions call `createSupabaseAdminClient` from `src/lib/supabase/admin.ts`.
**Why it's wrong:** Service-role access bypasses normal RLS protections if request authorization is not independently enforced.
**Do this instead:** Use the cookie-aware client from `src/lib/supabase/server.ts` for user-scoped operations and isolate explicitly privileged operations behind audited server-side authorization.

## Error Handling

**Strategy:** Validate in Server Actions, catch Supabase errors, and redirect with URL-encoded `error` messages; successful mutations redirect with `notice` messages.

**Patterns:**
- Required IDs and form values are checked before mutation in `src/app/page.tsx`.
- Database errors are converted into redirect parameters at action call sites.
- Database functions provide additional validation for snapshots, posting, totals, and cross-entity consistency in `supabase/migrations/*.sql`.

## Cross-Cutting Concerns

**Logging:** Console/server logs are present outside application modules, but no dedicated application logging abstraction is detected.
**Validation:** Explicit form parsing in `src/app/page.tsx`, `zod` dependency in `package.json`, and PostgreSQL constraints/functions.
**Authentication:** Supabase SSR support exists in `src/lib/supabase/server.ts`; route-level use of the admin client is the dominant observed data path.

---

*Architecture analysis: 2026-08-15*
