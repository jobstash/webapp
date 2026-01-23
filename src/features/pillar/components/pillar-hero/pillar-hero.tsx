import Link from 'next/link';

import { BrowseJobsButton } from '@/components/browse-jobs-button';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PillarDetails } from '@/features/pillar/schemas';
import {
  PILLAR_CATEGORY_CONFIG,
  getBooleanTagline,
  getPillarCategory,
  getPillarName,
} from '@/features/pillar/constants';

interface Props {
  slug: string;
  pillarDetails: PillarDetails;
}

const NAME_FIRST_CATEGORIES = new Set([
  'tag',
  'classification',
  'commitment',
  'locationType',
]);

const Headline = ({
  slug,
  category,
  pillarName,
  accent,
  tagline,
}: {
  slug: string;
  category: string;
  pillarName: string;
  accent: string;
  tagline: string;
}) => {
  if (category === 'boolean') {
    return <>{getBooleanTagline(slug)}</>;
  }

  const accentedName = (
    <span className={cn('inline-block', accent)}>{pillarName}</span>
  );

  if (NAME_FIRST_CATEGORIES.has(category)) {
    return (
      <>
        {accentedName} {tagline}
      </>
    );
  }

  return (
    <>
      {tagline} {accentedName}
    </>
  );
};

export const PillarHero = ({ slug, pillarDetails }: Props) => {
  const { description } = pillarDetails;
  const category = getPillarCategory(slug);
  const pillarName = getPillarName(slug);
  const config = PILLAR_CATEGORY_CONFIG[category];

  return (
    <section className='relative flex min-h-[420px] w-full items-center overflow-hidden border-b bg-linear-to-b from-primary/5 via-background to-background md:min-h-[520px]'>
      {/* Radial glow - matches home hero */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/4 via-transparent to-transparent' />

      <div className='relative mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16'>
        <div className='flex flex-col items-center gap-10 text-center'>
          {/* Hero content */}
          <div className='flex flex-col gap-6'>
            {/* Category pill */}
            <div className='flex items-center justify-center'>
              <span className='inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase'>
                <span className={cn('size-1.5 rounded-full', config.dot)} />
                {config.label}
              </span>
            </div>

            {/* Main headline - editorial style */}
            <h1 className='text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>
              <Headline
                slug={slug}
                category={category}
                pillarName={pillarName}
                accent={config.accent}
                tagline={config.tagline}
              />
            </h1>

            <p className='mx-auto max-w-2xl text-base text-muted-foreground md:max-w-4xl md:text-lg'>
              {description}
            </p>
          </div>

          {/* Primary CTAs - matching home hero */}
          <div className='flex flex-col gap-3 sm:flex-row'>
            <BrowseJobsButton />
            <Button size='lg' variant='outline' asChild>
              <Link href='/signup'>Post a Job</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
