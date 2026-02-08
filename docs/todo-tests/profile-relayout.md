# profile-relayout - Test Checklist

## Behaviors to Test

- [ ] Sidebar nav displays only "Overview" and "Settings" items (no Jobs or Accounts)
- [ ] Sidebar nav card shows "Your Profile" title inside the card above nav links
- [ ] Clicking "Overview" navigates to `/profile` and highlights that nav item
- [ ] Clicking "Settings" navigates to `/profile/settings` and highlights that nav item
- [ ] Identity card renders "Wallet" section with icon circle, address, and subtitle
- [ ] Identity card renders "Socials" section with social link pills
- [ ] Wallet section shows truncated address when wallet is connected
- [ ] Wallet section shows "No wallet connected" when no wallet exists
- [ ] Wallet section shows skeleton loader while Privy is initializing
- [ ] Socials section shows GitHub handle extracted from URL without @ symbol
- [ ] Socials section renders all social pills with uniform color (bg-accent/60)
- [ ] Socials section shows email pill with mailto link when email exists
- [ ] Socials section shows resume pill with download icon when CV exists
- [ ] Socials section shows skeleton loaders while showcase data is loading
- [ ] Socials section shows empty state message when no socials exist
- [ ] Settings page renders "Linked Accounts" card at the top
- [ ] Settings page renders "Session" card with logout button
- [ ] Settings page renders "Danger Zone" card with delete account option
- [ ] Visiting `/profile/jobs` returns 404 page
- [ ] Visiting `/profile/accounts` returns 404 page
- [ ] Mobile nav displays only "Overview" and "Settings" pills
- [ ] Profile completeness calculation excludes expert status weight
- [ ] Profile completeness weights sum to 100 (skills 35, resume 25, social 25, email 15)
- [ ] ProfileOverview shows ProfileCompleteness on mobile (lg:hidden)
- [ ] Identity card sections are separated by border-t dividers
