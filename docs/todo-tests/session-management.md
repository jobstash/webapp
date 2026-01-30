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
- [ ] `queryFn` calls GET first, then POST if no `apiToken` or session nearing expiry
- [ ] `queryFn` sends Privy token via `Authorization: Bearer` header in POST
- [ ] `queryFn` returns session data directly from POST response (no extra GET)
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
- [ ] Authenticated user sees profile content without flash of unauthenticated state
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
