# Search Header Design

## Overview

Implement a search header component with live suggestions dropdown. Users type to see suggestions from a BFF endpoint, select items to navigate to their pages, or submit to add `query=<search_string>` to the URL.

## Architecture

### Directory Structure

```
src/features/search/
├── server/
│   ├── api/suggestions/route.ts   # GET /api/search/suggestions?q=<query>
│   └── schemas.ts                 # Server-only schemas
├── components/
│   └── search-header/
│       ├── search-header.tsx      # Main component
│       ├── search-suggestions.tsx # Desktop dropdown
│       ├── search-overlay.tsx     # Mobile fullscreen overlay
│       ├── search-suggestion-item.tsx
│       ├── use-search-suggestions.ts
│       ├── use-search-query-state.ts
│       └── index.ts               # Barrel export
├── schemas.ts                     # Shared schemas
├── constants.ts
└── index.ts
```

Replaces: `src/components/app-header/search-header.tsx`

### Data Shape

```ts
// features/search/schemas.ts
const suggestionItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});

const suggestionGroupSchema = z.object({
  label: z.string(),
  items: z.array(suggestionItemSchema),
});

const suggestionsResponseSchema = z.array(suggestionGroupSchema);
```

Example response:

```json
[
  {
    "label": "Jobs",
    "items": [
      {
        "id": "j1",
        "label": "Senior Solidity Developer",
        "href": "/jobs/senior-solidity"
      }
    ]
  },
  {
    "label": "Organizations",
    "items": [
      { "id": "o1", "label": "Uniswap", "href": "/organizations/uniswap" }
    ]
  },
  {
    "label": "Tags",
    "items": [{ "id": "t1", "label": "React", "href": "/t/react" }]
  }
]
```

Groups are dynamic from the API, not hardcoded in frontend.

## Data Flow

1. User types in search input
2. Debounce 300ms
3. Request `/api/search/suggestions?q=<query>` via `useRemoteFetch`
4. BFF returns filtered groups (filtering happens server-side)
5. Frontend renders groups as-is (no client-side filtering)
6. `useRemoteFetch` caches response client-side (1 hour TTL)

## API Route

### Endpoint

`GET /api/search/suggestions?q=<query>`

### Implementation

```ts
// src/features/search/server/api/suggestions/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  // MVP: Filter mock data
  // Future: Call external APIs, aggregate results
  const filtered = filterMockSuggestions(query);

  return Response.json(suggestionsResponseSchema.parse(filtered));
}
```

### Mock Data (MVP)

```ts
const mockSuggestions = [
  {
    label: 'Jobs',
    items: [
      { id: 'j1', label: 'Senior Solidity Developer', href: '/jobs/senior-solidity' },
      { id: 'j2', label: 'React Frontend Engineer', href: '/jobs/react-frontend' },
      { id: 'j3', label: 'Smart Contract Auditor', href: '/jobs/smart-contract-auditor' },
    ],
  },
  {
    label: 'Organizations',
    items: [
      { id: 'o1', label: 'Uniswap', href: '/organizations/uniswap' },
      { id: 'o2', label: 'Aave', href: '/organizations/aave' },
      { id: 'o3', label: 'Chainlink', href: '/organizations/chainlink' },
    ],
  },
  {
    label: 'Tags',
    items: [
      { id: 't1', label: 'React', href: '/t/react' },
      { id: 't2', label: 'Solidity', href: '/t/solidity' },
      { id: 't3', label: 'DeFi', href: '/t/defi' },
    ],
  },
];
```

## UI/UX Behavior

### Desktop

1. User focuses input - no change
2. User types - suggestions dropdown appears below input
3. Dropdown width matches input width
4. Groups displayed with headers (e.g., "Jobs", "Organizations", "Tags")
5. Arrow keys navigate items, Enter selects (shadcn Command defaults)
6. No matches - show "Search for '<query>'" option
7. Select item - navigate to `item.href`
8. Press Enter on text - add `query=<text>` to URL
9. Click outside or Escape - close dropdown

### Mobile

1. User taps input - fullscreen overlay opens immediately
2. Overlay contains: back button, auto-focused input, suggestions list
3. Same grouped sections with more vertical space
4. Select item - navigate, overlay closes
5. Press Enter - update URL, overlay closes
6. Back button - close without action

### Mobile Overlay Structure

```
┌─────────────────────────────────┐
│ ← Back          Search          │
├─────────────────────────────────┤
│ 🔍 [search input auto-focused]  │
├─────────────────────────────────┤
│ Jobs                            │
│   Senior Solidity Developer  →  │
│   React Frontend Engineer    →  │
├─────────────────────────────────┤
│ Organizations                   │
│   Uniswap                    →  │
└─────────────────────────────────┘
```

## URL State

### Pattern

```
/jobs                        # No search
/jobs?query=solidity         # Search active
/jobs?query=solidity&page=2  # Search + pagination
```

### Hook

```ts
// use-search-query-state.ts
const useSearchQueryState = () => {
  const { start } = useProgress();
  const [queryParam, setQueryParam] = useQueryState('query');
  const [, setPage] = useQueryState('page');

  const setSearchQuery = (value: string | null) => {
    start();
    setPage(null); // Reset pagination
    return setQueryParam(value);
  };

  return [queryParam, setSearchQuery] as const;
};
```

### Submit Behavior

| Action                    | Result                    |
| ------------------------- | ------------------------- |
| Press Enter with text     | URL becomes `?query=text` |
| Press Enter with empty    | Removes `query` param     |
| Select suggestion item    | Navigate to `item.href`   |
| Select "Search for '...'" | URL becomes `?query=text` |

### Input Sync

- On mount: initialize from `queryParam` if present
- On URL change (back button): sync input to `queryParam`
- On type: update local state only
- On submit: update URL

## Components

### search-header.tsx

- Main component, renders search input with icon
- Detects viewport: desktop shows `SearchSuggestions`, mobile shows `SearchOverlay`
- Manages local state: `query` (input value), `isOpen` (visibility)
- On submit: calls `setSearchQuery` to update URL

### search-suggestions.tsx

- Desktop dropdown using shadcn `Command`
- `CommandList` with `CommandGroup` for each group
- `CommandEmpty` shows "Search for '<query>'" option
- Positioned below input, width matches input

### search-overlay.tsx

- Mobile fullscreen using shadcn `Dialog` (fullscreen styled)
- Contains search input at top
- Same `Command` structure for suggestions
- Close button in header

### search-suggestion-item.tsx

- Single item as `CommandItem`
- Wraps content in `Link` for navigation

### use-search-suggestions.ts

```ts
const useSearchSuggestions = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);

  const url = debouncedQuery.trim()
    ? `/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`
    : null;

  const { data, isLoading } = useRemoteFetch<SuggestionGroup[]>(
    url,
    { transform: (res) => suggestionsResponseSchema.parse(res) }
  );

  return { groups: data ?? [], isLoading };
};
```

## Technical Notes

- React 19 with `reactCompiler: true` - no manual `useMemo`/`useCallback`
- Use existing `useRemoteFetch` hook (client-side caching, abort controller)
- Use shadcn `Command` component for keyboard navigation
- Use shadcn `Dialog` for mobile overlay
- Zod validation on API response (server) and fetch transform (client)
- CORS not an issue - Next.js API routes are same-origin by default

## Decisions Summary

| Aspect        | Decision                                  |
| ------------- | ----------------------------------------- |
| Search type   | Hybrid - live suggestions, URL on submit  |
| Suggestions   | Dynamic groups from BFF                   |
| Data fetching | `useRemoteFetch` + debounced query        |
| Filtering     | Server-side in BFF                        |
| Desktop       | Dropdown, matches input width             |
| Mobile        | Fullscreen overlay on focus               |
| URL state     | `query` param via nuqs, resets pagination |
| Keyboard      | shadcn Command defaults                   |
| Empty state   | "Search for '<query>'" option             |
