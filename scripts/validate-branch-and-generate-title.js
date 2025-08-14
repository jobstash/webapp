#!/usr/bin/env node

const VALID_SCOPES = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test',
];

function validateBranchAndGenerateTitle(branchName) {
  // Check if branch name contains a slash
  if (!branchName.includes('/')) {
    throw new Error("Branch name must be in format 'scope/description'");
  }

  // Extract scope and description
  const [scope, ...descriptionParts] = branchName.split('/');
  const description = descriptionParts.join('/');

  // Check if description is not empty
  if (!description) {
    throw new Error('Branch description cannot be empty');
  }

  // Validate description format (only letters, numbers, hyphens, periods)
  if (!/^[a-zA-Z0-9-.]+$/.test(description)) {
    throw new Error(
      'Branch description must only contain letters, numbers, hyphens, and periods',
    );
  }

  // Validate scope against commitlint types
  if (!VALID_SCOPES.includes(scope)) {
    throw new Error(
      `Invalid branch scope '${scope}'. Must be one of: ${VALID_SCOPES.join(', ')}`,
    );
  }

  // Convert hyphenated description to space-separated and create title
  const titleDescription = description.replace(/-/g, ' ');
  const title = `${scope}: ${titleDescription}`;

  return title;
}

// Main execution
if (require.main === module) {
  const branchName = process.argv[2];

  if (!branchName) {
    console.error('Usage: node validate-branch-and-generate-title.js <branch-name>');
    process.exit(1);
  }

  try {
    const title = validateBranchAndGenerateTitle(branchName);
    console.log(title);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = { validateBranchAndGenerateTitle, VALID_SCOPES };
