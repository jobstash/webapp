# Filters Feature

## Filter Kinds

Defined in `constants.ts`:

| Kind            | UI Component    | Description                            |
| --------------- | --------------- | -------------------------------------- |
| `SORT`          | Select dropdown | Order by field (e.g., date, salary)    |
| `SWITCH`        | Toggle switch   | Boolean on/off (e.g., onboardIntoWeb3) |
| `RADIO`         | Radio group     | Single select from options             |
| `CHECKBOX`      | Checkbox group  | Multi-select from options              |
| `SEARCH`        | Combobox        | Searchable select with local options   |
| `REMOTE_SEARCH` | Combobox + API  | Searchable select fetching from API    |

## Icon Mapping

`components/filter-icon-map.tsx` maps `paramKey` to icons:

```
workModes       → WorkModeIcon
seniority       → SeniorityIcon
tags            → CodeXmlIcon
publicationDate → CalendarDaysIcon
classifications → CategoryIcon
commitments     → CommitmentIcon
minSalaryRange  → SalaryIcon
...
```

To add a new filter icon: add entry to `filterIconMap` object.

## Component Hierarchy

```
filters-aside/              # Sidebar container
├── active-filters/         # Currently applied filters (removable chips)
├── suggested-filters/      # All unapplied filters, organized by group
└── filter-overlay.tsx      # Screen-bounded option lists; kept inside mobile drawer
```

### Suspense Pattern

`filters-aside/` uses the boundary pattern for streaming:

- `filters-aside.tsx` - Suspense/ErrorBoundary wrapper
- `filters-aside.client.tsx` - Client interactive logic
- `filters-aside.skeleton.tsx` - Loading skeleton

## Remote Filters

Remote filters fetch options from API instead of using static options.

```ts
// constants.ts
export const REMOTE_FILTERS = {
  tags: `${clientEnv.MW_URL}/tags/search`,
};
```

Check if a filter is remote: `utils/check-is-remote-filter.ts`

## Data Flow

1. `server/data/fetch-filter-configs.ts` - Fetches filter configs from API
2. `server/dtos/dto-to-filter-config.ts` - Transforms DTO to app schema
3. `hooks/use-filter-query-state.ts` - Manages filter state in URL params
4. Components render based on `kind` discriminator

### Organization classifications on the homepage

The homepage hero uses the `organizationClassifications` options returned by
`/jobs/filters`, including labels, rather than a second frontend taxonomy.
The canonical values are `ai`, `crypto`, `fintech`, `robotics`, `banking`,
`tech` (displayed as Web2), `out_of_scope`, and `unclassified`. These are
organization/project verticals, not the job-role `classifications` filter.
Selections are ORed within this filter and ANDed with other filters.
The hero promotes the six business classifications; Out of scope and
Unclassified remain available in the full filter panel rather than as CTAs.

Hero buttons use the same CSV query-state hook as active filters: selecting or
removing a classification preserves other filters and resets pagination.
The company filter group exposes the same options on desktop and mobile.
Urgently Hiring, Crypto Beginner Jobs, and Fully Remote Jobs remain canonical
pillar links in the hero discovery tags, including on mobile.

The homepage recommendation link uses the existing eligibility and LoginLink
flow: signed-out visitors see “Sign in to get job recommendations” and return
to `/profile/jobs` after sign-in; signed-in visitors see “Jobs for me”.
Pillar-page CTA variants retain their existing behavior.

## Key Hooks

| Hook                       | Purpose                                 |
| -------------------------- | --------------------------------------- |
| `use-filter-query-state`   | Read/write filter values to URL params  |
| `use-active-filters`       | Get currently active filter configs     |
| `use-active-filter-labels` | Get human-readable active filter labels |
| `use-dropdown-label`       | Compute dropdown display label          |
