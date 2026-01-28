# search-suggestion-mobile-view - Test Checklist

## Behaviors to Test

### Mobile Dropdown Navigation

- [ ] Mobile search overlay shows dropdown menu instead of horizontal tabs
- [ ] Dropdown displays current active category label
- [ ] Clicking dropdown opens category selection menu
- [ ] Selecting a category from dropdown switches results without clearing search input
- [ ] Dropdown menu width matches trigger button width

### Desktop Tabs (Unchanged)

- [ ] Desktop view (>= 768px) shows horizontal tab buttons
- [ ] Desktop tabs are hidden on mobile viewport
- [ ] Tab switching works correctly on desktop

### Text Truncation

- [ ] Long job titles truncate with ellipsis on mobile
- [ ] Long organization names truncate with ellipsis
- [ ] Highlight matches display correctly within truncated text

### Search Input State

- [ ] Search input preserves query when switching categories on mobile
- [ ] Search input clears when closing mobile overlay
- [ ] Search input clears when selecting a result item

### Highlight Styling

- [ ] Search term matches highlighted with violet color (#a78bfa)
- [ ] Highlighted text has semibold font weight
