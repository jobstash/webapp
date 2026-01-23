# pillar-page-simplification - Test Checklist

## Behaviors to Test

### Page Routing & Navigation

- [ ] Visiting `/t-typescript` displays pillar page for TypeScript jobs
- [ ] Visiting `/cl-devrel` displays pillar page for Developer Relations jobs
- [ ] Visiting `/l-usa` displays pillar page for USA location jobs
- [ ] Invalid pillar slug (e.g., `/x-invalid`) shows 404 page
- [ ] Invalid boolean filter slug (e.g., `/b-nonexistent`) shows 404 page

### Hero Section

- [ ] PillarHero displays correct title from pillarDetails
- [ ] PillarHero displays correct description from pillarDetails
- [ ] Pillar category styling matches slug prefix (e.g., tag, classification, location)

### Job List Display

- [ ] Job list fetches jobs with pillar filter applied (e.g., `tags=typescript`)
- [ ] Job list fetches jobs with `publicationDate=this-month` hardcoded
- [ ] Job list displays all matching jobs without pagination controls
- [ ] Job list renders up to 100 jobs maximum
- [ ] Each job renders using JobListItem component

### Bottom CTA (when jobs exist)

- [ ] CTA displays "Looking for more {pillarName} opportunities?"
- [ ] CTA displays "View all {pillarName} jobs including older listings"
- [ ] CTA links to home with correct filter: `/?{paramKey}={value}`
- [ ] CTA shows hover effects (shimmer, arrow animation)

### Empty State (when no jobs)

- [ ] Empty state displays "No {pillarName} jobs posted this month"
- [ ] Empty state displays "Check back soon or explore all available positions"
- [ ] Empty state CTA links to home with correct filter applied
- [ ] Empty state shows search icon and decorative background

### Error State

- [ ] Error state displays "Failed to load jobs" on fetch failure
- [ ] Error state displays "Please try refreshing the page"

### Aside Section

- [ ] PlaceholderAside renders with correct width (w-68 / 272px)
- [ ] PlaceholderAside is hidden on mobile screens
- [ ] PlaceholderAside is visible on lg breakpoint and above
- [ ] PlaceholderAside has sticky positioning (top-20, lg:top-24)
- [ ] SocialsAside renders below PlaceholderAside

### Static Generation

- [ ] generateStaticParams returns pillar slugs for pre-rendering
- [ ] DISABLE_STATIC_GENERATION=true returns empty array

### Layout Stability

- [ ] Page maintains layout structure matching home page (aside + main)
- [ ] No layout shift when navigating between home and pillar pages
