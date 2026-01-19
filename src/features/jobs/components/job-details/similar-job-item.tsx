import { DollarSignIcon, MapPinIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LinkWithLoader } from '@/components/link-with-loader';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { type SimilarJobSchema } from '@/features/jobs/schemas';

interface SimilarJobItemProps {
  job: SimilarJobSchema;
}

export const SimilarJobItem = ({ job }: SimilarJobItemProps) => {
  const { title, href, salaryText, location, companyName, companyLogo } = job;

  return (
    <LinkWithLoader
      href={href}
      className={cn(
        'flex gap-2.5 rounded-lg p-2',
        'transition-colors hover:bg-muted/50',
      )}
    >
      <ImageWithFallback
        src={companyLogo ?? ''}
        alt={companyName ?? 'Company'}
        width={32}
        height={32}
        className='shrink-0 rounded-md ring-1 ring-border/50'
        fallback={
          <div
            className={cn(
              'flex size-8 items-center justify-center rounded-md',
              'bg-gradient-to-br from-muted to-muted/50',
              'text-xs font-medium text-muted-foreground',
              'ring-1 ring-border/50',
            )}
          >
            {companyName?.charAt(0).toUpperCase() ?? '?'}
          </div>
        }
      />

      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium text-foreground'>{title}</p>
        {companyName && (
          <p className='truncate text-xs text-muted-foreground'>
            by {companyName}
          </p>
        )}
        <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
          {location && (
            <span className='inline-flex items-center gap-1'>
              <MapPinIcon className='size-3' />
              {location}
            </span>
          )}
          {salaryText && (
            <span className='inline-flex items-center gap-1'>
              <DollarSignIcon className='size-3' />
              {salaryText}
            </span>
          )}
        </div>
      </div>
    </LinkWithLoader>
  );
};
