import { describe, expect, it } from 'vitest';

import { lookupAddresses } from './address-lookup';

describe('lookupAddresses', () => {
  it('normalizes case-only variants of reviewed mappings', () => {
    const result = lookupAddresses('[REMOTE] REMOTE');

    expect(result?.addresses?.length).toBeGreaterThan(0);
    expect(result?.addresses?.every((address) => address.isRemote)).toBe(true);
    expect(result?.addresses?.map((address) => address.countryCode)).toContain(
      'US',
    );
  });

  it('reuses a plain mapping for a remote-prefixed location', () => {
    const result = lookupAddresses('[REMOTE] Lisbon, Portugal');

    expect(result?.addresses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ countryCode: 'PT', isRemote: true }),
      ]),
    );
  });

  it('infers a country explicitly present in a new location string', () => {
    const result = lookupAddresses('Bobo-Dioulasso, Burkina Faso');

    expect(result?.addresses).toEqual([
      expect.objectContaining({ countryCode: 'BF', isRemote: false }),
    ]);
  });

  it('uses an unambiguous reviewed locality when the country is omitted', () => {
    const result = lookupAddresses('Montreal');

    expect(result?.addresses).toEqual([
      expect.objectContaining({ countryCode: 'CA', isRemote: false }),
    ]);
  });

  it('does not invent an address for an unknown office label', () => {
    expect(lookupAddresses('Foothill Office')).toBeNull();
  });
});
