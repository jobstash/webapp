'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLinkIcon, LoaderCircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { APPLY_STATUS, type MissingItem } from '@/features/jobs/apply-schemas';
import { GA_EVENT, trackEvent } from '@/lib/analytics';

import { EligibilityNudgeDialog } from './eligibility-nudge-dialog';
import { useJobApply } from './use-job-apply';
import { useJobApplyStatus } from './use-job-apply-status';

const GRADIENT_WRAPPER = cn(
  'rounded-lg bg-linear-to-r from-[#8743FF] to-[#D68800] p-0.5',
);

const GRADIENT_BUTTON = cn(
  'w-full rounded-[calc(var(--radius-lg)-2px)] bg-sidebar font-semibold text-white hover:bg-sidebar/80',
  'disabled:bg-sidebar disabled:text-white/50 disabled:opacity-100',
);

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

  const handleApplyClick = () => {
    trackEvent(GA_EVENT.APPLY_BUTTON_CLICKED, {
      job_id: jobId,
      job_title: jobTitle,
      organization: organization ?? '',
    });
    apply().catch(() => {});
  };

  const spinnerIcon = <LoaderCircleIcon className='size-4 animate-spin' />;
  const linkIcon = <ExternalLinkIcon className='size-4' />;

  const resolveButtonState = () => {
    if (isLoading) {
      return { icon: spinnerIcon, label: 'Loading...', disabled: true };
    }

    if (!isAuthLoading && !isAuthenticated) {
      const href = `/login?redirect=${encodeURIComponent(pathname)}`;
      return { icon: linkIcon, label: 'Apply Now', internalHref: href };
    }

    if (status === APPLY_STATUS.ALREADY_APPLIED) {
      return {
        icon: linkIcon,
        label: 'Revisit Application',
        externalHref: applyUrl ?? undefined,
      };
    }

    if (isExpertJob && status === APPLY_STATUS.INELIGIBLE && missing) {
      return {
        icon: linkIcon,
        label: 'Unlock Application',
        onClick: () => openNudge(missing),
      };
    }

    if (isApplying) {
      return { icon: spinnerIcon, label: 'Applying...', disabled: true };
    }

    return {
      icon: linkIcon,
      label: 'Apply Now',
      externalHref: applyUrl ?? undefined,
      onClick: applyUrl ? handleApplyClick : undefined,
    };
  };

  const { icon, label, disabled, onClick, internalHref, externalHref } =
    resolveButtonState();

  let button: React.ReactNode;

  if (internalHref) {
    button = (
      <Button asChild size='lg' className={GRADIENT_BUTTON}>
        <Link href={internalHref}>
          {icon}
          {label}
        </Link>
      </Button>
    );
  } else if (externalHref) {
    button = (
      <Button asChild size='lg' className={GRADIENT_BUTTON}>
        <Link
          href={externalHref}
          target='_blank'
          rel='noopener noreferrer'
          onClick={onClick}
        >
          {icon}
          {label}
        </Link>
      </Button>
    );
  } else {
    button = (
      <Button
        size='lg'
        className={GRADIENT_BUTTON}
        disabled={disabled}
        onClick={onClick}
      >
        {icon}
        {label}
      </Button>
    );
  }

  return (
    <>
      <div className={cn(GRADIENT_WRAPPER, className)}>{button}</div>

      <EligibilityNudgeDialog
        isOpen={nudgeOpen}
        onOpenChange={setNudgeOpen}
        missing={nudgeMissing}
      />
    </>
  );
};
