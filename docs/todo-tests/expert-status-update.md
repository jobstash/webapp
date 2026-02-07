# expert-status-update - Test Checklist

## Behaviors to Test

### Session & Authentication

- [ ] GET `/api/auth/session` returns `isExpert` field alongside `apiToken` and `expiresAt`
- [ ] POST `/api/auth/session` maps backend `cryptoNative` to `isExpert` in iron-session
- [ ] Session expiry clears `isExpert` to `null` along with other fields
- [ ] `useSession` hook exposes `isExpert` from session response
- [ ] `useEligibility` hook returns `isExpert` from lightweight session check

### Job Match API Route

- [ ] GET `/api/jobs/match/:uuid` returns 401 when no session exists
- [ ] GET `/api/jobs/match/:uuid` returns 400 when no skills query param provided
- [ ] GET `/api/jobs/match/:uuid` passes skills and isExpert to backend
- [ ] GET `/api/jobs/match/:uuid` truncates skills list to MAX_MATCH_SKILLS (30)
- [ ] GET `/api/jobs/match/:uuid` returns parsed score and category from backend
- [ ] GET `/api/jobs/match/:uuid` forwards cache-control headers from backend response
- [ ] GET `/api/jobs/match/:uuid` returns 502 for invalid backend responses

### useJobMatch Hook

- [ ] Fetches eligibility status via `useEligibility`
- [ ] Fetches profile skills when authenticated
- [ ] Calls job match API with sorted, truncated skills and isExpert flag
- [ ] Returns `isLoading: true` while auth, skills, or match data is pending
- [ ] Returns `match: null` when user has no skills
- [ ] Returns match data with score and category on success
- [ ] Does not fetch match when user is not authenticated
- [ ] Does not fetch match when skills list is empty

### useProfileSkills Hook

- [ ] Fetches from `/api/profile/skills` and parses response with Zod schema
- [ ] Returns array of `ProfileSkill` objects with id, name, normalizedName
- [ ] Only fetches when `enabled` is true
- [ ] Uses 5-minute stale time for caching

### EligibilityCta Component

- [ ] Shows "Check eligibility" link to `/onboarding` when user is not authenticated
- [ ] Shows skeleton loader while authentication or match data is loading
- [ ] Shows "Strong Match" badge with emerald styling for `strong_fit` category
- [ ] Shows "Good Match" badge with sky-blue styling for `partial_fit` category
- [ ] Shows tooltip with contextual message on match badge hover
- [ ] Renders nothing when match has unrecognized category
- [ ] Renders nothing when authenticated but no match data returned
- [ ] Is lazy-loaded with `next/dynamic` and SSR disabled

### Job List Item Integration

- [ ] EligibilityCta appears next to "Urgently Hiring" badge
- [ ] EligibilityCta receives `jobId` prop from job list item
- [ ] EligibilityCta does not appear for non-"Urgently Hiring" badges

### Header Auth Button

- [ ] Shows "Get Hired Now" CTA linking to `/onboarding` when not authenticated
- [ ] Shows "My Profile" CTA linking to `/profile` when authenticated
- [ ] Renders nothing while eligibility is loading
