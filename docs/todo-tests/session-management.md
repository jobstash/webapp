# session-management - Test Checklist

## API Route: POST /api/auth/session

- [ ] Returns 401 when no `Authorization` header is present
- [ ] Returns 401 when `Authorization` header contains an invalid/expired token
- [ ] Returns 502 when backend `/privy/check-wallet` returns a non-OK status
- [ ] Returns 502 when backend response fails Zod validation (missing or empty `token`)
- [ ] Returns 200 with `{ apiToken, expiresAt }` on successful token exchange
- [ ] Reads Privy token from `Authorization: Bearer <token>` header
- [ ] Stores `apiToken` in iron-session after successful exchange
- [ ] Stores `expiresAt` as ~55 minutes from current time in iron-session
- [ ] Sets `jobstash-session` cookie as HttpOnly and SameSite=Lax
- [ ] Sets `jobstash-session` cookie with `secure: true` only in production

## API Route: GET /api/auth/session

- [ ] Returns `{ apiToken: null, expiresAt: null }` when no session exists
- [ ] Returns `{ apiToken: "<token>", expiresAt: <timestamp> }` when session exists

## API Route: DELETE /api/auth/session

- [ ] Returns 200 with `{ ok: true }` after destroying session
- [ ] Clears the `jobstash-session` cookie after destroy

## AuthGuard (Server Component)

- [ ] Redirects to `/onboarding` when no iron-session `apiToken` exists
- [ ] Renders children when iron-session contains a valid `apiToken`
- [ ] Redirects to custom `fallbackUrl` when provided and user has no session

## useSession Hook

- [ ] Returns `isAuthenticated: false` when Privy is not ready or not authenticated
- [ ] Returns `isLoading: true` while session query is pending (initial fetch)
- [ ] Query is always enabled (`enabled: true`) — reads cookie without waiting for Privy
- [ ] Phase 1: `queryFn` calls GET to read iron-session cookie (no Privy dependency)
- [ ] Phase 1: Returns valid session immediately if `apiToken` exists and not expiring soon
- [ ] Phase 2: If token missing or expiring, attempts Privy token exchange only when `ready && authenticated`
- [ ] Phase 2: If Privy not ready, returns current session (if still valid) or `{ apiToken: null, expiresAt: null }`
- [ ] `queryFn` sends Privy token via `Authorization: Bearer` header in POST
- [ ] `queryFn` returns session data directly from POST response (no extra GET)
- [ ] Refetches when Privy becomes authenticated but session has no token (`useEffect`)
- [ ] Returns `isSessionReady: true` once `apiToken` is non-null
- [ ] Returns `apiToken` from the session query response
- [ ] `refetchInterval` schedules refetch 15 minutes before `expiresAt`
- [ ] `refetchInterval` returns `false` when no `expiresAt` (prevents unnecessary polling)
- [ ] Refetches session on window focus
- [ ] `logout()` calls DELETE then Privy logout then redirects to `/`
- [ ] `logout()` clears query data before Privy logout

## Profile Page Integration

- [ ] Profile page wraps content with `AuthGuard`
- [ ] Unauthenticated user visiting `/profile` is redirected to `/onboarding` server-side
- [ ] Authenticated user sees profile content immediately (cookie read, no Privy dependency)
- [ ] Profile page displays "Exchanging token..." while session is being created
- [ ] Profile page displays the API token once session is ready
- [ ] Logout button destroys session, logs out of Privy, and redirects to `/`

## Onboarding Flow Integration

- [ ] After Privy OAuth completes, session is created before redirecting to `/profile`
- [ ] Redirect to `/profile` only happens after `isSessionReady` is true
- [ ] Loading spinner shows during OAuth callback processing and session creation
- [ ] Onboarding step navigation still works correctly after session integration

## Environment & Configuration

- [ ] Server env validates `SESSION_SECRET` is at least 32 characters
- [ ] Server env validates `PRIVY_APP_ID` is non-empty
- [ ] Server env validates `PRIVY_APP_SECRET` is non-empty
- [ ] Build fails with clear error if any required server env var is missing

## Bugs / Issues Encountered

### Infinite spinner on /profile after OAuth navigation

**Symptom:** After completing Google OAuth on `/onboarding`, navigating to `/profile` shows an infinite spinner. `isAuthenticated` stays `false` and the session query never runs.

**Root cause:** `PrivyProvider` lives in route-specific layouts, not the root layout. When navigating from `/onboarding` to `/(main)/profile`, the provider remounts fresh (`ready=false`, `authenticated=false`). The session query had `enabled: isAuthenticated` which blocked it from running. `ProfileContent` also gated rendering on `!isAuthenticated`. Meanwhile, the iron-session cookie was valid (AuthGuard passed server-side), but the client ignored it.

```
RootLayout → RootProviders (ReactQueryProvider persists)
├── /onboarding → AuthProviders → PrivyProvider (Instance A, unmounts)
└── /(main)/profile → AuthProviders → PrivyProvider (Instance B, fresh)
```

**Fix (3 changes):**

1. `use-session.ts`: Changed `enabled: isAuthenticated` → `enabled: true`. The `queryFn` now reads the iron-session cookie first (Phase 1, no Privy dependency). Only attempts Privy token exchange (Phase 2) when Privy is ready. Added `useEffect` to refetch when Privy becomes authenticated but session has no token.
2. `use-session.ts`: Changed `isLoading: isAuthenticated && isPending` → `isLoading: isPending`.
3. `profile-content.tsx`: Changed `if (isLoading || !isAuthenticated)` → `if (isLoading)`. AuthGuard already guarantees authentication server-side.

**Files:** `src/features/auth/hooks/use-session.ts`, `src/features/profile/components/profile-content.tsx`
