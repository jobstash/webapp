import Link from 'next/link';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PillarCategory = 'role' | 'skill' | 'location' | 'commitment';

interface PillarItem {
  category: PillarCategory;
  label: string;
  href: string;
}

interface Props {
  pillarItems?: PillarItem[];
}

// Category styling - subtle dot indicator + hover accent
const categoryStyles: Record<PillarCategory, { dot: string; hover: string }> = {
  role: {
    dot: 'bg-blue-400',
    hover: 'hover:border-blue-500/40 hover:bg-blue-500/10',
  },
  skill: {
    dot: 'bg-emerald-400',
    hover: 'hover:border-emerald-500/40 hover:bg-emerald-500/10',
  },
  location: {
    dot: 'bg-amber-400',
    hover: 'hover:border-amber-500/40 hover:bg-amber-500/10',
  },
  commitment: {
    dot: 'bg-violet-400',
    hover: 'hover:border-violet-500/40 hover:bg-violet-500/10',
  },
};

export const HeroSection = ({ pillarItems }: Props) => {
  return (
    <section className='relative w-full overflow-hidden border-b bg-linear-to-b from-primary/5 via-background to-background'>
      {/* Subtle radial gradient */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/4 via-transparent to-transparent' />

      <div className='relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24'>
        <div className='flex flex-col items-center gap-10 text-center'>
          {/* Hero content */}
          <div className='flex flex-col gap-6'>
            <h1 className='text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>
              Find Your Next{' '}
              <span className='bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent'>
                Web3
              </span>{' '}
              Role
            </h1>
            <p className='mx-auto max-w-2xl text-base text-muted-foreground md:text-lg'>
              Connect with leading crypto and blockchain organizations. Discover
              opportunities in DeFi, NFTs, DAOs, and the decentralized future.
            </p>
          </div>

          {/* Primary CTAs */}
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Button size='lg' asChild>
              <Link href='/#jobs'>Browse Jobs</Link>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <Link href='/signup'>Post a Job</Link>
            </Button>
          </div>

          {/* Discovery Section */}
          {pillarItems && pillarItems.length > 0 && (
            <div className='flex w-full max-w-3xl flex-col items-center gap-6 pt-4'>
              {/* Connector element */}
              <div className='flex flex-col items-center gap-2 text-muted-foreground/60'>
                <span className='text-xs font-medium tracking-widest uppercase'>
                  Or explore by
                </span>
                <ChevronDownIcon className='size-4 animate-bounce' />
              </div>

              {/* Aligned chips */}
              <div className='flex flex-wrap items-center justify-center gap-2.5'>
                {pillarItems.map((item) => {
                  const style = categoryStyles[item.category];

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group relative flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm font-medium',
                        'transition-all duration-200',
                        'hover:shadow-md',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                        'active:scale-[0.98]',
                        style.hover,
                      )}
                    >
                      <span
                        className={cn(
                          'size-1.5 rounded-full transition-transform duration-200 group-hover:scale-125',
                          style.dot,
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
