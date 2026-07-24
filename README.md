---
title: README
description: Lunar Calendar Event Generator — setup, scripts, and project overview.
creation-time: 2026-07-24T19:45:00+08:00
updated-time: 2026-07-24T19:45:00+08:00
tags:
  - lunar-calendar
  - ics
  - bun
type: guide
---

# Lunar Calendar Event Generator

A Bun + React app that turns lunisolar milestones (初一 / 十五) into Gregorian dates and exports them as a downloadable `.ics` file for Google Calendar and other calendar apps.

## Features

- Generate ritual dates (lunar 1st and 15th) across a solar year range, including leap months (闰月)
- Format events as all-day ICS (`DATE` values via `ts-ics`)
- Download the calendar from the browser UI

## Stack

| Layer | Choice |
|-------|--------|
| Runtime / package manager | [Bun](https://bun.com) |
| UI | React, Shadcn UI, Tailwind CSS v4 |
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

Open the URL printed by `bun run dev`, then use **Download ICS File** to save the calendar.

## Project layout

```text
src/
  App.tsx                 # UI + ICS download
  lib/lunar-dates/        # lunisolar notification engine
  lib/lunar-dates-ics.ts  # notifications → .ics string
  components/ui/          # Shadcn components
test/                     # bun:test suites
```

## Notes

- Tests pin `TZ=Asia/Kuala_Lumpur` so lunar/Gregorian conversions stay stable. Prefer `bun run test` over bare `bun test`.
- Agent and coding conventions live in [`AGENTS.md`](AGENTS.md). Remaining product work is tracked in [`PLAN.md`](PLAN.md) (some items there may lag the current ICS UI).
