# webapp v2

## Development Workflow

This project uses a two-branch workflow with automated releases.

### Branches

- `dev` - Integration branch. All PRs merge here.
- `main` - Production branch. Only updated via release publish.

### Branch Naming

Branch names must use one of these prefixes:

| Prefix                                       | Version Bump          | Example             |
| -------------------------------------------- | --------------------- | ------------------- |
| `feat/` or `feature/`                        | Minor (1.2.0 → 1.3.0) | `feat/add-filters`  |
| `major/`                                     | Major (1.2.0 → 2.0.0) | `major/v2-redesign` |
| `fix/`, `chore/`, `refactor/`, `docs/`, etc. | Patch (1.2.0 → 1.2.1) | `fix/login-bug`     |

### Creating a Feature

1. Create a branch from `dev`:

   ```bash
   git checkout dev && git pull
   git checkout -b feat/my-feature
   ```

2. Make your changes and commit

3. Bump the version:

   ```bash
   pnpm version:bump
   ```

4. Push and create a PR to `dev`:

   ```bash
   git push -u origin feat/my-feature
   ```

5. CI will validate branch prefix and version, then run lint/build/test

### Releasing to Production

1. Go to GitHub Releases
2. Review the draft release (auto-generated from merged PRs)
3. Click "Publish release"
4. This triggers:
   - Auto-merge `dev` → `main`
   - DevOps deploys from `main`

### Version Tracking

The app version is exposed via `X-App-Version` header on API responses
for client staleness detection.
