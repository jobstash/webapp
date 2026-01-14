# CLAUDE.md

## Project Description

JobStash is a crypto native job board connecting talent with web3 organizations.

## Tech Stack

- **Language** - TypeScript
- **Framework** - Next.js 16 (App Router)
- **UI** - React 19, Tailwind CSS 4, shadcn/ui (Radix primitives)
- **Icons** - Lucide React
- **URL State** - nuqs
- **Data Fetching** - @tanstack/react-query (client), fetch (server)
- **Validation** - Zod
- **Package Manager** - pnpm
- **Linting** - oxlint, Prettier

### React 19 & Compiler

App uses React 19 with `reactCompiler: true` in Next.js config. The compiler handles memoization automatically.

**Do NOT use:**

- `useMemo` - compiler optimizes this
- `useCallback` - compiler optimizes this
- `React.memo` - compiler optimizes this

### Data Fetching

- **Server components** - Use `fetch()` directly (validated with Zod)
- **Client components** - Always use `@tanstack/react-query` (never raw fetch/axios)

See `react-best-practices` skill for react-query patterns.

## Commands

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Build for production (runs format & lint first via prebuild)
pnpm lint         # Run oxlint with auto-fix
pnpm format       # Format code with Prettier
```

## Git Conventions

### Commit Messages

- Use kebab-case when referencing hooks and components
- Examples:
  - `feat: add use-active-filters hook`
  - `fix: filters-aside loading state`
  - `refactor: update remote-virtualized-command component`

## Architecture

Next.js 16 app using App Router with React 19 and Tailwind CSS 4.

### Import Rules

- **Absolute imports (`@/`)** - For everything outside current folder
- **Relative imports (`./`)** - Only for files in same folder

```typescript
// Good
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useActiveFilters } from '@/features/filters/hooks';
import { ActiveFilterTrigger } from './active-filter-trigger'; // same folder

// Bad
import { Button } from '../../components/ui/button'; // use @/
import { schema } from '../schemas'; // use @/features/...
```

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/features/` - Feature modules with colocated components, data fetching, DTOs, hooks, schemas
- `src/components/` - Shared components: `ui/` (shadcn/ui), `svg/` (icons), `providers/`
- `src/lib/` - Shared utilities, schemas, constants, environment config
- `src/hooks/` - Shared React hooks

### Feature Module Structure

Each feature in `src/features/{feature}/` is self-contained:

| Folder/File    | Purpose                              | Environment |
| -------------- | ------------------------------------ | ----------- |
| `server/`      | Data fetching, DTOs, server actions  | Server-only |
| `components/`  | React components                     | Mixed       |
| `hooks/`       | Custom hooks                         | Client      |
| `schemas.ts`   | Zod app schemas (used by components) | Shared      |
| `constants.ts` | Feature constants                    | Shared      |

**Hook colocation:** If a hook is only used by one component, colocate it in the component folder instead of `hooks/`.

### Server vs Client

**Server-only code** lives in:

- `features/{feature}/server/` - feature-specific
- `lib/server/` - shared utilities

**Client components** use `'use client'` directive. Use `.client.tsx` suffix only when:

- Component needs Suspense/ErrorBoundary wrapper
- Client logic must be in separate file for boundaries to work

**Example** (filters-aside):

```
filters-aside/
├── filters-aside.tsx           # Main RSC wrapper with Suspense/ErrorBoundary
├── filters-aside.client.tsx    # Client component with hooks/interactivity
├── filters-aside.error.tsx     # ErrorBoundary client wrapper
├── filters-aside.layout.tsx    # Shared layout (prevents layout shift)
├── filters-aside.skeleton.tsx  # Loading skeleton
├── filters-aside.lazy.tsx      # Dynamic import wrapper (optional)
└── index.ts                    # Barrel export
```

### Component Folder Structure

Group main component + subcomponents in a folder when component has:

- Suspense/ErrorBoundary wrappers
- Client/server separation
- Multiple related files (skeleton, layout, error)

**File suffixes:**

| Suffix          | Purpose                            | Environment |
| --------------- | ---------------------------------- | ----------- |
| `.tsx`          | Main wrapper (Suspense/Error)      | Server      |
| `.client.tsx`   | Client logic (hooks, interactions) | Client      |
| `.error.tsx`    | ErrorBoundary client wrapper       | Client      |
| `.skeleton.tsx` | Loading state                      | Server      |
| `.layout.tsx`   | Shared layout (all states)         | Server      |
| `.lazy.tsx`     | Dynamic import wrapper             | Server      |

### Error Boundary Requirement

Any component fetching external data (server or client) MUST have an error boundary:

- Server components with `await fetch()` → wrap with ErrorBoundary
- Client components with react-query → wrap with ErrorBoundary
- API route handlers → wrap critical sections

This ensures graceful degradation when external services fail.

### Data Flow

- API responses validated with Zod schemas in `server/dtos/*.dto.ts`
- DTOs transformed to app types via `server/dtos/dto-to-*.ts` functions
- Environment variables validated in `src/lib/env/client.ts` using Zod

### Data Fetching Validation

Always use Zod to validate API input/output from external sources:

```typescript
// Pattern: Fetch → Validate → Transform
const json = await response.json();
const parsed = jobListPageDto.safeParse(json);
if (!parsed.success) {
  console.error(
    '[fetchJobListPage] Validation failed:',
    parsed.error.flatten(),
  );
  throw new Error('Invalid API response');
}
return dtoToJobListPage(parsed.data);
```

**Schema locations:**

- `features/{feature}/schemas.ts` - App schemas (used by components)
- `features/{feature}/server/dtos/*.dto.ts` - API response DTOs (server-only)
- `features/{feature}/server/schemas.ts` - Server-only validation (e.g., request params)

### UI Components

shadcn/ui (new-york style) with Radix UI primitives.

**Rules:**

- Always use `cn()` from `@/lib/utils` for className logic
- Always import base components from `@/components/ui/`

```typescript
// Good
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

<Button className={cn('base-class', isActive && 'active-class')} />

// Bad
<button className={`base-class ${isActive ? 'active-class' : ''}`} />
```

### SEO Considerations

As a job board, SEO is critical for discoverability:

- **Server-render job lists** - Job listings must be server-rendered for search engine indexing
- **Dynamic metadata** - Each job page generates unique title, description, and OpenGraph tags
- **Structured data** - Job postings use JSON-LD schema markup for rich search results
- **URL structure** - Clean, descriptive URLs with job titles and company names
- **Filter state in URL** - Search filters are URL params for shareable, indexable filtered views

## Environment Variables

Required in `.env`:

- `NEXT_PUBLIC_FRONTEND_URL` - Frontend URL
- `NEXT_PUBLIC_MW_URL` - Middleware/API URL
