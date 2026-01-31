# robots-no-index - Test Checklist

## Behaviors to Test

- [ ] `/robots.txt` returns `Disallow: /` when `NEXT_PUBLIC_ALLOW_INDEXING` is unset
- [ ] `/robots.txt` returns `Disallow: /` when `NEXT_PUBLIC_ALLOW_INDEXING=false`
- [ ] `/robots.txt` returns `Allow: /` with sitemap when `NEXT_PUBLIC_ALLOW_INDEXING=true`
- [ ] Page source contains `<meta name="robots" content="noindex, nofollow">` when indexing is disabled
- [ ] Page source contains `<meta name="robots" content="index, follow">` when indexing is enabled
- [ ] Child pages (pillar, job details, privacy, terms) inherit robots meta from root layout
- [ ] Build succeeds with `NEXT_PUBLIC_ALLOW_INDEXING=false`
- [ ] Build succeeds with `NEXT_PUBLIC_ALLOW_INDEXING=true`
- [ ] Build succeeds with `NEXT_PUBLIC_ALLOW_INDEXING` unset (defaults to blocked)
