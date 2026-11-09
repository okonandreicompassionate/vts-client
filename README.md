## Zoracom’s Visitor Tracking System 
Streamlines visitor access and management for effortless logging


## Setup

Requires Node 22 and pnpm (version pinned in `package.json` → `packageManager`).

```bash
pnpm install
cp .env.example .env   # point VITE_API_URL at your server
pnpm dev               # http://localhost:5173
```

Checks run in CI (`.github/workflows/ci.yml`): `pnpm lint`, `pnpm exec tsc -b`, `pnpm exec vite build`.

## Environment

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | yes | `/api` in production (proxied by `vercel.json`), `http://localhost:4000` locally |
| `VITE_MSAL_CLIENT_ID` | no | Entra app for "Sign in with Microsoft". Defaults to the Zoracom app |
| `VITE_MSAL_AUTHORITY` | no | Defaults to the zoracom.com directory. Use `https://login.microsoftonline.com/organizations` (with a multi-tenant app registration) to allow every organization's Microsoft accounts |

Vite inlines these at build time, so change them in Vercel and redeploy.

## Deploy (Vercel)

1. Import the repo in Vercel (framework preset: Vite, build command `pnpm build`, output `dist`).
2. Set `VITE_API_URL=/api` and, if needed, the `VITE_MSAL_*` variables.
3. `vercel.json` proxies `/api/*` to the Render server and serves `index.html` for every other path (client-side routing). Update the rewrite destination if the server URL changes.
4. Add the deployed origin as a **SPA redirect URI** on the Entra app registration, otherwise Microsoft sign-in fails.
5. The server's `FRONTEND_URL` must include the deployed origin (CORS and email links).

`vercel.json` also sets basic security headers and long-term caching for hashed `/assets`. There is no Content-Security-Policy yet: MSAL popups and Ant Design's runtime styles need a carefully tuned one, so add it deliberately and test sign-in.

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



"# vts-client" 
