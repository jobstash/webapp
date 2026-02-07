# Profile Page Rebuild Plan

## Context

The profile page (`/profile`) is currently a bare-bones dev view showing raw JSON dumps of session data, skills, and showcase info with logout/delete buttons. The app has a rich API surface (skills, showcase, job matching, resume) that's completely underutilized on the profile page.

**Goal:** Rebuild the profile page into a polished, multi-route experience with sidebar navigation — matching the app's existing layout patterns — featuring 8 features: completeness ring, job match feed, visual skills, social links, expert badge, pillar links, identity header, and account settings.

---

## Route Structure

```
/profile              → Overview (dashboard: completeness ring, jobs for you, pillar links)
/profile/skills       → Skills & Expertise (visual skills editor, expert badge)
/profile/connections  → Connections (social links, resume download)
/profile/settings     → Settings (logout, delete account, session info)
```

**Sidebar navigation** (4 items):
| Label | Route | Icon (Lucide) |
|-------|-------|---------------|
| Overview | `/profile` | `LayoutDashboard` |
| Skills | `/profile/skills` | `Tags` |
| Connections | `/profile/connections` | `Link2` |
| Settings | `/profile/settings` | `Settings` |

**Mobile:** Sidebar hidden (`hidden lg:flex`), replaced with horizontal tab bar at top of content.

---

## Layout Architecture

### Profile Layout (`src/app/(main)/profile/layout.tsx`)

Move `AuthGuard` from page.tsx into the layout so all profile routes are protected. Add the sidebar + content flex layout following the home page pattern.

```
AuthProviders
  └── AuthGuard (server component — redirects if no session)
        └── flex gap-4
              ├── aside (w-68, sticky, hidden lg:flex)
              │     ├── ProfileSidebar (nav links)
              │     └── ProfileCompleteness (ring — persistent on desktop)
              └── section (min-w-0, grow)
                    ├── ProfileMobileNav (visible only < lg)
                    ├── ProfileHeader (identity card — always visible)
                    └── {children} (route content)
```

**Key:** Profile header sits in the layout (above route content) so the user's identity is always visible regardless of which tab they're on.

---

## Feature → Route Mapping

### `/profile` — Overview Page

1. **Profile Completeness Ring** (also in sidebar on desktop)
   - Visual progress ring (SVG circle with stroke-dasharray animation)
   - Scores: has skills (30%), has resume (25%), has social (20%), has email (15%), is expert (10%)
   - Below ring: actionable suggestions for incomplete items
   - Hooks: `useProfileSkills`, `useProfileShowcase`

2. **"Jobs For You" Match Feed**
   - Top 5 matched jobs with match % badge
   - New API route: `GET /api/profile/matched-jobs` (server-side batched scoring)
   - Compact job cards reusing `MATCH_BADGES` styling from `eligibility-cta.tsx`
   - "Browse all jobs" link to home page
   - New hook: `useJobsForYou`

3. **Quick Pillar Links**
   - Auto-generated links to pillar pages from user's skills (e.g., "TypeScript Jobs →" links to `/t-typescript`)
   - Uses skill `normalizedName` + `t-` prefix from pillar constants
   - Hooks: `useProfileSkills`

### `/profile/skills` — Skills & Expertise

4. **Visual Skills Section**
   - Color-coded skill badges using existing `TAG_COLORS` (12-color palette)
   - "Edit skills" opens Dialog with search/select UI (adapt from `SkillsStep` onboarding component)
   - On save: `POST /api/onboarding/sync` → invalidate `profile-skills` query
   - Hooks: `useProfileSkills`, `useSkillsSearch`, `useSuggestedSkills`

5. **Expert Status Badge**
   - If expert: prominent "Crypto Native" badge with gradient styling
   - If not expert: CTA explaining expert benefits with link to `/b-expert` pillar
   - Hooks: `useSession()` for `isExpert`

### `/profile/connections` — Connections

6. **Connected Accounts & Socials**
   - Platform icons (GitHub, LinkedIn, Twitter, Telegram, Discord, Farcaster, Lens, Website)
   - Connected/not-connected states
   - Resume card with download button (links to `/api/resume/[id]`)
   - Reuse SVG icons from `src/components/svg/` (telegram, twitter, farcaster icons exist)
   - Hooks: `useProfileShowcase` (needs Zod schema added)

### `/profile/settings` — Settings

7. **Account Settings**
   - Session info (expert status, session expiry)
   - Logout button (reuse `useSession().logout`)
   - Danger zone: delete account (reuse existing `DeleteAccountDialog`)

### Layout (always visible)

8. **Profile Header / Identity Card**
   - Wallet address (truncated `0x1234...5678`) from `usePrivy()`
   - Expert badge inline (from Feature 5)
   - Lives in layout above route children

---

## File Structure

```
src/features/profile/
  schemas.ts                           # MODIFY: add showcase response schema
  constants.ts                         # NEW: sidebar nav items, social icon map, completeness weights
  hooks/
    use-profile-skills.ts              # EXISTS (keep)
    use-profile-showcase.ts            # MODIFY: add Zod validation
    use-profile-completeness.ts        # NEW: completeness % calculation
    use-profile-skills-editor.ts       # NEW: edit mode for skills (local state, not zustand)
    use-jobs-for-you.ts                # NEW: fetch matched jobs
  components/
    profile-content.tsx                # DELETE or gut: replaced by route pages
    delete-account-dialog.tsx          # EXISTS (keep — used in settings)
    use-delete-account-dialog.ts       # EXISTS (keep)
    profile-sidebar.tsx                # NEW: sidebar nav ('use client')
    profile-mobile-nav.tsx             # NEW: mobile tab bar ('use client')
    profile-header.tsx                 # NEW: identity card ('use client')
    profile-completeness.tsx           # NEW: completeness ring ('use client')
    expert-badge.tsx                   # NEW: expert status ('use client')
    profile-socials.tsx                # NEW: connected accounts ('use client')
    profile-pillar-links.tsx           # NEW: pillar links ('use client')
    profile-settings.tsx               # NEW: settings content ('use client')
    profile-overview.tsx               # NEW: overview page content ('use client')
    profile-skills/
      profile-skills.tsx               # NEW: skills display + edit trigger ('use client')
      profile-skills-editor.tsx        # NEW: skill edit dialog ('use client')
    jobs-for-you/
      jobs-for-you.tsx                 # NEW: match feed container ('use client')
      job-match-card.tsx               # NEW: individual match card ('use client')

src/app/(main)/profile/
  layout.tsx                           # MODIFY: add sidebar layout + AuthGuard
  page.tsx                             # MODIFY: render ProfileOverview
  skills/
    page.tsx                           # NEW: render ProfileSkills + ExpertBadge
  connections/
    page.tsx                           # NEW: render ProfileSocials
  settings/
    page.tsx                           # NEW: render ProfileSettings

src/app/api/profile/matched-jobs/
  route.ts                             # NEW: server-side job matching
```

---

## Critical Existing Files to Reuse

| File                                                                      | What to Reuse                                        |
| ------------------------------------------------------------------------- | ---------------------------------------------------- |
| `src/features/onboarding/constants.ts`                                    | `TAG_COLORS` (12-color palette for skill badges)     |
| `src/features/onboarding/hooks/use-skills-search.ts`                      | Skill search with pagination                         |
| `src/features/onboarding/hooks/use-suggested-skills.ts`                   | Suggested skills                                     |
| `src/features/onboarding/components/steps/skills-step.tsx`                | Tag rendering pattern, dropdown UI                   |
| `src/features/jobs/components/job-list/job-list-item/eligibility-cta.tsx` | `MATCH_BADGES` styling                               |
| `src/lib/utils/get-tag-color-index.ts`                                    | Color index calculation for skills                   |
| `src/features/profile/components/delete-account-dialog.tsx`               | Delete account dialog                                |
| `src/components/svg/`                                                     | Social platform icons (telegram, twitter, farcaster) |
| `src/components/link-with-loader.tsx`                                     | Navigation links with loading state                  |
| `src/app/(main)/(home)/page.tsx`                                          | Sidebar layout pattern (flex, w-68, sticky)          |

---

## Implementation Order

### Phase 1: Layout Foundation

1. **Profile sidebar + layout** — Modify `layout.tsx`, create `ProfileSidebar`, `ProfileMobileNav`
2. **Settings route** — Create `/profile/settings/page.tsx` with `ProfileSettings` (move logout + delete from current page)
3. **Stub route pages** — Create `/profile/skills/page.tsx` and `/profile/connections/page.tsx` with placeholder content

### Phase 2: Identity & Completeness

4. **Profile header** — Create `ProfileHeader` (wallet address, expert badge inline)
5. **Showcase schema** — Add Zod schema to `schemas.ts`, update `useProfileShowcase`
6. **Profile completeness** — Create `useProfileCompleteness` hook + `ProfileCompleteness` ring component

### Phase 3: Core Features

7. **Visual skills display** — Create `ProfileSkills` (read-only view with color tags)
8. **Expert badge** — Create `ExpertBadge` component
9. **Connected accounts** — Create `ProfileSocials` (social links, resume download)

### Phase 4: Interactive Features

10. **Skills editor** — Create `ProfileSkillsEditor` dialog + `useProfileSkillsEditor` hook
11. **Quick pillar links** — Create `ProfilePillarLinks`

### Phase 5: Job Matching

12. **Matched jobs API** — Create `/api/profile/matched-jobs/route.ts`
13. **Jobs For You feed** — Create `useJobsForYou` hook, `JobsForYou` + `JobMatchCard` components

---

## Verification

1. **Dev server** — `pnpm dev`, navigate to `/profile` and verify:
   - Unauthenticated users redirect to `/onboarding`
   - Sidebar renders with 4 nav items, active state matches current route
   - Mobile: sidebar hidden, horizontal tabs visible
   - Each route (`/profile`, `/profile/skills`, `/profile/connections`, `/profile/settings`) renders correctly

2. **Feature testing**:
   - Completeness ring updates when skills/showcase data loads
   - Skills display shows color-coded tags matching onboarding style
   - Skills editor opens dialog, search works, add/remove syncs via `/api/onboarding/sync`
   - Social links display connected platforms, resume download works
   - Expert badge shows correct state
   - Pillar links generate correct hrefs from user skills
   - Jobs For You shows match badges, links to job detail pages
   - Settings: logout works, delete account dialog works

3. **Build** — `pnpm build` passes without errors
4. **Lint** — `pnpm lint` passes
