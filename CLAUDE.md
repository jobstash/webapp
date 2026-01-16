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

## Commands

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Build for production (runs format & lint first via prebuild)
pnpm lint         # Run oxlint with auto-fix
pnpm format       # Format code with Prettier
```

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

### Project Structure

```
src/
├── app/                        # Next.js App Router (pages, layouts)
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── svg/                    # Icon components
│   └── providers/              # Context providers
├── features/{feature}/         # Feature modules (self-contained)
│   ├── server/
│   │   ├── data/fetch-*.ts     # Data fetching ('server-only')
│   │   └── dtos/
│   │       ├── *.dto.ts        # Zod API response schemas
│   │       └── dto-to-*.ts     # DTO → app type transforms
│   ├── components/             # Feature components (server/client)
│   ├── hooks/                  # Client hooks (or colocate with component)
│   ├── schemas.ts              # App-level Zod schemas
│   └── constants.ts            # Feature constants
├── hooks/                      # Shared React hooks
└── lib/                        # Shared utilities, env config
```

### Key Rules

- **Server-only code** in `server` folders e.g. `features/{feature}/server/` or `lib/server/`
- **Client components** use `'use client'` directive and should be further down the component tree
- **React 19 Compiler** - Do NOT use `useMemo`, `useCallback`, `React.memo`
- **Data fetching** - Server: `fetch()` + Zod, Client: `@tanstack/react-query`
- **UI Components** - shadcn/ui, always use `cn()` from `@/lib/utils`
- **Error boundaries** - Required for all components fetching external data

### Skills (load for detailed patterns)

| Skill                    | When to Load                        |
| ------------------------ | ----------------------------------- |
| `code-essentials`        | Always invoke when writing code     |
| `react-best-practices`   | Creating/modifying React components |
| `testing-best-practices` | Writing tests                       |
| `frontend-design`        | UI/UX implementation                |
| `code-simplifier`        | Refactoring code for readability    |
| `seo-best-practices`     | Pages, metadata, structured data    |

## Environment Variables

Required in `.env`:

- `NEXT_PUBLIC_FRONTEND_URL` - Frontend URL
- `NEXT_PUBLIC_MW_URL` - Middleware/API URL

## Avoid (Wastes Time & Tokens)

- **Do NOT test Zod schemas** - Zod guarantees schema enforcement. Testing that a schema validates correctly is testing Zod's implementation, not your code's behavior.
