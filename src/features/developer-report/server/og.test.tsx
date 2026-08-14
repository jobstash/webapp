import { describe, expect, it } from 'vitest';

import { renderDeveloperReportOg } from './og';

describe('developer report social image', () => {
  it('renders a PNG when the report is still loading', async () => {
    const response = renderDeveloperReportOg(null, 'Crypto');
    const body = await response.arrayBuffer();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/png');
    expect(body.byteLength).toBeGreaterThan(1_000);
  });
});
