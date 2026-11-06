import { ImageResponse } from 'next/og';
import { createElement } from 'react';
import { expect, it } from 'vitest';

import { jobstashLogoDataUrl } from './og-logo';

it('renders the packaged logo without fetching the deployment origin', async () => {
  expect(jobstashLogoDataUrl).toMatch(/^data:image\/png;base64,/);

  const response = new ImageResponse(
    createElement('img', {
      src: jobstashLogoDataUrl,
      width: 64,
      height: 64,
    }),
    { width: 64, height: 64 },
  );
  const bytes = new Uint8Array(await response.arrayBuffer());

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('image/png');
  expect(Array.from(bytes.subarray(0, 8))).toEqual([
    137, 80, 78, 71, 13, 10, 26, 10,
  ]);
  expect(bytes.length).toBeGreaterThan(100);
});
