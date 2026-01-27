# job-details-og-image - Test Checklist

## Behaviors to Test

### OG Image Generation

- [ ] Visiting `/{slug}/{id}/opengraph-image` renders a 1200x630 PNG image
- [ ] OG image displays JobStash logo in the top-left corner
- [ ] OG image displays organization logo in the top-right corner when available
- [ ] OG image omits organization logo section when org logo is null
- [ ] OG image displays job title in white bold text
- [ ] OG image displays "at {orgName}" in gray text when organization exists
- [ ] OG image displays salary with money emoji when salary info tag exists
- [ ] OG image displays location with pin emoji when location is available
- [ ] OG image displays work mode with house emoji when workMode info tag exists
- [ ] OG image omits salary section when no salary info tag
- [ ] OG image omits location section when no location data
- [ ] OG image omits work mode section when no workMode info tag

### Title Truncation

- [ ] Short titles (under 60 chars) display without truncation
- [ ] Long titles (over 60 chars) are truncated with ellipsis

### Location Formatting

- [ ] Remote jobs display "Remote" as location
- [ ] Jobs with locality display "{locality}, {country}" format
- [ ] Jobs with only country display just country name
- [ ] Jobs with no address fall back to organization location
- [ ] Jobs with no location data display no location section

### Fallback Handling

- [ ] Non-existent job ID renders "Job Not Found" image
- [ ] "Job Not Found" image displays JobStash logo centered
- [ ] "Job Not Found" image displays "Job Not Found" text

### Twitter Card

- [ ] Visiting `/{slug}/{id}/twitter-image` renders the same image as opengraph-image
- [ ] Twitter image exports same size (1200x630)
- [ ] Twitter image exports same content type (image/png)

### Metadata Integration

- [ ] Job details page metadata no longer contains explicit `images` in openGraph
- [ ] Job details page metadata no longer contains explicit `images` in twitter
- [ ] Next.js auto-discovers opengraph-image.tsx and generates og:image meta tag
- [ ] Next.js auto-discovers twitter-image.tsx and generates twitter:image meta tag

### Social Media Validators

- [ ] Facebook Sharing Debugger shows correct OG image
- [ ] Twitter Card Validator shows correct card image
- [ ] LinkedIn Post Inspector shows correct preview
- [ ] OpenGraph.xyz displays correct image preview
