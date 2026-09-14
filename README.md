---
title: README
description: Lunar Calendar Event Generator — setup, scripts, and project overview.
creation-time: 2026-07-24
updated-time: 2026-09-15
tags:
  - lunar-calendar
  - ics
  - bun
type: readme
---

# Lunar Calendar Event Generator

A Bun + React app that turns lunisolar dates into Gregorian calendar events and exports them as a downloadable `.ics` file for Google Calendar and other apps.

Build custom **recurrence rules** (e.g. 正月十五, 五月初五) and optional monthly events (每月初一/十五) plus catalog festivals in a stepped wizard, preview them by Gregorian year, then download the full expanded calendar.

## Features

### Wizard UI (3 steps)

1. **Date selection** — Choose a **lunar start year** and **loop years** (presets 5, 10, 25, 50, 100, 200, 300; default start year 2026, default loop 10). Optionally add **初一** / **十五** for every lunar month (including leap), and catalog **festivals** (once per year). Add custom recurrence rules via **lunar input** (month + day + title) or **solar input** (Gregorian `YYYY-MM-DD` + title, resolved to lunar month/day). Title is required. Duplicate custom month/day/title combinations are ignored. Next stays disabled until the cart has at least one item (custom, monthly, or catalog).
2. **Cart** — Review rules. Custom rows are read-only; **Edit** opens a dialog (title, lunar month, lunar day). Monthly and catalog rows show a label and **Delete** only. **Clear all** empties the cart. Start year and loop years are shown here but changed on Date selection. Confirm expands the cart; it stays disabled while the cart is empty.
3. **Preview** — Browse a 12-month grid by Gregorian year of the expanded events. Download ICS for all generated events. Lunar 冬月/腊月 can land in the next civil year.

State is managed with **Zustand** ([`src/store/calendar-store.ts`](src/store/calendar-store.ts)). Session-only — nothing is persisted to localStorage.

### Domain engine

- **Custom lunar dates** — Any day 1–30 in any lunar month (including leap months), expanded once per lunar year over the loop range via `collectCustomNotifications` ([`src/lib/lunar-dates/custom-dates.ts`](src/lib/lunar-dates/custom-dates.ts))
- **Monthly events** — 初一 / 十五 for every lunar month in the range via `expandMonthlyEvents` in the same module
- **Catalog items** — Festival dates in `FESTIVALS` ([`src/lib/lunar-dates/constants.ts`](src/lib/lunar-dates/constants.ts)), expanded with the same custom path (including 除夕 day-30 clamp)
- **Cart expand** — `confirmAndExpand` calls `notificationsFromCart` ([`src/lib/lunar-dates/cart-expand.ts`](src/lib/lunar-dates/cart-expand.ts)), which partitions `CartRule`s and concatenates custom + catalog, then monthly events
- **ICS export** — All-day events with default reminders (1 day before at 09:00 Asia/Kuala_Lumpur). The wizard does not expose alarm settings ([`src/lib/ics/generate.ts`](src/lib/ics/generate.ts))

Loop semantics: `numberOfYears: 10` produces **11 occurrences** (inclusive). The wizard passes the selected **lunar** start year straight into the expanders — it does **not** map 1 January to the previous lunar year. Lunar 2025 is not used when the start year is 2026.

## Stack

| Layer | Choice |
| ------- | -------- |
| Runtime / package manager | [Bun](https://bun.com) |
| UI | React 19, Shadcn UI, Tailwind CSS v4 |
| State | Zustand |
| Calendar engine | `lunar-javascript` |
| ICS export | `ts-ics` |
| Lint / format | Biome |
| Commit messages | [commitlint](https://commitlint.js.org/) (`@commitlint/config-conventional`) + `[ENG-n]` from the branch |
| Types | TypeScript (`tsc --noEmit`) |
| Git hooks | [Lefthook](https://lefthook.dev/) (`lefthook.yml`) |
| Component tests | happy-dom, Testing Library (`@testing-library/react`) |

## Setup

Requires [Bun](https://bun.com) installed.

```bash
bun install
```

`lefthook` and `bun` are listed in `trustedDependencies` so Bun can run install scripts. `prepare` runs `lefthook install` so Git hooks are wired after install. If `git commit` never shows Lefthook, run `bunx lefthook install`.

## Scripts

```bash
bun run dev        # hot-reload app (src/index.ts)
bun run start      # production serve
bun run build      # production build
bun run test       # unit tests (TZ=Asia/Kuala_Lumpur)
bun run typecheck  # tsc --noEmit
```

Open the URL printed by `bun run dev`, then walk through **Date selection → Cart → Preview → Download ICS**.

## Project layout

```text
lefthook.yml                   # Git hooks: Biome, commitlint, ticket prefix, pre-push
.github/workflows/ci.yml       # PR/push typecheck, tests, lint, build (ENG-24)
.github/workflows/post-merged-branch.yml  # dry-run idle merged-PR heads (ENG-30)
scripts/prepend-eng-ticket.ts  # prepare-commit-msg: prepend [ENG-n] from branch
commitlint.config.ts           # Conventional Commits + optional [ENG-n] prefix
src/
  App.tsx                      # step router (select | cart | preview)
  store/calendar-store.ts      # Zustand cart (custom + monthly + catalog), loop, expand
  components/
    steps/                     # DateSelectionStep, EventPickOptions, CartStep, PreviewStep
    cart/                      # CartItemRow (custom + edit), CartPickRow
    preview/                   # YearPreviewGrid, MonthCard
    ui/                        # Shadcn primitives (including Dialog)
  lib/
    lunar-dates/               # lunisolar domain
      cart-expand.ts           # notificationsFromCart (partition CartRule[])
      custom-dates.ts          # solar/lunar helpers, custom + monthly expand
      constants.ts             # month rules, defaults, MONTHLY_EVENTS + FESTIVALS
      lunar-dates.type.ts      # shared domain types
    ics/                       # notifications → .ics string
    wizard/                    # UI helpers (month list, loop presets, preview labels)
test/
  happydom.ts                  # happy-dom preload (see bunfig.toml)
  lunar-dates.test.ts          # expandMonthlyEvents
  lunar-dates-custom.test.ts   # collectCustomNotifications
  lunar-dates-wizard-api.test.ts  # cart-only custom path + resolveLunarMonthDay
  lunar-dates-cart-expand.test.ts  # notificationsFromCart (catalog + monthly)
  lunar-dates-ics.test.ts      # ICS formatting
  calendar-store.test.ts       # Zustand store
  input-field.test.tsx         # InputField (Testing Library)
  use-debounce.test.ts
  use-debounce-controlled-input.test.ts
  helpers/                     # test oracles
```

Import aliases: `@lunar-dates`, `@lunar-dates/*`, `@ics`, `@ics/*`, `@/*`.

## Domain API (wizard-relevant)

`confirmAndExpand` calls **`notificationsFromCart()`**. That helper concatenates **`collectCustomNotifications()`** (custom rules and catalog festival rows) and **`expandMonthlyEvents()`** (初一/十五). There is no `getLunarDateNotifications()`.

```typescript
import { notificationsFromCart } from '@lunar-dates';

const events = notificationsFromCart(
  [
    {
      kind: 'custom',
      lunarMonth: 1,
      lunarDay: 15,
      title: '正月十五',
    },
    { kind: 'monthly', monthlyId: 'chuyi' },
    { kind: 'catalog', catalogId: 'duanwu' },
  ],
  { startYear: 2026, numberOfYears: 10 },
);
```

`startYear` here is a **lunar year**. Leap months: if that year has the selected 闰 month, year 0 uses it; later years use the regular month. If it does not (e.g. 2026 + 闰六月), every year uses the regular month — 2025 闰六月 is not used. Day 30 in a 29-day month clamps to day 29.

## Git hooks

[Lefthook](https://lefthook.dev/) runs local checks on commit and push ([`lefthook.yml`](lefthook.yml)):

- **prepare-commit-msg** — prepends `[ENG-n]` from the current branch (`ENG-\d+`, case-insensitive) when missing. Skipped on `develop`, `staging`, `release`, `release/*`, and merge/squash
- **commit-msg** — [commitlint](https://commitlint.js.org/) with `@commitlint/config-conventional` plus an optional `[ENG-n]` subject prefix. Same skip refs as prepare-commit-msg
- **pre-commit** — Biome on staged `ts` / `tsx` / `js` / `json` / `html` / `css` (writes fixes and restages them)
- **pre-push** — `bun run typecheck` then `bun run test`

Dry-run without committing: `bunx lefthook run pre-commit` (stage matching files first) or `bunx lefthook run pre-push`. Validate a subject with `echo 'feat(ics): example' | bunx commitlint`. These are separate from Cursor agent hooks under `.cursor/hooks/`.

Hooks are local only. `git commit --no-verify` and `git push --no-verify` skip them. Merge blocking on GitHub is [ENG-24](https://linear.app/hl-engineering/issue/ENG-24/ci-typecheck-and-build-required-on-every-pr) (CI), not Lefthook.

## GitHub Actions

- [`ci.yml`](.github/workflows/ci.yml) — typecheck, tests, lint, and build on PRs and pushes to `develop` ([ENG-24](https://linear.app/hl-engineering/issue/ENG-24/ci-typecheck-and-build-required-on-every-pr))
- [`post-merged-branch.yml`](.github/workflows/post-merged-branch.yml) — manual dry-run of merged-PR heads idle ≥ 3 days (last commit, not merge time). Weekly cron and deletion are later PRs ([ENG-30](https://linear.app/hl-engineering/issue/ENG-30/github-action-delete-merged-pr-branches-after-3-days-idle)). After this workflow is on `develop`: Actions → Post merged branch → Run workflow (try `idle_days: 0` once). Empty candidate lists are normal for a solo repo, or if **Automatically delete head branches** is on.

## Notes

- Tests pin `TZ=Asia/Kuala_Lumpur` so lunar/Gregorian conversions stay stable. Prefer `bun run test` over bare `bun test`. Component tests preload happy-dom via [`bunfig.toml`](bunfig.toml).
- **Leap months (闰月):** Honor the leap month only in the **start lunar year**, and only if that year contains it. Later years (including later leap years) use the regular month. Missing leap months do not skip the year.
- **Lunar day 30:** Months with only 29 days use day 29 that year (clamp), not a skip.
- Agent and coding conventions live in [`.cursor/rules/`](.cursor/rules/).
