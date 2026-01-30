# Privy Authentication Flow

## Overview

JobStash uses [Privy](https://privy.io) as the authentication provider. After a user authenticates with Privy, the frontend exchanges the Privy access token for an API token from the JobStash middleware server. This API token is then used for authenticated API requests.

## Token Architecture

```
User → Privy SDK → Privy Access Token → Middleware API → API Token → Authenticated Requests
```

### Three Tokens in Play

| Token                   | Issuer              | Lifetime          | Storage                       | Purpose                                       |
| ----------------------- | ------------------- | ----------------- | ----------------------------- | --------------------------------------------- |
| **Privy Access Token**  | Privy               | 1 hour            | localStorage                  | Proves user authenticated with Privy          |
| **Privy Refresh Token** | Privy               | 30 days           | Managed by Privy SDK          | Renews expired access tokens                  |
| **API Token**           | JobStash Middleware | Longer than Privy | React Query cache (in-memory) | Session token for authenticated API endpoints |

## Authentication Flow

### 1. User Login (Onboarding)

```
/onboarding → User clicks "Continue with Google"
            → Privy SDK initiates OAuth flow
            → Google consent screen
            → Redirect back with privy_oauth_code & privy_oauth_state
            → Privy SDK processes OAuth code exchange
            → authenticated = true, user object populated
            → Redirect to /profile
```

**Implementation:** `src/features/onboarding/components/use-onboarding-content.ts`

The onboarding page detects the OAuth redirect via URL parameters and shows a loading spinner during the three-phase timing gap:

- Phase 1: Privy SDK initializing (`!ready`)
- Phase 2: SDK ready, OAuth hook idle (`hasOAuthParams` covers the gap)
- Phase 3: OAuth hook processing (`isOAuthLoading`)
- Phase 4: Authenticated → redirect to `/profile`

### 2. API Token Exchange

Once authenticated, the frontend exchanges the Privy access token for an API token:

```
GET {MW_URL}/privy/check-wallet
Headers: Authorization: Bearer {privyAccessToken}
Response: { token: string, ... }
```

**Implementation:** `src/features/profile/components/use-api-token.ts`

The `useApiToken` hook uses React Query to manage this exchange:

```ts
const { apiToken, isPending, isError, error } = useApiToken();
```

- **`getAccessToken()`** from Privy auto-refreshes the Privy token if expired
- React Query caches the API token with a 50-minute stale time
- One retry on failure (covers the edge case where the Privy token expires mid-request)

### 3. Authenticated API Requests

The API token is included as a Bearer token in requests to middleware endpoints that require a session:

```ts
fetch(`${MW_URL}/some/endpoint`, {
  headers: { Authorization: `Bearer ${apiToken}` },
});
```

### 4. Token Refresh Strategy

| Event                           | What Happens                                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Privy token nearing expiry**  | `getAccessToken()` auto-refreshes via the refresh token (Privy SDK handles this internally)                                  |
| **API token stale (>50min)**    | React Query refetches in background on next access; `getAccessToken()` provides a fresh Privy token                          |
| **Page refresh**                | React Query cache is lost; hook re-runs; `getAccessToken()` restores Privy session from storage; exchanges for new API token |
| **User returns after >1hr**     | Privy refresh token (30-day lifetime) restores the session; fresh Privy token → fresh API token exchange                     |
| **User returns after >30 days** | Privy refresh token expired; `authenticated = false`; redirected to `/onboarding`                                            |

### 5. Logout

```ts
await logout(); // Privy clears session
router.replace('/'); // Navigate to home
```

React Query stops serving the `['api-token']` query when `enabled` becomes `false` (after `authenticated` changes to `false`).

## Auth Guard Pattern

Protected pages use a simple auth guard effect:

```ts
useEffect(() => {
  if (ready && !authenticated) {
    router.replace('/onboarding');
  }
}, [ready, authenticated, router]);
```

- Uses `authenticated` from `usePrivy()` — a synchronous boolean derived from Privy's internal session state
- Does NOT use `getAccessToken()` for redirect decisions (it's async)

## Known Issues

### Auth Guard + Page Refresh Race Condition

**What happens:** On a full page refresh, `authenticated` is briefly `false` while the Privy SDK restores the session from localStorage. The auth guard fires `ready && !authenticated` before the SDK finishes restoring, which could cause a flash redirect to `/onboarding`.

**Why:** The Privy SDK sets `ready = true` before it has fully restored the session from storage. During this window, `authenticated` is `false` even though the user has a valid session.

**Current behavior:** Works fine in practice because Privy restores from localStorage fast enough that the race window is imperceptible. Users don't experience a flash redirect.

**Future risk:** If HttpOnly cookies are enabled in production, the session restore becomes asynchronous (requires a network round-trip to verify the cookie). This widens the race window significantly, making the flash redirect noticeable.

**Privy's prescribed fix:** Implement a Next.js middleware + `/refresh` page pattern that checks `privy-token` and `privy-session` cookies server-side before the page renders. Reference: https://docs.privy.io/recipes/react/cookies

## File Reference

| File                                                           | Purpose                                      |
| -------------------------------------------------------------- | -------------------------------------------- |
| `src/components/providers/privy-provider.tsx`                  | PrivyProvider configuration                  |
| `src/features/onboarding/components/use-onboarding-content.ts` | Login flow + redirect to /profile            |
| `src/features/onboarding/components/use-auth-buttons.ts`       | OAuth button handlers                        |
| `src/features/profile/components/use-api-token.ts`             | React Query hook for API token exchange      |
| `src/features/profile/components/use-profile-content.ts`       | Auth guard + page orchestration              |
| `src/features/profile/components/profile-content.tsx`          | Profile page UI                              |
| `src/lib/env/client.ts`                                        | Environment variables (MW_URL, PRIVY_APP_ID) |

## React Query Configuration for API Token

```ts
{
  queryKey: ['api-token'],
  enabled: ready && authenticated,
  staleTime: 50 * 60 * 1000,   // 50 min — refetch before Privy's 1hr expiry
  gcTime: 60 * 60 * 1000,      // 1hr — keep in cache when component unmounts
  retry: 1,                     // 1 retry — covers Privy token expiry edge case
  refetchOnWindowFocus: false,  // staleTime handles freshness
  throwOnError: false,          // inline error handling in component
}
```

## Extending to Other Features

When other features need the API token:

1. Move `use-api-token.ts` to `src/hooks/use-api-token.ts`
2. Update imports to `@/hooks/use-api-token`
3. Use in any authenticated component:

```ts
const { apiToken, isPending, isError } = useApiToken();
```

React Query deduplicates — multiple components sharing the `['api-token']` query key fetch once and share the cached result.
