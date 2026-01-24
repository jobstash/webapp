---
name: address-mapping
description: Knowledge base for converting raw location strings to structured addresses. Use when processing job location data for Schema.org compliance.
---

# Address Mapping Knowledge Base

## Mapping Structure

Each mapping has:

```typescript
interface AddressMapping {
  label: string; // Display label for job info tag
  addresses: Address[] | null; // Structured addresses, null for invalid
}
```

## Remote Prefix Format

Location strings may include a `[REMOTE]` prefix added by the fetch script when `locationType === 'REMOTE'`.

### Handling Rules

1. **Key preservation**: The mapping key includes the `[REMOTE]` prefix exactly as provided
2. **Label stripping**: Remove `[REMOTE]` from labels (labels never include "remote")
3. **isRemote detection**: Set `isRemote: true` when string starts with `[REMOTE]`

### Examples

| Input String           | Key                    | Label         | isRemote |
| ---------------------- | ---------------------- | ------------- | -------- |
| `"[REMOTE] NYC"`       | `"[REMOTE] NYC"`       | `"NY, USA"`   | `true`   |
| `"[REMOTE] Singapore"` | `"[REMOTE] Singapore"` | `"Singapore"` | `true`   |
| `"NYC"`                | `"NYC"`                | `"NY, USA"`   | `false`  |
| `"Remote - Singapore"` | `"Remote - Singapore"` | `"Singapore"` | `true`   |

## Label Guidelines

Labels appear on job info tags. Keep them concise with NO "remote" word (redundant with work mode tag).

### Single Location

| Raw String             | Label                  |
| ---------------------- | ---------------------- |
| `"Remote - Singapore"` | `"Singapore"`          |
| `"New York, USA"`      | `"New York, USA"`      |
| `"NYC"`                | `"NY, USA"`            |
| `"San Francisco"`      | `"San Francisco, USA"` |
| `"USA"`                | `"United States"`      |
| `"United Kingdom"`     | `"United Kingdom"`     |

### Multi-Location

Parse each location separated by `/`, `,`, or `;`. Include each as a separate address entry.

| Raw String                | Label                     | Addresses Count        |
| ------------------------- | ------------------------- | ---------------------- |
| `"USA, UK"`               | `"US, UK"`                | 2 (US + UK)            |
| `"USA, Philippines"`      | `"US, Philippines"`       | 2 (US + PH)            |
| `"EU/US"`                 | `"EU, US"`                | 2 (EU + US)            |
| `"Chicago, IL / NY, US"`  | `"Chicago, New York"`     | 2 (Chicago + NYC)      |
| `"SF, Seattle, Austin"`   | `"SF, Seattle, Austin"`   | 3 cities               |
| `"London, Paris, Berlin"` | `"London, Paris, Berlin"` | 3 cities (3 countries) |
| `"New York, SF, London"`  | `"NY, SF, London"`        | 3 cities (2 countries) |

**Label Guidelines for Multiple Cities:**

- Use abbreviated city names when space is limited (SF, NY, LA)
- If 4+ cities in same country, consider using country name: `"USA"` or `"US (multiple cities)"`
- If cities span multiple countries, list cities: `"NY, London, Berlin"`

### Regions

| Raw String    | Label            |
| ------------- | ---------------- |
| `"APAC"`      | `"Asia-Pacific"` |
| `"EMEA"`      | `"EMEA"`         |
| `"Europe"`    | `"Europe"`       |
| `"Worldwide"` | `"Anywhere"`     |
| `"Global"`    | `"Anywhere"`     |

### Invalid Locations

| Raw String   | Label                     |
| ------------ | ------------------------- |
| `"Cow Moon"` | `"Cow Moon"` (keep as-is) |

## Location Precedence Rules

**Key Principle:** If a location string contains specific cities, regions, or countries, those take precedence over generic modifiers like "Remote (any location)" or "any location".

### Precedence Order (highest to lowest)

1. **Explicit cities/regions** - `"Chicago, IL / NY, US"` → extract Chicago (IL) + New York (NY)
2. **Explicit countries** - `"USA, UK"` → use those countries
3. **Regional patterns** - `"APAC"`, `"EMEA"` → expand to countries
4. **Generic patterns** - `"Anywhere"`, `"Any"`, `"Worldwide"` → use worldwide expansion (label as "Anywhere")

### Examples

| Raw String                                             | Label                 | Addresses              | Rationale                     |
| ------------------------------------------------------ | --------------------- | ---------------------- | ----------------------------- |
| `"Chicago, IL / NY, US - Remote (any location)"`       | `"Chicago, New York"` | Chicago (IL) + NY (NY) | Cities take precedence        |
| `"San Francisco, CA / Seattle, WA - Remote"`           | `"SF, Seattle"`       | SF (CA) + Seattle (WA) | Multiple US cities            |
| `"Amsterdam, NL / London, GB - Remote (any location)"` | `"Amsterdam, London"` | Amsterdam + London     | Cities in different countries |
| `"USA - Remote (any location)"`                        | `"United States"`     | US only                | Country specified             |
| `"Remote (any location)"`                              | `"Anywhere"`          | Worldwide expansion    | No specific location          |
| `"Global"`                                             | `"Anywhere"`          | Worldwide expansion    | Generic pattern               |

## Address Schema

Each address must have:

- `country` (required): Display name (e.g., "United States")
- `countryCode` (required): ISO 3166-1 alpha-2 (e.g., "US") - **NO XX ALLOWED**
- `isRemote` (required): Boolean

Optional fields:

- `locality`: City or municipality
- `region`: State, province, or region
- `postalCode`: Postal code
- `street`: Street address
- `extendedAddress`: Apt, suite, unit, etc.
- `geo`: `{ latitude, longitude }` for rich results

## No XX Country Codes

**CRITICAL:** Every address MUST have a valid country and countryCode. The `XX` placeholder is NOT allowed.

For regional locations, expand to actual countries:

```typescript
const REGION_TO_COUNTRIES: Record<string, string[]> = {
  APAC: [
    'AU',
    'JP',
    'SG',
    'IN',
    'KR',
    'NZ',
    'HK',
    'TW',
    'PH',
    'MY',
    'TH',
    'VN',
    'ID',
  ],
  EMEA: [
    'GB',
    'DE',
    'FR',
    'NL',
    'ES',
    'IT',
    'IE',
    'SE',
    'PL',
    'AE',
    'IL',
    'ZA',
  ],
  'North America': ['US', 'CA', 'MX'],
  Europe: [
    'GB',
    'DE',
    'FR',
    'NL',
    'ES',
    'IT',
    'IE',
    'SE',
    'NO',
    'DK',
    'FI',
    'PL',
    'PT',
    'BE',
    'AT',
    'CH',
  ],
  Worldwide: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'NL', 'SG', 'IE'],
};
```

Include at least 5 major countries for each region.

## Remote Detection

Set `isRemote: true` if:

1. The string starts with `[REMOTE]` prefix, OR
2. The string contains "Remote" (case insensitive)

Examples:

- `"[REMOTE] NYC"` → `isRemote: true` (prefix)
- `"Remote - Singapore"` → `isRemote: true` (contains "Remote")
- `"USA"` → `isRemote: false`

## "Remote (any location)" Handling

The phrase "Remote (any location)" or similar variations indicate remote work is available, but **does NOT override explicit locations**.

### Parsing Rules

1. **Strip the remote modifier** to find actual locations
   - `"Chicago, IL - Remote (any location)"` → parse `"Chicago, IL"`
   - `"NYC / SF - Remote"` → parse `"NYC / SF"`

2. **If locations remain after stripping** → use those locations
   - Label: Use the parsed locations
   - Addresses: One entry per parsed location
   - `isRemote: true` (because "Remote" was present)

3. **If NO locations remain** → treat as worldwide
   - `"Remote (any location)"` → label: `"Anywhere"`, addresses: worldwide expansion
   - `"Remote - Global"` → label: `"Anywhere"`, addresses: worldwide expansion

### Examples

| Raw String                                       | After Stripping          | Label                 | Addresses           |
| ------------------------------------------------ | ------------------------ | --------------------- | ------------------- |
| `"Chicago, IL / NY, US - Remote (any location)"` | `"Chicago, IL / NY, US"` | `"Chicago, New York"` | 2 US cities         |
| `"USA - Remote (any location)"`                  | `"USA"`                  | `"United States"`     | 1 country (US)      |
| `"Remote (any location)"`                        | (empty)                  | `"Anywhere"`          | Worldwide expansion |
| `"APAC - Remote"`                                | `"APAC"`                 | `"Asia-Pacific"`      | APAC countries      |

## Country Code Reference

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

## Cities with Implicit Countries

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

## Output Format

Valid JSON with the new structure:

```json
{
  "USA": {
    "label": "United States",
    "addresses": [
      { "country": "United States", "countryCode": "US", "isRemote": false }
    ]
  },
  "New York, USA": {
    "label": "New York, USA",
    "addresses": [
      {
        "country": "United States",
        "countryCode": "US",
        "isRemote": false,
        "locality": "New York"
      }
    ]
  },
  "Remote - Singapore": {
    "label": "Singapore",
    "addresses": [
      { "country": "Singapore", "countryCode": "SG", "isRemote": true }
    ]
  },
  "USA, UK": {
    "label": "US, UK",
    "addresses": [
      { "country": "United States", "countryCode": "US", "isRemote": false },
      { "country": "United Kingdom", "countryCode": "GB", "isRemote": false }
    ]
  },
  "APAC": {
    "label": "Asia-Pacific",
    "addresses": [
      { "country": "Australia", "countryCode": "AU", "isRemote": false },
      { "country": "Japan", "countryCode": "JP", "isRemote": false },
      { "country": "Singapore", "countryCode": "SG", "isRemote": false },
      { "country": "India", "countryCode": "IN", "isRemote": false },
      { "country": "South Korea", "countryCode": "KR", "isRemote": false }
    ]
  },
  "Cow Moon": {
    "label": "Cow Moon",
    "addresses": null
  }
}
```
