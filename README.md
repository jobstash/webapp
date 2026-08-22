# webapp v2

## Development Workflow

Production deploys from reviewed changes pushed to `main`. Coolify observes
`main` and starts the existing automatic build.

### Branches

- `main` - Reviewed production branch and Coolify deployment source.

### Branch Naming

Branch names must use one of these prefixes:

| Prefix                                       | Version Bump          | Example             |
| -------------------------------------------- | --------------------- | ------------------- |
| `feat/` or `feature/`                        | Minor (1.2.0 → 1.3.0) | `feat/add-filters`  |
| `major/`                                     | Major (1.2.0 → 2.0.0) | `major/v2-redesign` |
| `fix/`, `chore/`, `refactor/`, `docs/`, etc. | Patch (1.2.0 → 1.2.1) | `fix/login-bug`     |

### Creating a Feature

1. Create a branch from `main`:

   ```bash
   git checkout main && git pull
   git checkout -b feat/my-feature
   ```

2. Make your changes and commit

3. Push and create a PR to `main`:

   ```bash
   git push -u origin feat/my-feature
   ```

4. CI validates the branch and runs lint, build, and tests. Merge only after
   review and green acceptance gates.

### Releasing to Production

Merge the reviewed PR into `main`. Coolify then builds and deploys that commit.
No release publication, version header, release environment variable, or
automatic branch merge is part of deployment.
