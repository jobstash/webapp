'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckIcon, ExternalLinkIcon, LoaderCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  APPLY_RESULT,
  APPLY_STATUS,
  type MissingItem,
} from '@/features/jobs/apply-schemas';
import { GA_EVENT, trackEvent } from '@/lib/analytics';

import { EligibilityNudgeDialog } from './eligibility-nudge-dialog';
import { useJobApply } from './use-job-apply';
import { useJobApplyStatus } from './use-job-apply-status';

interface ApplyButtonProps {
  hasApplyUrl: boolean;
  isExpertJob: boolean;
  jobId: string;
  jobTitle: string;
  organization: string | null;
  className?: string;
}

export const ApplyButton = ({
  hasApplyUrl,
  isExpertJob,
  jobId,
  jobTitle,
  organization,
  className,
}: ApplyButtonProps) => {
  const pathname = usePathname();
  const {
    isAuthenticated,
    isAuthLoading,
    isLoading,
    status,
    applyUrl,
    missing,
  } = useJobApplyStatus(jobId);
  const { isApplying, apply } = useJobApply(jobId);
  const [nudgeOpen, setNudgeOpen] = useState(false);
  const [nudgeMissing, setNudgeMissing] = useState<MissingItem[]>([]);

  if (!hasApplyUrl && !isExpertJob) return null;

  const openNudge = (items: MissingItem[]) => {
    setNudgeMissing(items);
    setNudgeOpen(true);
  };

  if (isLoading) {
    return <Skeleton className={`h-10 w-full ${className ?? ''}`} />;
  }

  if (!isAuthLoading && !isAuthenticated) {
    return (
      <Button asChild className={className} size='lg'>
        <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
          <ExternalLinkIcon className='size-4' />
          Apply Now
        </Link>
      </Button>
    );
  }

  if (status === APPLY_STATUS.ALREADY_APPLIED) {
    return (
      <Button className={className} size='lg' disabled>
        <CheckIcon className='size-4' />
        Already Applied
      </Button>
    );
  }

  if (isExpertJob && status === APPLY_STATUS.INELIGIBLE && missing) {
    return (
      <>
        <Button
          className={className}
          size='lg'
          onClick={() => openNudge(missing)}
        >
          <ExternalLinkIcon className='size-4' />
          Apply Now
        </Button>
        <EligibilityNudgeDialog
          isOpen={nudgeOpen}
          onOpenChange={setNudgeOpen}
          missing={nudgeMissing}
        />
      </>
    );
  }

  const handleApply = async () => {
    trackEvent(GA_EVENT.APPLY_BUTTON_CLICKED, {
      job_id: jobId,
      job_title: jobTitle,
      organization: organization ?? '',
    });

    if (isExpertJob) {
      try {
        const result = await apply();

        if (result.status === APPLY_RESULT.ELIGIBLE && 'applyUrl' in result) {
          window.open(result.applyUrl, '_blank', 'noopener,noreferrer');
        } else if (
          result.status === APPLY_RESULT.INELIGIBLE &&
          'missing' in result
        ) {
          openNudge(result.missing);
        }
      } catch {
        // Status hook will refetch on next window focus
      }
      return;
    }

    if (applyUrl) {
      fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortUUID: jobId }),
      }).catch(() => {});

      window.open(applyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const icon = isApplying ? (
    <LoaderCircleIcon className='size-4 animate-spin' />
  ) : (
    <ExternalLinkIcon className='size-4' />
  );

  return (
    <>
      <Button
        className={className}
        size='lg'
        disabled={isApplying}
        onClick={handleApply}
      >
        {icon}
        {isApplying ? 'Applying...' : 'Apply Now'}
      </Button>
      <EligibilityNudgeDialog
        isOpen={nudgeOpen}
        onOpenChange={setNudgeOpen}
        missing={nudgeMissing}
      />
    </>
  );
};
