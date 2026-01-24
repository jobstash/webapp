# job-list-item-layout-update - Test Checklist

## Behaviors to Test

### Job Title Section

- [ ] Job title displays inline with org logo (24x24) when organization exists
- [ ] Job title displays without logo spacing when no organization
- [ ] Org logo shows fallback with first letter when image fails to load
- [ ] Org name displays as muted subtitle below job title
- [ ] Org name subtitle links to `/o-<org>` pillar page
- [ ] Org name subtitle aligns with title (ml-8) when logo is present

### Job Info Tags

- [ ] "Jobs by <org>" tag appears as the last tag in job info tags
- [ ] "Jobs by <org>" tag links to `/o-<org>` pillar page
- [ ] "Jobs by <org>" tag uses externalLink icon

### Organization Section

- [ ] JobListItemOrg component returns null when no funding rounds or investors
- [ ] JobListItemOrg renders expandable details when funding rounds exist
- [ ] JobListItemOrg renders expandable details when investors exist
- [ ] Expandable section shows "View organization details" when collapsed
- [ ] Expandable section shows "Hide organization details" when expanded
- [ ] Chevron rotates 90 degrees when details are expanded

### Layout Spacing

- [ ] Tech tags render correctly when org section returns null
- [ ] Space between components is consistent (space-y-2) regardless of org content
