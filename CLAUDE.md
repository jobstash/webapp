# CLAUDE.md

## Project Description

JobStash is a crypto-native job board connecting talent with web3 organizations. This is the marketing + job-search frontend. It renders public SEO landing pages (pillar pages), a filterable job feed, individual job detail pages, and an authenticated candidate profile area (skills, resume parsing, suggested jobs).

The app is a **BFF (backend-for-frontend)**: it reads data from an external "middleware" API (`NEXT_PUBLIC_MW_URL`, referred to as **MW**) both from Server Components and from thin proxy Route Handlers under `src/app/api/**`.

## Tech Stack

- **Language** — TypeScript (strict)
- **Framework** — Next.js 16 (App Router), `output: 'standalone'`, React Compiler enabled
- **UI** — React 19, Tailwind CSS 4 (CSS-first, no `tailwind.config`), shadcn/ui (Radix primitives), `tw-animate-css`
- **Icons** — Lucide React + custom SVGs in `src/components/svg/`
- **URL State** — nuqs
- **Data Fetching** — `@tanstack/react-query` (client), `fetch` + Zod (server)
- **Validation** — Zod v4
- **Auth** — Privy (`@privy-io/react-auth` client, `@privy-io/server-auth` server) + `iron-session` (encrypted cookie sessions)
- **Storage** — Cloudflare R2 (S3-compatible, via `@aws-sdk/client-s3`) for resume files
- **AI** — Vercel AI SDK (`ai`) + `@ai-sdk/openai` for resume parsing
- **Rate limiting** — Upstash Redis (`@upstash/ratelimit` + `@upstash/redis`)
- **Monitoring** — Sentry (`@sentry/nextjs`)
- **Virtualization / search UX** — `@tanstack/react-virtual`, `@leeoniya/ufuzzy` (client fuzzy filter), `cmdk` (command palette)
- **Progress bar** — `@bprogress/next`
- **Package Manager** — pnpm (pinned to `10.28.0` — see Deploy notes)
- **Linting / Formatting** — oxlint (not ESLint), Prettier
- **Testing** — Vitest (node environment) + Testing Library

> **Declared but currently unused** (present in `package.json`, no imports in `src/`): `zustand`, `@ai-sdk/google`, and the `input-otp` shadcn component (OTP entry happens inside Privy's hosted modal). Do not assume there is a zustand store — shared state is React Query (server state) + nuqs (URL state) + local React state.

## Commands

```bash
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Production build. Runs `pnpm format && pnpm lint` first (prebuild).
                      #   → DISABLE_STATIC_GENERATION=true next build --webpack
pnpm start            # Serve the production build
pnpm lint             # oxlint --fix --fix-suggestions
pnpm format           # Prettier over ts/tsx/js/jsx/css/md/json
pnpm test             # Vitest (watch)
pnpm test:run         # Vitest (single run — used in CI and pre-push)
pnpm analyze          # Build with the bundle analyzer (ANALYZE_BUNDLE=true)
pnpm version:bump     # Bump package.json version (semver, by branch prefix or flag)
```

- Builds use **`--webpack`** (opting out of Turbopack) because of the custom `splitChunks` config and Sentry wrapping in `next.config.ts`.
- The `build` script sets **`DISABLE_STATIC_GENERATION=true`**, so production builds do **not** pre-render pillar/job pages. `generateStaticParams` returns `undefined` when this flag is set or in dev; pages are served on-demand with `force-cache` + `revalidate: 3600` (ISR-style).

## Architecture

Next.js 16 App Router, React 19, Tailwind 4. Server Components by default; `params`/`searchParams` are `Promise`s (async APIs).

### Import Rules

- **Absolute imports (`@/`)** — for everything outside the current folder (`@/*` → `./src/*`)
- **Relative imports (`./`)** — only for files in the same folder

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
├── app/                        # App Router
│   ├── (main)/                 # Public pages (header + footer)
│   │   ├── (home)/             # Home: hero layout + job feed
│   │   ├── [slug]/             # Pillar pages (SEO landing) + OG images
│   │   │   └── [id]/           # Job detail pages + OG images
│   │   ├── privacy/ terms/
│   │   └── layout.tsx          # AppHeader + AppFooter
│   ├── (auth)/                 # Privy-provider-scoped pages
│   │   ├── login/
│   │   └── profile/            # AuthGuard + profile shell (overview/jobs/settings)
│   ├── api/                    # BFF Route Handlers (proxy MW, attach session token)
│   ├── sitemap.xml/ … sitemap5.xml/   # route.ts sitemap index + chunks
│   ├── robots.ts, manifest.json, layout.tsx (root), global-error.tsx, not-found.tsx
├── components/
│   ├── ui/                     # shadcn/ui (22 components)
│   ├── svg/                    # Icon components (~26)
│   ├── providers/              # root-providers, react-query, privy (+ lazy)
│   ├── app-header/ app-header/ # Header & footer
│   └── *.tsx                   # Shared: hero-ctas, virtualized-command, image-with-fallback, …
├── features/{feature}/         # Self-contained feature modules (see below)
│   ├── server/
│   │   ├── data/fetch-*.ts     # Data fetching ('server-only')
│   │   └── dtos/               # *.dto.ts (Zod API shape) + dto-to-*.ts (transforms)
│   ├── components/             # server + client components
│   ├── hooks/                  # client hooks
│   ├── schemas.ts, constants.ts
│   └── CLAUDE.md               # (some features have their own — read it)
├── hooks/                      # Shared hooks (use-debounce, use-eligibility, use-min-duration, use-previous)
├── lib/
│   ├── env/{client,server}.ts  # env access (see Environment Variables)
│   ├── server/                 # 'server-only': session, privy, r2, resume-parser, guards, sitemap, …
│   ├── utils/                  # cn, capitalize, fuzzy-search, get-tag-color-index
│   ├── analytics/              # GA4 event map + trackEvent
│   ├── constants.ts, schemas.ts, types.ts, fonts.ts, get-query-client.ts
├── proxy.ts                    # Next.js middleware (renamed from middleware.ts in Next 16)
└── instrumentation-client.ts   # Sentry (browser)
```

Features: `auth`, `error-reporter`, `filters`, `home`, `jobs`, `pillar`, `profile`, `search`.

### Key Rules

- **Server-only code** lives in `server/` folders and starts with `import 'server-only'` (`features/{feature}/server/`, `lib/server/`, `lib/env/server.ts`).
- **Client components** use `'use client'` and sit low in the tree. Privy is mounted **only** in the `(auth)` route group, not globally.
- **React 19 Compiler is enabled** — do NOT use `useMemo`, `useCallback`, or `React.memo`.
- **Data fetching** — Server: `fetch()` + Zod DTO validation. Client: `@tanstack/react-query`.
- **UI** — shadcn/ui; always compose classes with `cn()` from `@/lib/utils`. Dark mode only (`className="dark"` hardcoded on `<html>`; no theme switcher).
- **Error boundaries** — every component fetching external data is wrapped. Feature `*.error.tsx` files wrap `AppErrorBoundary` (from `features/error-reporter`), which reports to Sentry. There are **no** route-convention `loading.tsx`/`error.tsx` files; use `<Suspense>` + skeleton + boundary components + `notFound()`.

### Nested CLAUDE.md files (read when working in these areas)

| Path                              | Covers                                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `src/features/jobs/CLAUDE.md`     | Job list/detail, badges, `JOBS_PER_PAGE=10`, job-match flow                                                                          |
| `src/features/filters/CLAUDE.md`  | Filter kinds, icon map, filters-aside boundary pattern                                                                               |
| `src/lib/server/guards/CLAUDE.md` | Resume-endpoint request guards (note: it references the old `api/onboarding/...` path; the live route is `api/profile/resume/parse`) |

## Data Layer — MW API access

There is **no central fetch client**. The convention is: build a URL from `clientEnv.MW_URL` and call native `fetch`, then `safeParse` the response with a Zod DTO and transform it. Two access patterns:

1. **Server Components** call `features/{feature}/server/data/fetch-*.ts` directly (e.g. `fetchJobListPage`, `fetchJobDetails`, `fetchPillarPageStatic`, `fetchFilterConfigs`). These use `import 'server-only'` and cache with `{ cache: 'force-cache', next: { revalidate: 3600 } }` — but only for requests with no user-specific search params (to avoid cache stampede / per-user cache blowup).
2. **Client → BFF proxy** Route Handlers under `src/app/api/**` read the iron-session, attach `Authorization: Bearer ${apiToken}`, forward to MW, and re-validate the response with Zod. Standard error shape `{ error }` with `401` (no session), `400` (bad input), `502` (backend/parse failure), `500` (unexpected).

**API routes (`src/app/api/`):**

| Route                           | Methods         | Purpose                                                                                                                                                                                                     |
| ------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth/session`                  | POST/GET/DELETE | Session lifecycle. POST verifies Privy token, requires an embedded wallet, exchanges it via `MW/privy/check-wallet`, stores `apiToken`/`isExpert`/`displayName`. GET expires after ~55min. DELETE destroys. |
| `jobs/apply`                    | POST            | → `MW/v2/profile/jobs/apply`                                                                                                                                                                                |
| `jobs/apply/status/[shortUUID]` | GET             | → `MW/v2/profile/jobs/apply/status/{id}`                                                                                                                                                                    |
| `jobs/match/[uuid]`             | GET             | → `MW/jobs/match/{uuid}` (server injects `isExpert` from session)                                                                                                                                           |
| `profile/skills`                | GET             | → `MW/profile/skills`                                                                                                                                                                                       |
| `profile/showcase`              | GET/POST        | → `MW/profile/showcase` (socials, email, CV link)                                                                                                                                                           |
| `profile/suggested-jobs`        | GET             | → `MW/jobs/suggested` (maps via `dtoToJobListPage`, adds `hasMore`)                                                                                                                                         |
| `profile/linked-accounts`       | GET             | Reads Privy user (no MW)                                                                                                                                                                                    |
| `profile/sync`                  | POST            | Fan-out: skills → `MW/profile/skills` + showcase → `MW/profile/showcase` (207 on partial)                                                                                                                   |
| `profile/delete`                | POST            | → `MW/profile/delete`, then destroys session                                                                                                                                                                |
| `profile/resume/parse`          | POST            | **Not a proxy** — guards → text extract → LLM parse → R2 upload → skill match                                                                                                                               |
| `resume/[id]`                   | GET             | Presigned R2 download (302 redirect, 1h expiry)                                                                                                                                                             |
| `search/suggestions`            | GET             | → `MW/search/jobs/suggestions`                                                                                                                                                                              |
| `search/tags/suggestions`       | GET             | → `MW/search/tags/suggestions`                                                                                                                                                                              |

`src/proxy.ts` is Next.js middleware (renamed from `middleware.ts` in Next 16). It only sets an `X-App-Version` response header on `/api/*` for client staleness detection — **no auth, redirects, or rewrites**.

## DTO-to-Schema Mapping

DTOs mirror API responses. Schemas are UI-optimized. Transform in `dto-to-*.ts`.

**Why:** isolate API changes to DTOs + transformers; give the UI flat, frontend-friendly shapes; single update point; explicit type safety with early `null` filtering; fix naming (snake_case → camelCase, API enum → UI term).

**Structure:**

```
features/{feature}/server/dtos/
├── *.dto.ts        # API response shape (server-only, exact API shape)
└── dto-to-*.ts     # DTO → schema transformation (business logic lives here)
features/{feature}/
└── schemas.ts      # UI-optimized schemas (flat, UI terminology)
```

**Guidelines:**

- DTOs validate the exact API shape (server-only).
- Schemas define UI types (flat, UI terminology).
- Transformers do routing/normalization/enrichment/fallbacks; return `null` for unusable data (filter early).
- Real example: `dto-to-job-list-item.ts` derives fallback titles/summaries, builds SEO `href`s via `slugify`, runs `lookupAddresses`, assembles `infoTags` with pillar links, and computes a `badge` (`FEATURED` / `URGENTLY_HIRING` / `BEGINNER`). `dto-to-filter-config.ts` re-derives the UI filter `kind` (`SWITCH`/`RADIO`/`CHECKBOX`/`SEARCH`/`REMOTE_SEARCH`/`SORT`/`RANGE`) from the API's `SINGLE_SELECT`/`MULTI_SELECT`/`RANGE` shape based on option counts and paramKey.

## Auth & Sessions

- **Client:** Privy hosted modal handles email/OTP/OAuth(GitHub, Google)/wallet login. Embedded Ethereum wallets are auto-created for **all** users. `PrivyClientProvider` is lazy (`ssr: false`) and only mounted in `(auth)`. Login logic: `features/auth/hooks/use-login-auth.ts`; default post-login redirect is `/profile/jobs`.
- **Session exchange:** on login the Privy access token is POSTed to `/api/auth/session`, which verifies it (`@privy-io/server-auth`), requires an embedded wallet, then exchanges it with `MW/privy/check-wallet` for a backend `apiToken`. That token + `isExpert` (from `cryptoNative`) + display identity are stored in an **iron-session** cookie (`jobstash-session`, httpOnly, sameSite lax, 1h).
- **Client session state:** `features/auth/hooks/use-session.ts` (React Query, key `['session']`) reads `/api/auth/session` and auto-refetches before expiry. `useEligibility()` (`src/hooks`) exposes `{ isAuthenticated, isExpert, displayName, identityType }`.
- **Guarding:** `features/auth/components/auth-guard.tsx` is an async Server Component that `redirect('/login')` when there's no `apiToken`; it wraps `/profile/*`. Every proxy route independently re-checks the session and destroys expired ones. `/login` itself is public.
- Server helpers: `src/lib/server/session.ts` (`getSession`), `src/lib/server/privy.ts` (`verifyPrivyToken`, `getPrivyUser`, `extractEmbeddedWallet`).

## Resume Parsing (`api/profile/resume/parse`)

Pipeline (see `src/lib/server/guards/CLAUDE.md` for guard details):

1. **Guards** (`src/lib/server/guards/`, run cheapest-first, first non-null `Response` wins): `checkOrigin` (403 vs `FRONTEND_URL`) → `checkRateLimit` (Upstash sliding window, **5 req / 15 min per IP**, 429 + `Retry-After`) → parse form → `checkFilename` → `checkMagicBytes` (PDF/DOC/DOCX signatures — used instead of `file.type` because iOS sends empty MIME) → SHA-256 hash cache (LRU 100, dedups repeat uploads). Max 5MB, max 5 pages.
2. **Extract text** (`src/lib/server/extract-text.ts`): `pdf-parse` for PDFs, `mammoth` for DOC/DOCX. `pdf-parse` is in `serverExternalPackages`; it detaches the ArrayBuffer, so extraction gets a buffer copy.
3. **LLM parse** (`src/lib/server/resume-parser.ts`, Vercel AI SDK + OpenAI): `parseResume` → `generateObject` with `gpt-4.1-nano`. If extracted text is `<50` chars, **vision fallback** `parseResumeFromPdf` sends the raw PDF to `gpt-4o-mini`.
4. **Store + match:** upload to R2 (`src/lib/server/r2.ts`, key `${uuid}/${filename}`), `matchSkills` against `MW/tags/batch-match`. The CV showcase URL stored in MW is `${FRONTEND_URL}/api/resume/${resumeId}`, which 302-redirects to a presigned R2 URL.

## Filters

Filters are fully **server-driven via URL state (nuqs)**. Setting any filter clears `page`; the RSC `JobList` reads `searchParams`, merges pillar context, and forwards them verbatim to `MW/jobs/list`. There is no client-side job filtering.

- Configs come from `MW/jobs/filters` (`fetchFilterConfigs`), transformed by `dtoToFilterConfig` into a discriminated union by `kind`: `SORT`, `SWITCH`, `RADIO`, `CHECKBOX`, `SEARCH`, `REMOTE_SEARCH`, `RANGE`.
- UI: `filters-aside/` (Suspense + boundary + lazy client) renders three sections — `active-filters/`, `suggested-filters/`, `more-filters/` (a `cmdk` command palette). Each dispatches on `config.kind`.
- `SEARCH` filters use `src/components/virtualized-command.tsx` (`@tanstack/react-virtual` + `@leeoniya/ufuzzy` client fuzzy filter via `src/lib/utils/fuzzy-search.ts`). `REMOTE_SEARCH` filters use `remote-virtualized-command/` (fetches options from `MW/tags/search`; server-side search, no ufuzzy).
- Hooks in `features/filters/hooks/`: `use-filter-query-state` (nuqs read/write + GA + resets page), `use-active-filters`, `use-suggested-filters`, `use-range-filter-state`, `use-filter-configs-with-pillar-context` (strips the current pillar's own value from filter options).

## Pillar Pages

Pillar pages are SEO landing pages rendered by `src/app/(main)/[slug]/page.tsx`. Slug validity + filter mapping live in **`src/features/pillar/constants.ts`** (`isValidPillarSlug`, `getPillarFilterContext`, `getPillarHeadline`). Data comes from `MW/search/pillar/page/static/{apiSlug}` via `fetchPillarPageStatic`. Each pillar composes `PillarHero`, `SuggestedPillars`, `PillarCTA`, `PillarJobList`, plus dynamic `opengraph-image.tsx`/`twitter-image.tsx`.

**Prefix → filter mappings** (`PREFIX_MAPPINGS`; matched by `startsWith`, longer prefixes first):

| Prefix     | Category (badge) | Home filter paramKey      | Headline example                                        |
| ---------- | ---------------- | ------------------------- | ------------------------------------------------------- |
| `t-`       | Skill            | `tags`                    | `t-typescript` → "TypeScript Jobs"                      |
| `cl-`      | Role             | `classifications`         | `cl-devrel` → "Developer Relations Jobs"                |
| `l-`       | Location         | **`null`** (links to `/`) | `l-usa` → "Jobs in USA"                                 |
| `co-`      | Work Type        | `commitments`             | `co-fulltime` → "Full-Time Jobs"                        |
| `lt-`      | Work Mode        | `locations`               | `lt-remote` → "Remote Jobs"                             |
| `o-`       | Company          | `organizations`           | `o-ethereum-foundation` → "Jobs at Ethereum Foundation" |
| `s-`       | Level            | `seniority` (numeric 1–5) | `s-senior` → "Senior Role Jobs" (value `3`)             |
| `i-`       | Investor         | `investors`               | `i-a16z` → "Jobs backed by a16z"                        |
| `fr-`      | Funding          | `fundingRounds`           | `fr-series-a` → "Series A Funded Jobs"                  |
| `b-{name}` | Filter (boolean) | (via boolean maps)        | see below                                               |

Notes:

- **There is no `c-` / chains prefix** (it existed in older docs but not in code).
- `l-` (geographic location) has `paramKey: null`, so its CTAs/empty-state link to `/`, not a `locations=` query. The `locations` paramKey is used by `lt-` (location type / work mode).
- `s-` seniority maps labels → numeric keys via `SENIORITY_MAPPING` (`1` Intern, `2` Junior, `3` Senior, `4` Lead, `5` Head). Its headline tagline is "Role Jobs" → e.g. "Senior Role Jobs".
- Names are cleaned via `PILLAR_NAME_OVERRIDES` (`bizdev`→Business Development, `devrel`→Developer Relations, `full-time`→Full-Time, `part-time`→Part-Time, `onsite`→On-Site), else title-cased.

**Special alias slugs** (no prefix; `SLUG_TO_API` / `API_TO_SLUG`):

| Frontend URL           | MW API slug         | paramKey (=`true`) | Headline               |
| ---------------------- | ------------------- | ------------------ | ---------------------- |
| `urgently-hiring`      | `b-expertJobs`      | `expertJobs`       | "Urgently Hiring Jobs" |
| `crypto-beginner-jobs` | `b-onboardIntoWeb3` | `onboardIntoWeb3`  | "Crypto Beginner Jobs" |

**Boolean (`b-`) filters** (`BOOLEAN_SLUG_TO_PARAM_KEY` + `BOOLEAN_TAGLINES`):

| Slug                        | paramKey                | Tagline                                 |
| --------------------------- | ----------------------- | --------------------------------------- |
| `b-pays-in-crypto`          | `paysInCrypto`          | "Jobs that pay in crypto"               |
| `b-offers-token-allocation` | `offersTokenAllocation` | "Jobs with token allocation"            |
| `b-beginner-friendly`       | `onboardIntoWeb3`       | fallback: "Jobs with Beginner Friendly" |

Unknown boolean slugs fall back to a "Jobs with {readable name}" tagline. `getPillarFilterHref` returns `/?{paramKey}={value}`, or `/` when the context is `null`.

## SEO

- **`generateMetadata`** on `[slug]` and `[slug]/[id]`: title (`… | JobStash`), description, `alternates.canonical` (from `clientEnv.FRONTEND_URL`), OpenGraph + Twitter `summary_large_image`; job pages add `keywords` from tags. Fallback "Not Found" metadata when data is missing.
- **`generateStaticParams`** on both dynamic routes — disabled when `DISABLE_STATIC_GENERATION=true` (production builds) or in dev.
- **JSON-LD:** `features/jobs/components/job-posting-schema.tsx` emits Schema.org `JobPosting` on job detail pages (helpers in `features/jobs/lib/seo-utils.ts`).
- **Dynamic OG images:** file-based `opengraph-image.tsx` (+ `twitter-image.tsx` re-export) for both pillar and job routes, using `next/og` `ImageResponse` (data helpers in each feature's `lib/og-image-utils.ts`).
- **Sitemaps:** `src/app/sitemap.xml/route.ts` is a hand-built index; `sitemap1` (static home), `sitemap2` (jobs via `fetchSitemapJobs`), `sitemap3–5` (pillar chunks of 3000 via `lib/server/sitemap/build-pillar-sitemap.ts`). All `revalidate: 3600`.
- **Indexing gate:** root `metadata.robots` and `robots.ts` both respect `NEXT_PUBLIC_ALLOW_INDEXING`.

Use the `seo`/`frontend-design` skills for detailed guidance when touching metadata, structured data, or new UI.

## Error Handling & Monitoring (Sentry)

- `instrumentation.ts` (server, runs when `NEXT_RUNTIME==='nodejs'`) and `src/instrumentation-client.ts` (browser) init Sentry: DSN from `NEXT_PUBLIC_SENTRY_DSN`, `tracesSampleRate: 0`, `sendDefaultPii: false`, tracing/replay disabled; server `beforeSend` strips request cookies/headers/data.
- `next.config.ts` wraps config in `withSentryConfig` (uploads + deletes sourcemaps at build; `silent: !CI`).
- `src/app/global-error.tsx` and `features/error-reporter/app-error-boundary.tsx` capture exceptions.

## Environment Variables

Two Zod-validated layers. **No `.env` / `.env.example` is committed** (`.env*` is gitignored).

**Public (`NEXT_PUBLIC_*`)** — accessed via `clientEnv` (`src/lib/env/client.ts`); the required ones are validated at boot in `next.config.ts` (build/dev fails if missing):

- `NEXT_PUBLIC_FRONTEND_URL` — frontend URL _(required, url)_
- `NEXT_PUBLIC_MW_URL` — middleware/API base _(required, url)_
- `NEXT_PUBLIC_PRIVY_APP_ID` — Privy app id _(required)_
- `NEXT_PUBLIC_PRIVY_CLIENT_ID` — Privy client id _(optional)_
- `NEXT_PUBLIC_ALLOW_INDEXING` — `'true'` enables indexing _(optional)_
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — GA4 id _(optional)_
- `NEXT_PUBLIC_SENTRY_DSN` — Sentry DSN
- `NEXT_PUBLIC_APP_VERSION` — auto-injected from `package.json` (do not set manually)

**Server-only** — validated at import in `src/lib/env/server.ts` (`import 'server-only'`), exported as `serverEnv`:

- `SESSION_SECRET` — iron-session key _(min 32 chars)_
- `PRIVY_APP_SECRET`
- `R2_ENDPOINT` _(url)_, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` — Cloudflare R2
- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL` _(url)_, `UPSTASH_REDIS_REST_TOKEN`

**Build/CI flags (not in schemas):** `DISABLE_STATIC_GENERATION`, `ANALYZE_BUNDLE`, `CI`, `SENTRY_AUTH_TOKEN`/`SENTRY_ORG`/`SENTRY_PROJECT`.

## Deploy

- Multi-stage `Dockerfile` on `node:22-alpine` → runs `.next/standalone` (`node server.js`) as non-root. Deploy target is **Coolify**.
- **pnpm is pinned to `10.28.0`** (`packageManager` + `corepack prepare pnpm@10.28.0`). Do **not** bump to `pnpm@latest` — `>10.28.0` turns ignored build scripts into fatal `ERR_PNPM_IGNORED_BUILDS` and breaks the deploy.
- Server secrets are passed as build-time placeholders (to satisfy Zod) and injected for real at runtime.

## Testing

Vitest runs in the **node** environment (not jsdom, despite jsdom being installed). Test files: `**/*.test.{ts,tsx}`. Setup extends `expect` with `@testing-library/jest-dom`.

- **Do NOT test Zod schemas or primitive schema helpers** (`nullableStringSchema`, `nonEmptyStringSchema`, …). That tests Zod, not our code.
- **DO test `dto-to-*.ts` transformers** — they hold the business logic (fallbacks, normalization, enrichment, filtering). Also test guards, `lib/utils`, and `lib/server/utils`.

```typescript
// ❌ Don't test: nullableStringSchema transforms empty to null
// ✓ Do test:   dtoToJobListItem generates a fallback summary when summary is null
```

`docs/todo-tests/` holds per-feature spec notes worth consulting for expected behavior.

## Release Workflow

- Two branches: PRs target **`dev`**; **`main`** is production (updated only when a GitHub release is published, which auto-merges `dev` → `main`).
- Branch prefix drives the version bump: `feat`/`feature` → minor, `major` → major, everything else → patch. Run `pnpm version:bump` before opening a PR.
- CI (`.github/workflows/ci.yml`, on PR → `dev`): `validate-branch` (prefix), `validate-version` (must be `> dev`), `lint`, `build`, `test`.
- Git hooks (`simple-git-hooks`): **commit-msg** = commitlint (conventional), **pre-commit** = `lint-staged` (prettier + oxlint), **pre-push** = `pnpm build && pnpm test`.

## Git Commit Rules

**CRITICAL: Always stage specific files by name.** Never use broad staging commands.

```bash
# ✅ Good — stage specific files
git add src/components/button.tsx src/hooks/use-auth.ts

# ❌ Bad — can re-add gitignored-but-previously-tracked files
git add .    # (also -A, --all, *)
```

**Why:** broad staging can re-add files in `.gitignore` if they were previously tracked (this happened with `.claude-worktree.json`).

**Before committing:** run `git status`, stage only files you intentionally modified, and `git restore --staged <file>` anything staged by accident.

## Project Skills, Agents & Commands (`.claude/`)

- **Skill** `address-mapping` (`.claude/skills/address-mapping/SKILL.md`) — knowledge base for converting raw job location strings into structured Schema.org addresses. Backed by `.claude/scripts/address-mapping/` (mapping scripts + `mappings.json`).
- **Agent** `address-mapper` (`.claude/agents/`) and **command** `/map-addresses` (`.claude/commands/`) — batch/parallel location-string mapping.
- The address pipeline is consumed at runtime by `src/lib/server/address-lookup.ts` (`lookupAddresses`), used in job/pillar DTO transforms.
- For UI work, the `frontend-design` skill is available for aesthetic/design guidance.
