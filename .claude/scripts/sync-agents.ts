import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

interface AgentMeta {
  name: string;
  description: string;
}

const CLAUDE_DIR = join(process.cwd(), '.claude');
const AGENTS_DIR = join(CLAUDE_DIR, 'agents');
const IMPLEMENT_PLAN_DIR = join(CLAUDE_DIR, 'scripts', 'implement-plan');

async function parseAgentFrontmatter(
  content: string,
): Promise<AgentMeta | null> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fm = match[1];
  const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = fm.match(/^description:\s*(.+)$/m)?.[1]?.trim();

  if (!name) return null;
  return { name, description: description ?? '' };
}

async function getAgents(): Promise<AgentMeta[]> {
  const files = await readdir(AGENTS_DIR);
  const agents: AgentMeta[] = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const content = await readFile(join(AGENTS_DIR, file), 'utf-8');
    const meta = await parseAgentFrontmatter(content);
    if (meta) agents.push(meta);
  }

  return agents;
}

async function updateTypesFile(agents: AgentMeta[]): Promise<void> {
  const typesPath = join(IMPLEMENT_PLAN_DIR, 'types.ts');
  const content = await readFile(typesPath, 'utf-8');

  const agentNames = [...agents.map((a) => `'${a.name}'`), "'manual'"];
  const newType = `export type AgentType = ${agentNames.join(' | ')};`;

  const updated = content.replace(/export type AgentType = [^;]+;/, newType);

  await writeFile(typesPath, updated);
  console.log(`✓ Updated types.ts with AgentType: ${agentNames.join(' | ')}`);
}

async function updateParserFile(agents: AgentMeta[]): Promise<void> {
  const parserPath = join(IMPLEMENT_PLAN_DIR, 'parser.ts');
  const content = await readFile(parserPath, 'utf-8');

  const agentNames = [...agents.map((a) => `'${a.name}'`), "'manual'"];
  const newArray = `const VALID_AGENTS: AgentType[] = [${agentNames.join(', ')}];`;

  const updated = content.replace(
    /const VALID_AGENTS: AgentType\[\] = \[[^\]]+\];/,
    newArray,
  );

  await writeFile(parserPath, updated);
  console.log(
    `✓ Updated parser.ts with VALID_AGENTS: [${agentNames.join(', ')}]`,
  );
}

function generateSubagentTable(agents: AgentMeta[]): string {
  const lines = [
    '**Subagent mapping:**',
    '',
    '| task.agent | Subagent | Purpose |',
    '|------------|----------|---------|',
  ];

  for (const agent of agents) {
    lines.push(
      `| \`${agent.name}\` | \`${agent.name}\` | ${agent.description} |`,
    );
  }

  lines.push('| `manual` | (skip - report to user) | Human action required |');

  return lines.join('\n');
}

async function main() {
  console.log('Syncing agents configuration...\n');

  const agents = await getAgents();

  if (agents.length === 0) {
    console.error('No agents found in .claude/agents/');
    process.exit(1);
  }

  console.log(
    `Found ${agents.length} agents: ${agents.map((a) => a.name).join(', ')}\n`,
  );

  await updateTypesFile(agents);
  await updateParserFile(agents);

  console.log('\n--- Subagent mapping for implement-plan.md ---\n');
  console.log(generateSubagentTable(agents));
  console.log(
    '\n✓ Copy the table above to .claude/commands/implement-plan.md if needed',
  );
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
