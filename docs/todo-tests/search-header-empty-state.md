# search-header-empty-state - Test Checklist

## Behaviors to Test

### Loading State (spinner)

- [ ] Displays a spinner with "Loading suggestions..." while initial suggestions are loading
- [ ] Spinner remains visible for at least 300ms to prevent flicker
- [ ] Spinner disappears once suggestions are loaded and results are displayed
- [ ] Spinner appears on both desktop dropdown and mobile overlay

### Empty State - No Results for Query

- [ ] Shows "No jobs published for "{query}" in the past 30 days" when search query has no matches
- [ ] Displays the exact user query text within quotes in the empty state message
- [ ] Empty state message appears after loading completes (not during loading)

### Empty State - Mobile Prompt

- [ ] Shows "Start typing to search..." on mobile overlay when no query has been entered

### Empty State - Pillar Page

- [ ] Shows "No jobs published for this criteria in the past 30 days" when pillar page has zero jobs
- [ ] Shows "Check back soon or explore all available positions" as subtitle
- [ ] Shows "View all {pillarName} jobs" link when pillar context exists
- [ ] Shows "Browse all jobs" link when no pillar context
- [ ] CTA link navigates to the correct filter href

### Transition States

- [ ] Results replace the spinner smoothly after loading completes
- [ ] Typing a new query shows loading state while fetching new results
- [ ] Previous results remain visible (with reduced opacity) when refetching with a new query
