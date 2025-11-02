# Codebase Guide and Clean Code Rules

This document defines how we structure, write, and review code in this repository. It is intended to be practical and easy to follow.

## Goals
- Consistent, readable, and maintainable code.
- Clear separation of concerns and predictable architecture.
- Strong typing with TypeScript; no `any`.
- Great DX without compromising performance or accessibility.

---

## Tech stack overview
- Next.js (App Router) + React + TypeScript
- TailwindCSS for styling
- Prisma + NestJS (server)
- ESLint + Prettier for linting/formatting

---

## Core rules (MUST FOLLOW)
- No `any` type.
  - Always use explicit, meaningful types. Prefer `unknown` + type-narrowing over `any` when necessary.
- No inline functions in JSX or as props.
  - Define handlers with `useCallback` or top-level named functions, then pass the reference.
  - Example: instead of `<Button onClick={() => doX(id)} />`, use:
    ```tsx
    const handleClick = useCallback(() => doX(id), [doX, id]);
    return <Button onClick={handleClick} />
    ```
- Types belong in `src/type/`.
  - Reusable domain types: `src/type/*.ts`.
  - Component-local types can live next to the component if they are not reused elsewhere, but prefer centralizing domain types.
- No magic strings/numbers. Use constants in `src/constant/`.
- No business logic in components.
  - UI components must be presentational; move logic to hooks (`src/hook/`) or services (`src/service/`).
- No direct mutation of state or props; always treat as immutable.
- Avoid deep prop-drilling; prefer composition or context where appropriate.
- Accessibility is not optional.
  - Ensure interactive elements have roles/labels, keyboard navigation, proper semantics.

---

## Project structure (client)
```
cvf-client/
  cvf-client/
    src/
      app/                # Next.js routes (App Router)
      components/         # UI components (presentational, small or composable)
      hook/               # React hooks for state/logic reuse
      service/            # API calls and domain services
      store/              # Global state (zustand, etc.)
      constant/           # Constants, enums, configuration values
      utils/              # Pure utility functions (no side effects)
      type/               # Shared domain types (TS only)
      public/             # Static assets
```

### Components
- Co-locate small styles and tests with components.
- Split large components into subcomponents under a subfolder.
- Prefer composition over props explosion.

### Pages (App Router)
- Keep route files thin; fetch data and compose presentational components.
- Put shared loaders/services in `src/service/`.

### Services
- One module per domain (e.g., `product.service.ts`).
- No UI imports; services are framework-agnostic (fetch/axios wrappers, DTO mapping).

### Hooks
- Encapsulate reusable logic with clear input/output.
- No direct DOM queries in hooks unless truly necessary.

### Types
- `src/type/` contains domain types (e.g., `product.ts`).
- Never import server-only types directly into the browser; define shared DTOs if needed.

---

## Naming conventions
- Files: `kebab-case.ts(x)` for modules; `PascalCase.tsx` for React components.
- Variables/Functions: `camelCase`.
- Types/Interfaces/Enums: `PascalCase`.
- React components must start with a capital letter.

---

## Styling conventions
- Use Tailwind utility classes; avoid inline `style` unless necessary.
- Extract repeated class groups into component props or small helpers.
- Responsive
  - Mobile-first; define base styles, then add `sm:`, `md:`, `lg:`, `xl:`, `2xl:` overrides.
  - Keep spacing consistent (`gap-2`, `gap-3`, `gap-4`, ...). Use design tokens if available.

---

## Performance
- Memoize heavy computations with `useMemo` and callbacks with `useCallback`.
- Avoid inline functions in JSX (re-render triggers).
- Use `React.memo` for pure components.
- Lazy load non-critical components when possible.
- Derive minimal state; avoid duplicating data.

---

## Accessibility (a11y)
- Buttons/links: correct semantics and `aria-*` attributes.
- Images: meaningful `alt` text or `alt=""` for decorative images.
- Keyboard navigation: focus states, `role`, `tabIndex` where appropriate.
- Color contrast should meet WCAG AA.

---

## Error handling & UX
- Use toasts/snackbars for transient errors and confirmations.
- Show skeletons or spinners for loading states.
- Provide empty states with helpful guidance.

---

## API and data
- All API calls live in `src/service/` and return typed results.
- Map server DTOs to client domain types at the boundary.
- Do not pass raw API responses into components.

---

## Testing (recommended)
- Unit tests for utilities and hooks.
- Component tests for critical UI (render/interaction).
- Keep tests alongside code or under `__tests__/`.

---

## Linting & formatting
- ESLint and Prettier are mandatory; do not commit lint errors.
- Prefer fixing with `npm run lint -- --fix` where safe.
- No console logs in committed code (except in rare, documented cases).

---

## Git hygiene
- Branch naming: `feat/…`, `fix/…`, `chore/…`, `refactor/…`.
- Conventional commits (recommended):
  - `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `style:`, `perf:`
- Keep PRs small and focused; include a clear summary and screenshots (if UI).

---

## Code review checklist (PR author)
- __Types__: no `any`; types declared or imported from `src/type/`.
- __Handlers__: no inline functions in JSX; handlers memoized where needed.
- __Separation__: logic in hooks/services; components are presentational.
- __State__: minimal and immutable; derived values with `useMemo`.
- __A11y__: labels, roles, keyboard, alt text.
- __Performance__: avoid unnecessary re-renders; lazy-load heavy parts.
- __Tests__: updated/added where applicable.
- __Docs__: README/CODEBASE_GUIDE updated if conventions changed.

---

## Examples

### Avoid inline functions in JSX
```tsx
// Bad
<Button onClick={() => doPurchase(productId)} />

// Good
const handlePurchase = useCallback(() => doPurchase(productId), [doPurchase, productId]);
<Button onClick={handlePurchase} />
```

### Strong typing and DTO mapping
```ts
// src/type/product.ts
export interface ProductDto { id: string; name: string; slug: string }
export interface Product { id: string; name: string; slug: string }

// src/service/product.mapper.ts
export function mapProductDto(dto: ProductDto): Product {
  return { id: dto.id, name: dto.name, slug: dto.slug };
}
```

### Constants over magic strings
```ts
// src/constant/route.ts
export const ROUTES = { products: "/products" } as const;

// usage
<Link href={ROUTES.products}>Products</Link>
```

---

## Server-side (NestJS + Prisma) highlights
- Keep controllers thin; move logic to services.
- DTOs and validation in `dto/`; entities (if used) in `entities/`.
- Prisma queries live in services; keep `include/select` explicit.
- Run migrations with meaningful names; never edit old migrations.
- Align `prisma` and `@prisma/client` versions exactly.

---

## How to propose changes to this guide
- Open a PR updating `CODEBASE_GUIDE.md` with a clear rationale and examples.
- Keep the guide concise and actionable.
