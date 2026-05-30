import { Button } from '@/components/ui/button';
import { PrimaryCTA } from '@/components/primary-cta';

interface Props {
  variant?: 'primary' | 'secondary';
}

// Renders the resolved button's exact box (same component, size, and label) as a
// muted, non-interactive placeholder. Matching the label width means there is no
// layout shift when the real CTA resolves.
export const HeroJobsForYouButtonSkeleton = ({
  variant = 'secondary',
}: Props) => {
  if (variant === 'primary') {
    return (
      <PrimaryCTA
        aria-hidden
        className='pointer-events-none animate-pulse px-6 text-base text-transparent'
      >
        Jobs For You
      </PrimaryCTA>
    );
  }

  return (
    <Button
      aria-hidden
      tabIndex={-1}
      size='lg'
      variant='secondary'
      className='pointer-events-none animate-pulse bg-accent text-base text-transparent'
    >
      Jobs For You
    </Button>
  );
};
