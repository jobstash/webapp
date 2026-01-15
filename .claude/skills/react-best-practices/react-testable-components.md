# Testable Components

## Core Principle

**Separate logic from UI.** Components are "dumb" renderers receiving data and callbacks. Logic lives in hooks that can be tested without DOM.

## File Structure

```
component-folder/
├── index.ts                   # Barrel export
├── component-name.tsx         # UI: calls hook, renders JSX
├── component-name.test.tsx    # UI tests: mock hook, simple props
├── use-component-name.ts      # Logic: state, async, handlers
└── use-component-name.test.ts # Hook tests: renderHook(), no DOM
```

## Concern Separation

| Concern             | Where     | Testing Approach                 |
| ------------------- | --------- | -------------------------------- |
| State management    | Hook      | `renderHook()`, no DOM needed    |
| Data fetching       | Hook      | Mock fetch, test hook directly   |
| Data transformation | Hook      | Pure function, simple assertions |
| Event handlers      | Hook      | Call handler, assert state       |
| UI rendering        | Component | Mock hook, verify output         |
| User interactions   | Component | `userEvent`, handlers are props  |

## Pattern

### Before (Mixed Concerns)

```tsx
// Hard to test: logic and UI intertwined
export const SearchList = ({ items, onSelect }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  // Fetching, filtering, handlers all mixed with JSX
  useEffect(() => {
    /* fetch logic */
  }, [debouncedQuery]);
  const filtered = results.filter(/* ... */);
  const handleSelect = (item) => {
    /* side effects */
  };

  return <div>{/* UI */}</div>;
};
```

### After (Separated Concerns)

```tsx
// use-search-list.ts - All logic, testable without DOM
export const useSearchList = ({ excludeIds, onSelect }) => {
  const [query, setQuery] = useState('');
  // ... state, fetching, filtering, handlers
  return { query, setQuery, isLoading, filteredResults, handleSelect };
};

// search-list.tsx - Pure UI, easy to test with mocked hook
export const SearchList = ({ items, onSelect }) => {
  const { query, setQuery, isLoading, filteredResults, handleSelect } =
    useSearchList({ excludeIds: items, onSelect });

  return <div>{/* UI only */}</div>;
};
```

## When to Extract Logic

**Extract to hook when component has:**

- `useState` (any state management)
- `useEffect` (side effects)
- Data fetching logic
- Complex event handlers with side effects
- Multiple interdependent derived values

**Keep in component:**

- Simple derived values from props: `const isActive = status === 'active'`
- Single-line transformations: `const displayName = user?.name ?? 'Guest'`
- UI-only refs: `const inputRef = useRef<HTMLInputElement>(null)`

## When NOT to Extract

Keep logic in component when:

- Component is truly simple (single `useState`, no async)
- Logic is purely UI-related (scroll position, focus management)
- Component is a leaf node with no complex behavior

## Checklist

- [ ] All state lives in the hook
- [ ] All async operations live in the hook
- [ ] All data transformations live in the hook
- [ ] Event handlers defined in hook (component calls them)
- [ ] Component only: calls hook, sets up DOM refs, renders JSX
- [ ] Hook returns typed interface (easy to mock)
