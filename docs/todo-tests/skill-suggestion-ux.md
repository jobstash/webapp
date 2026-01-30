# skill-suggestion-ux - Test Checklist

## Behaviors to Test

### Dropdown Loading States

- [ ] Displays "Loading skills..." with spinner on initial dropdown open (before any data loads)
- [ ] Displays "Searching..." with spinner when re-searching with no cached results available
- [ ] Shows "No skills found" only after loading completes with zero results and a non-empty query
- [ ] No empty flash occurs when typing more gibberish after "No skills found" is shown
- [ ] Spinner in search input addon shows while loading, search icon shows when idle

### Dropdown Content

- [ ] Renders available skills as clickable items when results exist
- [ ] Applies reduced opacity and disables pointer events on skill list while loading new results
- [ ] Shows "Load more" button when more pages are available
- [ ] "Load more" button shows spinner and "Loading..." text while fetching next page
- [ ] Dropdown renders nothing (no empty state) when no query and no results

### Skill Selection

- [ ] Clicking a skill in the dropdown adds it to selected skills
- [ ] Adding a skill closes the dropdown and clears the search input
- [ ] Selected skills display as colored tags with remove buttons
- [ ] Clicking the X on a selected skill tag removes it
- [ ] Already-selected skills are filtered out of the dropdown results

### Suggested Skills

- [ ] Suggested skills display as dashed-border tags when dropdown is closed
- [ ] Suggested skills become invisible (opacity-0) and non-interactive when dropdown is open
- [ ] Clicking a suggested skill adds it to selected skills
- [ ] Already-selected skills are filtered out of suggestions

### Search Input Behavior

- [ ] Typing in the search input opens the dropdown
- [ ] Pressing Escape clears the search, closes dropdown, and blurs input
- [ ] Blurring the input closes the dropdown
- [ ] Search is debounced (300ms) before fetching results

### Navigation

- [ ] "Back" button navigates to the previous onboarding step
- [ ] "Continue" button appears when skills are selected
- [ ] "Skip" button appears when no skills are selected
- [ ] Both continue and skip advance to the next step
