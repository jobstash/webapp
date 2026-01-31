# Authentication & Session Management

## Overview

JobStash uses [Privy](https://privy.io) for authentication and **iron-session** for server-side session management. Privy stores tokens in **localStorage** (HttpOnly cookies are OFF in the Privy Dashboard). After a user authenticates with Privy, the client sends the Privy access token via `Authorization: Bearer` header to the Next.js server, which exchanges it for a backend API token and stores it in an encrypted iron-session cookie.

## Architecture

```
Browser                          Next.js Server                    Backend API
──────                          ──────────────                    ───────────
  │                                    │                              │
  │ (1) Login via Privy               │                              │
  │ ─── token stored in localStorage ─│                              │
  │                                    │                              │
  │ (2) GET /api/auth/session         │                              │
  │ ──────────────────────────────────>│                              │
  │                                    │ (3) No active session        │
  │ (4) Receives { apiToken: null }   │                              │
  │ <──────────────────────────────────│                              │
  │                                    │                              │
  │ (5) POST /api/auth/session        │                              │
  │     Authorization: Bearer <token> │                              │
  │ ──────────────────────────────────>│                              │
  │                                    │ (6) Read Authorization header│
  │                                    │     Verify with Privy        │
  │                                    │     Call /privy/check-wallet │
  │                                    │ ─────────────────────────────>
  │                                    │                              │
  │                                    │ (7) Receive API token        │
  │                                    │ <─────────────────────────────
  │                                    │                              │
  │                                    │ (8) Store in iron-session    │
  │ (9) Receives { apiToken, expiry } │     (encrypted cookie)       │
  │ <──────────────────────────────────│                              │
  │                                    │                              │
  │ (10) Any page request             │                              │
  │ ──────────────────────────────────>│                              │
  │                                    │ (11) Read iron-session cookie│
  │                                    │      → API token available   │
  │                                    │      server-side             │
```

Steps 2–4 and 5–9 happen inside a single React Query `queryFn`. The client sends the Privy token via `Authorization` header — obtained from `getAccessToken()` which reads from localStorage.

## Token Architecture

| Token                   | Issuer              | Lifetime | Storage                             | Purpose                              |
| ----------------------- | ------------------- | -------- | ----------------------------------- | ------------------------------------ |
| **Privy Access Token**  | Privy               | 1 hour   | localStorage (Privy SDK)            | Proves user authenticated with Privy |
| **Privy Refresh Token** | Privy               | 30 days  | localStorage (Privy SDK)            | Renews expired access tokens         |
| **API Token**           | JobStash Middleware | ~1 hour  | `jobstash-session` encrypted cookie | Authenticated backend API requests   |

### Cookie Summary

| Cookie             | Set By       | HttpOnly | Secure (prod) | SameSite | MaxAge |
| ------------------ | ------------ | -------- | ------------- | -------- | ------ |
| `jobstash-session` | iron-session | Yes      | Yes           | Lax      | 1 hour |

This is the only cookie we manage. Privy tokens live in localStorage.

## Authentication Flow

### 1. User Login (Onboarding)

```
/onboarding → User clicks "Continue with Google"
            → Privy SDK initiates OAuth flow
            → Google consent screen
            → Redirect back with privy_oauth_code & privy_oauth_state
            → Privy SDK processes OAuth code exchange
            → authenticated = true, token stored in localStorage
            → useSession queryFn creates iron-session via POST
            → isSessionReady = true → redirect to /profile
```

**Implementation:** `src/features/onboarding/components/use-onboarding-content.ts`

The onboarding page shows a loading spinner during:

1. Privy SDK initializing (`!ready`)
2. OAuth hook processing (`isOAuthLoading`)
3. Once `ready && authenticated && isSessionReady` → redirect to `/profile`

### 2. Server-Side Token Exchange

The token exchange happens on the server via `POST /api/auth/session`:

```
Client: POST /api/auth/session
        Authorization: Bearer <privy-access-token>

Server: 1. Read token from Authorization header
        2. Verify token with @privy-io/server-auth
        3. GET {MW_URL}/privy/check-wallet (Bearer {privyToken})
        4. Receive { token: "<api-token>" }
        5. Store in iron-session: { apiToken, expiresAt }
        6. Set jobstash-session encrypted cookie

Client: Receives 200 { apiToken, expiresAt }
```

**Implementation:** `src/app/api/auth/session/route.ts`

### 3. Session Management (Client)

The `useSession` hook manages the full session lifecycle with a single React Query `useQuery`:

```ts
const { apiToken, isAuthenticated, isSessionReady, isLoading, logout } =
  useSession();
```

| Return Value      | Type             | Description                                       |
| ----------------- | ---------------- | ------------------------------------------------- |
| `apiToken`        | `string \| null` | Backend API token (from session query)            |
| `isAuthenticated` | `boolean`        | Privy `ready && authenticated`                    |
| `isSessionReady`  | `boolean`        | `apiToken !== null`                               |
| `isLoading`       | `boolean`        | `isAuthenticated && isPending`                    |
| `logout`          | `() => Promise`  | Destroys session → Privy logout → redirect to `/` |

**Implementation:** `src/features/auth/hooks/use-session.ts`

The hook uses zero `useEffect`s and zero mutations. The `queryFn` handles both fetching and creating:

1. `GET /api/auth/session` — check for existing session
2. If no `apiToken` or nearing expiry → call `getAccessToken()` for fresh Privy token → `POST /api/auth/session` with `Authorization: Bearer` header
3. Returns the session data directly from the POST response

Proactive refresh is handled by `refetchInterval`, which schedules a refetch 15 minutes before `expiresAt`. On refetch, the `queryFn` detects the session is nearing expiry and re-creates it via POST.

### 4. Server-Side Auth Guard

Protected pages use the `AuthGuard` server component:

```tsx
// src/app/(main)/profile/page.tsx
export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
```

**Logic:** Checks the iron-session for an `apiToken`. If no session exists, redirects to `/onboarding` before any page content is sent to the browser.

**Implementation:** `src/features/auth/components/auth-guard.tsx`

### 5. Token Refresh Strategy

| Event                            | What Happens                                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Session nearing expiry**       | `refetchInterval` triggers refetch; `queryFn` detects expiry → `getAccessToken()` → POST new session |
| **Privy token nearing expiry**   | `getAccessToken()` auto-refreshes using localStorage refresh token (Privy SDK handles this)          |
| **Page refresh**                 | iron-session cookie persists → GET returns existing session → no POST needed                         |
| **Session expired, Privy valid** | `queryFn` detects `apiToken === null` → `getAccessToken()` → POST creates new session                |
| **Window regains focus**         | Session query refetches (`refetchOnWindowFocus: true`); `queryFn` creates if needed                  |
| **User returns after >30 days**  | Privy refresh token expired; `getAccessToken()` returns null → user stays on onboarding              |

### 6. Logout

```
useSession.logout()
  → DELETE /api/auth/session  (destroys iron-session, clears jobstash-session cookie)
  → Privy SDK logout           (clears localStorage tokens)
  → window.location.href = '/' (hard redirect clears all client state)
```

## Session API Endpoints

| Method   | Path                | Purpose                               | Auth Required        |
| -------- | ------------------- | ------------------------------------- | -------------------- |
| `POST`   | `/api/auth/session` | Exchange Privy token → API token      | Authorization header |
| `GET`    | `/api/auth/session` | Check session status (token + expiry) | None                 |
| `DELETE` | `/api/auth/session` | Destroy session (logout)              | None                 |

### POST Response Codes

| Status | Body                                 | When                                 |
| ------ | ------------------------------------ | ------------------------------------ |
| 200    | `{ apiToken, expiresAt }`            | Session created successfully         |
| 401    | `{ error: "No Privy token" }`        | Authorization header missing         |
| 401    | `{ error: "Invalid Privy token" }`   | Token verification failed            |
| 502    | `{ error: "Token exchange failed" }` | Backend `/privy/check-wallet` failed |

## React Query Configuration

```ts
// Session query
{
  queryKey: ['session'],
  queryFn: fetchOrCreateSession,  // GET → conditional POST
  enabled: ready && authenticated,
  staleTime: 5 * 60 * 1000,       // 5 min
  refetchOnWindowFocus: true,
  refetchInterval: (query) => {    // dynamic — schedules refetch before expiry
    const expiresAt = query.state.data?.expiresAt;
    if (!expiresAt) return false;
    const delay = expiresAt - REFRESH_BUFFER - Date.now();
    return delay > 0 ? delay : 1000;
  },
}

// Constants
STALE_TIME     = 5 * 60 * 1000   // 5 min
REFRESH_BUFFER = 15 * 60 * 1000  // Refresh 15 min before expiry
SESSION_EXPIRY = 55 * 60 * 1000  // 55 min (safety margin under 1hr TTL)
```

## Token Lifecycle

| Token                        | Lifetime | Refresh Mechanism                                                                                                                                                                                        |
| ---------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Privy access token**       | 1 hour   | `getAccessToken()` auto-refreshes using localStorage refresh token (Privy SDK handles this transparently)                                                                                                |
| **API token** (iron-session) | 55 min   | `refetchInterval` in useSession schedules React Query refetch 15 min before `expiresAt`. queryFn detects expiring session → calls `getAccessToken()` (fresh Privy token) → POST creates new iron-session |

## Environment Variables

| Variable                   | Side          | Purpose                                     |
| -------------------------- | ------------- | ------------------------------------------- |
| `NEXT_PUBLIC_FRONTEND_URL` | Client+Server | Frontend URL                                |
| `NEXT_PUBLIC_MW_URL`       | Client+Server | Backend middleware URL                      |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Client+Server | Privy app ID for the SDK                    |
| `PRIVY_APP_ID`             | Server only   | Same value, used by `@privy-io/server-auth` |
| `PRIVY_APP_SECRET`         | Server only   | From Privy Dashboard > App Settings         |
| `SESSION_SECRET`           | Server only   | iron-session encryption key (min 32 chars)  |

## File Reference

| File                                                           | Purpose                                                     |
| -------------------------------------------------------------- | ----------------------------------------------------------- |
| `src/lib/env/server.ts`                                        | Server env validation (Zod)                                 |
| `src/lib/env/client.ts`                                        | Client env (FRONTEND_URL, MW_URL, PRIVY_APP_ID)             |
| `src/lib/server/session.ts`                                    | iron-session config (`getSession`, `SessionData`)           |
| `src/lib/server/privy.ts`                                      | Privy server utils (`verifyPrivyToken`)                     |
| `src/app/api/auth/session/route.ts`                            | Session API route (POST/GET/DELETE)                         |
| `src/features/auth/components/auth-guard.tsx`                  | Server-side auth guard (iron-session check)                 |
| `src/features/auth/hooks/use-session.ts`                       | Client-side session hook (queryFn handles create + refresh) |
| `src/features/onboarding/components/use-onboarding-content.ts` | Login flow + session-aware redirect                         |
| `src/features/profile/components/use-profile-content.ts`       | Profile page orchestration via `useSession`                 |
| `src/features/profile/components/profile-content.tsx`          | Profile page UI                                             |
| `src/components/providers/privy-provider.tsx`                  | PrivyProvider configuration                                 |

## Extending to Other Features

When other features need authenticated API access:

```ts
import { useSession } from '@/features/auth/hooks/use-session';

const { apiToken, isSessionReady } = useSession();
```

For server-side access (Server Components, Route Handlers):

```ts
import { getSession } from '@/lib/server/session';

const session = await getSession();
const apiToken = session.apiToken; // null if no active session
```

React Query deduplicates — multiple components using `useSession` share the same `['session']` query.

## Unauthenticated Endpoints

The resume parse endpoint (`POST /api/onboarding/resume/parse`) does **not** use Privy authentication — users may not be logged in during onboarding when they upload a resume.

**Protection:**

- Origin check — validates `Origin`/`Referer` against `FRONTEND_URL`
- Upstash IP-based rate limiting — 5 requests per 15 minutes per IP (sliding window)

**Reference:** `src/lib/server/guards/rate-limit-guard.ts`
