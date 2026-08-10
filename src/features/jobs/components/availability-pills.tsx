import { Badge } from '@/components/ui/badge';
import { LinkWithLoader } from '@/components/link-with-loader';
import { cn } from '@/lib/utils';
import type { JobAvailabilitySchema } from '@/features/jobs/schemas';

interface AvailabilityPillsProps {
  items: JobAvailabilitySchema[];
  limit?: number;
  className?: string;
}

export const AvailabilityPills = ({
  items,
  limit,
  className,
}: AvailabilityPillsProps) => {
  if (items.length === 0) return null;
  const visible = limit ? items.slice(0, limit) : items;
  const remaining = items.length - visible.length;

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {visible.map((item, index) => {
        const text = `${item.label} · ${item.requirement === 'required' ? 'Required' : 'Preferred'}`;
        const badge = (
          <Badge
            variant='outline'
            title={item.rawText}
            className={cn(
              'border-sky-500/20 bg-sky-500/5 text-sky-200 transition-colors',
              item.href &&
                'cursor-pointer hover:border-sky-400/50 hover:bg-sky-500/15 focus-visible:border-sky-400/50',
              item.requirement === 'preferred' &&
                'border-violet-500/20 bg-violet-500/5 text-violet-200',
            )}
          >
            {text}
          </Badge>
        );

        return item.href ? (
          <LinkWithLoader
            key={`${item.label}-${item.requirement}-${index}`}
            href={item.href}
            className='rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60'
          >
            {badge}
          </LinkWithLoader>
        ) : (
          <span key={`${item.label}-${item.requirement}-${index}`}>
            {badge}
          </span>
        );
      })}
      {remaining > 0 && <Badge variant='secondary'>+{remaining} more</Badge>}
    </div>
  );
};
