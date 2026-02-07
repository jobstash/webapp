# Jobs Feature

## Overview

Job listing with server-side rendering and URL-based pagination.

## Constants

```ts
// constants.ts
JOB_ITEM_BADGE = {
  FEATURED: 'Featured',
  URGENTLY_HIRING: 'Urgently Hiring',
  BEGINNER: 'Job for Web3 Beginners',
};

JOBS_PER_PAGE = 10;
```

## Data Flow

1. `server/data/fetch-job-list-page.ts` - Fetches paginated job list from API
2. `server/dtos/dto-to-job-list-page.ts` - Transforms response to app schema
3. `components/job-list/job-list.tsx` - Renders job cards

## Schemas

Defined in `schemas.ts`:

| Schema              | Purpose                                |
| ------------------- | -------------------------------------- |
| `jobTagSchema`      | Tag with colorIndex (1-12) for styling |
| `jobListItemSchema` | Single job card data                   |
| `jobListPageSchema` | Paginated response (page, total, data) |

## Components

```
components/
└── job-list/
    ├── job-list.tsx            # Main job list renderer
    └── job-list-pagination.tsx # Pagination controls
```

## Job Item Structure

Each job has:

- `title`, `summary`, `href`, `applyUrl`
- `organization` (name, logo, location, infoTags)
- `tags` (skills/technologies with colorIndex)
- `infoTags` (metadata like salary, commitment)
- `timestampText` (relative time)
- `badge` (Featured, Urgently Hiring, Beginner, or null)

## Job Match

Skill-based match scoring for authenticated users. Shows "Strong Match" / "Good Match" badges.

**Data flow:**

1. `useEligibility` → fetches session status (auth + `isExpert`)
2. `useProfileSkills` → fetches user skills
3. `useJobMatch` → calls `/api/jobs/match/[uuid]` with skills
4. API route reads `isExpert` from server session and forwards to backend

**Note:** `isExpert` affects backend scoring but is read server-side from session, not sent by the client. It must remain in the React Query key to invalidate cache when expert status changes.
