import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

import semver from 'semver';

type BumpType = 'major' | 'minor' | 'patch';

const BRANCH_BUMP_MAP: Record<string, BumpType> = {
  'feat/': 'minor',
  'feature/': 'minor',
  'major/': 'major',
  // Everything else defaults to patch
};

function getBranchName(): string {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
}

function getBumpTypeFromBranch(branch: string): BumpType {
  for (const [prefix, bump] of Object.entries(BRANCH_BUMP_MAP)) {
    if (branch.startsWith(prefix)) return bump;
  }
  return 'patch';
}

function getBumpTypeFromArgs(): BumpType | null {
  const args = process.argv.slice(2);
  if (args.includes('--major')) return 'major';
  if (args.includes('--minor')) return 'minor';
  if (args.includes('--patch')) return 'patch';
  return null;
}

function main() {
  const branch = getBranchName();
  const argBumpType = getBumpTypeFromArgs();
  const bumpType = argBumpType ?? getBumpTypeFromBranch(branch);

  const packagePath = 'package.json';
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  const oldVersion = packageJson.version;

  const newVersion = semver.inc(oldVersion, bumpType);
  if (!newVersion) {
    console.error(`Failed to bump version from ${oldVersion}`);
    process.exit(1);
  }

  packageJson.version = newVersion;
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

  const source = argBumpType ? 'flag' : 'branch';
  console.log(
    `Version bumped: ${oldVersion} → ${newVersion} (${bumpType} from ${source})`,
  );
  console.log(`Branch: ${branch}`);
}

main();
