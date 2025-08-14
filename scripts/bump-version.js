#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

const type = process.argv[2]; // "patch" or "minor"
if (!['patch', 'minor'].includes(type)) {
  console.error('Usage: node scripts/bump-version.js <patch|minor>');
  process.exit(1);
}

try {
  // Bump version without tag
  execSync(`npm version ${type} --no-git-tag-version`, { stdio: 'inherit' });

  // Read updated package.json
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const newVersion = pkg.version;

  // Stage files
  execSync(`git add package.json package-lock.json`, { stdio: 'inherit' });

  // Commit with formatted message
  execSync(`git commit -m "chore: bump version v${newVersion} (${type})"`, {
    stdio: 'inherit',
  });

  console.log(`✅ Version bumped to v${newVersion} (${type})`);
} catch (err) {
  console.error('❌ Error bumping version:', err);
  process.exit(1);
}
