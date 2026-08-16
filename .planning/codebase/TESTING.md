# Testing Patterns

**Analysis Date:** 2026-08-15

## Test Framework

**Runner:**
- No test runner is configured. No Jest, Vitest, Playwright, Cypress, or equivalent configuration was detected.
- No test files matching `*.test.*`, `*.spec.*`, or `__tests__` were detected outside excluded/generated areas.

**Assertion Library:**
- Not detected.

**Run Commands:**
```bash
pnpm lint       # ESLint static analysis
pnpm typecheck  # Strict TypeScript checking
pnpm build      # Next.js production build
```

## Test File Organization

**Location:**
- Automated test locations are not established. Current source lives under `src/app`, `src/lib`, and `src/modules`.

**Naming:**
- No test naming convention is established.

**Structure:**
```text
No test directory or test file pattern detected.
```

## Test Structure

**Suite Organization:**
- Not applicable; no suites exist.

**Patterns:**
- There are no setup, teardown, fixture, or assertion patterns to follow.
- Use component boundaries such as `src/app/product-vendor-rows.tsx` and `src/app/product-detail-parts-table.tsx` as unit-test targets if tests are introduced.

## Mocking

**Framework:**
- No mocking framework is configured.

**Patterns:**
```typescript
// No repository mocking pattern detected.
```

**What to Mock:**
- If unit tests are added, mock Supabase client boundaries from `src/lib/supabase/admin.ts` and `src/lib/supabase/server.ts`, plus Next navigation for server-action tests.

**What NOT to Mock:**
- Keep pure formatting and selection logic real; helpers such as `label`, `dateLabel`, and client selection behavior are deterministic in `src/app/page.tsx` and client components.

## Fixtures and Factories

**Test Data:**
```typescript
// No fixtures or factories detected.
```

**Location:**
- No fixture directory is established. Generated database types are in `src/types/supabase.ts` and should be treated as generated input, not fixtures.

## Coverage

**Requirements:**
- No coverage target or enforcement is configured.

**View Coverage:**
```bash
# Not available; no coverage command is defined in package.json.
```

## Test Types

**Unit Tests:**
- Not present. Highest-value initial targets are pure helpers and client interaction components in `src/app/*.tsx`.

**Integration Tests:**
- Not present. Supabase reads/writes and server actions are concentrated in `src/app/page.tsx` and should be covered against a controlled Supabase test project or local database when introduced.

**E2E Tests:**
- Not present. The single-page query-parameter navigation and form/action flows in `src/app/page.tsx` are natural E2E candidates.

## Common Patterns

**Async Testing:**
```typescript
// No async test pattern detected.
```

**Error Testing:**
```typescript
// No error assertion pattern detected.
```

## Verification Guidance

- Treat `pnpm lint`, `pnpm typecheck`, and `pnpm build` as the current verification gate because they are the only automated checks declared in `package.json`.
- Prioritize tests around server actions that parse `FormData`, call the service-role Supabase client, upload files, and redirect with encoded errors in `src/app/page.tsx`.
- Add regression coverage for interactive selection and empty states in `src/app/product-list-rows.tsx`, `src/app/product-parts-edit-rows.tsx`, and `src/app/product-vendor-rows.tsx`.

---

*Testing analysis: 2026-08-15*
