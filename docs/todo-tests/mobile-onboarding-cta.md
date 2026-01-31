# mobile-onboarding-cta - Test Checklist

## Behaviors to Test

### Header CTA (all viewports)

- [ ] "Get Hired Now" gradient button renders in header at mobile viewport (< 640px)
- [ ] "Get Hired Now" gradient button renders in header at tablet viewport (640px–1023px)
- [ ] "Get Hired Now" gradient button renders in header at desktop viewport (>= 1024px)
- [ ] Button text stays on a single line (no wrapping) at all viewports
- [ ] Button uses smaller text and padding on mobile (`text-sm`, `px-3`)
- [ ] Button uses larger text and padding on desktop (`text-base`, `px-6`)
- [ ] Clicking "Get Hired Now" navigates to `/onboarding`
- [ ] Button shows reduced opacity (`opacity-50`) while `/onboarding` page loads
- [ ] Button is non-interactive (`pointer-events-none`) during navigation transition
- [ ] Cmd/Ctrl+click opens `/onboarding` in a new tab (modifier key passthrough)

### Header Layout

- [ ] Mobile filters button (SlidersHorizontalIcon) is removed from header
- [ ] Search bar has full available width without filters button
- [ ] Header layout does not overflow on iPhone SE (320px width)

### Onboarding Content Centering

- [ ] First onboarding step (welcome) is vertically centered on mobile
- [ ] Content is pulled slightly above true center on mobile (`-mt-[60px]`)
- [ ] Content has no negative margin offset on tablet/desktop (`sm:mt-0`)
- [ ] Onboarding steps remain vertically centered on desktop viewports
