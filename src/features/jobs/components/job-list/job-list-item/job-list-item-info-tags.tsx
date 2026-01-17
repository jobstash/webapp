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
    <div className='flex flex-wrap items-center gap-1.5'>
      {visibleTags.map((tag) => {
        const content = (
          <>
            <InfoTagIcon iconKey={tag.iconKey} />
            <span>{tag.label}</span>
          </>
        );

        const className = cn(
          'inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs',
          tag.href && 'transition-colors hover:bg-muted/80',
        );

        if (tag.href) {
          return (
            <LinkWithLoader
              key={tag.label}
              href={tag.href}
              className={className}
            >
              {content}
            </LinkWithLoader>
          );
        }

        return (
          <span key={tag.label} className={className}>
            {content}
          </span>
        );
      })}
    </div>
  );
};
