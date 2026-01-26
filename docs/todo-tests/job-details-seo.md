# job-details-seo - Test Checklist

## Behaviors to Test

### Metadata Generation

- [ ] Job details page renders correct `<title>` with format "Job Title at Org Name | JobStash"
- [ ] Job details page renders correct `<title>` with format "Job Title | JobStash" when no organization
- [ ] Job details page renders `<meta name="description">` using job summary
- [ ] Job details page falls back to "View details for {title}" when summary is missing
- [ ] Not found job returns title "Job Not Found | JobStash"

### Open Graph Tags

- [ ] Job details page renders `og:title` matching page title
- [ ] Job details page renders `og:description` matching meta description
- [ ] Job details page renders `og:url` with full canonical URL
- [ ] Job details page renders `og:site_name` as "JobStash"
- [ ] Job details page renders `og:type` as "website"
- [ ] Job details page renders `og:image` with organization logo when available
- [ ] Job details page renders `og:image` with `/og-image.png` fallback when no logo

### Twitter Card Tags

- [ ] Job details page renders `twitter:card` as "summary"
- [ ] Job details page renders `twitter:title` matching page title
- [ ] Job details page renders `twitter:description` matching meta description
- [ ] Job details page renders `twitter:image` matching OG image

### Canonical URL

- [ ] Job details page renders `<link rel="canonical">` with full URL (FRONTEND_URL + job.href)

### Keywords

- [ ] Job details page renders `<meta name="keywords">` with tag names from job.tags

### JSON-LD Structured Data

- [ ] Job details page renders `<script type="application/ld+json">` in page body
- [ ] JSON-LD contains `@context` as "https://schema.org"
- [ ] JSON-LD contains `@type` as "JobPosting"
- [ ] JSON-LD contains `title` matching job title
- [ ] JSON-LD contains `description` from job description or summary fallback
- [ ] JSON-LD contains `datePosted` in ISO date format
- [ ] JSON-LD contains `employmentType` mapped from commitment infoTag
- [ ] JSON-LD contains `directApply` boolean based on applyUrl presence

### JSON-LD Organization Data

- [ ] JSON-LD contains `hiringOrganization` with `@type: Organization` when org exists
- [ ] JSON-LD `hiringOrganization` contains `name` from organization
- [ ] JSON-LD `hiringOrganization` contains `sameAs` with websiteUrl when available
- [ ] JSON-LD `hiringOrganization` contains `logo` when available
- [ ] JSON-LD omits `hiringOrganization` when job has no organization

### JSON-LD Location Data

- [ ] JSON-LD contains `jobLocation` with `@type: Place` when location exists
- [ ] JSON-LD `jobLocation` contains `address` from organization location
- [ ] JSON-LD omits `jobLocation` when no location available

### JSON-LD Salary Data

- [ ] JSON-LD contains `baseSalary` as MonetaryAmount when salary infoTag exists
- [ ] JSON-LD `baseSalary` contains `currency` extracted from salary label
- [ ] JSON-LD `baseSalary.value` contains `minValue` and `maxValue` parsed from range
- [ ] JSON-LD `baseSalary.value` contains `unitText` as "YEAR"
- [ ] JSON-LD omits `baseSalary` when no salary infoTag found

### JSON-LD Location Type

- [ ] JSON-LD contains `jobLocationType: TELECOMMUTE` when remote or hybrid detected
- [ ] JSON-LD omits `jobLocationType` for on-site jobs

### JSON-LD Skills

- [ ] JSON-LD contains `skills` array with tag names from job.tags
- [ ] JSON-LD omits `skills` when job has no tags

### SEO Utils - extractSalaryData

- [ ] Extracts salary from infoTag with iconKey "salary"
- [ ] Extracts salary from infoTag with iconKey containing "money"
- [ ] Parses "$80k - $120k" format correctly
- [ ] Parses "80,000 - 120,000 USD" format correctly
- [ ] Multiplies values by 1000 when in "k" format (values < 1000)
- [ ] Extracts currency from label suffix or defaults to "USD"
- [ ] Returns null when no salary infoTag found

### SEO Utils - extractEmploymentType

- [ ] Returns "FULL_TIME" for "Full-time" label
- [ ] Returns "PART_TIME" for "Part-time" label
- [ ] Returns "CONTRACTOR" for "Contract" label
- [ ] Returns "CONTRACTOR" for "Freelance" label
- [ ] Returns "INTERN" for "Internship" label
- [ ] Returns "FULL_TIME" as default when no commitment tag found

### SEO Utils - extractLocationType

- [ ] Returns "TELECOMMUTE" for "Remote" workMode label
- [ ] Returns "TELECOMMUTE" for "Hybrid" workMode label
- [ ] Returns "onsite" for "On-site" workMode label
- [ ] Falls back to checking location tag when no workMode tag
- [ ] Returns null when location type cannot be determined
