# webapp v2

## Development Workflow

Production deploys from reviewed changes pushed to `main`. Coolify observes
`main` and starts the existing automatic build.

### Branches

- `main` - Reviewed production branch and Coolify deployment source.

### Branch Naming

Branch names must use one of these prefixes:

| Prefix                                       | Version Bump          | Example             |
| -------------------------------------------- | --------------------- | ------------------- |
| `feat/` or `feature/`                        | Minor (1.2.0 → 1.3.0) | `feat/add-filters`  |
| `major/`                                     | Major (1.2.0 → 2.0.0) | `major/v2-redesign` |
| `fix/`, `chore/`, `refactor/`, `docs/`, etc. | Patch (1.2.0 → 1.2.1) | `fix/login-bug`     |

### Creating a Feature

1. Create a branch from `main`:

   ```bash
   git checkout main && git pull
   git checkout -b feat/my-feature
   ```

2. Make your changes and commit

3. Push and create a PR to `main`:

   ```bash
   git push -u origin feat/my-feature
   ```

4. CI validates the branch and runs lint, build, and tests. Merge only after
   review and green acceptance gates.

### Releasing to Production

Merge the reviewed PR into `main`. Coolify then builds and deploys that commit.
No release publication, version header, release environment variable, or
automatic branch merge is part of deployment.

## Security dependency maintenance

Use Node.js 24 and pnpm 12.18.0, pinned in `package.json`. All Docker stages use
`node:24.22.3-alpine3.24`, and CI uses Node 24. Commit `pnpm-lock.yaml` together with
dependency changes. `pnpm-workspace.yaml` contains explicit `allowBuilds`
permissions and reproducible dependency patches; Docker copies it and `patches/`
before the frozen install. Unreviewed install scripts remain fatal. The exact
`minimumReleaseAgeExclude` entries are limited to the newly published releases
required by the November 2026 latest-stable upgrade; other packages and future
versions retain pnpm's release quarantine.
The dependency stage includes Python, Make and a C/C++ compiler for websocket
native addons on Alpine; these tools are not copied into the builder or runner.

The November 2026 refresh targets npm's stable `latest` tags, including Next.js
16.4.5, React/React DOM 19.3.1, Privy React 3.51.3/Node 0.38.0, AI SDK 7.0.163
with OpenAI 4.0.109/Google 4.0.112, Sentry 11.11.0, and Vitest/Vite 5.1.0/8.3.6.
Node types intentionally track the Node 24 runtime (24.19.2), not Node 26.
Next's `experimental.useTypeScriptCli` keeps full build-time type checking with
TypeScript 7's native compiler. AI prompts use the SDK's `instructions` option.
Iron-session 9 retains the application's optional, JSON-compatible session fields.
Sentry 11's build wrapper comes from `@sentry/nextjs/config`; explicit
`dataCollection` exclusions preserve the no-personal-data instrumentation policy.
Vitest 5 DOM matcher types are registered through its `Matchers<R, T>` extension
interface in `vitest.setup.ts`, alongside the real jest-dom runtime matchers.
GitHub uses the existing brand asset; the removed Lucide LinkedIn icon is retained
locally with its upstream license.
OpenGraph routes embed the packaged logo as a cached data URI instead of fetching
their own origin, preserving Next's SSRF protection on private deployments.
The Vitest configuration uses native ESM (`vitest.config.mts`); Docker and formatting
exclude unrelated nested worktrees and local OAuth tooling.
Docker builds also require a valid `NEXT_PUBLIC_SENTRY_DSN` build argument; a
runtime-only server DSN cannot populate browser assets. Configure it as build-time
and runtime in Coolify. The guard logs no supplied DSN values, and its regression
tests run after the Zod security suite. Rollback to an image built with an empty
browser DSN restores that monitoring gap even if runtime configuration is correct.

Obsolete security floors were removed after inspecting the refreshed parent
requirements. WalletConnect utilities retain the 2.26 security floor, and UUID 11
retains the named CommonJS/ESM APIs consumed by legacy wallet dependencies.
The server integration uses `@privy-io/node` instead of deprecated `server-auth`.
Server users and token claims use the Node SDK's snake-case fields; client-side
React SDK fields are unchanged.

Application Zod uses current 4.6.7. Current Privy/Reown/x402 dependencies still
require Zod 3 APIs, including one-argument records; this is independent of any
historical application pin. Reproducible patches backport the upstream bounded
collection fix for GHSA-mrhx-c7xc-m3w5 to 3.22.4, 3.25.76 (including its bundled
v4), and the still-affected `zod/v3` entrypoint inside 4.6.7. Oversized upper-bounded
collections abort before element parsing or subsequent refinements. Minimum-only
and unbounded collections retain their existing behavior, as in the upstream fix.
Version-only audits still flag the old package versions; no alerts are suppressed.
Replace these local patches when vendor-supported upstream fixes become available.

`pnpm test:run` includes `test:security`: real CJS/ESM/UMD parser entrypoints and
actual Reown, Privy, x402, Coinbase and ABI schemas are exercised offline. Tests
cover oversized-input traversal, valid transformations/defaults/unions, malformed
payloads, and bounded vendor policy inputs. These do not prove live provider login.

The current Coinbase SDK permits 100 policy rules; nested criteria/address limits
remain 10/300. Privy's current API-base 2.0 removed its legacy `APIError` Zod
export, so that obsolete schema case is explicitly skipped, not redirected to a
stale installation. Wallet vendors still declare some historical peer ranges
(`@solana/kit` requires TypeScript 5, and one `use-sync-external-store` copy
declares React through 18); those upstream constraints are not suppressed.

Before release, run `pnpm install --frozen-lockfile`, `pnpm audit`,
`pnpm exec tsc --noEmit`, and `pnpm test:run`, then the production build and
staging smoke checks for authentication, wallet connection, resume parsing,
image/OG rendering, and Sentry source-map upload. These checks are not implied
by regenerating the lockfile.

### Search-header job count

The search header reads the exact global open-job count from `GET /jobs/count`
(`{ totalJobs: number }`), without fetching feed groups, cards or employer payloads.
It uses the same public eligibility rules as the unfiltered feed, including all
imports rather than only the latest batch. Page filters do not narrow this global
search hint. The request remains uncached across renders; React deduplicates it
within a render. A valid zero is retained, while a failed or invalid count leaves
the ordinary search placeholder without an invented number.

The hero, desktop sidebar and mobile drawer share a React render-scoped
`fetchFilterConfigs` call. This deduplicates `/jobs/filters` within the same
render without retaining facet data across requests or hiding committed changes.

### Source security boundaries

JobPosting JSON-LD escapes every `<` after JSON serialization. Job descriptions,
titles and employer names are upstream content, not trusted HTML: a literal
`</script>` must not escape the structured-data script. The regression renders
the actual server component and verifies a single script with lossless JSON data.

Job and similar-job API publication timestamps are required finite numbers or
explicit `null`. A null publication date does not make a job unavailable:
cards, detail headers and social images omit its date label/posted badge.
No epoch or current date is substituted. JobPosting structured data is omitted
when its required publication date is unknown, while the ordinary job page
remains available and indexable. Missing, nonnumeric and nonfinite timestamp
payloads still fail validation; real numeric timestamps retain their existing
display. The retained public Loopscale payload exercises the null-date regression.

CI passes untrusted pull-request branch names through an environment variable,
never GitHub expression interpolation into shell source. CI builds run
`node scripts/build-fixtures.cjs --build`, which starts a loopback-only server
before spawning the real build and closes it afterward. It serves only explicit
sitemap fixtures; unknown paths and methods return 404. Other service origins
use reserved `.invalid` names and the Privy application ID is a placeholder,
not a production provider. Production builds retain their real API configuration
and never use fixture data. Build-tool telemetry is disabled; runtime Sentry
error capture and privacy exclusions are unchanged. The CI token has read-only
repository content permissions.

GitHub findings remain open until this branch is merged and the default branch
is rescanned. The vendor Zod backports require source/test review because the
older version numbers still match the advisory; they must not be bulk-dismissed.

### Browser error reporting configuration

Docker production builds require `NEXT_PUBLIC_SENTRY_DSN` at **build time**.
In Coolify, mark that variable as build-time and runtime, using the public DSN
for the `jobstash/webapp` Sentry project. A runtime-only `SENTRY_DSN` is available
to the server SDK but cannot populate the browser bundle. `SENTRY_AUTH_TOKEN` is a
separate source-map upload secret and must never be used as the public DSN.

The Docker builder validates the public DSN before building assets and reports
only the variable name on failure. `pnpm test:run` includes its regression checks.
After deployment, confirm the built browser DSN is nonempty and verify receipt
of a clearly labeled, nonpersonal browser SDK event; healthy HTTP responses or
server-only events do not prove browser ingestion.

Rollback uses the previous application image and the previously recorded Coolify
variable settings. Rolling back to an image built with an empty public DSN also
restores that image's browser-monitoring outage; changing runtime variables alone
does not repair it. Keep the public build-time variable for future corrected builds.

### Pillar social-image counts

Pillar Open Graph and Twitter images (the `opengraph-image` and `twitter-image`
routes with Next.js-generated suffixes, advertised in page metadata) display the exact
`totalJobs` from `/jobs/feed?pillar=<API slug>&limit=1`, using the same canonical
pillar and public visibility rules as the page's job feed. This is the complete
open inventory, not just the latest import, recent publications, a page of jobs,
or the number of employer groups. The headline therefore says **Open**, not New.
`metadataOnly=true` deliberately returns `jobs: []`; that array is not a count.

Image requests are dynamic and the count fetch is uncached. Metadata retains
its existing five-minute, jobs-revision-aware cache; it cannot freeze the count.
The generated image response requires revalidation rather than immutable
caching. Social networks can retain their own previews and may need a re-scrape
after deployment. Failed or invalid feed responses fail image generation,
instead of publishing a misleading `(0)`; a valid zero is displayed as `(0)`.

`src/app/(main)/[slug]/opengraph-image.test.tsx` exercises real PNG rendering
against a deterministic local API fixture across pillar categories, aliases,
large/zero counts, visibility and publication-age semantics. Set
`PILLAR_OG_EVIDENCE_DIR` to save its rendered PNGs and headline evidence.
