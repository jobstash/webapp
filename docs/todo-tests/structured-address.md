# structured-address - Test Checklist

## Address Schema & Lookup

- [ ] `addressSchema` validates objects with required `country`, `countryCode`, and `isRemote` fields
- [ ] `addressSchema` accepts optional fields: `locality`, `region`, `postalCode`, `street`, `extendedAddress`, `geo`
- [ ] `lookupAddresses()` returns `null` for unmapped location strings
- [ ] `lookupAddresses()` returns `null` for `null` input
- [ ] `lookupAddresses()` returns `Address[]` for mapped location strings

## Job Schemas

- [ ] `jobListItemSchema` has `addresses: Address[] | null` field (job-level)
- [ ] `jobOrganizationSchema` keeps `location: string | null` (unchanged)
- [ ] `similarJobSchema` uses `addresses: Address[] | null` (job-level)
- [ ] TypeScript types are correctly inferred from updated schemas

## DTO Transformers

- [ ] `dtoToJobListItem` transforms `dto.location` (job-level) to `addresses` array
- [ ] `dtoToJobListItem` keeps `organization.location` as string (unchanged)
- [ ] `dtoToSimilarJob` transforms `dto.location` to `addresses` array
- [ ] Jobs with unmapped locations have `addresses: null` (graceful degradation)
- [ ] Multi-location strings (e.g., "USA, Philippines") produce multiple Address objects

## UI Components

### Organization Info Card

- [ ] Displays `organization.location` as string (unchanged)
- [ ] Does not render location section when location is null

### Similar Job Item

- [ ] Displays first address's country from `job.addresses`
- [ ] Does not render location when addresses is null

### Job Card Info Tags

- [ ] Location info tags render from raw DTO `job.location` string
- [ ] Pillar links (`/l-*`) use slugified location string

## SEO & Structured Data

### Job Posting Schema (Schema.org)

- [ ] Uses `job.addresses` for structured `PostalAddress` data
- [ ] Falls back to `organization.location` string when `job.addresses` is null
- [ ] Includes `addressCountry` using countryCode (ISO 3166-1 alpha-2)
- [ ] Includes optional fields (`addressLocality`, `addressRegion`, `postalCode`, `streetAddress`) when available
- [ ] Includes `GeoCoordinates` when geo data available
- [ ] Sets `jobLocationType: 'TELECOMMUTE'` when any address has `isRemote: true`

### SEO Utils

- [ ] `extractLocationType()` returns `'TELECOMMUTE'` when `job.addresses` contain `isRemote: true`
- [ ] `extractLocationType()` falls back to infoTag parsing when addresses not provided

## Pillar Pages

- [ ] Location pillar pages (`/l-usa`) continue to work with existing location filtering
- [ ] Location type pillar pages (`/lt-remote`) work correctly

## Mapping Scripts (.claude/scripts/address-mapping/)

- [ ] `fetch-locations.ts` fetches job-level locations from `/api/locations`
- [ ] `find-unmapped.ts` identifies location strings without mappings
- [ ] `add-mappings.ts` validates addresses against schema before adding
- [ ] `add-mappings.ts` rejects invalid address objects with clear error messages

## API Route

- [ ] `GET /api/locations` returns array of unique job-level location strings
- [ ] Response only includes `job.location`, not `organization.location`
- [ ] Response is sorted alphabetically
- [ ] Handles API errors gracefully with 500 status

## Edge Cases

- [ ] Jobs with only remote location display correctly
- [ ] Very long location strings split into multiple addresses display correctly
- [ ] Jobs with mixed remote and physical addresses handle `isRemote` correctly
