import { cn } from '@/lib/utils';
import { LinkWithLoader } from '@/components/link-with-loader';
import { type MappedInfoTagSchema } from '@/lib/schemas';

import { InfoTagIcon } from './info-tag-icon';

interface JobListItemInfoTagsProps {
  tags: MappedInfoTagSchema[];
  maxVisible?: number;
}

export const JobListItemInfoTags = ({
  tags,
  maxVisible = 4,
}: JobListItemInfoTagsProps) => {
  if (tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {visibleTags.map((tag) => {
        const content = (
          <>
            <InfoTagIcon iconKey={tag.iconKey} />
            <span>{tag.label}</span>
          </>
        );

        const baseStyles = cn(
          'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1',
          'bg-muted/50 text-xs text-muted-foreground',
          'ring-1 ring-border/50',
        );

        if (tag.href) {
          return (
            <LinkWithLoader
              key={tag.label}
              href={tag.href}
              className={cn(
                baseStyles,
                'transition-all duration-150',
                'hover:bg-muted hover:text-foreground hover:ring-border',
              )}
            >
              {content}
            </LinkWithLoader>
          );
        }

        return (
          <span key={tag.label} className={baseStyles}>
            {content}
          </span>
        );
      })}
    </div>
  );
};
