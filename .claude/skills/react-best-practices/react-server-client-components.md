# Server vs Client Components in Next.js App Router

## Decision Criteria

| Use Server Component        | Use Client Component                    |
| --------------------------- | --------------------------------------- |
| Data fetching               | User interactions (onClick, onChange)   |
| Static content              | Browser APIs (localStorage, window)     |
| SEO-critical content        | State management (useState, useReducer) |
| Heavy computations          | Effects (useEffect, useLayoutEffect)    |
| Access to backend resources | Custom hooks with client-side logic     |

## Implications

**Server Components:**

- Zero JS sent to client, not bundled
- Can access backend resources directly (DB, file system, env secrets)
- Cannot use hooks, browser APIs, or event handlers

**Client Components:**

- All code + dependencies shipped to browser
- Required for interactivity, state, effects
- Boundary propagates down (children become client too unless passed as props)

**Key Rule:** Push `'use client'` as far down the component tree as possible.

## Data Flow Pattern

```
Server Component (RSC)
  └── fetches data via server/data/*.ts ('server-only')
  └── validates response with Zod DTOs
  └── transforms via dto-to-*.ts functions
  └── passes serializable props to Client Component
        └── handles interactivity
        └── uses client hooks
```

**Props must be serializable:** You cannot pass functions, classes, or Dates directly to client components.

## Feature Architecture

### Adding to Existing Feature

1. Check if parent component is server or client
2. Follow established `server/` vs `components/` separation
3. If adding interactivity to server component:
   - Create new client component
   - Import and compose within server component
   - Pass only serializable data as props

### Creating New Feature

```
src/features/{feature}/
├── server/
│   ├── data/fetch-*.ts      # 'server-only' data fetching
│   └── dtos/
│       ├── *.dto.ts         # Zod validation schemas
│       └── dto-to-*.ts      # DTO to app type transformations
├── components/
│   ├── *-client.tsx         # 'use client' interactive components
│   └── *.tsx                # Server components (default)
├── hooks/use-*.ts           # Client-side hooks only
└── schemas.ts               # App-level Zod schemas
```

## Composition Pattern

```tsx
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { FeatureClient } from './feature-client';
import { fetchFeatureData } from '../server/data';
import { FeatureSkeleton } from './feature-skeleton';

// Server Component - fetches data
const FeatureRSC = async () => {
  const data = await fetchFeatureData();
  return <FeatureClient data={data} />;
};

// Exported component with loading/error handling
export const Feature = () => (
  <Suspense fallback={<FeatureSkeleton />}>
    <ErrorBoundary>
      <FeatureRSC />
    </ErrorBoundary>
  </Suspense>
);
```

```tsx
// feature-client.tsx
'use client';

import { useState } from 'react';
import type { FeatureData } from '../schemas';

interface Props {
  data: FeatureData;
}

export const FeatureClient = ({ data }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      {data.items.map((item) => (
        <button key={item.id} onClick={() => setSelected(item.id)}>
          {item.name}
        </button>
      ))}
    </div>
  );
};
```

## Common Mistakes

| Mistake                              | Problem                                        | Fix                                                          |
| ------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| `'use client'` too high in tree      | Entire subtree becomes client, bloating bundle | Move directive to smallest interactive component             |
| Importing server-only code in client | Build error or runtime leak                    | Keep server code in `server/` directory with `'server-only'` |
| Passing functions as props to client | Serialization error                            | Use Server Actions or move logic to client component         |
| Using hooks in server components     | Runtime error                                  | Extract interactive part to client component                 |
| Passing Date objects to client       | Serialization warning                          | Convert to ISO string, parse in client                       |

## When Both Seem Valid

If a component could reasonably be either:

1. **Default to Server** - better performance, smaller bundle
2. **Switch to Client only when:**
   - You need `useState`, `useEffect`, or other hooks
   - You need `onClick`, `onChange`, or other event handlers
   - You need browser APIs (window, localStorage, navigator)
   - You need to use a third-party library that requires client-side rendering
