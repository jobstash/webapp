# add-suggested-pillars-section - Test Checklist

## Behaviors to Test

- [ ] Pillar page renders "Explore More" section in the aside when suggestedPillars array is non-empty
- [ ] Suggested pillars section is hidden when suggestedPillars array is empty
- [ ] Each suggested pillar renders as a link with correct href
- [ ] Each suggested pillar displays the correct label text
- [ ] Each suggested pillar shows a colored dot matching its pillar category (tag, classification, location, etc.)
- [ ] Suggested pillar links have category-specific hover styles (border and background color)
- [ ] Clicking a suggested pillar link navigates to the corresponding pillar page
- [ ] Suggested pillars section appears above the PillarCTA in the aside sidebar
- [ ] Suggested pillars aside is only visible on desktop (lg breakpoint and above)
- [ ] DTO transformer maps suggestedPillars from API response to UI schema correctly
- [ ] DTO transformer applies capitalize formatting to suggested pillar labels by default
- [ ] DTO transformer applies address lookup for location pillars (href starting with `/l-`)
- [ ] DTO transformer applies titleCase for classification pillars (href starting with `/cl-`)
- [ ] DTO defaults suggestedPillars to empty array when field is missing from API response
- [ ] SuggestedPillar schema validates that label and href are non-empty strings
- [ ] pillarPageStaticSchema includes suggestedPillars array field
