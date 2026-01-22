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

### DTO-to-Schema Mapping

DTOs mirror API responses. Schemas are UI-optimized. Transform in `dto-to-*.ts`.

**Why This Pattern:**

- **Isolate API changes** - API updates only affect DTOs and transformers, not UI code
- **Frontend-optimized** - Flatten nested data, simplify access patterns for components
- **Single update point** - Schema changes propagate automatically through transformers
- **Type safety** - Explicit contracts; invalid data filtered early with `null` returns
- **Naming alignment** - Fix conventions (snake_case → camelCase), use UI terminology

**File Structure:**

```
features/{feature}/server/dtos/
├── *.dto.ts              # API response shape (server-only)
└── dto-to-*.ts           # DTO → schema transformation
features/{feature}/
└── schemas.ts            # UI-optimized schemas
```

**Transformation Patterns:**

| Pattern     | DTO (API)                  | Schema (UI)            |
| ----------- | -------------------------- | ---------------------- |
| Restructure | `googleAnalyticsEventId`   | `analytics.id`         |
| Normalize   | `value: string \| boolean` | `value: string`        |
| Rename      | `SINGLE_SELECT`            | `SWITCH`, `RADIO`, …   |
| Enrich      | —                          | `isSuggested: boolean` |

**Guidelines:**

- DTOs validate API responses (server-only, exact API shape)
- Schemas define UI types (flat structures, UI terminology)
- Transformers handle logic-based routing, normalization, filtering
- Return `null` for invalid/unusable data (filter early)

### Pillar Pages

Pillar pages are SEO landing pages for specific job filters. Each pillar slug uses a prefix to identify its category.

**Slug Prefix → Filter Param Mappings:**

| Prefix     | Filter Param     | Category Name  | Example Slug            |
| ---------- | ---------------- | -------------- | ----------------------- |
| `t-`       | tags             | tag            | `t-typescript`          |
| `cl-`      | classification   | classification | `cl-devrel`             |
| `l-`       | location         | location       | `l-usa`                 |
| `co-`      | commitment       | commitment     | `co-fulltime`           |
| `lt-`      | locationType     | locationType   | `lt-remote`             |
| `o-`       | organization     | organization   | `o-ethereum-foundation` |
| `s-`       | seniority        | seniority      | `s-senior`              |
| `i-`       | investors        | investor       | `i-a16z`                |
| `fr-`      | fundingRounds    | fundingRound   | `fr-series-a`           |
| `b-{name}` | {name} (boolean) | boolean        | `b-pays-in-crypto`      |

**Boolean Filters:**

Boolean filters use the `b-` prefix followed by the filter name. They generate contextual taglines:

- `b-pays-in-crypto` → "Jobs that pay in crypto"
- `b-offers-token-allocation` → "Jobs with token allocation"
- Default: "Jobs with {readable name}"

**Implementation:** `src/features/pillar/constants.ts`

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
