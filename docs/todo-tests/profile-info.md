# profile-info - Test Checklist

## Behaviors to Test

### Social Links URL Handling

- [ ] Social link pill with bare domain (e.g. `johnshift.dev`) renders href as `https://johnshift.dev`
- [ ] Social link pill with full URL (e.g. `https://github.com/user`) keeps href unchanged
- [ ] Social link pill with `http://` prefix keeps href unchanged (not double-prefixed)
- [ ] Email pill uses `mailto:` prefix and is not affected by protocol normalization
- [ ] Resume pill retains full `/api/resume/` URL without protocol normalization
- [ ] Clicking a social link pill opens in a new tab (target=\_blank)

### Profile Overview Layout

- [ ] Desktop layout renders ProfileIdentityCard, ProfileSkills, and hides ProfileStrengthCard
- [ ] Mobile layout renders ProfileStrengthCard and SuggestedJobsCard below main content
- [ ] ProfileIdentityCard renders WalletSection and SocialsSection in separate sections

### Wallet Section

- [ ] Displays truncated wallet address (first 6 + last 4 chars) when connected
- [ ] Shows "No wallet connected" when no wallet exists
- [ ] Shows skeleton loader while Privy is initializing

### Socials Section

- [ ] Shows 3 skeleton pill loaders while showcase data is loading
- [ ] Shows empty state with Github/LinkedIn/Twitter icons when no socials exist
- [ ] Renders correct icon for each social type (Github, LinkedIn, Twitter, Telegram, etc.)
- [ ] Extracts GitHub username from URL and displays it as the pill label
- [ ] Groups items correctly into socials, email, and resume categories

### Skills Section

- [ ] Shows 6 skeleton pill loaders while skills data is loading
- [ ] Shows empty state with "Add your skills" message when no skills exist
- [ ] Renders skill tags with color coding when skills are present
- [ ] Edit button opens skills editor modal
- [ ] Add Skills button appears in empty state

### Profile Strength Card

- [ ] Displays correct tier name based on completed item count (Lurker through All-Star)
- [ ] Progress bar fills proportionally to completed items (X of 4)
- [ ] Shows "Next Step" action linking to the first incomplete item
- [ ] Shows complete badge when all 4 items are done
- [ ] Desktop card shows full detail; mobile shows compact version

### Suggested Jobs Card

- [ ] Returns null (hidden) when no suggested jobs exist
- [ ] Shows loading spinner while fetching jobs
- [ ] Renders scrollable list of job items when jobs exist
- [ ] Job items open in a new tab when clicked

### Profile Settings

- [ ] Linked Accounts card shows Google account connection status
- [ ] Connect button triggers Privy link account flow
- [ ] Logout button logs user out and shows "Logging out..." while pending
- [ ] Delete account button opens confirmation dialog
- [ ] Delete dialog shows error message on failure and allows retry

### Sidebar Navigation

- [ ] Highlights "Overview" when on `/profile`
- [ ] Highlights "Settings" when on `/profile/settings`
- [ ] Desktop sidebar renders ProfileStrengthCard and SuggestedJobsCard

### Onboarding Sync Route

- [ ] Social URLs are normalized with correct protocol prefix on sync
- [ ] Website handles without protocol get `https://` prepended
- [ ] Social handles for GitHub/LinkedIn/Twitter resolve to full platform URLs
- [ ] No debug console.log statements in sync route
