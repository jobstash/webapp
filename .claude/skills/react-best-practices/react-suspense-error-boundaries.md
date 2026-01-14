# Suspense, Error Boundaries, and Layout Composition

## When to Use Suspense

| Use Case                                 | Example                                 |
| ---------------------------------------- | --------------------------------------- |
| Async data fetching in Server Components | RSC with `await fetch()`                |
| Streaming HTML with Next.js App Router   | Progressive page loading                |
| Coordinating multiple async boundaries   | Multiple data sources loading together  |
| Wrapping ErrorBoundary                   | Graceful loading → error → content flow |

**Suspense handles the loading state for async operations.** Place it around components that await data.

```tsx
<Suspense fallback={<FeatureSkeleton />}>
  <FeatureRSC /> {/* async server component */}
</Suspense>
```

## When to Use Error Boundary

| Use Case                                   | Example                                      |
| ------------------------------------------ | -------------------------------------------- |
| Catching render errors in async components | Failed data fetch                            |
| Graceful degradation                       | Show error UI instead of blank screen        |
| Error logging                              | Debug with `onError` callback                |
| Isolating failures                         | Prevent one component from crashing the page |

**Use `react-error-boundary` library** (not custom class components).

```tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary
  fallback={<FeatureError />}
  onError={(error) => console.error('[Feature]', error)}
>
  <FeatureRSC />
</ErrorBoundary>;
```

## ErrorBoundary Client Wrapper Pattern

ErrorBoundary must be a client component to work with RSC. Create a dedicated `.error.tsx` wrapper:

```tsx
// feature.error.tsx
'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

const handleError = (error: Error) => {
  console.error('[Feature] Failed to load:', error);
};

export const FeatureBoundary = ({ children, fallback }: Props) => (
  <ErrorBoundary fallback={fallback} onError={handleError}>
    {children}
  </ErrorBoundary>
);
```

**Usage in main wrapper:**

```tsx
// feature.tsx (server component)
import { Suspense } from 'react';
import { FeatureBoundary } from './feature.error';
import { FeatureSkeleton } from './feature.skeleton';

export const Feature = () => (
  <Suspense fallback={<FeatureSkeleton />}>
    <FeatureBoundary fallback={<FeatureError />}>
      <FeatureRSC />
    </FeatureBoundary>
  </Suspense>
);
```

**Why separate file?**

- ErrorBoundary uses `react-error-boundary` which requires client context
- Keeps main wrapper as server component
- Allows Suspense to properly catch async boundaries

## Suspense + ErrorBoundary Composition

**Always wrap ErrorBoundary with Suspense** (not the other way around):

```tsx
<Suspense fallback={<FeatureSkeleton />}>
  <ErrorBoundary fallback={<FeatureError />}>
    <FeatureRSC />
  </ErrorBoundary>
</Suspense>
```

This ensures:

1. Loading state shows first (Suspense catches the promise)
2. If fetch fails, error UI shows (ErrorBoundary catches the error)
3. If fetch succeeds, content renders

## When to Use Lazy Loading (`next/dynamic`)

**Key fact:** `next/dynamic` = `React.lazy()` + `Suspense` combined. They don't conflict.

| Use Case                         | Approach                                        |
| -------------------------------- | ----------------------------------------------- |
| Code split into separate bundle  | `dynamic(() => import('./Component'))`          |
| Component needs browser APIs     | `dynamic(..., { ssr: false })`                  |
| Load on demand (conditional)     | `{showMore && <DynamicComponent />}`            |
| Show loading during bundle fetch | `dynamic(..., { loading: () => <Skeleton /> })` |

**Suspense vs dynamic:**

- `next/dynamic` = lazy loading JS bundles (code splitting for performance)
- `Suspense` = waiting for async operations (data fetching, streaming)

```tsx
import dynamic from 'next/dynamic';
import { FeatureSkeleton } from './feature.skeleton';

// Lazy load with skeleton fallback
export const Feature = dynamic(
  () => import('./feature').then((mod) => mod.Feature),
  { loading: () => <FeatureSkeleton /> },
);

// Client-only (needs browser APIs)
export const Chart = dynamic(() => import('./chart'), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
```

**When to use `ssr: false`:**

- Component uses `window`, `document`, or browser-only APIs
- Third-party libraries that don't support SSR
- Migrating client-only apps (e.g., from Vite)

## Layout Composition (Preventing Layout Shift)

### The Problem

Layout shift occurs when:

- Skeleton → Content transition changes dimensions
- Error state has different dimensions than content
- Loading/error states don't share structural styling

### The Solution

**Use a shared layout component for ALL states:**

```
┌─────────────────────────────┐
│ LayoutComponent             │  ← Same wrapper for:
│  ┌───────────────────────┐  │    - Skeleton (loading)
│  │ {children}            │  │    - Error (failed)
│  │ {header} {footer}     │  │    - Content (success)
│  └───────────────────────┘  │
└─────────────────────────────┘
```

Layout components can accept:

- `children` - main content slot
- **Slot props** - named component props like `header`, `footer`, `sidebar` for specific regions

### Pattern Template

```tsx
// feature.layout.tsx - shared structure (same dimensions always)
// Can use children OR slot props for multiple regions

// Simple: children only
export const FeatureLayout = ({ children }: React.PropsWithChildren) => (
  <div className='w-full rounded-2xl border bg-sidebar p-4'>
    <span className='font-medium'>Feature Title</span>
    {children}
  </div>
);

// Advanced: slot props for multiple regions
interface FeatureLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const FeatureLayout = ({
  header,
  children,
  footer,
}: FeatureLayoutProps) => (
  <div className='w-full rounded-2xl border bg-sidebar p-4'>
    {header && <div className='mb-4'>{header}</div>}
    {children}
    {footer && <div className='mt-4'>{footer}</div>}
  </div>
);
```

```tsx
// feature.skeleton.tsx - uses layout
import { Skeleton } from '@/components/ui/skeleton';
import { FeatureLayout } from './feature.layout';

export const FeatureSkeleton = () => (
  <FeatureLayout>
    <div className='flex flex-wrap gap-2'>
      <Skeleton className='h-7 w-48' />
      <Skeleton className='h-7 w-24' />
      <Skeleton className='h-7 w-32' />
    </div>
  </FeatureLayout>
);
```

```tsx
// feature.error.tsx - uses same layout
import { FeatureLayout } from './feature.layout';

export const FeatureError = () => (
  <FeatureLayout>
    <p className='text-sm text-muted-foreground'>Failed to load</p>
  </FeatureLayout>
);
```

```tsx
// feature.tsx - composition with Suspense + ErrorBoundary
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FeatureLayout } from './feature.layout';
import { FeatureSkeleton } from './feature.skeleton';
import { FeatureError } from './feature.error';
import { FeatureClient } from './feature.client';
import { fetchFeatureData } from '../server/data';

const FeatureRSC = async () => {
  const data = await fetchFeatureData();
  return (
    <FeatureLayout>
      <FeatureClient data={data} />
    </FeatureLayout>
  );
};

export const Feature = () => (
  <Suspense fallback={<FeatureSkeleton />}>
    <ErrorBoundary
      fallback={<FeatureError />}
      onError={(e) => console.error('[Feature]', e)}
    >
      <FeatureRSC />
    </ErrorBoundary>
  </Suspense>
);
```

## Common Mistakes

| Mistake                                    | Problem                            | Fix                                |
| ------------------------------------------ | ---------------------------------- | ---------------------------------- |
| Skeleton without layout wrapper            | Layout shift on content load       | Use shared layout component        |
| Error component with different dimensions  | Layout shift on error              | Wrap error in same layout          |
| Inline fallback without matching structure | Inconsistent sizing                | Extract to component using layout  |
| ErrorBoundary wrapping Suspense            | Error may not catch async failures | Suspense should wrap ErrorBoundary |
| Missing `onError` callback                 | Silent failures, no debugging info | Always log errors                  |
| Using class-based error boundaries         | Outdated pattern, more boilerplate | Use `react-error-boundary` library |
