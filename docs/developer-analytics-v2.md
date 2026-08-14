# Developer analytics v2

## Data flow and API boundary

The classifier does not observe or write the database directly. It lists
candidates and applies every result through the ETL API. DBT is the component
that reads persisted GitHub and JobStash projections directly and materializes
the reporting facts.

```text
Codex classifier CLI
  -> protected ETL classification API
  -> PostgreSQL graph + review packets + refresh revision

PostgreSQL ban/taxonomy state
  -> protected scorer sync API
  -> ClickHouse threat_source projection
  -> serialized DBT build over stored GitHub data
  -> protected scorer report API
  -> public middleware report API
  -> /developers UI
```

The GitHub indexer, Kafka, Redis, workers, crawl branches, and raw event tables
are unchanged. Unbanning restores derived history because report builds filter
the preserved raw corpus using the current PostgreSQL ban projection.

## Endpoints

### ETL classification API

Both routes require a JWT accepted by `AuthGuard('jwt')` with the `write`
permission.

- `GET /vertical-classifications/candidates`
  - query: `cursor` (numeric node cursor), `limit` (1-500), and
    `includeReviewedFailures=true|false`
  - returns only `Organization` and `Project` records whose current vertical is
    `hybrid` or `ai_robotics`
  - project prose comes from the project itself, or from exactly one owner when
    the project has no prose; otherwise the evidence origin is `none`
- `POST /vertical-classifications/apply`
  - atomically checks `entityLabel`, `entityId`, `expectedVertical`, and the
    supplied input fingerprint
  - accepts either a grounded `classified` result or a `needs_review` failure
  - returns `409 Conflict` when the entity or inference input changed
  - preserves ban state and existing review evidence, and always leaves a human
    review packet open

Successful retries with the same fingerprint are idempotent. Review entries
are keyed by entity, status, and fingerprint, so a retry cannot duplicate one.

### Ban synchronization

- `POST /threat/sync`
  - scorer endpoint protected by `ThreatApiKeyGuard`
  - authenticate with `Authorization: Bearer $THREAT_API_KEY`
  - refreshes the ClickHouse projection of authoritative PostgreSQL bans and
    current verticals

The DBT runner calls this endpoint inside its filesystem lock before every
report build. Calls that arrive during a sync cause one serialized trailing
sync, so a ban committed during an earlier snapshot is not acknowledged by a
stale build.

### Developer report

- `GET /scorer/people/developer-report`
  - protected scorer route used by middleware
- `GET /people/developer-report`
  - unversioned public middleware route used by the web app

Both use the same query contract:

- `range=3m|6m|1y|3y|max` (default `max`)
- optional `vertical=<slug>`
- optional `chain=<slug>`

Vertical and chain may be combined. Every summary, time series, top list,
coverage value, and organization frame uses the same selected range and scope.
Available verticals and chains are response data, not frontend enums.

`rawIndexedCommitRecords` counts indexed commit rows after the current ban and
existence gates, including bots and records without an attributable numeric
author. `allContributors` counts attributable non-bot numeric GitHub author
IDs, while `creditedOriginalCommits` and `activeDevelopers` require the
provenance-approved original-work fact.

## Classifier operation

The command is dry-run by default. It uses the existing subscription-backed
`CodexInferenceProvider`, `gpt-5.6-terra`, medium reasoning, and bounded
concurrency. The state file is written atomically with mode-specific
fingerprints, making both dry-run and apply resumable.

```bash
cd ../etl
ETL_API_URL=https://etl.internal.example \
ETL_API_TOKEN=... \
yarn taxonomy:reclassify --concurrency 4 \
  --state .vertical-classification-progress.json \
  > classifier-dry-run.jsonl \
  2> classifier-dry-run.errors.jsonl
```

Inspect the JSONL distribution and failures before applying:

```bash
jq -r 'select(.event == "vertical_classification_result") | .to' \
  classifier-dry-run.jsonl | sort | uniq -c
jq 'select(.event == "vertical_classification_failure")' \
  classifier-dry-run.errors.jsonl
```

Apply the exact same candidate inputs through the API:

```bash
ETL_API_URL=https://etl.internal.example \
ETL_API_TOKEN=... \
yarn taxonomy:reclassify --apply --concurrency 4 \
  --state .vertical-classification-progress.json
```

Use `--retry-failures` only after reviewing the recorded failure packets. A
failed or invalid inference leaves the current vertical unchanged.

## Rollout order

1. Apply the ETL taxonomy/refresh migrations and deploy the guarded ETL API.
2. Run the classifier without `--apply`; inspect category counts, evidence, and
   failures.
3. Run it with `--apply` until the candidate endpoint contains only recorded
   failures awaiting review.
4. Deploy scorer with `POST /threat/sync`, then configure the DBT service with
   `SCORER_INTERNAL_URL` and `THREAT_API_KEY`.
5. Run `scripts/coolify-run-github-dbt.sh --resume-people` to synchronize the
   source projection and build the corrected facts.
6. Deploy middleware and the web app. Verify `3m`, `6m`, `1y`, `3y`, and `max`,
   each returned vertical, chain scopes, combined scopes, and empty states.
7. Verify a banned organization and all mapped siblings are absent from every
   historical point; unban it and confirm history returns after refresh.
8. After production acceptance, run the explicit derived-table cleanup in
   `github-dbt/deploy/drop-obsolete-developer-report-tables.sql`.
9. Install the separate ClickHouse system-log TTL fragment documented in
   `github-dbt/deploy/README.md`.

Do not create a new large backup or delete raw GitHub activity during this
rollout. Restore-data cleanup requires a separate inventory that proves which
copy is obsolete and identifies the newest usable restore database.
