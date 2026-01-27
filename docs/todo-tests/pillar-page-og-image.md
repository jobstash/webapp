# pillar-page-og-image - Test Checklist

## Behaviors to Test

### OG Image Generation

- [ ] Visiting `/t-typescript/opengraph-image` renders a valid PNG image
- [ ] Visiting `/l-usa/opengraph-image` renders a valid PNG image
- [ ] Invalid pillar slug (e.g., `/x-invalid/opengraph-image`) shows "Page Not Found" image
- [ ] Non-existent pillar data shows "Page Not Found" image

### Header Section

- [ ] Displays JobStash logo with rounded corners
- [ ] Displays "JobStash" text next to logo
- [ ] Displays "×" separator between JobStash and category pill
- [ ] Category pill shows colored dot matching category accent color
- [ ] Category pill shows correct label (Skill, Location, Company, etc.)

### Headline Section

- [ ] Headline shows "New" prefix
- [ ] Headline shows pillar name in category accent color (e.g., "TypeScript" in emerald for skills)
- [ ] Headline shows tagline text (e.g., "Jobs", "Jobs in", "Jobs at")
- [ ] Headline shows job count in parentheses
- [ ] Job count shows "20+" when count is 20 or more
- [ ] nameFirst categories render as "New {name} {tagline} (count)"
- [ ] non-nameFirst categories render as "New {tagline} {name} (count)"
- [ ] Boolean categories render without colored text

### Description Section

- [ ] Description text displays below headline
- [ ] Description truncates to 150 characters with "..." if too long
- [ ] Description uses secondary text color (lighter than muted)

### Organization Strip

- [ ] Displays up to 5 organization items
- [ ] Reduces to 4 orgs if total name length exceeds 55 characters
- [ ] Each org shows logo (or initial fallback) and name
- [ ] Org logos have rounded corners
- [ ] Fallback avatar shows first letter with category accent background
- [ ] Separator "|" appears between org items
- [ ] "+N more organizations" appears on new line when overflow exists
- [ ] Plural form: "+1 more organization" vs "+2 more organizations"

### Twitter Image

- [ ] `/t-typescript/twitter-image` returns same image as opengraph-image
- [ ] Twitter image exports match opengraph-image exports (size, contentType, alt)

### Metadata Integration

- [ ] Pillar page metadata does not include static images property
- [ ] Next.js auto-discovers opengraph-image.tsx for og:image meta tag
- [ ] Next.js auto-discovers twitter-image.tsx for twitter:image meta tag
