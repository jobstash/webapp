// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';

import { PromoBanner } from './promo-banner';

afterEach(cleanup);

it('is a single new-tab link to recruiters.rip named by the full message', () => {
  render(<PromoBanner />);

  const link = screen.getByRole('link');
  expect(link).toHaveAccessibleName(
    'We launched recruiters.rip, our best tool for finding the freshest jobs. First month free with code onemonthfree',
  );
  expect(link).toHaveAttribute('href', 'https://recruiters.rip');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener');
});
