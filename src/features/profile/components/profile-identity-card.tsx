import { SocialsSection } from './socials-section';
import { WalletSection } from './wallet-section';

export const ProfileIdentityCard = () => (
  <div className='flex flex-col rounded-2xl border border-neutral-800/50 bg-sidebar'>
    <div className='flex flex-col gap-3 p-4'>
      <h3 className='text-sm font-semibold'>Wallet</h3>
      <WalletSection />
    </div>

    <div className='flex flex-col gap-3 border-t border-neutral-800/50 p-4'>
      <h3 className='text-sm font-semibold'>Socials</h3>
      <SocialsSection />
    </div>
  </div>
);
