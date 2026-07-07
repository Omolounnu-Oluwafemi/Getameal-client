# GetaMeal Client

The web client for GetaMeal, built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Validation:** Zod (env vars + future form/schema validation)
- **Testing:** Vitest + React Testing Library
- **Tooling:** ESLint, Prettier (with Tailwind class sorting), Husky + lint-staged

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/                  # Routes only — keep these thin
├── components/
│   ├── ui/               # Reusable primitives (Button, Input, ...)
│   └── features/         # Composed, feature-specific components
├── lib/                  # Utilities, env validation, business logic
├── hooks/                # Custom React hooks
├── types/                # Shared TypeScript types
└── config/               # Site-wide config/constants
```

**Convention:** route files (`page.tsx`, `layout.tsx`) should mostly import
from `components/` and `lib/` rather than containing logic themselves.

## Scripts

| Command                | Description                                      |
| ----------------------- | ------------------------------------------------- |
| `npm run dev`           | Start the dev server                              |
| `npm run build`         | Production build                                  |
| `npm run start`         | Run the production build                          |
| `npm run lint`          | Lint with ESLint                                  |
| `npm run lint:fix`      | Lint and auto-fix                                 |
| `npm run format`        | Format all files with Prettier                    |
| `npm run format:check`  | Check formatting without writing                  |
| `npm run type-check`    | Run `tsc --noEmit`                                 |
| `npm run test`          | Run the Vitest suite once                          |
| `npm run test:watch`    | Run Vitest in watch mode                           |
| `npm run validate`      | Run type-check + lint + format:check + test       |

## Environment variables

All env vars are validated at startup via `src/lib/env.ts` (Zod). Add new
required vars to the schema there — the app will fail fast with a clear
error if they're missing or malformed, instead of breaking deep in a
request handler. See `.env.example` for the current set.

## Git hooks

A pre-commit hook (Husky + lint-staged) runs ESLint and Prettier on staged
files automatically. No extra setup needed after `npm install` —
`npm run prepare` is wired to the `prepare` lifecycle script.

## CI

See `.github/workflows/ci.yml`. Every push/PR runs: type-check → lint →
format check → tests → build.

## Notes for contributors

- Default to **Server Components**. Only add `'use client'` where you
  actually need interactivity, state, or browser APIs — and push it as
  far down the component tree as possible.
- Use the `cn()` helper (`src/lib/utils.ts`) instead of string-concatenating
  class names — it resolves Tailwind class conflicts correctly.
- New UI primitives go in `components/ui`; anything composed for a specific
  feature/page goes in `components/features`.
