'use client';

import { Suspense, lazy } from 'react';

import { ApplyButtonBoundary } from './apply-button.error';

const ApplyButton = lazy(() =>
  import('./apply-button').then((mod) => ({ default: mod.ApplyButton })),
);

interface CtaCardProps {
  hasApplyUrl: boolean;
  isExpertJob: boolean;
  jobId: string;
  jobTitle: string;
  organization: string | null;
}

export const CtaCard = ({
  hasApplyUrl,
  isExpertJob,
  jobId,
  jobTitle,
  organization,
}: CtaCardProps) => {
  if (!hasApplyUrl && !isExpertJob) return null;

  return (
    <div className='hidden rounded-2xl border border-neutral-800/50 bg-sidebar p-4 lg:block'>
      <ApplyButtonBoundary>
        <Suspense>
          <ApplyButton
            hasApplyUrl={hasApplyUrl}
            isExpertJob={isExpertJob}
            jobId={jobId}
            jobTitle={jobTitle}
            organization={organization}
            className='w-full'
          />
        </Suspense>
      </ApplyButtonBoundary>
    </div>
  );
};
