---
name: generate-test-checklist
description: Generate a behavior-focused test checklist for a feature
---

# Generate Test Checklist

Create a test checklist documenting behaviors to verify for a feature.

## Usage

```
/generate-test-checklist <feature-name>
```

Or without argument (auto-detects from `.claude-worktree.json`):

```
/generate-test-checklist
```

## Output

```
docs/todo-tests/<feature>.md
```

## File Format

```markdown
# <feature> - Test Checklist

## Behaviors to Test

- [ ] <behavior description 1>
- [ ] <behavior description 2>
- ...
```

## Writing Guidelines

- Describe what the user/system should be able to do
- Focus on observable behavior, not internal implementation
- Use action verbs: "renders", "displays", "navigates", "filters", "shows"
- Each checkbox = one testable behavior
- Keep descriptions concise but specific

## Deriving Behaviors

Gather context from:

1. Recent git changes: `git diff main --name-only`
2. Plan file (if in worktree): `.claude-worktree.json` → `metadata.plan`
3. Feature files in `src/features/<feature>/`
4. The feature's intended functionality

## Example Output

```markdown
# pillar-filters - Test Checklist

## Behaviors to Test

- [ ] Visiting `/t-typescript` displays "TypeScript Jobs" as hero heading
- [ ] Visiting `/l-usa` pre-filters job list to USA location
- [ ] Invalid pillar slug (e.g., `/x-invalid`) shows 404 page
- [ ] Filter params from pillar slug persist when navigating to job details
- [ ] Pillar page includes correct meta title and description for SEO
```

## Execution

1. Determine feature name (from argument or `.claude-worktree.json`)
2. Gather context (git diff, plan file, feature files)
3. Generate behavior checklist
4. Write to `docs/todo-tests/<feature>.md`
5. Report: `✓ Test checklist created: docs/todo-tests/<feature>.md`
