---
name: testing-best-practices
description: Use when writing or reviewing tests for components, hooks, utilities, or server-side code. Complements TDD (process) with principles (what to test). Apply when unsure what to assert, when tests break on refactor, or when testing mocks instead of behavior.
---

# Testing Best Practices

## Core Principle

**Test behavior, not implementation.**

Ask: "What does this code do for its consumers?" not "How does it work internally?"

A behavior test survives refactoring. An implementation test breaks when internals change.

### Behavior Test Litmus Test

Before any assertion, ask:

1. Would a user/caller care about this?
2. Would this break if I refactored but kept same behavior?
3. Am I testing what code _does_ or _how_ it does it?

If #2 is "yes" → rewrite.

## What to Test by Code Type

| Type           | Test                                                      | Don't Test                                        |
| -------------- | --------------------------------------------------------- | ------------------------------------------------- |
| **Components** | Rendered output, user interactions, conditional rendering | Internal state, effect triggers, re-render counts |
| **Hooks**      | Returned values, state changes, callback behaviors        | Internal variables, effect dependencies           |
| **Utilities**  | Input → output, edge cases, error conditions              | Implementation details                            |
| **Server**     | DTO validation, transformations, error handling           | Internal fetch logic                              |

## Integration Boundary Exception

At system boundaries, verify integration is wired correctly. **Only valid mock assertions:**

| Boundary        | Example                                                        |
| --------------- | -------------------------------------------------------------- |
| Error reporting | `expect(Sentry.captureException).toHaveBeenCalledWith(error)`  |
| Analytics       | `expect(analytics.track).toHaveBeenCalledWith('event', {...})` |
| Side effects    | localStorage, cookies, URL state                               |
| Cross-module    | Verify component calls correct API function                    |

**Pattern:** Test behavior AND integration together:

```typescript
it('reports error to Sentry when API fails', async () => {
  server.use(http.get('/api/jobs', () => HttpResponse.error()));
  render(<JobList />);

  // Behavior
  expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();

  // Integration
  expect(Sentry.captureException).toHaveBeenCalled();
});
```

## Test File Organization

**Inside test file (colocated):**

- Mocks (`vi.mock()`)
- Test fixtures (`defaultProps`, mock data)
- Setup/teardown
- Single-use helper functions

**Extract to shared folder (2+ files use it):**

- `src/test-utils/` - Global utilities
- `src/features/{feature}/test-utils/` - Feature-specific

## Test Naming

Use functional outcomes:

```typescript
// GOOD
it('filters jobs by location');
it('displays error message on API failure');
it('clears search value after selection');

// BAD - implementation detail
it('sets isOpen state to true');

// BAD - too verbose
it('allows user to filter jobs by selecting a location option');
```

**One behavior per test.** If name has "and", split it.

## Checklist

- [ ] Colocate: test files should be on the same folder as the code they test
- [ ] Tests describe what code does, not how
- [ ] Refactoring internals wouldn't break tests
- [ ] No assertions on internal state or re-render counts
- [ ] Mock assertions only at integration boundaries
- [ ] One behavior per test
- [ ] Mocks/fixtures inside test file
- [ ] Shared utils (2+ files) in `test-utils/` folder

## Red Flags

Stop if you're:

- Asserting on internal state values
- Testing that a mock was rendered
- Writing tests that break on refactor
- Adding test-only methods to production code

## Do NOT Test

### Zod Schemas

**Never test Zod schemas directly.** Testing that a schema validates/rejects data is testing Zod's implementation, not your code's behavior.

```typescript
// BAD - testing Zod's implementation
it('validates email field', () => {
  const result = userSchema.safeParse({ email: 'invalid' });
  expect(result.success).toBe(false);
});

// BAD - testing schema shape
it('requires name field', () => {
  const result = userSchema.safeParse({});
  expect(result.error?.issues[0].path).toContain('name');
});
```

Zod guarantees enforcement. If the schema is defined correctly, it works. Test the **behavior that uses the schema** instead (e.g., component shows error message, API returns 400).

**REQUIRED COMPANION:** Use with superpowers:test-driven-development for the complete testing workflow (TDD handles _when_, this handles _what_).
