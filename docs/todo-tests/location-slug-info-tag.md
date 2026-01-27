# location-slug-info-tag - Test Checklist

## Behaviors to Test

- [x] `slugify('Europe/Remote')` returns `'europe-remote'` (slash without spaces)
- [x] `slugify('Europe / Remote')` returns `'europe-remote'` (slash with surrounding spaces)
- [x] `slugify('Europe/ Remote')` returns `'europe-remote'` (slash with trailing space only)
- [x] `slugify('Europe /Remote')` returns `'europe-remote'` (slash with leading space only)
- [x] `slugify('A/B/C')` returns `'a-b-c'` (multiple consecutive slashes)
- [x] `slugify(null)` returns `''` (null input)
- [x] `slugify(undefined)` returns `''` (undefined input)
- [x] `slugify('Hello World')` returns `'hello-world'` (basic string conversion)
- [x] `slugify('USA, Remote')` returns `'usa-remote'` (comma handling unchanged)
- [x] `slugify('Full-Time')` returns `'full-time'` (dash handling unchanged)
