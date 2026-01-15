---
name: react-best-practices
description: Use when creating, modifying, or reviewing React component files (.tsx, .jsx) to ensure best practices are followed
---

# React Best Practices

> **React 19:** This project uses React Compiler (`reactCompiler: true`). Do not use `useMemo`, `useCallback`, or `React.memo` - the compiler handles memoization automatically.

## Component Structure

Order: Imports → Props Interface → Component (hooks → handlers → render)
Hooks: context → data → state → derived → effects
Handlers: Define in component body (React 19 compiler handles optimization)
**Details:** @react-component-structure.md

## Server vs Client Components

| Server                        | Client                       |
| ----------------------------- | ---------------------------- |
| Data fetching, static content | Interactions, state, effects |
| SEO, backend access           | Browser APIs                 |

**Rule:** Push `'use client'` as far down as possible.
**Details:** @react-server-client-components.md

## Suspense & Error Boundaries

| Suspense            | ErrorBoundary         | `next/dynamic`          |
| ------------------- | --------------------- | ----------------------- |
| Async data fetching | Render error catching | Code splitting          |
| Streaming HTML      | Graceful degradation  | Browser-only components |

**Rule:** Use layout components for skeleton/error/content to prevent layout shift.
**Details:** @react-suspense-error-boundaries.md

## Route File Rules

Route files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`) should only import and compose components.

**Do:**

- Import components from `@/features/` or local folders
- Compose components with props and children

**Don't:**

- Declare components inline
- Include hooks or state management
- Write complex JSX logic

**Details:** @react-route-files.md

## Component Design Rules

**Single Responsibility:** One component = one reason to change. Split into utils, hooks, presentational, container.
**Details:** @react-single-responsibility-principle.md

**Composition:** Use `children`/render props for variations, not conditionals.
**Details:** @react-open-closed-principle.md

**Consistent Interfaces:** Same prop shapes across component hierarchies.
**Details:** @react-liskov-substitution-principle.md

**Minimal Props:** Don't accept props you don't use.
**Details:** @react-interface-segregation-principle.md

## Data Fetching (React Query)

Use `@tanstack/react-query` for client-side data fetching:

- `isPending` for initial load state
- `isFetching` for any fetch in progress
- `placeholderData: keepPreviousData` for smooth transitions
- Always validate responses with Zod

**Details:** @react-query.md

## Testable Components

**Core Principle:** Separate logic from UI. Components render; hooks manage state and behavior.

| Concern            | Where it lives | How to test                |
| ------------------ | -------------- | -------------------------- |
| State, async, data | Hook           | `renderHook()`, no DOM     |
| Event handlers     | Hook           | Call handler, assert state |
| UI rendering       | Component      | Mock hook, simple props    |

**Rule:** Extract logic to hooks. Components only: call hook, render JSX.
**Details:** @react-testable-components.md
