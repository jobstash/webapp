import Link from 'next/link';

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
] as const;

const CURRENT_YEAR = new Date().getFullYear();

export const FooterLegal = () => (
  <div className='flex flex-col gap-4'>
    <h3 className='text-sm font-semibold text-foreground'>Legal</h3>
    <ul className='flex flex-col gap-2'>
      {LEGAL_LINKS.map(({ label, href }) => (
        <li key={href}>
          <Link
            href={href}
            className='text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
    <p className='mt-4 text-xs text-muted-foreground'>
      &copy; {CURRENT_YEAR} JobStash. All rights reserved.
    </p>
  </div>
);
