# Google Analytics 4 Integration

GA4 event tracking for the JobStash webapp, covering the full job discovery funnel.

## Setup

### 1. Environment Variable

Add the GA4 measurement ID to your environment:

```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The variable is **optional**. When unset, the GA script does not load and all `trackEvent` calls no-op. Development works without it.

### 2. GA4 Property Configuration

In the [Google Analytics console](https://analytics.google.com):

1. Create a GA4 property for "JobStash"
2. Create a Web data stream pointing to the production domain
3. Enable **Enhanced Measurement** (page views are handled automatically via browser history events)
4. Create **Custom Dimensions** (Event-scoped):

| Dimension           | Type   | Description                          |
| ------------------- | ------ | ------------------------------------ |
| `job_id`            | Text   | Job identifier                       |
| `job_title`         | Text   | Job title                            |
| `organization`      | Text   | Hiring organization                  |
| `filter_name`       | Text   | Filter paramKey                      |
| `filter_value`      | Text   | Selected filter value                |
| `filter_type`       | Text   | Filter kind (SWITCH, CHECKBOX, etc.) |
| `pillar_slug`       | Text   | Pillar page slug                     |
| `pillar_category`   | Text   | Pillar category                      |
| `login_method`      | Text   | Auth method (wallet, github, etc.)   |
| `apply_destination` | Text   | External apply URL domain            |
| `search_query`      | Text   | Search query text                    |
| `page_number`       | Number | Pagination page                      |
| `source`            | Text   | UI location (hero, sidebar, etc.)    |
| `step_number`       | Number | Onboarding step index                |
| `step_name`         | Text   | Onboarding step name                 |

5. Mark **Key Events** (conversions):
   - `apply_button_clicked`
   - `login_completed`
   - `onboarding_completed`

6. Recommended explorations:
   - **Funnel**: Discovery → Job Details → Apply Click
   - **Segments**: Authenticated vs Anonymous, Filter Users vs Direct

## Architecture

### Package

[`@next/third-parties/google`](https://nextjs.org/docs/app/api-reference/components/google-analytics) — loads `gtag.js` asynchronously after hydration with zero bundle impact.

### Files

```
src/lib/analytics/
├── constants.ts   # GA_EVENT names + GaEventParams type map
├── track.ts       # trackEvent() wrapper around sendGAEvent
└── index.ts       # Barrel export
```

### How It Works

1. `<GoogleAnalytics>` in `src/app/layout.tsx` loads the gtag script (conditional on env var)
2. Components import `trackEvent` and `GA_EVENT` from `@/lib/analytics`
3. `trackEvent` is type-safe — TypeScript enforces correct params per event
4. SSR-safe — no-ops when `window` is undefined

### Usage

```typescript
import { GA_EVENT, trackEvent } from '@/lib/analytics';

trackEvent(GA_EVENT.JOB_CARD_CLICKED, {
  job_id: '123',
  job_title: 'Senior Solidity Engineer',
  organization: 'Ethereum Foundation',
});
```

## Tracked Events

### Discovery

| Event                      | Trigger                       | Key Params                                            |
| -------------------------- | ----------------------------- | ----------------------------------------------------- |
| `filter_applied`           | Filter value set/changed      | filter_name, filter_value, filter_type, analytics_id? |
| `filter_removed`           | Filter cleared                | filter_name                                           |
| `search_query`             | Search suggestion selected    | search_query                                          |
| `pillar_clicked`           | Pillar chip/link clicked      | pillar_slug, pillar_category, source                  |
| `suggested_filter_applied` | Suggested filter chip clicked | filter_name                                           |

### Browsing

| Event                | Trigger               | Key Params                      |
| -------------------- | --------------------- | ------------------------------- |
| `job_card_clicked`   | Job list item clicked | job_id, job_title, organization |
| `pagination_clicked` | Page number changed   | page_number                     |

### Interest

| Event                 | Trigger                  | Key Params     |
| --------------------- | ------------------------ | -------------- |
| `similar_job_clicked` | Similar job link clicked | job_id, source |

### Conversion

| Event                  | Trigger              | Key Params                                          |
| ---------------------- | -------------------- | --------------------------------------------------- |
| `apply_button_clicked` | Apply button clicked | job_id, job_title, organization, apply_destination? |

### Auth & Onboarding

| Event                    | Trigger                | Key Params             |
| ------------------------ | ---------------------- | ---------------------- |
| `login_started`          | Auth button clicked    | login_method           |
| `login_completed`        | OAuth success callback | login_method           |
| `onboarding_step_viewed` | Onboarding step shown  | step_number, step_name |
| `onboarding_completed`   | Onboarding finished    | (none)                 |

### Navigation

| Event                   | Trigger                           | Key Params          |
| ----------------------- | --------------------------------- | ------------------- |
| `hero_cta_clicked`      | "Browse Jobs" or "Post a Job" CTA | source              |
| `external_link_clicked` | Footer social link clicked        | destination, source |

## Where Events Are Fired

| Area            | Files Modified                                                                                                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Apply button    | `features/jobs/components/job-details/apply-button.tsx`                                                                                                                                                     |
| Filters         | `features/filters/hooks/use-filter-query-state.ts`, `use-range-filter-state.ts`, 5 suggested-filter components                                                                                              |
| Job browsing    | `features/jobs/components/job-list/job-list-item/job-list-item.tsx`, `job-list-pagination.tsx`, `job-details/similar-job-item.tsx`                                                                          |
| Search          | `features/search/components/search-header/search-header.client.tsx`                                                                                                                                         |
| Pillar nav      | `features/home/components/hero-section/hero-section.tsx`, `features/pillar/components/suggested-pillars.tsx`, `components/browse-jobs-button.tsx`, `features/pillar/components/pillar-hero/pillar-hero.tsx` |
| Auth/onboarding | `features/onboarding/components/use-auth-buttons.ts`, `use-onboarding-content.ts`                                                                                                                           |
| Header/footer   | `components/app-header/header-auth-button.tsx`, `components/app-footer/footer-socials.tsx`                                                                                                                  |

## Adding a New Event

1. Add the event name to `GA_EVENT` in `src/lib/analytics/constants.ts`
2. Add the params type to `GaEventParams` in the same file
3. Call `trackEvent(GA_EVENT.YOUR_EVENT, { ... })` in the relevant component

TypeScript will enforce the correct params at the call site.

## Notes

- **Page views** are tracked automatically by GA4 Enhanced Measurement (browser history events). No manual page view tracking is needed.
- **Suggested filter clicks** fire both `suggested_filter_applied` (source identification) and `filter_applied` (unified filter tracking).
- **Range filter removal** fires two `filter_removed` events (one per URL param) since range filters use two params (lowest/highest).
- **Expert job apply** is not tracked — the expert variant shows a job alert CTA, not a real apply action.
- **Search tracking** only fires on suggestion selection, not on keystrokes.
