import { describe, expect, it } from 'vitest';

import { developerReportOgImage } from './og-image';

describe('developer report Open Graph image metadata', () => {
  it('returns complete crawler metadata and a versioned image URL', () => {
    const search = new URLSearchParams({ vertical: 'crypto', range: '1y' });

    expect(
      developerReportOgImage(
        'https://jobstash.xyz/developers',
        'Crypto Developer Report',
        search,
      ),
    ).toEqual({
      url: 'https://jobstash.xyz/developers/og?vertical=crypto&range=1y&v=20260815',
      width: 1200,
      height: 630,
      type: 'image/png',
      alt: 'Crypto Developer Report — JobStash',
    });
  });

  it('does not emit an empty trailing query string for the overall report', () => {
    expect(
      developerReportOgImage(
        'https://jobstash.xyz/developers',
        'Developer Ecosystem Report',
        new URLSearchParams(),
      ).url,
    ).toBe('https://jobstash.xyz/developers/og?v=20260815');
  });
});
