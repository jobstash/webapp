/**
 * Fixes debug ID linkage between JS and source map files.
 *
 * Turbopack generates JS and .map files with different hashes.
 * sentry-cli injects debugId into JS files but can't follow
 * sourceMappingURL to inject debug_id into the corresponding
 * .map files when names don't match.
 *
 * This script reads the debugId from each JS file and writes the
 * matching debug_id into its referenced .map file.
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CHUNKS_DIR = join(process.cwd(), '.next/static/chunks');

const DEBUG_ID_RE = /\/\/# debugId=([a-f0-9-]+)/;
const SOURCE_MAP_URL_RE = /\/\/# sourceMappingURL=(.+\.map)/;

const jsFiles = readdirSync(CHUNKS_DIR).filter((f) => f.endsWith('.js'));

let fixed = 0;

for (const jsFile of jsFiles) {
  const jsPath = join(CHUNKS_DIR, jsFile);
  const content = readFileSync(jsPath, 'utf8');

  const debugIdMatch = DEBUG_ID_RE.exec(content);
  const mapUrlMatch = SOURCE_MAP_URL_RE.exec(content);

  if (!debugIdMatch || !mapUrlMatch) continue;

  const debugId = debugIdMatch[1];
  const mapPath = join(CHUNKS_DIR, mapUrlMatch[1]);

  let mapContent: string;
  try {
    mapContent = readFileSync(mapPath, 'utf8');
  } catch {
    continue;
  }

  // Skip if already has debug_id
  if (mapContent.includes('"debug_id"')) continue;

  // Insert debug_id into the JSON source map
  const patched = mapContent.replace(
    /^\{"version"/,
    `{"debug_id":"${debugId}","version"`,
  );

  if (patched !== mapContent) {
    writeFileSync(mapPath, patched);
    fixed++;
  }
}

console.log(`Fixed debug_id in ${fixed} source map files`);
