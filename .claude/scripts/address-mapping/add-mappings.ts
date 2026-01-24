/**
 * Reads new mappings from stdin and merges into mappings.json
 * Validates each address against the Zod schema before adding
 * Run with: echo '{"USA": [...]}' | npx tsx .claude/scripts/address-mapping/add-mappings.ts
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

  for (const [key, addresses] of entries) {
    if (!Array.isArray(addresses)) {
      throw new Error(`Value for "${key}" must be an array of addresses`);
    }

    const validatedAddresses = addresses.map((address, index) => {
      const result = addressSchema.safeParse(address);

      if (!result.success) {
        const errors = result.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        throw new Error(`Invalid address at "${key}"[${index}]: ${errors}`);
      }

      return result.data;
    });

    validated[key] = validatedAddresses;
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
