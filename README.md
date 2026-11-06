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
