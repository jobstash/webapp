# Route File Rules

## Principle

Route files are **composition points**, not implementation points. They wire together feature components and pass server data down.

## Allowed in Route Files

- Importing components
- Server-side data fetching (in page.tsx)
- Composing components with props/children
- Metadata exports

## Not Allowed in Route Files

- Inline component declarations
- `useState`, `useEffect`, or other hooks
- Complex conditional rendering logic
- Business logic of any kind

## Examples

### Violation

```tsx
// app/jobs/page.tsx - BAD
export default async function JobsPage() {
  const jobs = await fetchJobs();

  // Inline component declaration - WRONG
  const JobCard = ({ job }) => (
    <div className='...'>
      <h2>{job.title}</h2>
    </div>
  );

  return (
    <div>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
```

### Adherence

```tsx
// app/jobs/page.tsx - GOOD
import { JobList } from '@/features/jobs/components/job-list';
import { fetchJobs } from '@/features/jobs/server';

export default async function JobsPage() {
  const jobs = await fetchJobs();
  return <JobList jobs={jobs} />;
}
```

## Layout Files

Layout files follow the same rule - only import and compose:

```tsx
// app/jobs/layout.tsx - GOOD
import { Sidebar } from '@/features/jobs/components/sidebar';

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex'>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```
