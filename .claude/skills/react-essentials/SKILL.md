---
name: react-essentials
description: Core React patterns for this project - component structure, hook extraction, and import order. Always use for any React work.
---

# React Essentials

> **React 19:** This project uses React Compiler (`reactCompiler: true`). Do not use `useMemo`, `useCallback`, or `React.memo` - the compiler handles memoization automatically.

## Core Principle: Extract Logic to Hooks

**Components are UI-only.** All logic lives in a custom hook for the component.

```
component-folder/
├── index.ts                  # Barrel export
├── my-component.tsx          # UI only - calls hook, renders JSX
└── use-my-component.ts       # All logic - state, handlers, effects
```

### What Goes Where

| In Component                    | In Custom Hook                   |
| ------------------------------- | -------------------------------- |
| Call the hook                   | `useState`                       |
| JSX rendering                   | `useEffect`                      |
| UI-only refs (`useRef` for DOM) | Data fetching                    |
| Simple prop transforms          | Event handlers with side effects |
|                                 | Derived/computed values          |
|                                 | Business logic                   |

### Pattern

```tsx
// use-user-card.ts - ALL logic here
export const useUserCard = (userId: string) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: user, isPending } = useQuery({...});

  const displayName = user?.name ?? 'Guest';

  const handleToggle = () => setIsExpanded(!isExpanded);
  const handleDelete = async () => {
    await deleteUser(userId);
  };

  return { user, isPending, displayName, isExpanded, handleToggle, handleDelete };
};

// user-card.tsx - UI only
export const UserCard = ({ userId }: Props) => {
  const { user, isPending, displayName, isExpanded, handleToggle, handleDelete } =
    useUserCard(userId);

  if (isPending) return <Skeleton />;

  return (
    <Card>
      <h2>{displayName}</h2>
      {isExpanded && <Details user={user} />}
      <Button onClick={handleToggle}>Toggle</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </Card>
  );
};
```

### When NOT to Extract

Keep in component when:

- Truly simple (no state, no effects, just props → JSX)
- Logic is purely UI-related (scroll position, focus)
- Leaf component with no behavior

## Structure

### Import Order

```tsx
'use client'; // Only if needed

// 1. React/Next/external libs
import { type ReactNode } from 'react';

// 2. Project imports (@/)
import { useAuth } from '@/features/auth/hooks';
import type { User } from '@/features/auth/schemas';

// 3. Relative imports (./)
import { useUserCard } from './use-user-card';
import { UserAvatar } from './user-avatar';
```

### Component Template

```tsx
// Props interface with JSDoc
interface Props {
  /** User ID to display */
  userId: string;
  /** Called when user is deleted */
  onDelete?: () => void;
}

// Component - UI only
export const UserCard = ({ userId, onDelete }: Props) => {
  // 1. Call the custom hook
  const { user, isPending, handleDelete } = useUserCard(userId);

  // 2. Early returns for loading/error
  if (isPending) return <Skeleton />;

  // 3. Render
  return (
    <Card>
      <h2>{user.name}</h2>
      <Button onClick={handleDelete}>Delete</Button>
    </Card>
  );
};
```

### Hooks Order (inside custom hook)

1. Context hooks (`useAuth`, `useTheme`)
2. Data fetching hooks (`useQuery`)
3. Local state (`useState`)
4. Derived values
5. Effects (`useEffect`)
6. Handlers
7. Return object
