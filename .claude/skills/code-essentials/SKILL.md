---
name: code-essentials
description: Use when writing or reviewing code - applies fundamental principles for simplicity, clarity, and consistent conventions
---

# Code Essentials

Fundamental principles to apply when writing any code.

## Simplicity

- Write only the absolute minimum code needed
- Minimize cognitive load - code should be clear to junior developers
- Functions do one specific task only
- Avoid over-engineering and premature abstraction

## Project Preferences

- Use **kebab-case** for file names and commit messages
- Prefer **arrow functions** over function declarations

## Conventions

### Naming

- **Functions:** verbs (`getUser`, `validateInput`, `fetchData`)
- **Variables:** nouns (`user`, `inputValue`, `response`)
- **Booleans:** adjective with `is` prefix (`isValid`, `isLoading`, `isEmpty`)

### Colocation

Export only when needed elsewhere. Prefer keeping code close to where it's used:

1. **Same file** - if only used within that file
2. **Same folder** - if only imported by files in that folder
3. **Shared folder** - if imported from multiple locations

### Typescript

- Explicit function return types **except** react components (no `: ReactNode -> {...})
- Use `type` import when applicable
- Return/throw early inside functions - avoid deep nesting
- No `any` type coercion - use utilize typescript: type guards, satisfies, `as` etc
- Avoid ternary operators in component render functions

## React

- Always extract all logic into custom hooks - only ui-related logic should remain in the component

## Testing

- Colocate: test files should be on the same folder as the code they test
- Do not test zod schemas
