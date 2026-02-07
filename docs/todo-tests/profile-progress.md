# profile-progress - Test Checklist

## Behaviors to Test

### ProfileStrengthCard - Progress Bar

- [ ] Renders a thin horizontal progress bar with neutral-800 background track
- [ ] Bar fill width is 0% when completedCount is 0
- [ ] Bar fill width is 25% when completedCount is 1
- [ ] Bar fill width is 50% when completedCount is 2
- [ ] Bar fill width is 75% when completedCount is 3
- [ ] Bar fill width is 100% when completedCount is 4
- [ ] Bar fill color matches the current tier's bgColor
- [ ] Bar fill transitions smoothly when completedCount changes

### ProfileStrengthCard - Desktop Layout

- [ ] Displays "Profile Strength" label on the left
- [ ] Displays "X of 4" counter on the right with tabular-nums styling
- [ ] Shows tier name in bold uppercase with tier's accent color
- [ ] Shows tier message as muted text below tier name
- [ ] Shows next step CTA as a clickable link with arrow icon
- [ ] Arrow icon shifts right on hover of next step CTA
- [ ] Shows unlock message below next step label
- [ ] Desktop layout is hidden on mobile (lg:flex)

### ProfileStrengthCard - Mobile Layout

- [ ] Shows tier name and counter on the same row
- [ ] Does not show tier message (saves vertical space)
- [ ] Shows next step label with action button on the right
- [ ] Action button includes arrow icon
- [ ] Mobile layout is hidden on desktop (lg:hidden)

### ProfileStrengthCard - Tier Progression

- [ ] Shows "LURKER" in neutral-500 when 0 items completed
- [ ] Shows "STARTER" in amber-500 when 1 item completed
- [ ] Shows "ACTIVE" in blue-500 when 2 items completed
- [ ] Shows "STRONG" in violet-500 when 3 items completed
- [ ] Shows "ALL-STAR" in emerald-500 when 4 items completed

### ProfileStrengthCard - All-Star State

- [ ] Shows emerald completion badge with SparklesIcon when all 4 items complete
- [ ] Displays "Profile complete" text in emerald-400
- [ ] Does not show next step CTA when all items complete
- [ ] Desktop badge uses p-3 padding
- [ ] Mobile badge uses p-2.5 padding

### ProfileStrengthCard - Card Styling

- [ ] Card uses rounded-2xl border with neutral-800/50 and bg-sidebar
- [ ] Card styling matches sidebar nav items

### useProfileCompleteness Hook

- [ ] Returns correct tier based on completed item count
- [ ] Returns completedCount matching number of true completion flags
- [ ] Returns nextStep as first incomplete item or null if all complete
- [ ] Skills completion checks if skills array has items
- [ ] Resume completion checks for showcase item with label "CV"
- [ ] Social completion checks for showcase items that are not CV or Email
- [ ] Email completion checks for showcase item with label "Email"

### Constants

- [ ] PROFILE_TIERS has 5 tiers with correct minItems (0, 1, 2, 3, 4)
- [ ] Each tier has name, color, bgColor, message, and minItems properties
- [ ] COMPLETENESS_ITEMS has 4 items (skills, resume, social, email)
- [ ] Each completeness item has key, label, action, unlocks, and href

### Integration

- [ ] ProfileStrengthCard renders in desktop sidebar (profile-sidebar.tsx)
- [ ] ProfileStrengthCard renders in mobile overview (profile-overview.tsx wrapped in lg:hidden)
- [ ] ProfileSkills shows empty state with updated message
- [ ] SocialsSection shows ghost icon empty state when no socials connected
- [ ] JobsForYou shows locked state with lock icon when no skills added
- [ ] JobsForYou appears in sidebar below strength card
