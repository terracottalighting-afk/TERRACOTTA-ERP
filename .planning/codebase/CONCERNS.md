# Codebase Concerns

**Analysis Date:** 2026-08-15

## Tech Debt

**Monolithic application page and action layer:**
- Issue: Routing, data access, validation, server actions, and nearly all rendered UI are concentrated in one file.
- Files: `src/app/page.tsx` (approximately 8,800 lines)
- Impact: Changes have a large regression surface, slow review/build feedback, and make module ownership difficult to enforce.
- Fix approach: Split route/page composition, domain queries, mutations, and feature components into `src/modules/<module>/`; keep server actions close to their domain and share typed validation helpers.

**Generated database types are oversized and manually coupled to the app:**
- Issue: The generated schema type file is over 500 KB and the page duplicates many hand-written record types.
- Files: `src/types/supabase.ts`, `src/app/page.tsx`
- Impact: Schema changes can silently diverge from UI types and make type checking and navigation expensive.
- Fix approach: Derive query result types from generated types or dedicated DTOs and regenerate types as part of a repeatable CI/database workflow.

**Module boundaries are documentation-only:**
- Issue: Most declared ERP modules contain only README boundary files while behavior is implemented in the root page or is a placeholder.
- Files: `src/modules/admin/README.md`, `src/modules/ar/README.md`, `src/modules/inventory/README.md`, `src/modules/order/README.md`, `src/modules/purchasing/README.md`, `src/modules/reports/README.md`, `src/modules/rga/README.md`, `src/modules/shipping/README.md`, `src/app/page.tsx`
- Impact: Core operational workflows cannot be exercised in the UI and future work will continue increasing the monolith.
- Fix approach: Implement each module as an independently testable vertical slice with explicit query/action/component entry points.

## Known Bugs

**Storage metadata can be orphaned or inconsistent:**
- Symptoms: Uploads write the object before inserting `attachment`/document/image rows; a later database error leaves an untracked object. Product document insertion errors are not checked.
- Files: `src/app/page.tsx:982`, `src/app/page.tsx:1027`, `src/app/page.tsx:1106`
- Trigger: Any successful storage upload followed by an attachment or related-row failure.
- Workaround: Reconcile storage objects against attachment rows and delete failed-upload objects.

**Default thumbnail updates are not atomic:**
- Symptoms: The action clears existing defaults, then inserts the new image in a separate request; a failure can leave a product with no default thumbnail.
- Files: `src/app/page.tsx:1213`, `src/app/page.tsx:1247`, `src/app/page.tsx:1292`
- Trigger: Concurrent image updates or an insert failure after the clearing update.
- Workaround: Retry the image update and manually restore a default.

## Security Considerations

**Service-role key is the only data-access boundary:**
- Risk: Every server-rendered query and server action constructs an admin Supabase client, bypassing database RLS. Authorization is not checked in the page/action code.
- Files: `src/lib/supabase/admin.ts`, `src/app/page.tsx`, `supabase/migrations/202608100001_api_read_grants_for_phase1_ui.sql`
- Current mitigation: The admin client is server-only by convention and the service key is read from environment configuration.
- Recommendations: Authenticate requests, authorize each action by role/scope, use the cookie-aware client for user-scoped operations, enable RLS and add policies in migrations, and reserve the service-role client for narrowly isolated jobs.

**Database authorization posture is not represented in migrations:**
- Risk: No migration contains `CREATE POLICY` or `ENABLE ROW LEVEL SECURITY`; many migrations grant broad CRUD privileges to `service_role`, so a leaked or misrouted server action has unrestricted impact.
- Files: `supabase/migrations/202608080001_foundation.sql`, `supabase/migrations/202608100001_api_read_grants_for_phase1_ui.sql`, `supabase/migrations/202608130004_product_parts_write_grants.sql`, `supabase/migrations/202608140001_product_vendor_ui_grants.sql`
- Current mitigation: Requests currently appear to pass through server actions.
- Recommendations: Add explicit authenticated-role policies, audit grants, and integration tests that prove tenant/role isolation.

**File upload validation is incomplete:**
- Risk: Customer documents and product documents accept arbitrary size/content; MIME type is client-provided and the service role writes directly to storage. Product images validate MIME but not file signatures.
- Files: `src/app/page.tsx:982`, `src/app/page.tsx:1027`, `src/app/page.tsx:1106`, `next.config.ts`, `supabase/config.toml`
- Current mitigation: Image uploads have a 25 MB check and storage has a 50 MiB local limit.
- Recommendations: Enforce per-route size/type allowlists, inspect magic bytes, sanitize/display filenames consistently, scan files, rate-limit uploads, and delete objects on metadata failure.

**Private files are exposed through public URLs:**
- Risk: Attachment rendering calls `getPublicUrl`, which is inappropriate for private buckets and may expose documents if bucket policy is public.
- Files: `src/app/page.tsx:3626`, `src/app/page.tsx:982`, `src/app/page.tsx:1027`
- Current mitigation: Product document/image buckets are created with `public: false` in some paths.
- Recommendations: Generate short-lived signed URLs after authorization and never assume bucket visibility from a stored bucket name.

## Performance Bottlenecks

**Every request performs broad option and customer queries:**
- Problem: `Home` loads customer search plus ten option datasets on every navigation, including product-only routes.
- Files: `src/app/page.tsx:8474`, `src/app/page.tsx:8518`, `src/app/page.tsx:543`
- Cause: All data loading is composed at the root page before module rendering.
- Improvement path: Load only the active module’s dependencies, cache stable lookup tables, and add pagination/index review for search fields.

**Product-part search fetches up to 500 parent candidates:**
- Problem: Search paths issue a large `.limit(500)` lookup and then perform more queries to construct results.
- Files: `src/app/page.tsx:3115`, `src/app/page.tsx:3149`, `src/app/page.tsx:6982`, `src/app/page.tsx:7142`
- Cause: Search composition occurs in application code instead of a database view/function.
- Improvement path: Push joins/filtering into indexed SQL views or RPCs, cap result sets server-side, and measure query plans.

**Repeated per-record storage URL/signing work:**
- Problem: Detail rendering maps attachment/document/image records through multiple asynchronous storage operations.
- Files: `src/app/page.tsx:3561`, `src/app/page.tsx:3591`, `src/app/page.tsx:3615`
- Cause: Storage resolution is performed per record during page rendering.
- Improvement path: Batch metadata, generate URLs only for visible records, and cache signed URLs briefly.

## Fragile Areas

**Multi-step financial and inventory mutations:**
- Files: `src/app/page.tsx:1707`, `src/app/page.tsx:1962`, `src/app/page.tsx:2483`, `src/app/page.tsx:2780`
- Why fragile: A single user action performs multiple independent Supabase mutations without a database transaction or compensating workflow.
- Safe modification: Move invariants and multi-table updates into transactional SQL functions; add failure-path tests before changing action order.
- Test coverage: No test files or test runner configuration detected.

**Query-string-driven authorization and record selection:**
- Files: `src/app/page.tsx:8474`, `src/app/page.tsx:2831`, `src/app/page.tsx:3286`, `src/app/page.tsx:3765`
- Why fragile: IDs and module names arrive from URL/form data and are used to select records; access checks are absent.
- Safe modification: Validate UUIDs/enums with Zod and authorize the requested record before every read/write.
- Test coverage: No automated request/action tests detected.

**Placeholder module routing:**
- Files: `src/app/page.tsx:3928`, `src/app/page.tsx:8832`, `src/modules/*/README.md`
- Why fragile: Navigation presents modules such as AR, shipping, purchasing, reports, RGA, and admin even when rendering only a placeholder.
- Safe modification: Mark unavailable workflows explicitly in navigation or implement each route with acceptance tests before exposing it operationally.
- Test coverage: Not detected.

## Scaling Limits

**Single-page server-rendering model:**
- Current capacity: Product lists are capped at requested page sizes up to 100; several related dashboard lists are capped between 3 and 24.
- Limit: The root page still performs many independent queries and renders large detail branches; latency and memory grow with each added module.
- Scaling path: Use route-level layouts/pages, cached lookup data, database views/RPCs, and measured pagination/indexes.

## Dependencies at Risk

**Unpinned `latest` dependencies:**
- Risk: Framework, Supabase SDK, CLI, and type packages can change on install without a source change.
- Files: `package.json`, `pnpm-lock.yaml`
- Impact: Reproducibility, build behavior, and security patch review are weakened.
- Migration plan: Pin compatible versions, update deliberately, and verify lockfile changes in CI.

## Missing Critical Features

**Authentication, roles, permissions, and audit trail:**
- Problem: The declared admin/security boundary has no UI implementation or visible request authorization.
- Blocks: Safe multi-user ERP operation, accountability for financial/inventory changes, and tenant/department scoping.
- Files: `src/modules/admin/README.md`, `src/lib/supabase/server.ts`, `src/app/page.tsx`, `supabase/migrations/202608080001_foundation.sql`

**Operational module workflows:**
- Problem: AR, order entry, inventory, purchasing, shipping, RGA, reports, and admin navigation resolve to placeholders.
- Blocks: End-to-end ERP processing from order through fulfillment, invoicing, payment, returns, and reporting.
- Files: `src/modules/ar/README.md`, `src/modules/order/README.md`, `src/modules/inventory/README.md`, `src/modules/purchasing/README.md`, `src/modules/shipping/README.md`, `src/modules/rga/README.md`, `src/modules/reports/README.md`, `src/app/page.tsx`

## Test Coverage Gaps

**No automated test suite detected:**
- What's not tested: Server actions, authorization, RLS behavior, upload validation, storage cleanup, transaction consistency, search pagination, and financial/inventory calculations.
- Files: `package.json`, `src/app/page.tsx`, `supabase/migrations`
- Risk: Regressions and security failures can reach production unnoticed.
- Priority: High

**Verification command is not currently reproducible in this environment:**
- What's not tested: `pnpm lint` and `pnpm typecheck` could not complete because pnpm attempted a non-interactive modules purge and registry metadata fetch failed.
- Files: `package.json`, `pnpm-lock.yaml`
- Risk: The repository has no CI evidence to distinguish code failures from dependency/runtime drift.
- Priority: Medium

---

*Concerns audit: 2026-08-15*
