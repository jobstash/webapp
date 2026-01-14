---
name: seo-best-practices
description: Use when optimizing pages for search engines, adding metadata, structured data, or reviewing crawlability in Next.js apps
triggers:
  - review
globs:
  - '**/app/**/page.tsx'
  - '**/app/**/layout.tsx'
  - '**/app/sitemap.ts'
  - '**/app/robots.ts'
  - '**/*schema*.tsx'
  - '**/*metadata*.ts'
  - '**/*seo*.tsx'
---

# SEO Best Practices

## Overview

**Core principle:** Content must be crawlable, server-rendered, and semantically rich.

Search engines index what they can see in the initial HTML response. Client-rendered content is invisible to crawlers.

## When to Use

- Creating new pages or routes
- Adding/updating page metadata
- Implementing structured data (JSON-LD)
- SEO audits or reviews
- Fixing crawlability issues
- **Code review** of page.tsx, layout.tsx, sitemap.ts, robots.ts files

## Review Checklist (for affected files)

When reviewing changes to pages or layouts, verify:

- [ ] Page has appropriate metadata (title, description)
- [ ] Dynamic pages use `generateMetadata`
- [ ] Links use `<Link>` or `<a href>`, not `<button onClick>`
- [ ] Content is server-rendered (not client-only)
- [ ] Images have alt text
- [ ] Only one `<h1>` per page
- [ ] Structured data added for job/org pages

## Quick Reference

| Category        | Required                                              |
| --------------- | ----------------------------------------------------- |
| Metadata        | title, description, OG tags, Twitter cards, canonical |
| Structured Data | JSON-LD (JobPosting, Organization, BreadcrumbList)    |
| Technical       | sitemap.ts, robots.ts, semantic HTML, internal links  |
| Rendering       | Server-render all content, links, headings            |
| Performance     | LCP < 2.5s, CLS < 0.1, minimal JS bundle              |

## Metadata (Next.js 14+)

### Static Metadata

```typescript
// app/page.tsx or layout.tsx
export const metadata: Metadata = {
  title: 'Page Title | Site Name', // 50-60 chars
  description: 'Page description for search results.', // 150-160 chars
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    url: 'https://example.com/page',
    siteName: 'Site Name',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Title',
    description: 'Twitter Description',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://example.com/page',
  },
};
```

### Dynamic Metadata

```typescript
// app/jobs/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const job = await getJob(params.id);
  return {
    title: `${job.title} at ${job.company} | JobSite`,
    description: job.summary.slice(0, 160),
    openGraph: { ... },
    alternates: {
      canonical: `https://example.com/jobs/${params.id}`,
    },
  };
}
```

### Canonical URLs

Use canonical for:

- Paginated content: `/jobs?page=2` → canonical to `/jobs`
- Filtered content: `/jobs?tag=react` → canonical to `/jobs`
- Duplicate paths: `/job/123` and `/jobs/123` → pick one

## Structured Data (JSON-LD)

### JobPosting Schema (Primary for Job Boards)

```typescript
// components/job-posting-schema.tsx
export function JobPostingSchema({ job }: { job: Job }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    validThrough: job.expiresAt,
    employmentType: job.type, // FULL_TIME, PART_TIME, CONTRACT
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company.name,
      sameAs: job.company.url,
      logo: job.company.logo,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location.city,
        addressCountry: job.location.country,
      },
    },
    baseSalary: job.salary
      ? {
          '@type': 'MonetaryAmount',
          currency: job.salary.currency,
          value: {
            '@type': 'QuantitativeValue',
            minValue: job.salary.min,
            maxValue: job.salary.max,
            unitText: 'YEAR',
          },
        }
      : undefined,
    jobLocationType: job.remote ? 'TELECOMMUTE' : undefined,
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Organization Schema

```typescript
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Company Name',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  sameAs: [
    'https://twitter.com/company',
    'https://linkedin.com/company/company',
    'https://github.com/company',
  ],
};
```

### BreadcrumbList Schema

```typescript
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://example.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Jobs',
      item: 'https://example.com/jobs',
    },
    { '@type': 'ListItem', position: 3, name: 'React Developer' },
  ],
};
```

### WebSite + SearchAction (Sitelinks Search Box)

```typescript
// app/layout.tsx - add to root layout
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'JobSite',
  url: 'https://example.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://example.com/jobs?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};
```

## Technical SEO

### Sitemap (app/sitemap.ts)

```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getAllJobs();

  const jobUrls = jobs.map((job) => ({
    url: `https://example.com/jobs/${job.id}`,
    lastModified: job.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    { url: 'https://example.com', lastModified: new Date(), priority: 1 },
    {
      url: 'https://example.com/jobs',
      lastModified: new Date(),
      priority: 0.9,
    },
    ...jobUrls,
  ];
}
```

### Robots (app/robots.ts)

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

### Semantic HTML

```html
<main>
  <!-- Primary content -->
  <article>
    <!-- Self-contained content -->
    <h1>Job Title</h1>
    <!-- One h1 per page -->
    <nav aria-label="Breadcrumb">
      <!-- Navigation -->
      <a href="/">Home</a> > <a href="/jobs">Jobs</a>
    </nav>
  </article>
</main>
```

## Server Rendering Rules

| MUST be Server-Rendered  | Can be Client-Rendered |
| ------------------------ | ---------------------- |
| All page content/text    | Interactive filter UI  |
| Links (`<a href="...">`) | Modals, dropdowns      |
| Headings (h1-h6)         | Tooltips, popovers     |
| JSON-LD structured data  | Analytics scripts      |
| Images with alt text     | User preferences       |
| Lists, tables, data      | Animations             |

**Test:** View page source (Ctrl+U). If content isn't in raw HTML, it won't be indexed.

## Performance for SEO

### Core Web Vitals Targets

- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **INP** (Interaction to Next Paint): < 200ms

### Bundle Optimization

```typescript
// Dynamic imports for non-critical components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});

// Route-based code splitting (automatic in Next.js App Router)
```

### Images

```typescript
import Image from 'next/image';

<Image
  src='/job-image.png'
  alt='Descriptive alt text' // Required for SEO
  width={800}
  height={600}
  loading='lazy' // Below fold
  priority // Above fold (LCP)
/>;
```

### Fonts

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents layout shift
});
```

## Common Mistakes

| Mistake                           | Fix                                |
| --------------------------------- | ---------------------------------- |
| Client-rendering job list         | Use RSC, fetch in Server Component |
| `<button onClick>` for navigation | Use `<Link href="/...">` or `<a>`  |
| Missing JSON-LD on job pages      | Add JobPosting schema component    |
| No canonical on filtered pages    | Add `alternates.canonical`         |
| Blocking `/api/` needed for SSR   | Only block truly private endpoints |
| No alt text on images             | Always include descriptive alt     |
| Multiple h1 tags                  | One h1 per page only               |

## Verification Checklist

Before deploying:

- [ ] **View Source Test**: Content visible in raw HTML (Ctrl+U)
- [ ] **Rich Results Test**: [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- [ ] **Lighthouse SEO**: Score 90+ in Chrome DevTools
- [ ] **Mobile-Friendly**: [search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly)
- [ ] **Sitemap**: `/sitemap.xml` lists all pages
- [ ] **Robots**: `/robots.txt` allows crawling
- [ ] **Canonical URLs**: No duplicate content issues
- [ ] **Structured Data**: Valid JSON-LD in page source

## Tools

- **Google Search Console**: Monitor indexing, issues
- **Google Rich Results Test**: Validate structured data
- **Lighthouse**: Audit SEO, performance, accessibility
- **Screaming Frog**: Crawl site like search engines
- **Schema.org Validator**: Test JSON-LD syntax
