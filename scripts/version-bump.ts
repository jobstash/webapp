import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import semver from 'semver';

const BRANCH_BUMP_MAP: Record<string, 'major' | 'minor' | 'patch'> = {
  'feat/': 'minor',
  'feature/': 'minor',
  'major/': 'major',
  // Everything else defaults to patch
};

function getBranchName(): string {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
}

function getBumpType(branch: string): 'major' | 'minor' | 'patch' {
  for (const [prefix, bump] of Object.entries(BRANCH_BUMP_MAP)) {
    if (branch.startsWith(prefix)) return bump;
  }
  return 'patch';
}

function main() {
  const branch = getBranchName();
  const bumpType = getBumpType(branch);

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

  console.log(`Version bumped: ${oldVersion} → ${newVersion} (${bumpType})`);
  console.log(`Branch: ${branch}`);
}

main();
