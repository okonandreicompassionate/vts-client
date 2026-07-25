# Zoracom's Visitor Tracking System

Streamlines visitor access and management for effortless logging


## Commit Guidelines

This project uses **Husky** and **Commitlint** to enforce the **Conventional Commits** specification. All commits must follow the required format to maintain a clean Git history and enable automated tooling such as changelog generation and semantic versioning.

### Commit Format

```text
<type>(<optional-scope>): <description>
```

**Examples**

```text
feat(auth): add password reset flow
fix(api): handle expired access tokens
refactor(modal): simplify confirmation state
docs: update installation guide
chore: configure commitlint
```

### Commit Types

| Type       | Description                                                                |
| ---------- | -------------------------------------------------------------------------- |
| `feat`     | Introduces a new feature or user-facing functionality.                     |
| `fix`      | Fixes a bug or incorrect behavior.                                         |
| `refactor` | Improves code structure without changing behavior.                         |
| `perf`     | Improves performance.                                                      |
| `docs`     | Documentation-only changes.                                                |
| `style`    | Formatting or stylistic changes that do not affect functionality.          |
| `test`     | Adds or updates tests.                                                     |
| `build`    | Changes to the build system, tooling, or dependencies.                     |
| `ci`       | Changes to CI/CD configuration or workflows.                               |
| `chore`    | Maintenance tasks, project configuration, or other non-functional changes. |
| `revert`   | Reverts a previous commit.                                                 |

### Guidelines

* Write commit messages in the **imperative mood**.

  * ✅ `feat: add authentication`
  * ❌ `feat: added authentication`

* Keep the subject concise and descriptive.

* The commit header **must not exceed 100 characters**.

* Use a scope when it improves clarity.

  * `fix(auth): handle expired token`
  * `refactor(table): extract pagination hook`



### Pre-Commit Checks

Before every commit, Husky automatically runs:

```bash
pnpm lint
pnpm build
```

