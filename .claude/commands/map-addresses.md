# Map Addresses Command

Generate structured address mappings from raw location strings.

## Usage

```
/map-addresses
```

## Workflow

### Step 1: Select Middleware URL

Use AskUserQuestion to prompt the user for the middleware URL:

- **Production** (https://middleware.jobstash.xyz) - Recommended
- **Local** (http://localhost:8080)
- **Other** - Custom URL

### Step 2: Fetch Locations

Run the fetch script with the selected URL:

```bash
npx tsx .claude/scripts/address-mapping/fetch-locations.ts <middleware-url>
```

This fetches all unique location strings from the API and saves to `fetched-locations.json`.

### Step 3: Find Unmapped Locations

Run the find-unmapped script:

```bash
npx tsx .claude/scripts/address-mapping/find-unmapped.ts
```

This compares fetched locations against existing mappings and outputs unmapped strings to `unmapped.json`.

**If no unmapped locations:** Report completion and stop.

### Step 4: Read Unmapped Locations

Read `.claude/scripts/address-mapping/unmapped.json` to get the list of location strings that need mapping.

### Step 5: Get User Approval

1. Count total unmapped locations from `unmapped.json`
2. Calculate:
   - Number of batches = ceil(total / 50)
   - Number of waves = ceil(batches / 5) (max 5 agents per wave)
3. Report to user:
   ```
   === Address Mapping Summary ===
   Locations to map: X
   Batches (50 each): Y
   Parallel agents per wave: 5 (max)
   Waves needed: Z
   ```
4. Ask for confirmation using AskUserQuestion:
   - "Proceed with mapping X locations?"
   - Options: "Yes, proceed", "Cancel"

### Step 6: Launch Parallel Agents

1. Divide locations into batches of 50
2. Launch up to **5 agents in parallel** using Task tool:
   ````
   Task({
     subagent_type: "address-mapper",
     model: "opus",
     prompt: "Process batch X of Y:\n\n```json\n[...locations...]\n```"
   })
   ````
3. Wait for wave to complete, launch next wave if needed
4. Repeat until all batches are processed

### Step 7: Consolidate Results

1. Collect JSON output from each agent
2. Merge all mappings into single object
3. Collect all uncertain mappings
4. Handle agent failures:
   - If an agent fails or returns invalid JSON, report the batch that failed
   - Include failed batches in final report for manual processing
   - Continue with successful batches
5. Pipe consolidated mappings to add-mappings.ts:
   ```bash
   echo '<consolidated-json>' | npx tsx .claude/scripts/address-mapping/add-mappings.ts
   ```

### Step 8: Final Report

Report:

- Total locations processed
- Successfully mapped
- Validation errors (if any)
- Failed batches (if any) for manual processing
- Uncertain mappings for review

```
=== Address Mapping Complete ===

Total locations processed: X
Successfully mapped: Y
Failed batches: Z (list batch numbers if any)

Uncertain mappings (review recommended):
- "APAC" → Expanded to 5 major Asia-Pacific countries
- "EU/US" → Split into Europe + US addresses

Remaining unmapped: N
```

## Error Handling

If add-mappings.ts reports validation errors:

1. Show the error to the user
2. Ask if they want to fix and retry or skip the problematic mapping
3. Continue with remaining mappings

Common errors:

- `countryCode "XX"` - Region not expanded to countries
- Missing `label` - Every mapping needs a display label
- Invalid `addresses` - Must be array or null

## Files

```
.claude/scripts/address-mapping/
├── mappings.json          # Accumulated mappings (committed to repo)
├── types.ts               # TypeScript types
├── fetch-locations.ts     # Fetches from API (requires URL arg)
├── find-unmapped.ts       # Finds unmapped strings
├── add-mappings.ts        # Validates and merges mappings
├── fetched-locations.json # Temporary (gitignored)
└── unmapped.json          # Temporary (gitignored)
```
