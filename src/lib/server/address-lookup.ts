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

interface CountryIdentity {
  country: string;
  countryCode: string;
}

const REMOTE_PREFIX = /^\[remote\]\s*/i;

const normalizeLocation = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const addressScore = (mapping: AddressLookupResult): number =>
  mapping.addresses?.length ?? 0;

// Upstream locations are free-form and frequently change only in casing or
// whitespace. Keep exact lookup first, then use a normalized index so variants
// such as "[REMOTE] REMOTE" reuse the reviewed "[REMOTE] Remote" mapping.
const normalizedMappings = new Map<string, AddressLookupResult>();
for (const [key, mapping] of Object.entries(mappings)) {
  const normalizedKey = normalizeLocation(key);
  const existing = normalizedMappings.get(normalizedKey);
  if (!existing || addressScore(mapping) > addressScore(existing)) {
    normalizedMappings.set(normalizedKey, mapping);
  }
}

const countriesByCode = new Map<string, CountryIdentity>();
const localityCandidates = new Map<string, Map<string, Address>>();

for (const mapping of Object.values(mappings)) {
  for (const address of mapping.addresses ?? []) {
    countriesByCode.set(address.countryCode, {
      country: address.country,
      countryCode: address.countryCode,
    });

    if (address.locality) {
      const localityKey = normalizeLocation(address.locality);
      const candidates = localityCandidates.get(localityKey) ?? new Map();
      candidates.set(address.countryCode, address);
      localityCandidates.set(localityKey, candidates);
    }
  }
}

// The reviewed mapping corpus is broad but not a canonical country database.
// Keep explicit additions limited to countries observed in current source data
// that aren't represented by an existing mapping yet.
for (const country of [
  { country: 'Ethiopia', countryCode: 'ET' },
  { country: 'Malawi', countryCode: 'MW' },
]) {
  if (!countriesByCode.has(country.countryCode)) {
    countriesByCode.set(country.countryCode, country);
  }
}

const countryPhrases = new Map<string, CountryIdentity>();
for (const country of countriesByCode.values()) {
  countryPhrases.set(normalizeLocation(country.country), country);
}

const COUNTRY_ALIASES: Record<string, string> = {
  'bay area': 'US',
  baku: 'AZ',
  california: 'US',
  'cote d ivoire': 'CI',
  'czech republic': 'CZ',
  deutschland: 'DE',
  england: 'GB',
  'espirito santo': 'BR',
  'great britain': 'GB',
  ireland: 'IE',
  munchen: 'DE',
  nyc: 'US',
  osterreich: 'AT',
  'sao paolo': 'BR',
  scotland: 'GB',
  sf: 'US',
  uae: 'AE',
  uk: 'GB',
  'united states of america': 'US',
  'u s': 'US',
  'u s a': 'US',
  us: 'US',
  usa: 'US',
  wien: 'AT',
  wales: 'GB',
};

for (const [alias, code] of Object.entries(COUNTRY_ALIASES)) {
  const country = countriesByCode.get(code);
  if (country) countryPhrases.set(normalizeLocation(alias), country);
}

const ALPHA_3_COUNTRY_CODES: Record<string, string> = {
  ARE: 'AE',
  AUS: 'AU',
  AUT: 'AT',
  BEL: 'BE',
  BGR: 'BG',
  BRA: 'BR',
  CAN: 'CA',
  CHE: 'CH',
  CHN: 'CN',
  COL: 'CO',
  CZE: 'CZ',
  DEU: 'DE',
  DNK: 'DK',
  ESP: 'ES',
  FIN: 'FI',
  FRA: 'FR',
  GBR: 'GB',
  HKG: 'HK',
  IDN: 'ID',
  IND: 'IN',
  IRL: 'IE',
  ISR: 'IL',
  ITA: 'IT',
  JPN: 'JP',
  KOR: 'KR',
  MEX: 'MX',
  MYS: 'MY',
  NLD: 'NL',
  NOR: 'NO',
  NZL: 'NZ',
  PHL: 'PH',
  POL: 'PL',
  PRT: 'PT',
  ROU: 'RO',
  SGP: 'SG',
  SWE: 'SE',
  THA: 'TH',
  TUR: 'TR',
  TWN: 'TW',
  UKR: 'UA',
  USA: 'US',
  VNM: 'VN',
  ZAF: 'ZA',
};

const US_STATE_CODES = new Set([
  'AK',
  'AL',
  'AR',
  'AZ',
  'CA',
  'CO',
  'CT',
  'DC',
  'DE',
  'FL',
  'GA',
  'HI',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'NC',
  'ND',
  'NE',
  'NH',
  'NJ',
  'NM',
  'NV',
  'NY',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VA',
  'VT',
  'WA',
  'WI',
  'WV',
  'WY',
]);

const CANADIAN_PROVINCE_CODES = new Set([
  'AB',
  'BC',
  'MB',
  'NB',
  'NL',
  'NS',
  'NT',
  'NU',
  'ON',
  'PE',
  'QC',
  'SK',
  'YT',
]);

const containsPhrase = (haystack: string, needle: string): boolean =>
  ` ${haystack} `.includes(` ${needle} `);

const toAddress = (
  country: CountryIdentity,
  isRemote: boolean,
  locality?: string,
): Address => ({
  ...country,
  isRemote,
  ...(locality && { locality }),
});

const inferAddresses = (
  rawLocation: string,
  isRemote: boolean,
): AddressLookupResult | null => {
  const displayLocation = rawLocation.replace(REMOTE_PREFIX, '').trim();
  const normalized = normalizeLocation(displayLocation);
  if (!normalized) return null;

  const explicitCountries = new Map<string, CountryIdentity>();
  for (const [phrase, country] of countryPhrases) {
    // "Georgia" is both a country and a US state. Only use a reviewed mapping
    // or a less ambiguous signal for it.
    if (phrase === 'georgia') continue;
    if (containsPhrase(normalized, phrase)) {
      explicitCountries.set(country.countryCode, country);
    }
  }

  if (explicitCountries.size > 0) {
    return {
      label: displayLocation,
      addresses: [...explicitCountries.values()]
        .slice(0, 6)
        .map((country) => toAddress(country, isRemote)),
    };
  }

  const localities = new Map<string, Address>();
  for (const [locality, candidates] of localityCandidates) {
    if (candidates.size !== 1 || !containsPhrase(normalized, locality)) {
      continue;
    }
    const address = [...candidates.values()][0];
    localities.set(
      `${address.countryCode}:${address.locality}`,
      toAddress(address, isRemote, address.locality),
    );
  }

  if (localities.size > 0) {
    return {
      label: displayLocation,
      addresses: [...localities.values()].slice(0, 6),
    };
  }

  const uppercaseTokens = displayLocation.match(/\b[A-Z]{2,3}\b/g) ?? [];
  const codedCountries = new Map<string, CountryIdentity>();
  for (const token of uppercaseTokens) {
    const alpha3Code = ALPHA_3_COUNTRY_CODES[token];
    if (alpha3Code) {
      const country = countriesByCode.get(alpha3Code);
      if (country) codedCountries.set(country.countryCode, country);
      continue;
    }

    const tokenCountry = countriesByCode.get(token);
    const isUsState = US_STATE_CODES.has(token);
    const isCanadianProvince = CANADIAN_PROVINCE_CODES.has(token);

    // Codes such as CA, DE, IN, and IL can mean either a country or a North
    // American subdivision. Without a recognized city/country (handled
    // above), guessing would create prohibited false location data.
    if (tokenCountry && (isUsState || isCanadianProvince)) continue;

    if (isUsState) {
      const country = countriesByCode.get('US');
      if (country) codedCountries.set(country.countryCode, country);
      continue;
    }

    if (isCanadianProvince) {
      const country = countriesByCode.get('CA');
      if (country) codedCountries.set(country.countryCode, country);
      continue;
    }

    if (tokenCountry) {
      codedCountries.set(tokenCountry.countryCode, tokenCountry);
    }
  }

  if (codedCountries.size === 0) return null;

  return {
    label: displayLocation,
    addresses: [...codedCountries.values()]
      .slice(0, 6)
      .map((country) => toAddress(country, isRemote)),
  };
};

/**
 * Look up structured addresses for a raw location string. Reviewed mappings
 * win; normalized and conservative country/locality inference cover new
 * variants. Returns null when no truthful country can be established.
 */
export const lookupAddresses = (
  rawLocation: string | null,
): AddressLookupResult | null => {
  if (!rawLocation) return null;

  const exact = mappings[rawLocation];
  if (exact) return exact;

  const normalized = normalizedMappings.get(normalizeLocation(rawLocation));
  if (normalized) return normalized;

  const isRemote = REMOTE_PREFIX.test(rawLocation);
  if (isRemote) {
    const withoutPrefix = rawLocation.replace(REMOTE_PREFIX, '').trim();
    const plain =
      mappings[withoutPrefix] ??
      normalizedMappings.get(normalizeLocation(withoutPrefix));
    if (plain) {
      return {
        ...plain,
        addresses:
          plain.addresses?.map((address) => ({
            ...address,
            isRemote: true,
          })) ?? null,
      };
    }
  }

  return inferAddresses(rawLocation, isRemote);
};
