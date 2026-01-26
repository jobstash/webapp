/**
 * Fetches all location strings from the middleware API and saves to fetched-locations.json
 * Run with: npx tsx .claude/scripts/address-mapping/fetch-locations.ts <middleware-url>
 * Example: npx tsx .claude/scripts/address-mapping/fetch-locations.ts https://middleware.jobstash.xyz
 */

import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, 'fetched-locations.json');

const fetchLocations = async (): Promise<void> => {
  const mwUrl = process.argv[2];

  if (!mwUrl) {
    console.error('Usage: npx tsx fetch-locations.ts <middleware-url>');
    console.error(
      'Example: npx tsx fetch-locations.ts https://middleware.jobstash.xyz',
    );
    process.exit(1);
  }

  try {
    const apiUrl = `${mwUrl}/jobs/list?page=1&limit=5000`;

    console.log(`Fetching from: ${apiUrl}`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const json = await response.json();
    const jobs = json.data as Array<{
      location?: string | null;
      locationType?: string | null;
    }>;

    const locations = jobs
      .map((job) => {
        if (!job.location) return null;
        // Prepend [REMOTE] when locationType is REMOTE
        if (job.locationType === 'REMOTE') {
          return `[REMOTE] ${job.location}`;
        }
        return job.location;
      })
      .filter((loc): loc is string => Boolean(loc));

    const uniqueLocations = [...new Set(locations)].sort((a, b) =>
      a.localeCompare(b),
    );

    await writeFile(OUTPUT_PATH, JSON.stringify(uniqueLocations, null, 2));

    console.log(`Fetched ${uniqueLocations.length} unique locations`);
    console.log(`Saved to: ${OUTPUT_PATH}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
};

fetchLocations();
