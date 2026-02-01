# profile-delete-account - Test Checklist

## Behaviors to Test

### Profile Page - Danger Zone

- [ ] Displays "Danger Zone" section with delete account description
- [ ] Renders "Delete account" button in the danger zone section
- [ ] Shows loading state when session is loading

### Delete Account Dialog

- [ ] Opens confirmation dialog when "Delete account" button is clicked
- [ ] Displays warning that action is permanent and cannot be undone
- [ ] Shows "Cancel" and "Delete account" buttons in the dialog footer
- [ ] Closes dialog when "Cancel" is clicked
- [ ] Clears error state when dialog is closed and reopened
- [ ] Prevents dialog from closing while deletion is in progress
- [ ] Hides close button while deletion is in progress
- [ ] Disables "Cancel" and "Delete account" buttons while deletion is in progress
- [ ] Shows "Deleting..." text on the confirm button while deletion is in progress

### Delete Account - Success Flow

- [ ] Calls POST /api/profile/delete when user confirms deletion
- [ ] Calls logout after successful account deletion
- [ ] Dialog stays frozen (uncloseable, buttons disabled) until navigation completes

### Delete Account - Error Handling

- [ ] Displays backend error message when API returns an error response
- [ ] Displays backend message when API returns success: false
- [ ] Displays fallback error message when API response has no error or message field
- [ ] Displays network error message when fetch throws an exception
- [ ] Clears previous error when retrying deletion

### API Route - POST /api/profile/delete

- [ ] Returns 401 when session has no API token
- [ ] Returns 401 when session token is expired
- [ ] Destroys session when token is missing or expired
- [ ] Forwards request to backend with authorization header
- [ ] Returns 502 when backend connection fails
- [ ] Returns backend status code for 4xx errors
- [ ] Returns 502 for backend 5xx errors
- [ ] Returns 502 when backend response is not valid JSON
- [ ] Returns 502 when backend response does not match expected schema
- [ ] Destroys session when backend confirms successful deletion
- [ ] Returns parsed backend response on success

### Schema - messageResponseSchema

- [ ] Validates response with success boolean and non-empty message string

## Bugs / Issues Encountered

### Dialog briefly unfreezes on successful deletion

**Symptom:** After successful `POST /api/profile/delete`, the dialog flickers back to an interactive state (buttons re-enabled, closeable) before the page navigates to `/`.

**Root cause:** `finally { setIsDeleting(false) }` ran on both success and error paths. `window.location.href = '/'` does not stop JS execution — the assignment triggers an async navigation, so `finally` runs immediately after, resetting `isDeleting` before the browser navigates away.

**Fix:** Removed the `finally` block. `setIsDeleting(false)` is now called only in the two error paths (API error response and `catch` block). On success, `isDeleting` stays `true` and the dialog remains frozen until the hard redirect completes.

**File:** `src/features/profile/components/use-delete-account-dialog.ts`
