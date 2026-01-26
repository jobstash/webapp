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
locations       → WorkModeIcon
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
├── suggested-filters/      # Quick-select suggested filters
└── more-filters/           # "More filters" dropdown for additional options
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

## Key Hooks

| Hook                       | Purpose                                 |
| -------------------------- | --------------------------------------- |
| `use-filter-query-state`   | Read/write filter values to URL params  |
| `use-active-filters`       | Get currently active filter configs     |
| `use-active-filter-labels` | Get human-readable active filter labels |
| `use-dropdown-label`       | Compute dropdown display label          |
