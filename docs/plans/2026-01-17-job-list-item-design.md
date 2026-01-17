# Job List Item Component Design

## Overview

Replace the current placeholder `<pre>` tag job list rendering with a fully implemented card-based job list item component.

## Design Decisions

| Decision              | Choice                   | Rationale                                               |
| --------------------- | ------------------------ | ------------------------------------------------------- |
| Visual style          | Card-based               | Scannability, clear visual hierarchy                    |
| Information density   | Essential only           | Clean, fast to scan                                     |
| Badge display         | Corner ribbon            | Subtle but visible, doesn't compete with title          |
| Organization display  | Logo + name inline       | Compact and recognizable                                |
| Tech tags             | Show first 3 + "+N more" | Quick sense of tech stack without overwhelming          |
| Card clickable        | No                       | Multiple interactive elements inside (title, org, tags) |
| Title vs Org position | Title first              | Industry standard, users scan by role first             |

## Card Layout

```
┌─────────────────────────────────────────────────────┐
│  Job Title                         [Featured] badge │
│                                                     │
│  [Logo]  [Org Name →] [↗] · Location        [▼]     │
│                                                     │
│  [Senior →] [Salary] [Remote →] [Full-time →]       │
│                                                     │
│  [React →] [TypeScript →] [Node.js →] +3    2 days  │
└─────────────────────────────────────────────────────┘

→ = filter link
[↗] = external link to org website
[▼] = toggle to expand org details
```

### Expanded Organization Section

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  [Org Name →] [↗] · Location        [▲]     │
│                                                     │
│  👥 50-100 employees                                │
│  💰 [Series B →] · $25M · Jan 2024                  │
│  💰 [Series A →] · $10M · Mar 2023                  │
│  🏛️ [a16z →], [Paradigm →], +2 more                 │
└─────────────────────────────────────────────────────┘
```

## Interactive Elements

### Links to Job Detail Page

- Job title → `/job-slug/shortUUID`

### Filter Links (same page with filter applied)

- Org name → `/?organizations=org-name`
- Seniority → `/?seniority=senior`
- Location → `/?location=new-york`
- Work mode → `/?locationType=remote`
- Commitment → `/?commitment=full-time`
- Classification → `/?classification=engineering`
- Pays in Crypto → `/?paysInCrypto=true`
- Token Allocation → `/?offersTokenAllocation=true`
- Tech tags → `/?tags=react`
- Funding rounds → `/?fundingRounds=series-b`
- Investors → `/?investors=a16z`

### External Links

- Org external icon → `websiteUrl` (opens in new tab)

### Non-Interactive

- Salary (range, not a discrete filter)
- Timestamp
- Employee count

## Visual Styling

### Card

- Background: `bg-card`
- Border: `border border-border`
- Rounded: `rounded-lg`
- Padding: `p-4`
- Hover: `hover:shadow-md` transition

### Badge (Corner Ribbon)

- Position: `absolute top-3 right-3`
- Style: Small pill, `text-xs font-medium`
- Colors by type:
  - Featured → amber/gold
  - Expert → purple
  - Beginner → green

### Job Title

- Size: `text-lg font-semibold`
- Color: `text-foreground`
- Hover: `hover:underline`

### Organization Row

- Logo: 36px, rounded, fallback placeholder
- Name: `text-sm font-medium`, `hover:underline`
- External icon: `text-muted-foreground`, `hover:text-foreground`
- Location: `text-sm text-muted-foreground`
- Separator: `·` between name and location

### Info Tags

- Small pills: `text-xs px-2 py-1 rounded-full`
- Background: `bg-muted`
- Icon + label inline
- Linkable: `hover:bg-muted/80` cursor pointer

### Tech Tags

- Colored pills using `colorIndex` (1-12)
- `text-xs px-2 py-1 rounded-full`
- "+N more" as muted text

### Timestamp

- Position: bottom-right
- Style: `text-xs text-muted-foreground`

## Schema Updates

### Updated `jobListItemSchema.organization`

```ts
organization: z.nullable(
  z.object({
    name: nonEmptyStringSchema,
    href: nonEmptyStringSchema,           // Filter: /?organizations=org-name
    websiteUrl: nullableStringSchema,     // External link
    location: nullableStringSchema,
    logo: nullableStringSchema,
    employeeCount: nullableStringSchema,  // "50-100"
    fundingRounds: z.array(
      z.object({
        roundName: nonEmptyStringSchema,  // "Series B"
        amount: nullableStringSchema,     // "$25M"
        date: nullableStringSchema,       // "Jan 2024"
        href: nonEmptyStringSchema,       // /?fundingRounds=series-b
      }),
    ),
    investors: z.array(
      z.object({
        name: nonEmptyStringSchema,
        href: nonEmptyStringSchema,       // /?investors=a16z
      }),
    ),
  }),
),
```

### Info Tags with `href`

Info tags already support optional `href` via `mappedInfoTagSchema`. DTO mapping needs to populate `href` for filterable tags.

Linkable:

- Seniority, Location, Work mode, Commitment, Classification, Pays in Crypto, Token Allocation

Non-linkable:

- Salary (range value)

## Component Structure

```
src/features/jobs/components/job-list/job-list-item/
├── job-list-item.tsx           # Main card (server component)
├── job-list-item-badge.tsx     # Corner ribbon (server component)
├── job-list-item-org.tsx       # Org section with toggle (client component)
├── job-list-item-info-tags.tsx # Info tags row (server component)
└── job-list-item-tech-tags.tsx # Tech tags row (server component)
```

### Component Details

**JobListItem** (server component)

- Props: `JobListItemSchema`
- Assembles all sub-components
- Handles card layout and styling

**JobListItemBadge** (server component)

- Props: `badge: string | null`
- Renders corner ribbon if badge present
- Color based on badge type

**JobListItemOrg** (client component - needs toggle state)

- Props: organization object
- Collapsed: logo, name link, external icon, location, toggle button
- Expanded: adds employee count, funding rounds, investors

**JobListItemInfoTags** (server component)

- Props: `infoTags: MappedInfoTagSchema[]`
- Renders row of info tag pills
- Conditionally wraps in Link if `href` present

**JobListItemTechTags** (server component)

- Props: `tags: JobTagSchema[]`
- Shows first 3 tags with colors
- "+N more" indicator if additional tags

## Files to Modify

```
src/features/jobs/schemas.ts              # Update organization schema
src/features/jobs/server/dtos/
└── dto-to-job-list-item.ts               # Add hrefs, restructure org
src/features/jobs/components/job-list/
└── job-list.tsx                          # Use new JobListItem component
```

## Implementation Order

1. Update `schemas.ts` - new organization structure
2. Update `dto-to-job-list-item.ts` - add hrefs, restructure org mapping
3. Create `job-list-item-badge.tsx` - simplest, no dependencies
4. Create `job-list-item-tech-tags.tsx` - tag display + "+N more"
5. Create `job-list-item-info-tags.tsx` - conditional hrefs
6. Create `job-list-item-org.tsx` - client component with toggle
7. Create `job-list-item.tsx` - assembles all pieces
8. Update `job-list.tsx` - use new JobListItem component

## No Changes Needed

- `job-list-item.dto.ts` - already has all required data
- `job-list-pagination.tsx` - unchanged
