import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Address } from '@/lib/schemas';

export interface AddressLookupResult {
  label: string;
  addresses: Address[] | null;
}

type AddressMappings = Record<string, AddressLookupResult>;

// Load mappings from .claude/scripts/address-mapping/mappings.json
const mappingsPath = join(
  process.cwd(),
  '.claude/scripts/address-mapping/mappings.json',
);
const mappingsContent = readFileSync(mappingsPath, 'utf-8');
const mappings: AddressMappings = JSON.parse(mappingsContent);

/**
 * Look up structured addresses for a raw location string.
 * Returns null if no mapping exists (graceful degradation).
 */
export const lookupAddresses = (
  rawLocation: string | null,
): AddressLookupResult | null => {
  if (!rawLocation) return null;

  return mappings[rawLocation] ?? null;
};
