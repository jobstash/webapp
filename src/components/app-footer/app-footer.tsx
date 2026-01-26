import { FooterBrand } from './footer-brand';
import { FooterNav } from './footer-nav';
import { FooterSocials } from './footer-socials';
import { FooterLegal } from './footer-legal';

export const AppFooter = () => {
  return (
    <footer
      role='contentinfo'
      className='mt-16 border-t border-neutral-800 bg-card/30'
    >
      <div className='mx-auto max-w-7xl px-2 py-12 lg:py-16'>
        <div className='grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='flex flex-col gap-6'>
            <FooterBrand />
            <FooterSocials />
          </div>

          <div className='lg:col-span-2'>
            <FooterNav />
          </div>

          <FooterLegal />
        </div>
      </div>
    </footer>
  );
};
