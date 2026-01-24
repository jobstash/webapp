/**
 * Compares fetched locations against existing mappings to find unmapped strings
 * Run with: npx tsx .claude/scripts/address-mapping/find-unmapped.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AddressMappings } from './types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FETCHED_PATH = join(__dirname, 'fetched-locations.json');
const MAPPINGS_PATH = join(__dirname, 'mappings.json');
const OUTPUT_PATH = join(__dirname, 'unmapped.json');

const findUnmapped = async (): Promise<void> => {
  try {
    const [fetchedContent, mappingsContent] = await Promise.all([
      readFile(FETCHED_PATH, 'utf-8'),
      readFile(MAPPINGS_PATH, 'utf-8'),
    ]);

    const fetchedLocations: string[] = JSON.parse(fetchedContent);
    const mappings: AddressMappings = JSON.parse(mappingsContent);

    if (!Array.isArray(fetchedLocations)) {
      throw new Error('fetched-locations.json is not an array');
    }

    const mappedKeys = new Set(Object.keys(mappings));
    const unmapped = fetchedLocations.filter(
      (location) => !mappedKeys.has(location),
    );

    await writeFile(OUTPUT_PATH, JSON.stringify(unmapped, null, 2));

    console.log(`Total locations: ${fetchedLocations.length}`);
    console.log(`Already mapped: ${mappedKeys.size}`);
    console.log(`Unmapped: ${unmapped.length}`);
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

findUnmapped();
