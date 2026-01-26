/**
 * Reads new mappings from stdin and merges into mappings.json
 * Validates each address against the Zod schema before adding
 * Rejects XX country codes - regions must be expanded to real countries
 * Run with: echo '{"USA": {"label": "United States", "addresses": [...]}}' | npx tsx .claude/scripts/address-mapping/add-mappings.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { addressSchema } from '../../../src/lib/schemas';

import type { AddressMappings } from './types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAPPINGS_PATH = join(__dirname, 'mappings.json');

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString('utf-8');
};

const validateMappings = (input: unknown): AddressMappings => {
  if (typeof input !== 'object' || input === null) {
    throw new Error('Input must be a JSON object');
  }

  const validated: AddressMappings = {};
  const entries = Object.entries(input as Record<string, unknown>);

  for (const [key, mapping] of entries) {
    if (typeof mapping !== 'object' || mapping === null) {
      throw new Error(
        `Value for "${key}" must be an object with label and addresses`,
      );
    }

    const { label, addresses } = mapping as Record<string, unknown>;

    // Validate label
    if (typeof label !== 'string' || label.length === 0) {
      throw new Error(`Missing or invalid "label" for "${key}"`);
    }

    // addresses can be null for invalid locations
    if (addresses === null) {
      validated[key] = { label, addresses: null };
      continue;
    }

    if (!Array.isArray(addresses)) {
      throw new Error(`"addresses" for "${key}" must be an array or null`);
    }

    const validatedAddresses = addresses.map((address, index) => {
      const result = addressSchema.safeParse(address);

      if (!result.success) {
        const errors = result.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        throw new Error(`Invalid address at "${key}"[${index}]: ${errors}`);
      }

      // Reject XX country codes - regions must be expanded
      if (result.data.countryCode === 'XX') {
        throw new Error(
          `Invalid countryCode "XX" at "${key}"[${index}]: Regional locations must be expanded to real countries`,
        );
      }

      return result.data;
    });

    validated[key] = { label, addresses: validatedAddresses };
  }

  return validated;
};

const addMappings = async (): Promise<void> => {
  try {
    const stdinContent = await readStdin();

    if (!stdinContent.trim()) {
      throw new Error('No input received from stdin');
    }

    let newMappings: unknown;
    try {
      newMappings = JSON.parse(stdinContent);
    } catch {
      throw new Error('Invalid JSON input');
    }

    const validatedMappings = validateMappings(newMappings);
    const newCount = Object.keys(validatedMappings).length;

    if (newCount === 0) {
      console.log('No mappings to add');
      return;
    }

    const existingContent = await readFile(MAPPINGS_PATH, 'utf-8');
    const existingMappings: AddressMappings = JSON.parse(existingContent);

    const mergedMappings: AddressMappings = {
      ...existingMappings,
      ...validatedMappings,
    };

    await writeFile(MAPPINGS_PATH, JSON.stringify(mergedMappings, null, 2));

    console.log(`Added ${newCount} mapping(s)`);
    console.log(`Total mappings: ${Object.keys(mergedMappings).length}`);
    console.log(`Saved to: ${MAPPINGS_PATH}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
};

addMappings();
