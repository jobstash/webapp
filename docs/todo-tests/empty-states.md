# empty-states - Test Checklist

## Behaviors to Test

### Job List — Home Page

- [ ] Skeleton renders while job list is loading on initial page visit
- [ ] Job listings render correctly once loaded
- [ ] Applying filters that return zero results shows "No results for these filters" message
- [ ] Empty state with active filters displays a "Clear filters" link pointing to `/`
- [ ] Visiting home with no filters and an empty API response shows "No jobs available right now" and "Check back soon"
- [ ] When the jobs API fails, the error boundary shows "Failed to load jobs" with a "Try again" button
- [ ] Clicking "Try again" in the error boundary re-mounts `JobList` and retries the fetch

### Profile — Jobs For You Page (`/profile/jobs`)

- [ ] Shows skeleton while loading when user has skills
- [ ] Renders job list when suggested jobs are returned
- [ ] Shows "No matching jobs found. Check back soon." when user has skills but API returns zero results
- [ ] Shows "Failed to load job suggestions" with an alert icon when the suggested jobs API call fails
- [ ] Shows "Add profile skills to unlock job matches" prompt when user has no skills
- [ ] Shows "Upload your resume to get personalized job matches" prompt when user has neither skills nor resume
