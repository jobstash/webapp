# pillar-page-og-org-overflow - Test Checklist

## Behaviors to Test

- [ ] OG image displays organizations on a single line without overflow
- [ ] Organizations with combined name length under 40 characters all display
- [ ] Organizations exceeding 40 character threshold show "+N more organizations" badge
- [ ] Pipe separator (|) renders between each organization
- [ ] First organization does not have a leading separator
- [ ] Organization logos display correctly with rounded corners
- [ ] Organizations without logos show initial letter fallback with accent color
- [ ] Overflow badge shows correct singular "organization" for count of 1
- [ ] Overflow badge shows correct plural "organizations" for count > 1
