# fix-linked-accounts - Test Checklist

## Behaviors to Test

- [ ] Profile settings page shows Google email and green check when Google is linked
- [ ] Profile settings page shows "Not connected" and "Connect" button when Google is not linked
- [ ] Clicking "Connect" opens Privy link flow and updates display on success (cache invalidation)
- [ ] Linked account status persists across page refreshes (server-side, not Privy client state)
- [ ] Existing sessions without `privyDid` degrade gracefully to "Not connected" (no crash)
- [ ] After logging out and back in, `privyDid` is stored and linked accounts load correctly
- [ ] `/api/profile/linked-accounts` returns 401 when session has no `privyDid`
- [ ] `/api/profile/linked-accounts` returns `{ data: [] }` when no Google account is linked
- [ ] `/api/profile/linked-accounts` returns `{ data: [{ type: "google_oauth", email: "..." }] }` when linked
- [ ] Debug `<pre>` tag no longer renders on profile settings page
- [ ] Loading skeleton displays while linked accounts are being fetched
