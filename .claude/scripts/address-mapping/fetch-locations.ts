/**
 * Fetches all location strings from the API and saves to fetched-locations.json
 * Run with: npx tsx .claude/scripts/address-mapping/fetch-locations.ts
 */

import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, 'fetched-locations.json');
const API_URL = 'http://localhost:3000/api/locations';

const fetchLocations = async (): Promise<void> => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const locations: string[] = await response.json();

    if (!Array.isArray(locations)) {
      throw new Error('API response is not an array');
    }

    await writeFile(OUTPUT_PATH, JSON.stringify(locations, null, 2));

    console.log(`Fetched ${locations.length} locations`);
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
