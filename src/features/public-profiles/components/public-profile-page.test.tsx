// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { publicProfileFixture } from '../test-fixtures';

vi.mock('next/image', () => ({
  default: ({
    unoptimized: _unoptimized,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { unoptimized?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ''} {...props} />
  ),
}));

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

import { PublicProfilePage } from './public-profile-page';

describe('PublicProfilePage', () => {
  it('renders safe info, child links, aggregates, and redacted notices', () => {
    render(<PublicProfilePage profile={publicProfileFixture.data} />);

    expect(screen.getByRole('heading', { name: 'Example Labs' })).toBeVisible();
    expect(
      screen.getByText('Public infrastructure for open networks.'),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Example Labs builds and maintains public infrastructure for open networks.',
      ),
    ).toBeVisible();
    expect(screen.getByText('4.25 / 5 average')).toBeVisible();
    expect(screen.getByText('€120,000')).toBeVisible();
    expect(
      screen.getByRole('link', { name: /Example Foundation/ }),
    ).toHaveAttribute('href', '/o-example-foundation');
    expect(
      screen.getByText('This is the decided and redacted public notice.'),
    ).toBeVisible();
    expect(screen.queryByText(/private@example.com/)).not.toBeInTheDocument();
  });
});
