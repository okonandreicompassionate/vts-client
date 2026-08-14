## Zoracom’s Visitor Tracking System 
Streamlines visitor access and management for effortless logging


## Codebase Architecture

This project follows a **feature-based architecture inspired by [Bulletproof React](https://github.com/alan2207/bulletproof-react)**. Application code is organized around business domains, with each feature owning its components, API logic, hooks, types, and utilities.

Shared concerns that are used across multiple features live in common application-level directories, while feature-specific logic remains close to the feature that owns it. This keeps dependencies explicit, reduces coupling, and makes the codebase easier for new developers to understand, maintain, and extend.

The architecture follows a simple principle:

> **Organize code by what it does, not only by what type of file it is.**

This structure is intentionally designed to provide a clear separation of responsibilities while keeping the project scalable as new business domains are introduced.


## Commit Guidelines

This project uses **Husky** and **Commitlint** to enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Format: 
`<type>(<optional-scope>): <description>`


**Examples**

- feat(auth): add password reset flow
- fix(api): handle expired access tokens
- refactor(modal): simplify confirmation state
- perf(dashboard): reduce visitor list re-renders
- perf(api): cache carrier code lookups
- docs: update installation guide
- chore: configure commitlint

See `commitlint.config.js` in this repo for exact rules.



