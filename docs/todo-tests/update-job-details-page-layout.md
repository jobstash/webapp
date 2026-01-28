# update-job-details-page-layout - Test Checklist

## Behaviors to Test

### Typography & Layout

- [ ] Job title displays at `text-2xl font-bold` size
- [ ] Section headings (About the Role, Requirements, etc.) display at `text-lg font-semibold`
- [ ] Body text displays at `text-base` with `text-foreground/60` color
- [ ] Container has responsive padding (`p-3 pt-4` mobile, `p-6` desktop)
- [ ] Sections have proper spacing (`space-y-8`)

### Content Sections

- [ ] "About the Role" section renders description as plain text paragraph
- [ ] "Requirements" section renders as bullet list with primary-colored dots
- [ ] "Responsibilities" section renders as bullet list with primary-colored dots
- [ ] "Benefits" section renders as bullet list with primary-colored dots
- [ ] Empty bullet sections (no items) do not render
- [ ] Bullet points are indented from section headings (`pl-1`)

### Info Tags

- [ ] Info tags display with `text-foreground/60` color
- [ ] Info tags with links show hover state

### Skills Section

- [ ] Skills display as colored tags with appropriate color variants
- [ ] Skills link to pillar pages (`/t-{normalizedName}`)

### Apply Button (Desktop)

- [ ] CTA card only shows on desktop (`hidden lg:block`)
- [ ] Apply button shows icon before "Apply Now" text
- [ ] Expert jobs show click handler (alert placeholder)
- [ ] Regular jobs link to external apply URL

### Apply Button (Mobile)

- [ ] Mobile apply bar shows fixed at bottom on mobile
- [ ] Mobile apply bar hidden on desktop (`lg:hidden`)
- [ ] Apply button shows icon before "Apply Now" text
- [ ] No duplicate apply buttons on mobile view

### Responsive Layout

- [ ] Sidebar shows on right on desktop (`lg:flex`)
- [ ] Sidebar content moves below main content on mobile
- [ ] Main content takes full width on mobile
