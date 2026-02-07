# profile-strength-improvements - Test Checklist

## Behaviors to Test

### Typography and Header Alignment

- [ ] Desktop "Profile Strength" header renders at base font size matching "Your Profile" and "Your Job Matches" headers
- [ ] Desktop "Profile Strength" header uses `<h3>` element for semantic consistency
- [ ] Desktop header has `font-medium` weight matching sibling sidebar sections

### Desktop Layout

- [ ] Tier name and count ("X of 4") display on the same row with space between
- [ ] Tier message displays below the progress bar
- [ ] Progress bar fills proportionally (25% per completed item)
- [ ] Progress bar color matches the current tier color

### CTA Layout (Desktop)

- [ ] "Next: {label}" CTA renders full width matching CompleteBadge width
- [ ] CTA displays as single-line with text left and arrow icon right
- [ ] CTA has hover state with background color transition
- [ ] CTA links to the correct profile section

### CTA Layout (Mobile)

- [ ] Mobile "Next: {label}" CTA renders full width matching CompleteBadge width
- [ ] Mobile CTA displays as single-line block (not split with separate button)
- [ ] Long CTA labels truncate with ellipsis on mobile
- [ ] Mobile CTA has hover state with background color transition

### CompleteBadge

- [ ] "Profile complete" badge displays when all 4 items are completed
- [ ] Badge and CTA occupy the same visual slot (uniform size and shape)

### Tier Messages

- [ ] Lurker tier shows "Complete your profile to get started"
- [ ] Starter tier shows "You're on the map"
- [ ] Active tier shows "Getting noticed by recruiters"
- [ ] Strong tier shows "Standing out from the crowd"
- [ ] All-Star tier shows "Maximum visibility across all recruiters"

### Mobile Layout (Unchanged)

- [ ] Mobile layout omits "Profile Strength" label
- [ ] Mobile uses tier name as primary heading
- [ ] Mobile count displays as muted text
