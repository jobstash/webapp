# add-job-details-og-image-description - Test Checklist

## Behaviors to Test

### Job Details OG Image

- [ ] OG image displays job title (truncated to 60 chars with ellipsis if longer)
- [ ] OG image displays job description/summary (truncated to 220 chars)
- [ ] OG image shows organization name and logo in header
- [ ] OG image shows "JobStash × Organization" header format
- [ ] OG image displays badge pill for "Featured" jobs with amber color
- [ ] OG image displays badge pill for "Job for Experts" with violet color
- [ ] OG image displays badge pill for "Job for Web3 Beginners" with emerald color
- [ ] OG image displays "Urgently Hiring" badge for Expert jobs
- [ ] OG image displays info pills (Role, Salary, Location, Mode, Contract)
- [ ] OG image shows fallback letter when organization has no logo
- [ ] OG image shows "Job Not Found" when job doesn't exist
- [ ] Long titles wrap to next line instead of overflowing
- [ ] Badges appear before info pills in the bottom section

### Pillar Page OG Image

- [ ] OG image displays headline with job count
- [ ] OG image displays description (truncated to 220 chars)
- [ ] OG image shows category pill with accent color dot
- [ ] OG image displays organization logos with names
- [ ] OG image shows overflow count when more than 4 orgs
- [ ] OG image shows "Page Not Found" for invalid pillar slugs
- [ ] Long headlines wrap to next line instead of overflowing

### Shared Utilities

- [ ] `truncateText` function adds "..." when text exceeds max length
- [ ] `truncateText` trims whitespace before adding ellipsis
- [ ] `formatLocationText` returns "Remote" for remote jobs
- [ ] `formatLocationText` returns "City, Country" format when locality exists
- [ ] `formatLocationText` returns country only when no locality
- [ ] `formatLocationText` falls back to org location when no addresses
