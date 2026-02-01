# onboarding-sync - Test Checklist

## Behaviors to Test

### Onboarding Sync (BFF Route)

- [ ] POST `/api/onboarding/sync` returns 401 when user has no session token
- [ ] POST `/api/onboarding/sync` returns 400 for invalid JSON body
- [ ] POST `/api/onboarding/sync` returns 400 when body fails schema validation
- [ ] POST `/api/onboarding/sync` sends skills to MW `/profile/skills` with Bearer token
- [ ] POST `/api/onboarding/sync` sends showcase entries to MW `/profile/showcase` with Bearer token
- [ ] POST `/api/onboarding/sync` skips skills sync when skills array is empty
- [ ] POST `/api/onboarding/sync` skips showcase sync when no socials, email, or resume provided
- [ ] POST `/api/onboarding/sync` returns partial success when one MW call fails and the other succeeds
- [ ] POST `/api/onboarding/sync` builds correct social URLs from handle (e.g. github handle → `https://github.com/<handle>`)
- [ ] POST `/api/onboarding/sync` includes CV showcase entry with correct resume URL when resume is provided
- [ ] POST `/api/onboarding/sync` includes email showcase entry when email is provided

### Onboarding Sync (Client Hook)

- [ ] `useOnboardingSync` starts in `idle` status
- [ ] `useOnboardingSync` transitions to `syncing` then `done` on successful sync
- [ ] `useOnboardingSync` skips sync and goes directly to `done` when no skills or resume data
- [ ] `useOnboardingSync` prevents duplicate sync calls via ref guard
- [ ] `useOnboardingSync` sets `done` status even when fetch throws an error
- [ ] `useOnboardingSync` fires GA `ONBOARDING_PROFILE_SYNCED` event with correct params

### Onboarding Flow Integration

- [ ] Completing onboarding with authenticated session triggers sync automatically
- [ ] Onboarding redirects to `/profile` after sync status becomes `done`
- [ ] Onboarding tracks `ONBOARDING_COMPLETED` GA event before syncing

### Suggested Skills

- [ ] `useSuggestedSkills` fetches popular tags from MW search endpoint
- [ ] `useSuggestedSkills` filters out already-selected skills by ID
- [ ] `useSuggestedSkills` maps tags to `UserSkill` with `colorIndex` and `isFromResume: false`

### Profile Skills (BFF Route)

- [ ] GET `/api/profile/skills` returns 401 when user has no session token
- [ ] GET `/api/profile/skills` proxies MW `/profile/skills` response with Bearer token
- [ ] GET `/api/profile/skills` returns 502 when MW connection fails
- [ ] GET `/api/profile/skills` returns 502 when MW returns invalid JSON
- [ ] GET `/api/profile/skills` forwards MW error status (4xx as-is, 5xx as 502)

### Profile Showcase (BFF Route)

- [ ] GET `/api/profile/showcase` returns 401 when user has no session token
- [ ] GET `/api/profile/showcase` proxies MW `/profile/showcase` response with Bearer token
- [ ] GET `/api/profile/showcase` returns 502 when MW connection fails
- [ ] GET `/api/profile/showcase` returns 502 when MW returns invalid JSON
- [ ] GET `/api/profile/showcase` forwards MW error status (4xx as-is, 5xx as 502)

### Profile Page (Debug Display)

- [ ] Profile page displays Skills section with raw JSON from `/api/profile/skills`
- [ ] Profile page displays Showcases section with raw JSON from `/api/profile/showcase`
- [ ] Profile page shows "Loading..." in Skills section while query is pending
- [ ] Profile page shows "Loading..." in Showcases section while query is pending
- [ ] Profile page shows error message in Skills section when fetch fails
- [ ] Profile page shows error message in Showcases section when fetch fails
- [ ] Skills and Showcases queries are only enabled after session is ready
