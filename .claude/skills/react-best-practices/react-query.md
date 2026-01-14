# React Query Patterns

## Data Fetching Hook Pattern

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';

export const useFeatureData = (id: string) => {
  return useQuery({
    queryKey: ['feature', id],
    queryFn: () => fetchFeature(id),
    enabled: !!id,
  });
};
```

## Query Function Extraction

Extract `queryFn` logic to a separate function:

- **Inline** - If only used in this file
- **Import** - If shared (already exported elsewhere)

```tsx
// Inline (same file only)
const fetchFeature = async (id: string) => {
  const res = await fetch(`/api/feature/${id}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return featureSchema.parse(await res.json());
};

// Shared (import from where it's exported)
import { fetchFeature } from '@/feature/data/fetch-feature';

export const useFeatureData = (id: string) => {
  return useQuery({
    queryKey: ['feature', id],
    queryFn: () => fetchFeature(id),
  });
};
```

## Loading States

| State        | Use Case                                  |
| ------------ | ----------------------------------------- |
| `isPending`  | Initial load (no cached data)             |
| `isFetching` | Any fetch in progress (including refetch) |
| `isLoading`  | Deprecated, use `isPending`               |

**Pattern for smooth UX:**

```tsx
// Show skeleton only on initial load
if (isPending) return <Skeleton />;

// Show subtle loading indicator on refetch
return (
  <div className={cn(isFetching && 'opacity-70')}>
    {data.map((item) => (
      <Item key={item.id} {...item} />
    ))}
  </div>
);
```

## Keep Previous Data

Use `placeholderData: keepPreviousData` to:

- Prevent layout shift during refetch
- Keep showing old data while new data loads
- Provide smoother pagination/filtering UX

Use `isPending` for initial load skeleton, `isFetching` for subtle refetch indicator:

```tsx
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const { data, isPending, isFetching } = useQuery({
  queryKey: ['items', page],
  queryFn: () => fetchItems(page),
  placeholderData: keepPreviousData,
});

if (isPending) return <Skeleton />;

return <List data={data} className={cn(isFetching && 'opacity-70')} />;
```

## Query Key Patterns

```tsx
// Simple key
queryKey: ['users'];

// With parameters
queryKey: ['user', userId];

// With filters
queryKey: ['users', { status: 'active', page: 1 }];

// Nested resource
queryKey: ['users', userId, 'posts'];
```
