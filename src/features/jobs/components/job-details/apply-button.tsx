'use client';

import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { GA_EVENT, trackEvent } from '@/lib/analytics';

interface ApplyButtonProps {
  applyUrl: string | null;
  isExpertJob: boolean;
  jobId: string;
  jobTitle: string;
  organization: string | null;
  className?: string;
}

const getApplyDestination = (url: string): string | undefined => {
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
};

export const ApplyButton = ({
  applyUrl,
  isExpertJob,
  jobId,
  jobTitle,
  organization,
  className,
}: ApplyButtonProps) => {
  if (!applyUrl && !isExpertJob) return null;

  const handleExpertClick = () => {
    alert('Not Implemented');
  };

  const handleApplyClick = () => {
    if (!applyUrl) return;

    trackEvent(GA_EVENT.APPLY_BUTTON_CLICKED, {
      job_id: jobId,
      job_title: jobTitle,
      organization: organization ?? '',
      apply_destination: getApplyDestination(applyUrl),
    });
  };

  const buttonContent = (
    <>
      <ExternalLinkIcon className='size-4' />
      Apply Now
    </>
  );

  if (isExpertJob) {
    return (
      <Button className={className} size='lg' onClick={handleExpertClick}>
        {buttonContent}
      </Button>
    );
  }

  return (
    <Button asChild className={className} size='lg'>
      <Link
        href={applyUrl!}
        target='_blank'
        rel='noopener noreferrer'
        onClick={handleApplyClick}
      >
        {buttonContent}
      </Link>
    </Button>
  );
};
