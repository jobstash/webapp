# update-og-metadata - Test Checklist

## Behaviors to Test

### Root Layout Metadata

- [ ] metadataBase is set to FRONTEND_URL for proper URL resolution
- [ ] Default openGraph config includes siteName "JobStash"
- [ ] Default openGraph type is "website"
- [ ] Default openGraph image is "/jobstash-logo.png"
- [ ] Default twitter card is "summary_large_image"

### Job Details Page OG Tags

- [ ] OG title matches job title with org name suffix
- [ ] OG description uses job summary when available
- [ ] OG description falls back to generic text when summary is null
- [ ] OG image uses org logo when it is an absolute URL (starts with http)
- [ ] OG image falls back to "/jobstash-logo.png" when org logo is relative
- [ ] OG image falls back to "/jobstash-logo.png" when org logo is null
- [ ] Twitter card is "summary_large_image" for better visibility
- [ ] Canonical URL is properly constructed

### Social Preview Testing

- [ ] Facebook sharing shows correct title, description, and image
- [ ] Twitter sharing shows large image card format
- [ ] LinkedIn sharing shows correct metadata
- [ ] Images resolve to absolute URLs (not relative paths)
