import Link from 'next/link';

const NAV_SECTIONS = [
  {
    title: 'Browse Jobs',
    links: [
      { label: 'Remote', href: '/lt-remote' },
      { label: 'Full-time', href: '/co-full-time' },
      { label: 'Developer', href: '/cl-developer' },
      { label: 'DevRel', href: '/cl-devrel' },
    ],
  },
  {
    title: 'Popular Skills',
    links: [
      { label: 'Solidity', href: '/t-solidity' },
      { label: 'TypeScript', href: '/t-typescript' },
      { label: 'Rust', href: '/t-rust' },
      { label: 'React', href: '/t-react' },
    ],
  },
] as const;

export const FooterNav = () => (
  <nav aria-label='Footer navigation' className='flex gap-12 lg:gap-16'>
    {NAV_SECTIONS.map(({ title, links }) => (
      <div key={title} className='flex flex-col gap-4'>
        <p className='text-sm font-semibold text-foreground'>{title}</p>
        <ul className='flex flex-col gap-2'>
          {links.map(({ label, href }) => (
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
      </div>
    ))}
  </nav>
);
