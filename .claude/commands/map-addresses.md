# Map Addresses Command

Generate structured address mappings from raw location strings.

## Usage

```
/map-addresses
```

## Prerequisites

- Dev server must be running (`pnpm dev`)
- The `/api/locations` endpoint must be accessible

## Workflow

### Step 1: Fetch Locations

Run the fetch script:

```bash
npx tsx .claude/scripts/address-mapping/fetch-locations.ts
```

This fetches all unique location strings from the API and saves to `fetched-locations.json`.

### Step 2: Find Unmapped Locations

Run the find-unmapped script:

```bash
npx tsx .claude/scripts/address-mapping/find-unmapped.ts
```

This compares fetched locations against existing mappings and outputs unmapped strings to `unmapped.json`.

**If no unmapped locations:** Report completion and stop.

### Step 3: Read Unmapped Locations

Read `.claude/scripts/address-mapping/unmapped.json` to get the list of location strings that need mapping.

### Step 4: Process in Batches of 50

For each batch of up to 50 unmapped locations:

1. **Show the batch** to the user with the locations to be mapped
2. **Ask for confirmation** using AskUserQuestion:
   - "Proceed with mapping these 50 locations?"
   - Options: "Yes, map them", "Skip this batch", "Stop mapping"

3. **If user confirms**, generate mappings for the batch following the conversion guidelines below

4. **Track uncertain mappings** - locations where you had to make assumptions or couldn't determine exact data

5. **Pipe mappings to add-mappings.ts**:

   ```bash
   echo '<json>' | npx tsx .claude/scripts/address-mapping/add-mappings.ts
   ```

6. **Report batch results**:
   - Mappings added
   - Any validation errors
   - Uncertain mappings flagged

7. **Loop** back to Step 2 to find remaining unmapped locations

### Step 5: Final Report

When all locations are mapped (or user stops), provide a summary:

```
=== Address Mapping Complete ===

Total locations processed: X
Successfully mapped: Y
Skipped: Z

Uncertain mappings (review recommended):
- "APAC" → Used generic Asia-Pacific region
- "EU/US" → Split into two addresses

Remaining unmapped: N
```

## Conversion Guidelines

### Address Schema

Each address must have:

- `country` (required): Display name (e.g., "United States")
- `countryCode` (required): ISO 3166-1 alpha-2 (e.g., "US")
- `isRemote` (required): Boolean

Optional fields:

- `locality`: City or municipality
- `region`: State, province, or region
- `postalCode`: Postal code
- `street`: Street address
- `extendedAddress`: Apt, suite, unit, etc.
- `geo`: `{ latitude, longitude }` for rich results

### Remote Detection

Set `isRemote: true` if the string contains "Remote" (case insensitive).

Examples:

- "Remote" → `isRemote: true`
- "Remote - Singapore" → `isRemote: true`
- "USA" → `isRemote: false`

### Country Code Reference

Use ISO 3166-1 alpha-2 codes:

| Pattern                     | Country              | Code |
| --------------------------- | -------------------- | ---- |
| USA, United States, US      | United States        | US   |
| UK, United Kingdom, Britain | United Kingdom       | GB   |
| Philippines, PH             | Philippines          | PH   |
| Singapore, SG               | Singapore            | SG   |
| Germany, DE                 | Germany              | DE   |
| Canada, CA                  | Canada               | CA   |
| Australia, AU               | Australia            | AU   |
| Japan, JP                   | Japan                | JP   |
| India, IN                   | India                | IN   |
| France, FR                  | France               | FR   |
| Netherlands, NL             | Netherlands          | NL   |
| Switzerland, CH             | Switzerland          | CH   |
| Ireland, IE                 | Ireland              | IE   |
| Portugal, PT                | Portugal             | PT   |
| Spain, ES                   | Spain                | ES   |
| Poland, PL                  | Poland               | PL   |
| Brazil, BR                  | Brazil               | BR   |
| Mexico, MX                  | Mexico               | MX   |
| China, CN                   | China                | CN   |
| Hong Kong, HK               | Hong Kong            | HK   |
| Taiwan, TW                  | Taiwan               | TW   |
| UAE, Dubai                  | United Arab Emirates | AE   |
| Israel, IL                  | Israel               | IL   |
| South Korea, Korea          | South Korea          | KR   |
| Vietnam, VN                 | Vietnam              | VN   |
| Thailand, TH                | Thailand             | TH   |
| Indonesia, ID               | Indonesia            | ID   |
| Malaysia, MY                | Malaysia             | MY   |

### Multi-Location Strings

For strings listing multiple locations, create multiple Address objects in the array.

Example:

```json
{
  "USA, Philippines": [
    { "country": "United States", "countryCode": "US", "isRemote": false },
    { "country": "Philippines", "countryCode": "PH", "isRemote": false }
  ]
}
```

### Region-Level Locations

For vague regional locations, mark as **uncertain** and use best approximation:

| String            | Handling                           | Uncertain? |
| ----------------- | ---------------------------------- | ---------- |
| APAC              | Use "Asia-Pacific" with code "XX"  | Yes        |
| Europe            | Use "Europe" with code "XX"        | Yes        |
| EMEA              | Use "EMEA" with code "XX"          | Yes        |
| LATAM             | Use "Latin America" with code "XX" | Yes        |
| Worldwide, Global | Use "Worldwide" with code "XX"     | Yes        |

### Cities with Implicit Countries

Parse country from well-known cities:

| Cities                                                                                             | Country              | Code |
| -------------------------------------------------------------------------------------------------- | -------------------- | ---- |
| New York, NYC, San Francisco, SF, Los Angeles, LA, Seattle, Austin, Denver, Miami, Chicago, Boston | United States        | US   |
| London, Manchester, Birmingham, Edinburgh                                                          | United Kingdom       | GB   |
| Toronto, Vancouver, Montreal                                                                       | Canada               | CA   |
| Sydney, Melbourne, Brisbane                                                                        | Australia            | AU   |
| Berlin, Munich, Frankfurt, Hamburg                                                                 | Germany              | DE   |
| Paris, Lyon, Marseille                                                                             | France               | FR   |
| Amsterdam, Rotterdam                                                                               | Netherlands          | NL   |
| Zurich, Geneva, Basel                                                                              | Switzerland          | CH   |
| Dublin                                                                                             | Ireland              | IE   |
| Lisbon, Porto                                                                                      | Portugal             | PT   |
| Madrid, Barcelona                                                                                  | Spain                | ES   |
| Tel Aviv, Jerusalem                                                                                | Israel               | IL   |
| Dubai, Abu Dhabi                                                                                   | United Arab Emirates | AE   |
| Tokyo, Osaka                                                                                       | Japan                | JP   |
| Seoul                                                                                              | South Korea          | KR   |
| Beijing, Shanghai, Shenzhen                                                                        | China                | CN   |
| Mumbai, Bangalore, Delhi, Hyderabad                                                                | India                | IN   |
| Sao Paulo, Rio de Janeiro                                                                          | Brazil               | BR   |

### Output Format

Valid JSON that can be piped to add-mappings.ts:

```json
{
  "USA": [
    { "country": "United States", "countryCode": "US", "isRemote": false }
  ],
  "Remote - Singapore": [
    { "country": "Singapore", "countryCode": "SG", "isRemote": true }
  ],
  "New York, USA": [
    {
      "country": "United States",
      "countryCode": "US",
      "isRemote": false,
      "locality": "New York"
    }
  ]
}
```

## Error Handling

If add-mappings.ts reports validation errors:

1. Show the error to the user
2. Ask if they want to fix and retry or skip the problematic mapping
3. Continue with remaining mappings

## Files

```
.claude/scripts/address-mapping/
├── mappings.json          # Accumulated mappings (committed to repo)
├── types.ts               # TypeScript types
├── fetch-locations.ts     # Fetches from API
├── find-unmapped.ts       # Finds unmapped strings
├── add-mappings.ts        # Validates and merges mappings
├── fetched-locations.json # Temporary (gitignored)
└── unmapped.json          # Temporary (gitignored)
```
