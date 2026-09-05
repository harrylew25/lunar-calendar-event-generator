---
title: README
description: Lunar Calendar Event Generator — setup, scripts, and project overview.
creation-time: 2026-07-24
updated-time: 2026-09-05
tags:
  - lunar-calendar
  - ics
  - bun
type: readme
---

# Lunar Calendar Event Generator

A Bun + React app that turns lunisolar dates into Gregorian calendar events and exports them as a downloadable `.ics` file for Google Calendar and other apps.

Build custom **recurrence rules** (e.g. 正月十五, 五月初五) in a stepped wizard, preview them by Gregorian year, then download the full expanded calendar.

## Features

### Wizard UI (3 steps)

1. **Date selection** — Choose a **lunar start year** and **loop years** (presets 5, 10, 25, 50, 100, 200, 300; default start year 2026, default loop 10). Add recurrence rules via **lunar input** (month + day + title) or **solar input** (Gregorian `YYYY-MM-DD` + title, resolved to lunar month/day). Title is required. Duplicate month/day/title combinations are ignored. An empty cart cannot continue.
2. **Cart** — Review rules. Rows are read-only; **Edit** opens a dialog (title, lunar month, lunar day). **Delete** a row or **Clear all**. Start year and loop years are shown here but changed on Date selection. Confirm expands the cart; empty cart cannot proceed.
3. **Preview** — Browse a 12-month grid by Gregorian year of the expanded events. Download ICS for all generated events. Lunar 冬月/腊月 can land in the next civil year.

State is managed with **Zustand** ([`src/store/calendar-store.ts`](src/store/calendar-store.ts)). Session-only — nothing is persisted to localStorage.

### Domain engine

- **Custom lunar dates** — Any day 1–30 in any lunar month (including leap months), expanded once per lunar year over the loop range ([`src/lib/lunar-dates/custom-dates.ts`](src/lib/lunar-dates/custom-dates.ts))
- **Milestone dates** — Bulk 初一 / 十五 generation for every lunar month in a range ([`src/lib/lunar-dates/milestones.ts`](src/lib/lunar-dates/milestones.ts)); used by the library API, not the wizard cart flow
- **ICS export** — All-day events with default reminders (1 day before at 09:00 Asia/Kuala_Lumpur). The wizard does not expose alarm settings ([`src/lib/ics/generate.ts`](src/lib/ics/generate.ts))

Loop semantics: `numberOfYears: 10` produces **11 occurrences** (inclusive). The wizard passes the selected **lunar** start year straight into `collectCustomNotifications` — it does **not** map 1 January to the previous lunar year. Lunar 2025 is not used when the start year is 2026.

## Stack

| Layer | Choice |
| ------- | -------- |
| Runtime / package manager | [Bun](https://bun.com) |
| UI | React 19, Shadcn UI, Tailwind CSS v4 |
| State | Zustand |
| Calendar engine | `lunar-javascript` |
| ICS export | `ts-ics` |
| Lint / format | Biome |
| Types | TypeScript (`tsc --noEmit`) |
| Git hooks | [Lefthook](https://lefthook.dev/) (`lefthook.yml`) |
| Component tests | happy-dom, Testing Library (`@testing-library/react`) |

## Setup

Requires [Bun](https://bun.com) installed.

```bash
bun install
```

`lefthook` is listed in `trustedDependencies` so Bun can run its install script. `prepare` runs `lefthook install` so Git hooks are wired after install. If `git commit` never shows Lefthook, run `bunx lefthook install`.

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
lefthook.yml                   # Git pre-commit (Biome) and pre-push (tsc + tests)
src/
  App.tsx                      # step router (select | cart | preview)
  store/calendar-store.ts      # Zustand cart, loop, expand
  components/
    steps/                     # DateSelectionStep, CartStep, PreviewStep
    cart/                      # CartItemRow (read-only row + edit Dialog)
    preview/                   # YearPreviewGrid, MonthCard
    ui/                        # Shadcn primitives (including Dialog)
  lib/
    lunar-dates/               # lunisolar domain
      conversion.ts            # solar/lunar conversion helpers
      milestones.ts            # chuyi/shiwu bulk generation
      custom-dates.ts          # custom date expansion (wizard API)
      constants.ts             # month rules, defaults
    ics/                       # notifications → .ics string
    wizard/                    # UI helpers (month list, loop presets, preview labels)
test/
  happydom.ts                  # happy-dom preload (see bunfig.toml)
  lunar-dates.test.ts          # milestones + conversion
  lunar-dates-custom.test.ts   # custom dates via getLunarDateNotifications
  lunar-dates-wizard-api.test.ts  # collectCustomNotifications (cart-only path)
  lunar-dates-ics.test.ts      # ICS formatting
  calendar-store.test.ts       # Zustand store
  input-field.test.tsx         # InputField (Testing Library)
  use-debounce.test.ts
  use-debounce-controlled-input.test.ts
  helpers/                     # test oracles
```

Import aliases: `@lunar-dates`, `@lunar-dates/*`, `@ics`, `@ics/*`, `@/*`.

## Domain API (wizard-relevant)

The wizard cart calls **`collectCustomNotifications()`** directly — not `getLunarDateNotifications()`, which always includes 初一/十五 milestones for the range.

```typescript
import { collectCustomNotifications } from '@lunar-dates';

const events = collectCustomNotifications(
  [{ kind: 'lunar', lunarMonth: 1, lunarDay: 15, title: '正月十五' }],
  { startYear: 2026, numberOfYears: 10 },
);
```

`startYear` here is a **lunar year**. Leap months: if that year has the selected 闰 month, year 0 uses it; later years use the regular month. If it does not (e.g. 2026 + 闰六月), every year uses the regular month — 2025 闰六月 is not used. Day 30 in a 29-day month clamps to day 29.

## Git hooks

[Lefthook](https://lefthook.dev/) runs local checks on commit and push ([`lefthook.yml`](lefthook.yml)):

- **pre-commit** — Biome on staged `ts` / `tsx` / `js` / `json` / `html` / `css` (writes fixes and restages them)
- **pre-push** — `bun run typecheck` then `bun run test`

Dry-run without committing: `bunx lefthook run pre-commit` (stage matching files first) or `bunx lefthook run pre-push`. These are separate from Cursor agent hooks under `.cursor/hooks/`.

Hooks are local only. `git commit --no-verify` and `git push --no-verify` skip them. Merge blocking on GitHub is [ENG-24](https://linear.app/hl-engineering/issue/ENG-24/ci-typecheck-and-build-required-on-every-pr) (CI), not Lefthook.

## Notes

- Tests pin `TZ=Asia/Kuala_Lumpur` so lunar/Gregorian conversions stay stable. Prefer `bun run test` over bare `bun test`. Component tests preload happy-dom via [`bunfig.toml`](bunfig.toml).
- **Leap months (闰月):** Honor the leap month only in the **start lunar year**, and only if that year contains it. Later years (including later leap years) use the regular month. Missing leap months do not skip the year.
- **Lunar day 30:** Months with only 29 days use day 29 that year (clamp), not a skip.
- Agent and coding conventions live in [`.cursor/rules/`](.cursor/rules/).
