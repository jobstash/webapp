# profile-recommended-jobs - Test Checklist

## Behaviors to Test

### Suggested Jobs Card

- [ ] Card displays "Your Job Matches" heading when jobs are returned
- [ ] Card shows loading spinner while jobs are being fetched
- [ ] Card renders nothing when no jobs are returned and not loading
- [ ] Each job item opens in a new browser tab when clicked
- [ ] Job items display title, company name, company logo, and timestamp
- [ ] Company logo falls back to first letter initial when image fails to load
- [ ] Loading state and loaded state have the same fixed height (no layout shift)
- [ ] Scrollable area appears when job list exceeds container height
- [ ] Card only fetches suggested jobs when user has skills on their profile
- [ ] Card reuses cached profile skills (no duplicate `/api/profile/skills` request)

### API Route (`/api/profile/suggested-jobs`)

- [ ] Returns 401 when user is not authenticated
- [ ] Returns 400 when no skills query param is provided
- [ ] Returns jobs array when valid skills are provided
- [ ] Sanitizes skills input (trims whitespace, filters empty strings)
- [ ] Caps skills at MAX_MATCH_SKILLS (30) before forwarding to backend
- [ ] Reads `isExpert` from server session, not from client query params
- [ ] Returns 502 when backend connection fails
- [ ] Returns empty jobs array when backend response fails Zod validation

### Hook (`useSuggestedJobs`)

- [ ] Query is disabled when skills array is empty
- [ ] Query key includes both skills and isExpert for proper cache invalidation
- [ ] Uses `keepPreviousData` to prevent flash when skills change
- [ ] Caps skills at MAX_MATCH_SKILLS before sending to API

### SimilarJobItem (`target` prop)

- [ ] Renders with `LinkWithLoader` (client navigation) when no target is provided
- [ ] Renders with plain `Link` and `target="_blank"` when target prop is `_blank`
- [ ] Includes `rel="noopener noreferrer"` when target is `_blank`
- [ ] Fires analytics tracking event on click regardless of target mode

### Profile Sidebar Integration

- [ ] Suggested jobs card renders in profile sidebar below navigation
- [ ] Card appears on all profile tab routes (`/profile`, `/profile/accounts`, `/profile/settings`)
