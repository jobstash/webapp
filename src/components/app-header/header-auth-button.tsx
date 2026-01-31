import { LinkWithLoader } from '@/components/link-with-loader';
import { PrimaryCTA } from '@/components/primary-cta';

export const HeaderAuthButton = () => (
  <PrimaryCTA
    asChild
    className='px-3 text-sm whitespace-nowrap lg:px-6 lg:text-base'
  >
    <LinkWithLoader href='/onboarding'>Get Hired Now</LinkWithLoader>
  </PrimaryCTA>
);
