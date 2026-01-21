---
name: code-essentials
description: Use when writing or reviewing code - applies fundamental principles for simplicity, clarity, and consistent conventions
---

# Code Essentials

Fundamental principles to apply when writing any code.

## Simplicity

- Write only the absolute minimum code needed
- Minimize cognitive load - code should be clear to junior developers
- Functions do one specific task only
- Avoid over-engineering and premature abstraction

## Project Preferences

- Use **kebab-case** for file names and commit messages

### Arrow Functions (HARD RULE)

**Always use arrow functions** for components, hooks, utils, handlers, and all other code.

```typescript
// Good
const MyComponent = () => { ... };
const useCustomHook = () => { ... };
const formatDate = (date: Date): string => { ... };
const handleClick = () => { ... };

// Bad - do not use function declarations
function MyComponent() { ... }
function useCustomHook() { ... }
function formatDate(date: Date): string { ... }
```

**Only exceptions** (where `function` is required):

- Generator functions (`function*`)
- Rare cases needing dynamic `this` binding

## Conventions

### Naming

- **Functions:** verbs (`getUser`, `validateInput`, `fetchData`)
- **Variables:** nouns (`user`, `inputValue`, `response`)
- **Booleans:** adjective with `is` prefix (`isValid`, `isLoading`, `isEmpty`)

### Colocation

Export only when needed elsewhere. Prefer keeping code close to where it's used:

1. **Same file** - if only used within that file
2. **Same folder** - if only imported by files in that folder
3. **Shared folder** - if imported from multiple locations

### Imports

- Use **absolute imports** with `@/...` for files outside the current folder
- Use **relative imports** only for files in the same folder (`./<file>`)
- Never use parent traversal (`..`) - use absolute imports instead
- Separate relative imports from absolute imports with a blank line above

```typescript
// Good
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/use-auth';

import { helper } from './helper';
import { schema } from './schema';

// Bad - parent traversal
import { Button } from '../components/button';
import { useAuth } from '../../hooks/use-auth';
```

### Typescript

- Explicit function return types **except** react components (no `: ReactNode -> {...})
- Use `type` import when applicable
- Return/throw early inside functions - avoid deep nesting
- No `any` type coercion - use utilize typescript: type guards, satisfies, `as` etc
- Avoid ternary operators in component render functions

## React

- Always extract all logic into custom hooks - only ui-related logic should remain in the component

## Testing

- Colocate: test files should be on the same folder as the code they test
- Do not test zod schemas
