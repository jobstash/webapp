# search-tabbed-results - Test Checklist

## Behaviors to Test

### Tab Rendering

- [ ] Renders tabs for each non-empty suggestion group (Jobs, Organizations, Tags)
- [ ] Hides tabs for groups with no items
- [ ] Displays item count in tab label (e.g., "Jobs (12)")
- [ ] Auto-selects the first non-empty group by default
- [ ] Returns null when all groups are empty (parent handles empty state)

### Tab Interaction

- [ ] Clicking a tab switches to that category's content
- [ ] Keyboard navigation between tabs works (arrow keys)
- [ ] Tab focus states are visible for accessibility

### Tab Content

- [ ] Each tab displays a vertical list of suggestion items
- [ ] Items navigate to correct href via Next.js Link
- [ ] Clicking an item triggers onItemSelect callback
- [ ] Content area scrolls when items exceed available space

### Loading States

- [ ] Shows skeleton with placeholder tabs during initial load
- [ ] Shows skeleton with placeholder list items during initial load
- [ ] Reduces opacity and disables interactions during refetch (pending state)

### Empty States

- [ ] Shows "No suggestions found" message when query returns no results
- [ ] Shows "Start typing to search..." prompt when no query entered

### Search Submit

- [ ] Shows "Search for [query]" option when query is entered
- [ ] Clicking search option triggers onSearchSubmit with trimmed query
- [ ] Shows loading spinner in search option during fetch

### Mobile Overlay

- [ ] Tabs render correctly within full-screen mobile overlay
- [ ] Tab list is horizontally scrollable if tabs overflow
- [ ] Touch targets meet minimum size (44px height)
- [ ] Content fills available space appropriately
