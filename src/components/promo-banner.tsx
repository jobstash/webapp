const PROMO_URL = 'https://recruiters.rip';
const PROMO_CODE = (
  <code className='rounded-sm bg-black/25 px-1 py-0.5 font-mono'>
    onemonthfree
  </code>
);

// One-line strip above the sticky header: it scrolls away with the page.
// The full sentence is always the link's accessible name; below `md` it is
// visually replaced by the shorter line, which must fit a 320px viewport.
export const PromoBanner = () => (
  <a
    href={PROMO_URL}
    target='_blank'
    rel='noopener'
    className='relative flex h-8 items-center justify-center overflow-hidden bg-[#8743FF] px-2 text-xs font-medium whitespace-nowrap text-white hover:bg-[#6B2ED4] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white md:text-sm'
  >
    <span aria-hidden className='md:hidden'>
      recruiters.rip: first month free, code {PROMO_CODE}
    </span>
    <span className='sr-only md:not-sr-only'>
      We launched recruiters.rip, our best tool for finding the freshest jobs.
      First month free with code {PROMO_CODE}
    </span>
  </a>
);
