---
title: README
description: Lunar Calendar Event Generator — setup, scripts, and project overview.
creation-time: 2026-07-24
updated-time: 2026-08-11
tags:
  - lunar-calendar
  - ics
  - bun
type: guide
---

# Lunar Calendar Event Generator

A Bun + React app that turns lunisolar dates into Gregorian calendar events and exports them as a downloadable `.ics` file for Google Calendar and other apps.

Build custom **recurrence rules** (e.g. 正月十五, 五月初五) in a stepped wizard, preview them by Gregorian year, then download the full expanded calendar.

## Features

### Wizard UI (3 steps)

1. **Date selection** — Set loop length (5–100 years, default 100). Add recurrence rules via **lunar input** (month + day + title) or **solar input** (Gregorian date + title, resolved to lunar month/day). Title is required.
2. **Cart** — Review, edit, or delete rules. Adjust loop years. Confirm to expand.
3. **Preview** — Browse a 12-month grid for any year in the expanded range. Download ICS for all generated events.

State is managed with **Zustand** ([`src/store/calendar-store.ts`](src/store/calendar-store.ts)). Session-only — nothing is persisted to localStorage.

### Domain engine

- **Custom lunar dates** — Any day 1–30 in any lunar month (including leap months), expanded once per lunar year over the loop range ([`src/lib/lunar-dates/custom-dates.ts`](src/lib/lunar-dates/custom-dates.ts))
- **Milestone dates** — Bulk 初一 / 十五 generation for every lunar month in a range ([`src/lib/lunar-dates/milestones.ts`](src/lib/lunar-dates/milestones.ts)); used by the library API, not the wizard cart flow
- **ICS export** — All-day events with default reminders ([`src/lib/ics/generate.ts`](src/lib/ics/generate.ts))

Loop semantics: `numberOfYears: 100` produces **101 occurrences** (inclusive, from the lunar year anchored to the current Gregorian year at confirm time).

## Stack

| Layer | Choice |
|-------|--------|
| Runtime / package manager | [Bun](https://bun.com) |
| UI | React 19, Shadcn UI, Tailwind CSS v4 |
| State | Zustand |
| Calendar engine | `lunar-javascript` |
| ICS export | `ts-ics` |
| Lint / format | Biome |
| Types | TypeScript (`tsc --noEmit`) |

## Setup

Requires [Bun](https://bun.com) installed.

```bash
bun install
```

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
src/
  App.tsx                      # step router (select | cart | preview)
  store/calendar-store.ts      # Zustand cart, loop, expand
  components/
    steps/                     # DateSelectionStep, CartStep, PreviewStep
    cart/                      # CartItemRow
    preview/                   # YearPreviewGrid, MonthCard
    ui/                        # Shadcn primitives
  lib/
    lunar-dates/               # lunisolar domain
      conversion.ts            # solar/lunar conversion, loop start helper
      milestones.ts            # chuyi/shiwu bulk generation
      custom-dates.ts          # custom date expansion (wizard API)
      constants.ts             # month rules, defaults
    ics/                       # notifications → .ics string
    wizard/                    # UI helpers (month list, preview labels)
test/
  lunar-dates.test.ts          # milestones + conversion
  lunar-dates-custom.test.ts   # custom dates via getLunarDateNotifications
  lunar-dates-wizard-api.test.ts  # collectCustomNotifications (cart-only path)
  lunar-dates-ics.test.ts      # ICS formatting
  calendar-store.test.ts       # Zustand store
  helpers/                     # test oracles
```

Import aliases: `@lunar-dates`, `@lunar-dates/*`, `@ics`, `@ics/*`, `@/*`.

## Domain API (wizard-relevant)

The wizard cart calls **`collectCustomNotifications()`** directly — not `getLunarDateNotifications()`, which always includes 初一/十五 milestones for the range.

```typescript
import {
  collectCustomNotifications,
  resolveLunarMonthDay,
  resolveStartLunarYearFromGregorian,
} from '@lunar-dates';

const startYear = resolveStartLunarYearFromGregorian(new Date().getFullYear());
const events = collectCustomNotifications(
  [{ kind: 'lunar', lunarMonth: 1, lunarDay: 15, title: '正月十五' }],
  { startYear, numberOfYears: 100 },
);
```

## Notes

- Tests pin `TZ=Asia/Kuala_Lumpur` so lunar/Gregorian conversions stay stable. Prefer `bun run test` over bare `bun test`.
- **Leap months (闰月):** Selecting a leap month (e.g. 闰六月) only produces events in lunar years that actually contain that leap month; other years are skipped silently. For yearly recurrence, prefer the regular month (六月).
- Agent and coding conventions live in [`.cursor/rules/`](.cursor/rules/).
