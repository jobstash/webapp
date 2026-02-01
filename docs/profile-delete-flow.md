# Profile Delete Account Flow

## Overview

Authenticated users can permanently delete their account from the `/profile` page. The flow uses a confirmation dialog that freezes (uncloseable, submit disabled) during deletion to prevent accidental interruption. On success, the session is destroyed server-side and the user is logged out via a hard redirect to `/`.

## Architecture

```
Browser (Client)                   Next.js Server                    Backend API
────────────────                   ──────────────                    ───────────
  │                                       │                              │
  │ (1) Click "Delete account"            │                              │
  │     → Dialog opens                    │                              │
  │                                       │                              │
  │ (2) Click "Delete account" confirm    │                              │
  │     → Dialog freezes (isDeleting)     │                              │
  │                                       │                              │
  │ (3) POST /api/profile/delete          │                              │
  │ ─────────────────────────────────────>│                              │
  │                                       │ (4) Validate iron-session    │
  │                                       │     (apiToken + expiry)      │
  │                                       │                              │
  │                                       │ (5) POST /profile/delete     │
  │                                       │     Authorization: Bearer    │
  │                                       │ ─────────────────────────────>
  │                                       │                              │
  │                                       │ (6) { success, message }     │
  │                                       │ <─────────────────────────────
  │                                       │                              │
  │                                       │ (7) Destroy iron-session     │
  │ (8) Receives { success, message }     │     (if success)             │
  │ <─────────────────────────────────────│                              │
  │                                       │                              │
  │ (9) Call logout()                     │                              │
  │     → DELETE /api/auth/session        │                              │
  │     → Privy logout                    │                              │
  │     → window.location.href = '/'      │                              │
```

## Client-Side Flow

### 1. Dialog Component

`DeleteAccountDialog` renders a shadcn `Dialog` with confirmation UI. The dialog is controlled via `useDeleteAccountDialog` hook.

**Freeze behavior while deleting:**

| Element          | While `isDeleting`                       |
| ---------------- | ---------------------------------------- |
| Close (X) button | Hidden (`showCloseButton={!isDeleting}`) |
| Escape / overlay | Blocked (`onOpenChange` returns early)   |
| Cancel button    | Disabled                                 |
| Confirm button   | Disabled, shows "Deleting..."            |

### 2. Hook: `useDeleteAccountDialog`

Manages dialog state and the delete operation.

```
onConfirm()
  → setIsDeleting(true), setError(null)
  → POST /api/profile/delete
  → If error response:
      setError(message), setIsDeleting(false)  ← dialog unfreezes
  → If success:
      await logout()  ← dialog stays frozen until navigation
  → If network error (catch):
      setError(fallback), setIsDeleting(false)  ← dialog unfreezes
```

`isDeleting` is only reset to `false` on error paths. On success, the dialog stays frozen because `logout()` triggers `window.location.href = '/'` which navigates the browser away.

### 3. Error Message Resolution

The hook resolves error messages in priority order:

1. `data.error` (from Next.js route error responses)
2. `data.message` (from backend `messageResponseSchema`)
3. Fallback: `"Failed to delete account"`
4. Network errors: `"Something went wrong. Please try again."`

## Server-Side Flow

### API Route: `POST /api/profile/delete`

**Steps:**

1. Read iron-session
2. Validate `apiToken` exists and is not expired
3. If invalid: destroy session, return 401
4. Forward `POST` to backend `{MW_URL}/profile/delete` with `Authorization: Bearer {apiToken}`
5. Validate response with `messageResponseSchema` (`{ success: boolean, message: string }`)
6. If `success: true`: destroy iron-session (clear cookie)
7. Return parsed response to client

**Response codes:**

| Status | Body                                 | When                                      |
| ------ | ------------------------------------ | ----------------------------------------- |
| 200    | `{ success: true, message: "..." }`  | Account deleted                           |
| 200    | `{ success: false, message: "..." }` | Backend refused (business logic)          |
| 401    | `{ error: "Not authenticated" }`     | No session or expired token               |
| 4xx    | `{ error: "Delete request failed" }` | Backend 4xx error                         |
| 502    | `{ error: "..." }`                   | Backend unreachable, 5xx, or bad response |

## File Reference

| File                                                           | Purpose                                      |
| -------------------------------------------------------------- | -------------------------------------------- |
| `src/features/profile/components/delete-account-dialog.tsx`    | Dialog UI component                          |
| `src/features/profile/components/use-delete-account-dialog.ts` | Dialog state + delete logic                  |
| `src/app/api/profile/delete/route.ts`                          | Server-side delete route handler             |
| `src/features/profile/components/profile-content.tsx`          | Profile page (renders dialog in Danger Zone) |
| `src/features/auth/hooks/use-session.ts`                       | Provides `logout()` passed to dialog         |
| `src/lib/schemas.ts`                                           | `messageResponseSchema` (shared schema)      |
| `src/lib/server/session.ts`                                    | iron-session config (`getSession`)           |
