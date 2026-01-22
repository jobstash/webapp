import { readFile } from 'node:fs/promises';
import type { Plan, Task, AgentType } from './types.ts';

const VALID_AGENTS: AgentType[] = ['react-architect', 'react-qa', 'manual'];

export async function parsePlanFile(filePath: string): Promise<Plan> {
  const content = await readFile(filePath, 'utf-8');
  return parsePlan(content);
}

export function parsePlan(content: string): Plan {
  // Extract frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) throw new Error('Missing frontmatter');

  const fm = fmMatch[1];
  const feature = fm.match(/^feature:\s*(.+)$/m)?.[1]?.trim() ?? '';
  const created = fm.match(/^created:\s*(.+)$/m)?.[1]?.trim() ?? '';
  const status = fm.match(/^status:\s*(.+)$/m)?.[1]?.trim() ?? '';

  // Extract overview
  const body = content.replace(/^---\n[\s\S]*?\n---\n*/, '');
  const overview =
    body.match(/## Overview\n+([\s\S]*?)(?=\n## )/)?.[1]?.trim() ?? '';

  // Extract tasks
  const tasksSection = body.match(/## Tasks\n+([\s\S]*)/)?.[1] ?? '';
  const taskBlocks = tasksSection
    .split(/\n(?=### )/)
    .filter((b) => b.startsWith('### '));
  const tasks = taskBlocks.map(parseTaskBlock);

  return { feature, created, status, overview, tasks };
}

function parseTaskBlock(block: string): Task {
  const id = block.match(/^### (.+)/)?.[1]?.trim() ?? '';

  const field = (name: string) =>
    block
      .match(new RegExp(`- \\*\\*${name}\\*\\*:\\s*(.+)$`, 'mi'))?.[1]
      ?.trim();

  const arrayField = (name: string): string[] => {
    const match = block.match(
      new RegExp(`- \\*\\*${name}\\*\\*:\\s*\\[([^\\]]*)\\]`, 'mi'),
    );
    if (!match) return [];
    return match[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  // Parse nested inputs
  const inputsMatch = block.match(
    /- \*\*inputs\*\*:\n([\s\S]*?)(?=\n- \*\*outputs)/i,
  );
  const inputFiles = parseNestedList(inputsMatch?.[1], 'files');
  const contextMatch = inputsMatch?.[1]?.match(/- context:\s*(.+)/);
  const context = contextMatch?.[1]?.trim();

  // Parse nested outputs
  const outputsMatch = block.match(
    /- \*\*outputs\*\*:\n([\s\S]*?)(?=\n- \*\*prompt)/i,
  );
  const outputFiles = parseNestedList(outputsMatch?.[1], 'files');
  const outputExports = parseNestedList(outputsMatch?.[1], 'exports');

  // Parse prompt
  const promptMatch = block.match(
    /- \*\*prompt\*\*:\s*\|\n([\s\S]*?)(?=\n---|\n### |$)/i,
  );
  const prompt =
    promptMatch?.[1]
      ?.split('\n')
      .map((l) => l.replace(/^ {4}/, ''))
      .join('\n')
      .trim() ?? '';

  const agent = (field('agent') ?? 'manual') as AgentType;
  if (!VALID_AGENTS.includes(agent)) {
    throw new Error(`Invalid agent type: ${agent}`);
  }

  return {
    id,
    title: field('title') ?? id,
    agent,
    dependsOn: arrayField('depends_on'),
    inputs: {
      files: inputFiles,
      context: context === 'null' || !context ? null : context,
    },
    outputs: {
      files: outputFiles,
      exports: outputExports,
    },
    prompt,
  };
}

function parseNestedList(block: string | undefined, key: string): string[] {
  if (!block) return [];

  // Inline: `- files: [file1, file2]`
  const inline = block.match(new RegExp(`- ${key}:\\s*\\[([^\\]]*)\\]`, 'i'));
  if (inline) {
    return inline[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Nested: `- files:\n  - file1\n  - file2`
  const nested = block.match(
    new RegExp(`- ${key}:\\n([\\s\\S]*?)(?=\\n  - [a-z]|$)`, 'i'),
  );
  if (!nested) return [];

  return nested[1]
    .split('\n')
    .map((line) => line.match(/^\s+- (.+)/)?.[1]?.trim())
    .filter((x): x is string => !!x);
}
