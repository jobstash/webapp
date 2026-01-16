import { select } from '@inquirer/prompts';
import { execSync } from 'child_process';

interface Worktree {
  path: string;
  name: string;
}

const getWorktrees = (): Worktree[] => {
  const output = execSync('git worktree list --porcelain', {
    encoding: 'utf-8',
  });
  const lines = output.split('\n');

  const worktrees: Worktree[] = [];
  let currentPath = '';

  for (const line of lines) {
    if (line.startsWith('worktree ')) {
      currentPath = line.slice('worktree '.length);
    } else if (line.startsWith('branch ')) {
      // Extract branch name from refs/heads/...
      const branch = line.slice('branch '.length).replace('refs/heads/', '');
      worktrees.push({
        path: currentPath,
        name: branch,
      });
    }
  }

  return worktrees;
};

const getMainWorktreePath = (): string => {
  // Main worktree is the first one listed by git
  const output = execSync('git worktree list --porcelain', {
    encoding: 'utf-8',
  });
  const firstLine = output.split('\n')[0];
  if (firstLine.startsWith('worktree ')) {
    return firstLine.slice('worktree '.length);
  }
  return '';
};

const main = async () => {
  const command = process.argv.slice(2).join(' ');

  if (!command) {
    console.error('Error: No command provided');
    console.error('Usage: pnpm worktree:exec "<command>"');
    process.exit(1);
  }

  const allWorktrees = getWorktrees();
  const mainPath = getMainWorktreePath();

  // Filter out the main worktree
  const worktrees = allWorktrees.filter((wt) => wt.path !== mainPath);

  if (worktrees.length === 0) {
    console.error('Error: No worktrees available');
    console.error(
      'Create a worktree with: git worktree add <path> -b <branch>',
    );
    process.exit(1);
  }

  const selectedPath = await select({
    message: 'Select worktree:',
    choices: worktrees.map((wt) => ({
      name: `${wt.name} (${wt.path})`,
      value: wt.path,
    })),
  });

  console.log(`\nExecuting in ${selectedPath}:\n$ ${command}\n`);

  execSync(command, {
    cwd: selectedPath,
    stdio: 'inherit',
  });
};

main();
