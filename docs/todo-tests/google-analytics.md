# google-analytics - Test Checklist

## Behaviors to Test

### Core Setup

- [ ] GoogleAnalytics component renders in root layout when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- [ ] GoogleAnalytics component does not render when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is empty/unset
- [ ] `trackEvent` no-ops gracefully during SSR (window undefined)
- [ ] `trackEvent` calls `sendGAEvent` with correct event name and params on the client

### Apply Button (Conversion)

- [ ] Clicking apply button fires `apply_button_clicked` with job_id, job_title, organization, and apply_destination
- [ ] `apply_destination` extracts hostname from the apply URL
- [ ] Expert job variant does not fire `apply_button_clicked`
- [ ] Desktop apply button (cta-card) passes job metadata props to ApplyButton
- [ ] Mobile apply bar passes job metadata props to ApplyButton

### Filter Events (Discovery)

- [ ] Setting a filter value fires `filter_applied` with filter_name, filter_value, and filter_type
- [ ] Clearing a filter fires `filter_removed` with filter_name
- [ ] Range filter apply fires `filter_applied` with combined range value
- [ ] `analytics_id` and `analytics_name` are included when available from filter config
- [ ] Clicking a suggested filter chip fires `suggested_filter_applied` with filter_name
- [ ] Suggested filter click also fires `filter_applied` (dual tracking)

### Job Browsing

- [ ] Clicking a job card fires `job_card_clicked` with job_id, job_title, and organization
- [ ] Changing pagination page fires `pagination_clicked` with page_number
- [ ] Clicking a similar job fires `similar_job_clicked` with job_id and source 'similar_jobs'

### Search

- [ ] Selecting a search suggestion fires `search_query` with the search text
- [ ] Selecting a mobile search suggestion fires `search_query` with the search text
- [ ] Dismissing search dropdown without selecting does not fire `search_query`
- [ ] Typing without selecting does not fire `search_query`

### Pillar Navigation

- [ ] Clicking a hero discovery chip fires `pillar_clicked` with pillar_slug, pillar_category, and source 'hero_discovery'
- [ ] Clicking a suggested pillar fires `pillar_clicked` with source 'suggested_pillars'
- [ ] Clicking "Browse Jobs" button fires `hero_cta_clicked` with source 'browse_jobs'
- [ ] Clicking "Post a Job" link in hero fires `hero_cta_clicked` with source 'post_job'
- [ ] Clicking "Post a Job" link in pillar hero fires `hero_cta_clicked` with source 'post_job'

### Auth & Onboarding

- [ ] Clicking Google login fires `login_started` with login_method 'google'
- [ ] Clicking wallet login fires `login_started` with login_method 'wallet'
- [ ] Clicking GitHub login fires `login_started` with login_method 'github'
- [ ] Clicking email login fires `login_started` with login_method 'email'
- [ ] Successful OAuth login fires `login_completed` with login_method
- [ ] Each onboarding step change fires `onboarding_step_viewed` with step_number and step_name
- [ ] Completing onboarding fires `onboarding_completed` exactly once (no duplicates)

### Header & Footer

- [ ] Clicking "Get Hired Now" header button fires `hero_cta_clicked` with source 'header_cta'
- [ ] Clicking a footer social link fires `external_link_clicked` with destination URL and source 'footer'
- [ ] Internal footer links do not fire `external_link_clicked`
