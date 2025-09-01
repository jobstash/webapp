import { notFound } from 'next/navigation';

import { fetchStaticJobDetails } from '@/lib/jobs/server/data/fetch-static-job-details';

import { BackButton } from '@/lib/jobs/ui/back-button';

import { generateJobPostingJsonLd } from '../utils';

interface Props {
  id: string;
  slug: string;
}

export const JobDetailsPage = async ({ id, slug }: Props) => {
  const job = await fetchStaticJobDetails(id);

  if (!job) {
    return notFound();
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: generateJobPostingJsonLd({ job, slug, id }),
        }}
      />

      <div className='flex flex-col gap-4'>
        <BackButton />
        <h1>{slug}</h1>
        <pre>
          {JSON.stringify(
            {
              id,
              title: job.title,
              slug,
              org: job.organization?.name,
              summary: job.summary,
              requirements: job.requirements,
              responsibilities: job.responsibilities,
              benefits: job.benefits,
              culture: job.culture,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </>
  );
};
