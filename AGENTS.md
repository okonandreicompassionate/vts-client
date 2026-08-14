# AGENTS.md

## Project Overview

VTS(Visitor Tracking System) is a scalable application that Streamlines visitor access and management for effortless logging

- **React Vite**: Modern Vite-based React application


## Setup Commands

```bash


# Install dependencies
pnpm install

# Start development server
pnpm dev

# Lint code
pnpm lint

# Build for production
pnpm build
```

## Project Structure

The codebase follows a feature-based architecture organized as follows:

```
src/
├── app/              # Application layer (routes, providers, router)
├── components/       # Shared UI components
├── config/          # Global configurations and env variables
├── features/        # Feature-based modules (admins, visitors, etc.)
├── hooks/           # Shared React hooks
├── lib/             # Preconfigured libraries (react-query, auth, etc.)
├── types/           # Shared TypeScript types
└── utils/           # Shared utility functions
```

### Feature Structure
Each feature should be self-contained:

```
src/features/admin/
├── api/         # API calls and hooks for this feature
├── components/  # Feature-specific components  
├── hooks/       # Feature-specific hooks
├── stores/      # Feature-specific state
├── types/       # Feature-specific types
└── utils/       # Feature-specific utilities
```

## Code Standards

### TypeScript
- **Strict mode enabled** - All TypeScript strict checks are enforced
- **Type-first approach** - Define types before implementation
- **Absolute imports** - Use `@/` prefix for all src imports (e.g., `@/components/ui/button`)

### Code Style
- **ESLint + Prettier** configured for consistent formatting
- **Kebab-case** for file and folder names
- **PascalCase** for React components
- **camelCase** for functions and variables

### Architecture Rules
- **No cross-feature imports** - Features should not import from each other
- **Unidirectional flow** - Code flows: shared → features → app
- **Colocation** - Keep related code as close as possible to where it's used

## Component Guidelines

### Best Practices
- **Composition over props** - Use children/slots instead of many props
- **Single responsibility** - Each component should have one clear purpose  
- **Extract render functions** - Move complex JSX into separate components
- **Limit prop count** - Consider composition if accepting too many props

### Styling
- **Tailwind CSS** is the primary styling solution
- **Headless UI components** using Radix UI primitives
- **ShadCN/UI pattern** - Components are copied into codebase, not installed as packages

## State Management Strategy

### Component State
- Use `useState` for simple independent state
- Use `useReducer` for complex state with multiple related updates

### Application State  
- **Redux Store** for global application state (modals, notifications, themes)
- Keep state as close to usage as possible
- Avoid premature globalization

### Server State
- **RTK Query (TanStack Query)** for all server state management

### Form State
- **React Hook Form** for form management
- **Zod** for form validation schemas
- Create reusable Form and Input components

## State Management (Redux)

### Principles

- Use **Redux Toolkit** (`configureStore`), never the legacy `redux` `createStore` (deprecated).
- **Server state** lives in **RTK Query** (cache, refetch, loading flags) — do not hand-write
  slices for API data.
- **Client/UI state only** (auth token, filters, toggles) lives in `createSlice` slices.
- **One API slice per app** (`createApi`); split endpoints per feature with `injectEndpoints`.
- **Never hand-write types.** Infer `RootState` / `AppDispatch` from the store and expose
  pre-typed hooks.

### File Placement

| Concern | Location |
|---|---|
| Configured base API slice (`createApi`) | `lib/rtk-query.ts` |
| Configured HTTP client (axios instance, if used) | `lib/api-client.ts` |
| Store setup (`configureStore`, `RootState`, `AppDispatch`) | `stores/store.ts` |
| Typed hooks (`useAppDispatch`, `useAppSelector`) | `stores/hooks.ts` |
| Feature endpoints (`injectEndpoints`) + generated hooks | `features/<feature>/api/*.ts` |
| Feature client-state slice | `features/<feature>/<feature>Slice.ts` |
| Provider composition | `app/provider.tsx` |

> Rule of thumb: the **configured library instance** → `lib/`; the **actual requests + hooks**
> → `features/<feature>/api/`; the **global store** → `stores/`.

### Base Slice

The base slice holds the `baseQuery` and `tagTypes`; features inject their own endpoints.

// lib/rtk-query.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const baseApi = createApi({
reducerPath: "api",
baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
tagTypes: ["Visitor"],
endpoints: () => ({}), // features inject into this
});


### Store & Typed Hooks

Register `baseApi.reducer` + `baseApi.middleware`; infer types from the store.

// stores/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "../lib/rtk-query";
export const store = configureStore({
reducer: { [baseApi.reducerPath]: baseApi.reducer },
middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});
setupListeners(store.dispatch); // refetchOnFocus / refetchOnReconnect
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
​
// stores/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

### Feature Endpoints

Each feature injects its endpoints and re-exports the auto-generated hooks. Tag each item as
`{ type, id }` and the collection as `{ type, id: 'LIST' }` so mutations refetch only what changed.


## API Layer

> The shared `baseApi` slice is defined once in `lib/rtk-query.ts` — see the
> **State Management** section. This section covers how features add endpoints to it.

### Structure

Use **one API slice per app** (`createApi`), and split endpoints by feature with
`injectEndpoints` — do not create a separate API slice per resource.

Each feature's `api/` folder should define:

1. **Types** for request args and response data (plus optional `transformResponse` for validation/reshaping)
2. **Endpoint definitions** (`build.query` / `build.mutation`) with cache **tags** for invalidation
3. **Auto-generated hooks** exported from the slice (RTK Query generates these — never hand-write them)

Cache invalidation uses the tag system: queries `providesTags`, mutations `invalidatesTags`.
Tag each item as `{ type, id }` and the collection as `{ type, id: 'LIST' }` so mutations
refetch only what actually changed.

### Example Pattern

​
// features/discussions/api/discussions.ts
import { baseApi } from "../../../lib/rtk-query";
export type Discussion = { id: string; title: string; body: string };
export type GetDiscussionsParams = { page?: number; search?: string };
export const discussionsApi = baseApi.injectEndpoints({
endpoints: (build) => ({
getDiscussions: build.query<Discussion[], GetDiscussionsParams>({
query: (params) => ({ url: "/discussions", params }),
providesTags: (result) =>
result
? [
...result.map(({ id }) => ({ type: "Discussion" as const, id })),
{ type: "Discussion" as const, id: "LIST" },
]
: [{ type: "Discussion" as const, id: "LIST" }],
}),
createDiscussion: build.mutation<Discussion, Pick<Discussion, "title" | "body">>({
query: (body) => ({ url: "/discussions", method: "POST", body }),
invalidatesTags: [{ type: "Discussion", id: "LIST" }],
}),
}),
});
// Auto-generated hooks (replaces manual React Query hooks)
export const { useGetDiscussionsQuery, useCreateDiscussionMutation } = discussionsApi;

Remember to register each feature's tag names in `tagTypes` on the base slice
(`lib/rtk-query.ts`), and import the endpoints file somewhere so `injectEn


```

## Security Considerations

### Authentication
- **JWT tokens** stored in HttpOnly cookies (preferred) or localStorage
- **React Query Auth** for user state management
- Automatic token refresh handling

### Authorization
- **RBAC** (Role-Based Access Control) for basic permissions
- **PBAC** (Permission-Based Access Control) for granular control
- Client-side authorization for UX (always validate server-side)

### XSS Prevention
- **Sanitize all user inputs** before rendering
- Use DOMPurify for HTML content sanitization
- Validate and escape data at boundaries

## Performance Optimization

### Code Splitting
- **Route-level splitting** - Lazy load pages/routes
- Avoid excessive splitting (balance requests vs. bundle size)

### React Optimizations
- **Children prop pattern** - Prevent unnecessary re-renders
- **State colocation** - Keep state close to where it's used
- **State initializer functions** - For expensive initial computations

### Image Optimization
- Lazy loading for images outside viewport
- Modern formats (WebP) with fallbacks
- Responsive images using srcset

## Error Handling

### API Errors
- Global error interceptor in API client
- Automatic error notifications via toast system
- Automatic token refresh on 401 errors

### Application Errors
- **Error Boundaries** at feature level (not just app level)
- Graceful fallbacks for broken components

## Build and Deployment

### Development
- **Vite** for fast development builds and HMR
- **TypeScript** strict mode for compile-time safety
- **ESLint + Prettier** for code quality

### Production
- Deploy to CDN platforms: **Vercel**, **Netlify**, or **AWS CloudFront**
- Source maps uploaded to Sentry for error tracking
- Environment-specific configuration via env files

## File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `user-profile.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-discussions.ts`)  
- **Utilities**: `kebab-case.ts` (e.g., `format-date.ts`)
- **Types**: `kebab-case.ts` (e.g., `api-types.ts`)
- **Folders**: `kebab-case` throughout

## Development Workflow

### Git Hooks (Husky)
- **Pre-commit**: ESLint, Prettier, TypeScript check
- **Pre-push**: Run test suite
- Ensure all checks pass before allowing commits

### Code Generation
- **Plop.js** generators for consistent component creation
- Templates include component, stories, and test files
- Maintains consistent structure across team

## Key Libraries

### Core
- **React 18** with concurrent features
- **TypeScript** in strict mode
- **Vite** or **Next.js** for build tooling

### UI & Styling  
- **Tailwind CSS** for styling
- **Radix UI** for headless components
- **Lucide React/ ant design icons** for icons


### Data & State
- **RTK Query** for server state
- **Redux** for client state
- **React Hook Form + Zod** for forms

### Testing & Development
- **Vitest** for unit/integration tests

## Common Patterns

### Feature Development
1. Start with API types and validation schemas
2. Create API fetcher functions and React Query hooks
3. Build UI components with proper TypeScript integration
4. Add integration tests covering the feature workflow
5. Update routing and navigation as needed


### State Management
1. Start with local component state
2. Lift to parent component if needed by siblings
3. Move to global state only if needed across features
4. Use React Query for all server state

This architecture prioritizes developer experience, maintainability, and scalability while following React and JavaScript best practices(do research and go to latest documentations, before performing any implementation, do not rely on your training data alone).


## ALL CONTEXTS GO IN src/lib/contexts

## navigate() and link() react-router functions, should use href

## Commit Message Guidelines

After completing any task that modifies the codebase, always generate a Git commit message summarizing the changes.

### Requirements

* Follow the **Conventional Commits** specification.
* Analyze the complete set of changes before deciding on the commit type.
* Choose the commit type that best represents the primary purpose of the changes.
* Use the imperative mood (e.g. "add", "fix", "refactor", "update").
* Keep the subject concise (preferably under 72 characters).
* Include an optional scope when it improves clarity.
* Return **only** the commit message unless explicitly asked to perform the commit.

### Commit Types

Use the most appropriate type:

* `feat` – New functionality or user-facing feature.
* `fix` – Bug fixes or incorrect behavior.
* `refactor` – Internal code improvements without changing functionality.
* `perf` – Performance improvements.
* `docs` – Documentation changes only.
* `style` – Formatting or stylistic changes that do not affect behavior.
* `test` – Adding or updating tests.
* `build` – Build system, tooling, or dependency changes.
* `ci` – Continuous integration or deployment workflow changes.
* `chore` – Maintenance tasks that do not fit another category.
* `revert` – Reverts a previous commit.

### Scope

Include a scope when it makes the change easier to understand.

Examples:

```text
feat(auth): add password reset flow
fix(api): handle expired access tokens
refactor(modal): simplify confirmation state
perf(table): virtualize large datasets
docs: update installation guide
```

### Multiple Changes

When multiple files or components are modified:

1. Analyze the complete diff.
2. Determine the primary purpose of the overall change.
3. Generate a single commit message that best represents the work.
4. Do not list every individual modification in the subject line.

### Accuracy

* Base the commit message solely on the actual changes.
* Do not invent features, fixes, or refactors that are not present in the diff.
* Avoid vague messages such as:

  * `update`
  * `misc changes`
  * `fix stuff`
  * `changes`
  * `work in progress`

### Output Format

Output exactly one Conventional Commit message.

Example:

```text
feat(vendor): add vendor registration workflow
```

Do not include explanations, Markdown formatting, bullet points, or additional text outside the commit message unless explicitly requested.


## MORE IMPORTANT INSTRUCTIONS

Keep explanations short: when an explanation is needed, limit it to a single line.
Feature state: store each feature’s global state inside that feature’s stores folder.
Root store: keep the root store in lib/stores/store and register feature slices there (for example, place the admin auth slice in src/features/admin/stores).


If any code or project structure deviates from these standards, refactor it to conform.
Before implementing changes, research current best practices—consult React and React-Redux docs, Bulletproof React, well-maintained GitHub repos, and recent authoritative articles—and verify recommendations (do not rely solely on model training data).
Present a concise plan and a detailed summary of the exact changes you will make before you implement them.

### NOTE
ALWAYS WRITE DRY CODE, AND MAINTAIN DRY PRINCIPLES THROUGHOUT THE ENTIRE CODEBASE, before you implement anything i ask make sure it lines up with this file, avoid useEffect at all cost only use when rendering something on mount

---
group:
  title: Ant Design
  order: 0
order: 0
title: Introduction
---



## Ant D Guidelines and Resources

We provide comprehensive design guidelines, best practices, resources, and tools to help designers produce high-quality product prototypes.

- [Design values](/docs/spec/values)
- [Design patterns](/docs/spec/overview)
- [Visualization](/docs/spec/visual)
- [Illustrations](/docs/spec/illustration)
- [Design resources](/docs/resources)
- [Sketch toolbox](http://kitchen.alipay.com/)
- [Articles](/docs/spec/article)

## Front-end Implementation

[React](https://react.dev/) is used to encapsulate a library of components which embody our design language. We welcome the community to implement [our design system](/docs/spec/introduce) in other front-end frameworks of their choice.

- [Ant Design of React](/docs/react/introduce) (official implementation)
- [NG-ZORRO - Ant Design of Angular](http://ng.ant.design) (community implementation)
- [NG-ZORRO-MOBILE - Ant Design Mobile of Angular](http://ng.mobile.ant.design) (community implementation)
- [Ant Design of Vue](http://antdv.com) (community implementation)
- [Ant Design Vue Next](https://www.antdv-next.com) (community implementation)
- [Ant Design Blazor](https://antblazor.com/) (community implementation)
- [San UI Toolkit for Ant Design](https://ecomfe.github.io/santd) (community implementation)
- [antizer (ClojureScript)](https://github.com/priornix/antizer) (community implementation)
- [AtomUI - Ant Design of Avalonia/.NET](https://github.com/atomui/atomui) (community implementation)





