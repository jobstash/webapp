# Pillar Filters - Test Checklist

## Layout

- Pillar page (`/t-typescript`, `/cl-devrel`, etc.) displays two-column layout on desktop
- Hero is full-width at top, filters sidebar and job list are below
- Filters sidebar is visible on the left, job list on the right
- Sidebar is hidden on mobile
- Hero has consistent height (no layout shift when navigating between home and pillar pages)
- Gap exists between hero separator line and the content below

## Filter Options (Static Filters)

- On `/cl-devrel`, the "Classifications" filter should NOT show "DevRel" as an option
- On `/co-fulltime`, the "Commitments" filter should NOT show "Full-time" as an option
- Other filter options remain available and selectable
- Boolean pillar pages (`/b-pays-in-crypto`) should hide their corresponding toggle

## Filter Options (Remote Search Filters)

- On `/t-typescript`, open the "Skills" filter dropdown
- Initial options should NOT include "TypeScript"
- Search for "typescript" - results should NOT include "TypeScript"
- Search for "react" - results should include "React" (other values still work)
- Same behavior applies to any remote search filter on its pillar page

## Job List

- Jobs on `/t-typescript` should all be TypeScript-related
- Adding additional filters (e.g., selecting "React" tag) narrows results to TypeScript + React jobs
- Pagination works correctly
- Job count reflects filtered results

## URL Redirect (redundant params)

- `/t-typescript?tags=typescript` redirects to `/t-typescript`
- `/t-typescript?tags=typescript,react` redirects to `/t-typescript?tags=react`
- `/t-typescript?tags=react` stays as-is (no redirect needed)
- `/t-typescript` with no params stays as-is

## Filter Interactions

- Selecting a filter on pillar page adds it to URL params
- Removing a filter removes it from URL params
- Active filters chip shows user-selected filters (not the implicit pillar filter)
- Clearing all filters returns to base pillar page (pillar filter still applied)
