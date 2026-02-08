'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { GA_EVENT, trackEvent } from '@/lib/analytics';
import { LinkWithLoader } from '@/components/link-with-loader';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { type SimilarJobSchema } from '@/features/jobs/schemas';

interface SimilarJobItemProps {
  job: SimilarJobSchema;
  target?: React.HTMLAttributeAnchorTarget;
}

const LINK_CLASS = cn(
  'flex items-start gap-2.5 rounded-lg p-2',
  'transition-colors hover:bg-muted/50',
);

const FALLBACK_CLASS = cn(
  'mt-0.5 flex size-8 items-center justify-center rounded-md',
  'bg-linear-to-br from-muted to-muted/50',
  'text-xs font-medium text-muted-foreground',
  'ring-1 ring-border/50',
);

export const SimilarJobItem = ({ job, target }: SimilarJobItemProps) => {
  const { title, href, timestampText, companyName, companyLogo } = job;

  const subtitle = [companyName, timestampText].filter(Boolean).join(' · ');

  const handleClick = () => {
    trackEvent(GA_EVENT.SIMILAR_JOB_CLICKED, {
      job_id: job.id,
      source: 'similar_jobs',
    });
  };

  const content = (
    <>
      <ImageWithFallback
        src={companyLogo ?? ''}
        alt={companyName ?? 'Company'}
        width={32}
        height={32}
        className='mt-0.5 shrink-0 rounded-md ring-1 ring-border/50'
        fallback={
          <div className={FALLBACK_CLASS}>
            {companyName?.charAt(0).toUpperCase() ?? '?'}
          </div>
        }
      />

      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium text-foreground'>{title}</p>
        {subtitle && (
          <p className='truncate text-xs text-muted-foreground'>{subtitle}</p>
        )}
      </div>
    </>
  );

  if (target) {
    return (
      <Link
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        className={LINK_CLASS}
      >
        {content}
      </Link>
    );
  }

  return (
    <LinkWithLoader href={href} onClick={handleClick} className={LINK_CLASS}>
      {content}
    </LinkWithLoader>
  );
};
