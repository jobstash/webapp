/**
 * Merges batch mapping files into mappings.json and cleans up temp files.
 * Run after all address-mapper agents complete:
 *   npx tsx .claude/scripts/address-mapping/finalize-mappings.ts
 */

import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { addressSchema } from '../../../src/lib/schemas';

import type { AddressMappings } from './types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAPPINGS_PATH = join(__dirname, 'mappings.json');
const UNCERTAIN_PATH = join(__dirname, 'uncertain-mappings.json');
const TEMP_DIR = join(__dirname, 'temp');

interface BatchOutput {
  mappings: Record<string, unknown>;
  uncertain?: string[];
}

const validateMappings = (
  input: Record<string, unknown>,
  sourcePath: string,
): AddressMappings => {
  const validated: AddressMappings = {};

  for (const [key, mapping] of Object.entries(input)) {
    if (typeof mapping !== 'object' || mapping === null) {
      console.warn(
        `Warning: Skipping "${key}" in ${sourcePath} - invalid mapping object`,
      );
      continue;
    }

    const { label, addresses } = mapping as Record<string, unknown>;

    if (typeof label !== 'string' || label.length === 0) {
      console.warn(
        `Warning: Skipping "${key}" in ${sourcePath} - missing or invalid label`,
      );
      continue;
    }

    if (addresses === null) {
      validated[key] = { label, addresses: null };
      continue;
    }

    if (!Array.isArray(addresses)) {
      console.warn(
        `Warning: Skipping "${key}" in ${sourcePath} - addresses must be array or null`,
      );
      continue;
    }

    const validatedAddresses = [];
    let hasError = false;

    for (let i = 0; i < addresses.length; i++) {
      const result = addressSchema.safeParse(addresses[i]);

      if (!result.success) {
        const errors = result.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        console.warn(
          `Warning: Invalid address at "${key}"[${i}] in ${sourcePath}: ${errors}`,
        );
        hasError = true;
        break;
      }

      if (result.data.countryCode === 'XX') {
        console.warn(
          `Warning: Invalid countryCode "XX" at "${key}"[${i}] in ${sourcePath}`,
        );
        hasError = true;
        break;
      }

      validatedAddresses.push(result.data);
    }

    if (!hasError) {
      validated[key] = { label, addresses: validatedAddresses };
    }
  }

  return validated;
};

const finalizeMappings = async (): Promise<void> => {
  try {
    // Read batch files
    let batchFiles: string[];
    try {
      const files = await readdir(TEMP_DIR);
      batchFiles = files
        .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
        .sort();
    } catch {
      console.log('No temp directory found. Nothing to finalize.');
      return;
    }

    if (batchFiles.length === 0) {
      console.log('No batch files found. Nothing to finalize.');
      return;
    }

    console.log(`Found ${batchFiles.length} batch file(s) to process`);

    // Read existing mappings
    let existingMappings: AddressMappings = {};
    try {
      const content = await readFile(MAPPINGS_PATH, 'utf-8');
      existingMappings = JSON.parse(content);
    } catch {
      console.log('No existing mappings.json found, starting fresh');
    }

    const allUncertain: string[] = [];
    const failedBatches: string[] = [];
    let newMappingsCount = 0;

    // Process each batch file
    for (const batchFile of batchFiles) {
      const batchPath = join(TEMP_DIR, batchFile);

      try {
        const content = await readFile(batchPath, 'utf-8');
        const batch: BatchOutput = JSON.parse(content);

        if (!batch.mappings || typeof batch.mappings !== 'object') {
          console.warn(`Warning: ${batchFile} has no valid mappings object`);
          failedBatches.push(batchFile);
          continue;
        }

        const validated = validateMappings(batch.mappings, batchFile);
        const validatedCount = Object.keys(validated).length;

        if (validatedCount > 0) {
          Object.assign(existingMappings, validated);
          newMappingsCount += validatedCount;
        }

        if (batch.uncertain && Array.isArray(batch.uncertain)) {
          allUncertain.push(...batch.uncertain);
        }

        console.log(`  ${batchFile}: ${validatedCount} valid mappings`);
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`Warning: Failed to process ${batchFile}: ${msg}`);
        failedBatches.push(batchFile);
      }
    }

    // Sort keys alphabetically
    const sortedMappings = Object.fromEntries(
      Object.entries(existingMappings).sort(([a], [b]) =>
        a.toLowerCase().localeCompare(b.toLowerCase()),
      ),
    ) as AddressMappings;

    // Write final mappings
    await writeFile(MAPPINGS_PATH, JSON.stringify(sortedMappings, null, 2));

    // Write uncertain mappings for review (same format as mappings.json)
    if (allUncertain.length > 0) {
      const uncertainMappings: AddressMappings = {};
      for (const item of allUncertain) {
        // Extract location key (before " - " if present)
        const dashIndex = item.indexOf(' - ');
        const key = dashIndex > 0 ? item.slice(0, dashIndex) : item;
        if (sortedMappings[key]) {
          uncertainMappings[key] = sortedMappings[key];
        }
      }
      if (Object.keys(uncertainMappings).length > 0) {
        const sortedUncertain = Object.fromEntries(
          Object.entries(uncertainMappings).sort(([a], [b]) =>
            a.toLowerCase().localeCompare(b.toLowerCase()),
          ),
        ) as AddressMappings;
        await writeFile(
          UNCERTAIN_PATH,
          JSON.stringify(sortedUncertain, null, 2),
        );
      }
    }

    // Clean up temp directory (includes all batch files)
    try {
      await rm(TEMP_DIR, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }

    // Final report
    console.log('\n=== Finalize Complete ===');
    console.log(`New mappings added: ${newMappingsCount}`);
    console.log(`Total mappings: ${Object.keys(sortedMappings).length}`);

    if (failedBatches.length > 0) {
      console.log(`\nFailed batches: ${failedBatches.join(', ')}`);
    }

    if (allUncertain.length > 0) {
      console.log('\nUncertain mappings (review recommended):');
      for (const item of allUncertain) {
        console.log(`  - ${item}`);
      }
      console.log(`\nUncertain mappings saved to: ${UNCERTAIN_PATH}`);
    }

    console.log(`\nSaved to: ${MAPPINGS_PATH}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
};

finalizeMappings();
