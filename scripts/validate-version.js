#!/usr/bin/env node

const { execSync } = require('child_process');
const semver = require('semver');

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8',
    }).trim();
  } catch (error) {
    console.error(' Failed to get current branch');
    console.error('Error:', error.message);
    process.exit(1);
  }
}
function extractCoreVersion(version) {
  // Extract major.minor.patch from a version string, ignoring prerelease/build metadata
  const parsed = semver.parse(version);
  if (!parsed) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return `${parsed.major}.${parsed.minor}.${parsed.patch}`;
}

function getRemoteMainPackageJson() {
  try {
    const result = execSync('gh api repos/:owner/:repo/contents/package.json?ref=main', {
      encoding: 'utf8',
      env: { ...process.env, GITHUB_TOKEN: process.env.GITHUB_TOKEN },
    });

    const response = JSON.parse(result);
    const content = Buffer.from(response.content, 'base64').toString('utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('❌ Failed to fetch remote main branch package.json');
    console.error('Make sure you have gh CLI installed and GITHUB_TOKEN is set');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

function getLocalMainPackageJson() {
  try {
    const content = execSync('git show main:package.json', {
      encoding: 'utf8',
    });
    return JSON.parse(content);
  } catch (error) {
    console.error('❌ Failed to read package.json from local main branch');
    console.error('Make sure local main branch exists and contains package.json');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function validateVersion() {
  const currentBranch = getCurrentBranch();

  if (currentBranch !== 'main') {
    console.log('Version validation skipped - only runs on main branch');
    process.exit(0);
  }

  const remoteMainPackage = getRemoteMainPackageJson();
  const localMainPackage = getLocalMainPackageJson();

  const remoteMainVersion = remoteMainPackage.version;
  const localMainVersion = localMainPackage.version;

  console.log(`Remote main: ${remoteMainVersion}`);
  console.log(`Local main:  ${localMainVersion}\n`);

  let remoteMainCoreVersion, localMainCoreVersion;

  try {
    remoteMainCoreVersion = extractCoreVersion(remoteMainVersion);
    localMainCoreVersion = extractCoreVersion(localMainVersion);
  } catch (error) {
    console.error('❌ Version parsing failed:', error.message);
    process.exit(1);
  }

  // Compare versions using semver
  if (semver.lte(localMainCoreVersion, remoteMainCoreVersion)) {
    console.error('❌ VERSION VALIDATION FAILED!');
    console.error('');
    console.error(
      `Local main version (${localMainCoreVersion}) must be greater than remote main version (${remoteMainCoreVersion})`,
    );
    console.error('');
    console.error('Please increment the version in local main branch package.json:');
    console.error(
      `  • Patch: ${semver.inc(remoteMainCoreVersion, 'patch')} (for bug fixes)`,
    );
    console.error(
      `  • Minor: ${semver.inc(remoteMainCoreVersion, 'minor')} (for new features)`,
    );
    console.error(
      `  • Major: ${semver.inc(remoteMainCoreVersion, 'major')} (for breaking changes)`,
    );
    console.error('');
    process.exit(1);
  }

  const versionType = semver.diff(remoteMainCoreVersion, localMainCoreVersion);
  console.log(`✅ ${remoteMainCoreVersion} → ${localMainCoreVersion} (${versionType})`);
  process.exit(0);
}

validateVersion().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
