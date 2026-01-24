import { NextResponse } from 'next/server';

import { clientEnv } from '@/lib/env/client';

/**
 * Internal API route that fetches raw location strings from the API.
 * Used by the address mapping workflow to identify unmapped locations.
 * Returns the raw location strings BEFORE transformation to Address[].
 */
export const GET = async () => {
  try {
    // Fetch raw data directly from API (not through transformer)
    const url = `${clientEnv.MW_URL}/jobs/list?page=1&limit=5000`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const json = await response.json();
    const jobs = json.data as Array<{ location?: string | null }>;

    // Extract unique job-level location strings
    const locations = jobs
      .map((job) => job.location)
      .filter((loc): loc is string => Boolean(loc));

    const uniqueLocations = [...new Set(locations)].sort((a, b) =>
      a.localeCompare(b),
    );

    return NextResponse.json(uniqueLocations);
  } catch (error) {
    console.error('[api/locations] Failed to fetch locations:', error);

    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 },
    );
  }
};
