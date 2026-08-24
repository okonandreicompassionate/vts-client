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
├── config/           # Global configurations and env variables
├── features/         # Feature-based modules (admins, visitors, etc.)
├── hooks/            # Shared React hooks
├── lib/              # Preconfigured libraries (react-query, auth, etc.)
├── types/            # Shared TypeScript types
└── utils/            # Shared utility functions
```

### Feature Structure
Each feature should be self-contained:

```
src/features/auth/
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
- Use **Radix UI** for headless interaction primitives such as dialogs, dropdown menus,
  popovers, tooltips, menus, and selects. Wrap Radix primitives in shared local components
  before using them across features.
- Keep **Ant Design** for complex data-oriented controls already established in the app,
  including tables, forms, pagination, notifications, and message feedback.
- **ShadCN/UI pattern** - Components are copied into codebase, not installed as packages

## State Management Strategy

### Component State
- Use `useState` for simple independent state
- Use `useReducer` for complex state with multiple related updates

### Application State
- Use Redux Toolkit only for shared client state, currently authentication state.
- Use React context for theme, popup, and other cross-cutting context state.
- Keep state as close to its usage as possible and avoid premature globalization.

### Server State
- Use RTK Query for all server state, caching, loading, refetching, and invalidation.

### Form State
- Use Ant Design `Form` components for form state and validation.
- Keep reusable form and input behavior in shared components where appropriate.
## State Management (Redux)

### Principles

- Use **Redux Toolkit** (`configureStore` and `createSlice`), never legacy Redux APIs.
- Keep server state in **RTK Query**. Do not duplicate API data in hand-written Redux slices.
- Keep client state in slices only when it is shared across the app. The current slices are
  `adminAuth` and `visitorAuth`; theme and modal state use React context providers.
- The app intentionally uses three RTK Query API slices, separated by access context:
  `adminApi`, `visitorApi`, and `publicApi`.
- Infer `RootState` and `AppDispatch` from the configured store. Use the typed hooks from
  `src/lib/stores/hooks.ts` when dispatching or selecting Redux state.

### File Placement

| Concern | Location |
|---|---|
| Admin API slice | `src/lib/api/admin/admin-api.ts` |
| Visitor API slice | `src/lib/api/visitor/visitor-api.ts` |
| Public API slice | `src/lib/api/public/public-api.ts` |
| Tenant-aware base queries | `src/lib/api/{admin,visitor,public}/*-base-query.ts` |
| Store setup and inferred types | `src/lib/stores/store.ts` |
| Typed Redux hooks | `src/lib/stores/hooks.ts` |
| Feature RTK Query endpoints | `src/features/<feature>/api/*-api-slice.ts` |
| Feature client-state slices | `src/features/<feature>/stores/` |
| Context providers | `src/lib/contexts/` |
| Provider composition | `src/app/provider.tsx` |

### API Slices

Each access context owns one `createApi` slice with its own `reducerPath`, base query, and
tag types. Feature API files extend the appropriate slice with `injectEndpoints`:

```ts
import { adminApi } from "@/lib/api/admin/admin-api";

export const usersApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<GetAdminsResponse, void>({
      query: () => "/auth/admins",
      providesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});
```

Use `adminApi` for authenticated admin operations, `visitorApi` for authenticated visitor
operations, and `publicApi` for unauthenticated visitor-facing operations. Keep endpoint
definitions, request/response types, generated hooks, and cache tags in the owning feature.

### Store & Typed Hooks

Register all three API reducers and middlewares in `src/lib/stores/store.ts`, along with the
`adminAuth` and `visitorAuth` reducers. Call `setupListeners(store.dispatch)` for RTK Query
focus/reconnect behavior. The store exports `RootState` and `AppDispatch`; the hooks module
exports `useAppDispatch` and `useAppSelector`.

### Cache Tags

Declare tag types on the owning API slice. Queries use `providesTags` and mutations use
`invalidatesTags`; collection tags use `id: "LIST"`, while individual records use their
record ID. This keeps mutations scoped to the relevant API cache.

### Forms and Context

Forms currently use Ant Design `Form`, `Input`, `Select`, and `Switch` components. Shared
modal state, theme state, and popup state belong in `src/lib/contexts/`, not Redux slices.

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
- **Radix UI** for headless interaction primitives
- **Ant Design** for complex data and form controls
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





