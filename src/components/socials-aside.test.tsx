// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SocialsAsideContent from './socials-aside-content';

afterEach(() => {
  cleanup();
});

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('SocialsAsideContent', () => {
  it('renders all 4 social links', () => {
    render(<SocialsAsideContent />);

    expect(screen.getByRole('link', { name: 'Telegram' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'X' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Farcaster' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Community' })).toBeInTheDocument();
  });

  it('has correct hrefs', () => {
    render(<SocialsAsideContent />);

    expect(screen.getByRole('link', { name: 'Telegram' })).toHaveAttribute(
      'href',
      'https://telegram.me/jobstash',
    );
    expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute(
      'href',
      'https://x.com/jobstash_xyz',
    );
    expect(screen.getByRole('link', { name: 'Farcaster' })).toHaveAttribute(
      'href',
      'https://farcaster.xyz/~/channel/jobstash',
    );
    expect(screen.getByRole('link', { name: 'Community' })).toHaveAttribute(
      'href',
      'https://telegram.me/jobstashxyz',
    );
  });

  it('opens links in new tab', () => {
    render(<SocialsAsideContent />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
