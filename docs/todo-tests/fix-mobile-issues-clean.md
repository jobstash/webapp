# fix-mobile-issues-clean - Test Checklist

## Behaviors to Test

### Desktop View (md breakpoint and above)

- [ ] View Details badge renders in top-right corner of job card
- [ ] View Details badge displays ExternalLinkIcon and "View Details" text
- [ ] View Details badge has muted styling (bg-muted, text-muted-foreground)
- [ ] Clicking View Details badge navigates to job details page
- [ ] Mobile CTA button is hidden on desktop viewports

### Mobile View (below md breakpoint)

- [ ] Full-width CTA button renders at bottom of job card content
- [ ] Mobile CTA displays "View Job Details" text with ArrowRightIcon
- [ ] Mobile CTA button spans full width of card
- [ ] Mobile CTA has proper touch target size (h-11)
- [ ] Clicking mobile CTA navigates to job details page
- [ ] Desktop badge is hidden on mobile viewports
- [ ] Active state shows scale animation (scale-[0.98])

### Loading States

- [ ] Desktop View Details badge shows loading indicator when clicked
- [ ] Mobile CTA button shows loading indicator when clicked

### Accessibility

- [ ] Both CTAs are accessible via keyboard navigation
- [ ] Both CTAs have appropriate focus states
- [ ] Link destination is same for both desktop and mobile variants
