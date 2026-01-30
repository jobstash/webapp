# onboarding-login-privy - Test Checklist

## Behaviors to Test

### PrivyProvider Setup

- [ ] PrivyClientProvider wraps the app as outermost provider in root-providers
- [ ] Privy initializes with dark theme and accent color #8743FF
- [ ] Login methods configured: wallet, github, google, email
- [ ] Embedded wallet creation is disabled (createOnLogin: 'off')
- [ ] PRIVY_APP_ID env var is validated as non-empty string

### Onboarding Page - Loading States

- [ ] Shows loading spinner while Privy SDK is initializing (!ready)
- [ ] Shows loading spinner when OAuth redirect params are detected in URL
- [ ] Shows loading spinner while OAuth hook is processing (isOAuthLoading)
- [ ] Shows loading spinner when already authenticated (before redirect to /profile)
- [ ] Resets onboarding store state on mount

### Onboarding Page - Step Navigation

- [ ] Renders step dot indicators when not in login view
- [ ] Hides step dot indicators when in login view
- [ ] Current step dot uses primary color, completed dots use primary/50, future dots use muted
- [ ] Close button navigates to home page (/)

### AuthButtons - Login Methods

- [ ] Clicking "Continue with Google" initiates Google OAuth flow via initOAuth
- [ ] Google button shows loading spinner icon while OAuth is in progress
- [ ] All buttons are disabled while Google login is in progress
- [ ] "Connect Wallet" button renders but handler is a no-op (WIP)
- [ ] "Continue with GitHub" button renders but handler is a no-op (WIP)
- [ ] "Continue with Email" button renders but handler is a no-op (WIP)

### LoginView - Layout

- [ ] Displays "Welcome Back" heading and "Log in to your JobStash account" subtitle
- [ ] Renders AuthButtons component
- [ ] "Back to onboarding" button calls hideLogin to return to step view

### Onboarding - Post-Authentication Redirect

- [ ] Redirects to /profile when Privy reports ready and authenticated
- [ ] Uses router.replace (not push) for the redirect

### Profile Page - Auth Guard

- [ ] Redirects to /onboarding when ready and not authenticated
- [ ] Shows "Loading..." while Privy is initializing (!ready)
- [ ] Shows "Loading..." when not yet authenticated (covers redirect gap)

### Profile Page - Session Display

- [ ] Displays "Your Profile" heading when authenticated
- [ ] Renders user session details as formatted JSON in pre block
- [ ] Shows "Exchanging token..." while API token is being fetched
- [ ] Displays API token string on successful fetch
- [ ] Displays error message when check-wallet API call fails (e.g. 403)

### Profile Page - API Token Exchange

- [ ] Calls GET /privy/check-wallet with Privy access token as Bearer header
- [ ] Parses response with Zod schema requiring non-empty token string
- [ ] Query is enabled only when ready and authenticated
- [ ] Query uses 50-minute stale time with 1 retry
- [ ] Returns null when no API token is available yet

### Profile Page - Logout

- [ ] "Log out" button calls Privy logout
- [ ] Redirects to / after logout (even if logout throws)
