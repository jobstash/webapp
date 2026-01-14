# React Component Structure

## Template

```tsx
'use client'; // Only if needed

// 1. IMPORTS

// React/Next/external libs
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Project imports (@/)
import { FILTER_KIND } from '@/features/filters/constants';
import { useActiveFilters } from '@/features/filters/hooks';
import type { FilterConfig } from '@/features/filters/schemas';

// Relative imports (./)
import { FilterItem } from './filter-item';
import { FilterSkeleton } from './filter-skeleton';

// 2. PROPS INTERFACE
interface Props {
  /** Filter configurations to display */
  configs: FilterConfig[];
  /** Callback when filter changes */
  onChange?: (key: string, value: string) => void;
}

// 3. COMPONENT
export const MyComponent = ({ configs, onChange }: Props) => {
  // Hooks (ordered: context → data → state → derived → effects)
  const activeFilters = useActiveFilters(configs);
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = configs.filter((c) => c.kind === 'checkbox');

  // Handlers
  const handleSelect = (itemId: string) => {
    setSelected(itemId);
    onChange?.(itemId, 'value');
  };

  // Render
  return <div>{/* ... */}</div>;
};
```

## Order

1. **Imports** - grouped by: React/Next/external libs, project imports (`@/`), relative imports (`./`)
2. **Props interface** - with JSDoc comments for each prop
3. **Component** - hooks → handlers → render

## Hooks Order

1. Context hooks (`useAuth`, `useTheme`)
2. Data fetching hooks
3. Local state (`useState`)
4. Derived values (computed from state/props)
5. Effects (`useEffect`)

## Handlers

Define handlers as regular functions. React 19 compiler auto-optimizes them.
