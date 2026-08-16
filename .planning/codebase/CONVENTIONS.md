# Coding Conventions

**Analysis Date:** 2026-08-15

## Naming Patterns

**Files:**
- Use lowercase kebab-case for React component files, such as `src/app/product-detail-parts-table.tsx` and `src/app/customer-terms-fields.tsx`.
- Use lowercase descriptive names for infrastructure modules, such as `src/lib/supabase/server.ts`.

**Functions:**
- Use camelCase for functions and handlers: `createSupabaseAdminClient`, `getProductBrandOptions`, `dateLabel` (`src/lib/supabase/admin.ts`, `src/app/page.tsx`).
- Use verb-oriented names for server actions, typically ending in `Action`, such as `createCustomerAction` in `src/app/page.tsx`.

**Variables:**
- Use camelCase for local values and state (`selectedPartIds`, `productOptions`).
- Use descriptive boolean names with `is`, `has`, or `show` prefixes (`isSelected`, `hasInitialSelection`, `showParentPicker`).
- Preserve snake_case for database columns and form field names (`account_type_id`, `selected_part_ids`) at the Supabase/FormData boundary.

**Types:**
- Use PascalCase for local object types and component props (`CustomerAccount`, `ProductDetail`, `ProductPartEditRow`).
- Use string unions for constrained UI values (`ProductImageCategory`, `ProductDocumentType`) in `src/app/page.tsx`.
- Use generated `Database` types for Supabase clients via `src/types/supabase.ts`; avoid editing that generated file manually.

## Code Style

**Formatting:**
- TypeScript uses double quotes, semicolons, trailing commas where multiline, and two-space indentation, as shown across `src/app/*.tsx` and `src/lib/supabase/*.ts`.
- `eslint.config.mjs` composes `eslint-config-next` and ignores `.next/**`, `node_modules/**`, and generated `src/types/supabase.ts`.

**Linting:**
- Run `pnpm lint`; the configured rules come from Next.js ESLint configuration in `eslint.config.mjs`.
- Run `pnpm typecheck` for strict TypeScript validation. `tsconfig.json` enables `strict`, `isolatedModules`, `noEmit`, and the `@/*` alias to `src/*`.

## Import Organization

**Order:**
1. Framework and third-party imports (`next/*`, `react`).
2. Relative component imports from the same route directory.
3. Aliased application imports using `@/*`.

**Path Aliases:**
- Use `@/*` for imports rooted at `src`, configured in `tsconfig.json`; Supabase clients use `@/types/supabase`.
- Use relative imports for sibling components in `src/app`.

## Error Handling

**Patterns:**
- Check Supabase `{ data, error }` results immediately and throw `new Error(error.message)` for read failures, especially in `src/app/page.tsx`.
- Server actions validate required fields early and redirect back with stable errors such as `error=missing_required` or URL-encoded messages (`src/app/page.tsx`).
- Use `redirect()` from `next/navigation` for action success/failure navigation rather than returning action payloads (`src/app/page.tsx`).
- The admin client fails fast when required environment variables are absent (`src/lib/supabase/admin.ts`).
- The server client catches cookie-write failures because Server Components cannot mutate cookies (`src/lib/supabase/server.ts`); keep this boundary-specific behavior localized.

## Logging

**Framework:** Console logging is not detected in application source.

**Patterns:**
- Do not log secrets or service-role credentials. Surface user-visible action failures through redirect query parameters as used in `src/app/page.tsx`.

## Comments

**When to Comment:**
- Comments are sparse; use them for framework constraints or non-obvious boundary behavior, as in the cookie mutation catch in `src/lib/supabase/server.ts`.

**JSDoc/TSDoc:**
- JSDoc/TSDoc is not detected. Prefer clear names and explicit types unless a public abstraction needs additional explanation.

## Function Design

**Size:**
- Small UI components and helpers are focused, but `src/app/page.tsx` contains route rendering, data loaders, and numerous server actions. Split new features into module/action files when practical.

**Parameters:**
- Components receive one destructured props object with inline or nearby structural types (`src/app/product-vendor-rows.tsx`).
- Normalize `FormData` values explicitly with `String(...).trim()` and convert optional blanks to `null` (`src/app/page.tsx`).

**Return Values:**
- Helpers return typed arrays/records and normalize missing database data with `data ?? []` (`src/app/page.tsx`).
- Client components render explicit empty-state text rather than undefined content (`src/app/product-detail-parts-table.tsx`).

## Module Design

**Exports:**
- Use named exports for reusable React components and clients (`ProductVendorRows`, `createSupabaseAdminClient`).
- Keep page-specific helpers and server actions local to `src/app/page.tsx` unless reused.

**Barrel Files:**
- Barrel files are not detected. Import directly from the defining module.

---

*Convention analysis: 2026-08-15*
