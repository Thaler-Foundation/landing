# Thaler Frontend

Landing page for [thaler.finance](https://thaler.finance).

## Stack

- Next.js 16, React 19, TypeScript 6
- Tailwind CSS v4
- TanStack Query
- Bun

## Getting started

```bash
bun install
bun dev        # http://localhost:3001
```

Ask the team for a `.env.local`. Required variables aren't documented here since this repo is public.

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server on port 3001 |
| `bun build` | Production build |
| `bun start` | Start production server |
| `bun run typecheck` | Type check without emitting |
| `bun run lint` | ESLint |
| `bun run format` | Prettier |
| `bun test` | Run tests |

## Git hooks

Husky runs two checks automatically:

- **pre-commit**: `tsc --noEmit` (type check)
- **pre-push**: `next build` (full build)

## Project structure

```
src/
  app/              # Next.js App Router — landing page, blog, legal pages, waitlist API
  components/       # UI components (landing, layout, legal, icons)
  lib/              # Utilities, i18n, waitlist backend, SEO helpers
  data/             # Static data (blog posts, roadmap)
  styles/           # Global CSS
```
