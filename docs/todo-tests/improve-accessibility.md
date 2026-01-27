# improve-accessibility - Test Checklist

## Behaviors to Test

### Main Landmark

- [ ] Home page (`/`) renders with a single `<main>` element
- [ ] Pillar pages (`/t-typescript`, `/l-usa`) render with a single `<main>` element
- [ ] Static pages (`/privacy`, `/terms`) render with a single `<main>` element
- [ ] No nested `<main>` elements exist on any page

### Heading Hierarchy

- [ ] Footer section titles render as `<p>` elements, not `<h3>`
- [ ] Document heading hierarchy is sequential (no skipped levels)
- [ ] Lighthouse accessibility audit passes heading order check

### Image Fallback

- [ ] Images with empty `src` immediately show fallback without network request
- [ ] Images with `null` `src` immediately show fallback without network request
- [ ] Images with valid `src` that fail to load trigger fallback after error
- [ ] Organization logos display letter avatar fallback when no logo URL exists
