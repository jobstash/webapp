# perf-authd-routes - Test Checklist

## Behaviors to Test

- [ ] Pages that don't require auth (e.g., `/`, `/[slug]`) render without loading Privy provider
- [ ] Profile page (`/profile`) loads with Privy auth provider available
- [ ] Onboarding page (`/onboarding`) loads with Privy auth provider available
- [ ] Authenticated user on onboarding page redirects to `/profile` after session is ready
- [ ] Onboarding step components (welcome, resume, skills, connect) load lazily via dynamic imports
- [ ] Root providers (NuqsAdapter, ReactQueryProvider, ProgressProvider) remain functional on all routes
- [ ] Progress bar renders correctly at the top of every page
- [ ] AuthProviders wrapper correctly nests PrivyClientProvider for auth routes
- [ ] Non-auth routes have reduced JS bundle size compared to when Privy was in root providers
- [ ] Navigation between auth and non-auth routes works without layout errors
