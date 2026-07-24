---
title: AGENTS
description: Agent guidelines for the Lunar Calendar Event Generator repository.
creation-time: 2026-07-24T00:00:00+08:00
updated-time: 2026-07-24T19:25:00+08:00
tags:
  - agents
  - lunar-calendar
type: guide
---

# AGENTS

You are an expert full-stack engineer operating inside this repository. Write highly type-safe, performant, and self-documenting code. Read and follow these guidelines before any task.

## Project Overview

**Name:** Lunar Calendar Event Generator

**Goal:** Convert lunisolar calendar milestones (e.g. 初一 / 十五) into Gregorian dates and export them as downloadable `.ics` files for calendar apps.

**Key paths:**

- Domain logic: `src/lib/lunar-dates/`
- ICS export: `src/lib/lunar-dates-ics.ts`
- UI: `src/App.tsx`, `src/components/ui/`
- Tests: `test/`

## Development Environment & Tooling

- **Package manager / runtime:** Bun (`bun install`, `bun run`, `bun test`)
- **Language:** TypeScript, React
- **UI:** Shadcn UI, Tailwind CSS v4
- **Calendar engine:** `lunar-javascript`
- **ICS:** `ts-ics`
- **Lint / format / imports:** Biome (do not hand-format; do not add Prettier or ESLint)
- **Types:** `bun run typecheck` (`tsc --noEmit`)
- **Tests:** `bun run test` (sets `TZ=Asia/Kuala_Lumpur` — required for date-sensitive tests)

### Cursor hooks (do not duplicate these)

Project hooks under `.cursor/hooks/` already cover post-edit hygiene. Prefer fixing hook feedback over re-running the same commands yourself after every edit.

| Hook | Responsibility | Not responsible for |
|------|----------------|---------------------|
| `afterFileEdit` / `afterTabFileEdit` | File-scoped Biome (`check --write`) | `tsc`, tests |
| `postToolUse` (Write / StrReplace / EditNotebook) | Mid-turn `tsc --noEmit` via `additional_context` | Biome, tests |
| `stop` (`loop_limit: 3`) | Final gate: `tsc` + `bun run test` via `followup_message` | Biome / formatting |

`tsc` on both `postToolUse` and `stop` is intentional: early feedback vs don't-finish-red. Only Biome formats; only stop runs the test suite.

### Common scripts

- `bun run dev` — hot-reload app (`src/index.ts`)
- `bun run test` — unit tests (for local/debug use; stop hook also runs this)
- `bun run typecheck` — TypeScript check (for local/debug use; hooks also run this)
- `bun run build` — production build

## Code and TypeScript Principles

- **Biome:** Formatting, lint, and import organization are handled by Biome via hooks. Do not make manual formatting-only edits.
- **TypeScript:** Explicit types on function arguments, return values, and complex state. Never use `any`; use `unknown` when the type is not known.
- **KISS:** Keep functions and components small, focused, and easy to understand.
- **DRY:** Extract shared logic into `src/lib/` (or focused modules under it), shared types, or reusable components — not a separate `src/utils/` tree.
- **Tailwind CSS:** Prefer utility classes. Avoid custom CSS unless necessary. Never use dynamic class interpolation (e.g. `col-span-${span}`); use a static class lookup map for Tailwind v4.
- **File size:** Keep files under `src/` under **150 lines** where possible. If a file must exceed that, stop and ask the user for an exception before continuing.

Always use braces for `if` / `else`, including single-line bodies:

```typescript
// no
if (value === 'new_line') return '\n';

// yes
if (value === 'new_line') {
	return '\n';
}
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

**Format:** `<type>([optional scope]): <description>`

**Types:**

- `feature` — new capability
- `fix` — bug fix
- `docs` — documentation only (README, AGENTS, PLAN, etc.)
- `style` — formatting-only changes that do not affect logic
- `refactor` — neither fix nor feature
- `perf` — performance improvement
- `test` — add or correct tests
- `chore` — tooling, deps, scripts

**Scopes (optional):** Prefer domain areas such as `lunar-dates`, `ics`, `App`, `hooks`.

**Breaking changes:** Use `BREAKING CHANGE:` in the footer, or `!` after the type/scope (e.g. `feature!:`).

**Examples:**

- `feature(ics): add all-day lunar milestone calendar export`
- `fix(lunar-dates): use UTC date parts for ICS DATE values`
- `test(lunar-dates): cover leap-month 初一 notifications`
- `docs: clarify AGENTS tooling and key paths`
