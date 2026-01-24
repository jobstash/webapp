/**
 * Address interface for mapping scripts.
 * Authoritative Zod schema: src/lib/schemas.ts (addressSchema)
 */
export interface Address {
  /** Display name of the country (e.g., "United States", "Philippines") */
  country: string;
  /** ISO 3166-1 alpha-2 country code (e.g., "US", "PH") */
  countryCode: string;
  /** Whether this is a remote position */
  isRemote: boolean;
  /** City or municipality */
  locality?: string;
  /** State, province, or region (e.g., "CA", "Cebu") */
  region?: string;
  /** Postal code */
  postalCode?: string;
  /** Primary street address */
  street?: string;
  /** Apartment, suite, unit, building, floor, c/o */
  extendedAddress?: string;
  /** Geographic coordinates for LocalBusiness rich results */
  geo?: {
    latitude: number;
    longitude: number;
  };
}

export type AddressMappings = Record<string, Address[]>;
