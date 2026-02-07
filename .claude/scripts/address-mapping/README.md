# Address Mapping

Converts raw job location strings from the middleware API into structured address data used by the webapp for filtering and display.

## Why This Exists

Job listings arrive with freeform location strings like `"Remote - Singapore"`, `"NYC"`, or `"APAC"`. The webapp needs structured data (country codes, city names, remote flags) for location filters and SEO. This pipeline maps raw strings to structured `Address` objects validated against the app's Zod schema.

The output (`mappings.json`) is consumed at runtime by `src/lib/server/address-lookup.ts`.

## Prerequisites

- **pnpm** and **Node.js** installed
- **Claude Code CLI** with access to Opus model (agents run on Opus)
- The middleware API running locally or accessible at production URL

## How to Run

In Claude Code, run the slash command:

```
/map-addresses
```

This launches an interactive workflow that handles everything. You will be prompted to:

1. Select the middleware URL (production, local, or custom)
2. Approve the number of batches before processing begins

## Workflow Steps

| Step                   | What Happens                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Select URL**      | Choose production (`NEXT_PUBLIC_MW_URL`), local (`localhost:8080`), or custom                                                                                                        |
| **2. Fetch locations** | Calls `/jobs/list?page=1&limit=5000`, extracts unique location strings, prepends `[REMOTE]` for remote jobs. Saves to `fetched-locations.json`                                       |
| **3. Find unmapped**   | Compares fetched locations against existing `mappings.json`. Outputs new strings to `unmapped.json`                                                                                  |
| **4. Review**          | Shows count of unmapped locations and estimated batch/wave counts                                                                                                                    |
| **5. Approve**         | You confirm before any AI processing begins                                                                                                                                          |
| **6. Process batches** | Splits unmapped locations into batches of 50. Launches up to 5 `address-mapper` agents in parallel per wave. Each agent writes results to `temp/batch-{N}.json`                      |
| **7. Finalize**        | Merges batch outputs into `mappings.json`, validates against Zod schema, rejects `XX` country codes, sorts alphabetically, saves uncertain mappings separately, cleans up temp files |
| **8. Report**          | Shows totals: processed, mapped, failed batches, uncertain mappings                                                                                                                  |

## File Structure

```
.claude/scripts/address-mapping/
├── README.md                  # This file
├── types.ts                   # TypeScript type definitions
├── fetch-locations.ts         # Step 2: fetch from middleware API
├── find-unmapped.ts           # Step 3: diff against existing mappings
├── add-mappings.ts            # Validate and merge new mappings
├── finalize-mappings.ts       # Step 7: merge batches, validate, sort
├── mappings.json              # Accumulated mapping database (committed)
├── uncertain-mappings.json    # Mappings needing manual review (committed)
├── fetched-locations.json     # Temp: raw API locations (gitignored)
├── unmapped.json              # Temp: unprocessed strings (gitignored)
└── temp/                      # Temp: batch output files (gitignored)
    └── batch-*.json
```

Related files:

- `.claude/commands/map-addresses.md` - Slash command definition
- `.claude/agents/address-mapper.md` - Agent configuration
- `.claude/skills/address-mapping/SKILL.md` - Domain knowledge for agents
- `src/lib/server/address-lookup.ts` - Runtime consumer of `mappings.json`

## Mapping Format

Each entry in `mappings.json`:

```json
{
  "[REMOTE] Singapore": {
    "label": "Singapore",
    "addresses": [
      {
        "country": "Singapore",
        "countryCode": "SG",
        "isRemote": true
      }
    ]
  }
}
```

- **Key**: Raw location string (with `[REMOTE]` prefix if applicable)
- **label**: Concise display name (no "remote" word)
- **addresses**: Array of structured addresses, or `null` for generic locations

## Reviewing Uncertain Mappings

After `/map-addresses` completes, some mappings may be flagged as **uncertain**. These are ambiguous locations where the AI agent had to make judgment calls (e.g., expanding regions to countries, interpreting timezone ranges, correcting typos).

Uncertain mappings are **already merged into `mappings.json`** and are live. The `uncertain-mappings.json` file is a review checklist — it contains the same entries in the same format, extracted for easy review.

### Review Workflow

1. Open `uncertain-mappings.json` to see flagged entries
2. For each entry, check the mapping in `mappings.json`:
   - **Label** — Is the display name accurate and concise?
   - **Countries** — Are the right countries included? Too many? Too few?
   - **Cities** — Are `locality`/`region` values correct?
   - **Remote flag** — Should `isRemote` be true or false?
3. If a mapping is **wrong** → edit it directly in `mappings.json`
4. If a mapping is **correct** → no action needed
5. After review → delete `uncertain-mappings.json` to signal review is complete

### Common Uncertain Patterns

| Pattern              | Example                                     | What to Check                                             |
| -------------------- | ------------------------------------------- | --------------------------------------------------------- |
| Region expansion     | `"APAC"` → 13 countries                     | Are the representative countries reasonable?              |
| Timezone range       | `"Central Europe through Americas Eastern"` | Are the inferred countries within the timezone range?     |
| Typo correction      | `"District of Colombia"` → D.C., USA        | Was the correction right? (Could be Colombia the country) |
| Multi-region         | `"EU/US"` → split into countries            | Is the split balanced and accurate?                       |
| Territory vs country | `"Puerto Rico"` → `PR` vs `US`              | Should it use its own ISO code or parent country?         |
| Remote inference     | `"also open to remote"` → `isRemote: true`  | Was the remote flag correctly inferred?                   |

### Notes

- `uncertain-mappings.json` is **overwritten** on each `/map-addresses` run
- If you skip review, the mappings still work — they're just best-effort
- Re-running `/map-addresses` skips already-mapped locations, so manual edits to `mappings.json` are preserved

## Error Handling

- **Zod validation**: Every address is validated against the app schema. Invalid entries are skipped with warnings.
- **No `XX` country codes**: Regions like "APAC" must expand to real country codes. Entries with `XX` are rejected.
- **Max 6 addresses**: Broad locations (regions, timezone ranges) are capped at 6 addresses. Agents pick the most relevant — explicitly named locations first, then major crypto/tech hubs. Strings that naturally produce fewer than 6 are left as-is.
- **Uncertain mappings**: Ambiguous locations (timezone ranges, vague regions) are saved to `uncertain-mappings.json` for manual review.
- **Failed batches**: Tracked separately in the final report. Re-run `/map-addresses` to retry; already-mapped entries are skipped automatically.
- **Idempotent**: Running the command again only processes new unmapped locations.
