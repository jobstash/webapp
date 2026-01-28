# add-actual-job-suggestion-search - Test Checklist

## Search Input Behavior (Desktop)

- [ ] Typing in search input opens suggestions dropdown
- [ ] Focusing on search input opens suggestions dropdown
- [ ] Clicking outside the search container closes dropdown and clears input
- [ ] Pressing Escape closes dropdown and clears input
- [ ] Pressing Enter does not submit (no URL query param update)
- [ ] Clicking a suggestion result navigates to the result's href
- [ ] Clicking a suggestion result closes dropdown and clears input
- [ ] Cmd/Ctrl/Alt-clicking a suggestion opens in new tab without closing dropdown
- [ ] Input value clears whenever dropdown closes (for any close reason)

## Search Input Behavior (Mobile)

- [ ] Tapping search button opens full-screen overlay
- [ ] Tapping mobile search input opens full-screen overlay
- [ ] Typing in mobile overlay input shows suggestions
- [ ] Tapping back button closes overlay and clears input
- [ ] Clicking a suggestion result navigates to the result's href
- [ ] Clicking a suggestion result closes overlay and clears input
- [ ] Mobile overlay input auto-focuses when opened
- [ ] Mobile overlay shows "Start typing to search..." prompt when empty

## Suggestions Loading & Display

- [ ] Shows loading state while fetching suggestions
- [ ] Loading indicator displays for minimum 200ms (prevents flash)
- [ ] Displays suggestions grouped by category tabs (Jobs, Organizations, etc.)
- [ ] Shows "No suggestions found for X" when query has no results
- [ ] Empty query shows no results (desktop) or prompt (mobile)
- [ ] Previous results remain visible while loading new results (keepPreviousData)
- [ ] Results container shows reduced opacity during loading

## Group/Tab Navigation

- [ ] Displays available group tabs based on API response
- [ ] Clicking a tab switches to that group's results
- [ ] Active tab is visually highlighted
- [ ] Tab selection persists for same query
- [ ] Tab selection resets when query changes

## Pagination (Load More)

- [ ] "Load more" button appears when hasMore is true
- [ ] Clicking "Load more" fetches next page of results
- [ ] "Load more" button shows loading spinner while fetching
- [ ] "Load more" button is disabled while loading more
- [ ] New results append to existing results list

## Query Highlighting

- [ ] Matching text in result labels is highlighted
- [ ] Highlighting matches individual words from multi-word queries
- [ ] Highlighting is case-insensitive
- [ ] Highlighting ignores spaces and hyphens (e.g., "typescript" matches "Type-Script")
- [ ] Overlapping matches are merged (no duplicate highlights)
- [ ] Highlighting is disabled during loading state

## Debouncing

- [ ] Search query is debounced by 300ms before fetching
- [ ] Rapid typing does not trigger multiple API requests
- [ ] Only final debounced query triggers API fetch

## API Route Behavior

- [ ] Returns 400 for invalid request parameters
- [ ] Returns 502 when backend connection fails
- [ ] Returns 502 when backend returns server error (5xx)
- [ ] Returns backend status code for client errors (4xx)
- [ ] Returns 502 when backend response is invalid JSON
- [ ] Returns 502 when backend response fails schema validation
- [ ] Returns validated response data on success
- [ ] Logs validation errors server-side (not exposed to client)

## Accessibility

- [ ] Search input has accessible name via placeholder
- [ ] Mobile overlay has accessible dialog title (sr-only)
- [ ] Back button in mobile overlay has screen reader label
- [ ] Result items are keyboard focusable
- [ ] Focus styles visible on result items
