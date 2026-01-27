# fix-pillar-page-metadata - Test Checklist

## Behaviors to Test

- [ ] Pillar page `/t-typescript` renders `<title>` tag with "TypeScript Jobs | JobStash"
- [ ] Pillar page `/l-usa` renders `<meta name="description">` with pillar-specific description
- [ ] Pillar page includes `<link rel="canonical">` pointing to the correct URL
- [ ] Pillar page includes Open Graph meta tags (`og:title`, `og:description`, `og:url`, `og:image`)
- [ ] Pillar page includes Twitter Card meta tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- [ ] Invalid pillar slug returns "Page Not Found | JobStash" as title
- [ ] Pillar page that fails to fetch data returns "Page Not Found | JobStash" as title
- [ ] `og:image` and `twitter:image` point to `/jobstash-logo.png`
- [ ] Canonical URL uses `NEXT_PUBLIC_FRONTEND_URL` environment variable
