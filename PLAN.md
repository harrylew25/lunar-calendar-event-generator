---
title: PLAN
description: Remaining work for lunar calendar event generation and ICS export.
creation-time: 2026-07-24T00:00:00+08:00
updated-time: 2026-07-24T00:00:00+08:00
tags:
  - lunar-calendar
  - ics
type: plan
---

# PLAN: Lunar Calendar Event Generator

A Bun + React app that converts lunisolar calendar milestones into importable `.ics` files for Google Calendar.

## Current state

The lunar date engine is implemented under `src/lib/lunar-dates/`:

- **Ritual tracker (初一 & 十五):** `getLunarDateNotifications` — loops lunar years/months, emits `LunarDateNotification[]` with Gregorian `[year, month, day]`.
- **Solar input:** `startSolarYear` + `startSolarMonth` anchor on day 1 → resolve lunar start → begin at 初一.
- **Leap months:** generator iterates all months from `LunarYear.getMonthsInYear()`, including 闰月.
- **Tests:** 14 unit tests in `test/` (library used as oracle).

```text
[Configurations] ──> [Generator Loop] ──> [ICS Formatter] ──> [.ics download]
       ✅                    ✅                  ❌                 ❌
```

## Tech stack

| Layer | Choice |
|-------|--------|
| Runtime | Bun |
| UI | React, Shadcn UI, Tailwind |
| Calendar engine | `lunar-javascript` |
| ICS export | `ts-ics` (not the `ics` package) |

## Remaining work

### 1. ICS export (`src/lib/lunar-dates-ics.ts`)

Map `LunarDateNotification[]` → `IcsEvent[]` → `generateIcsCalendar` string.

- All-day events: `start` / `end` with `type: 'DATE'`; `end` = next day (exclusive).
- Stable, deterministic `uid` per event (e.g. hash of lunar year + month + day + type).
- Expose a function the UI can call to trigger browser download (or `Bun.write` for server-side).

### 2. UI — month/year picker

Wire Shadcn form controls to `getLunarDateNotifications({ startSolarYear, startSolarMonth, numberOfYears })` and a download button that calls the ICS module.

- Optional: Zod schema at the form boundary for input validation (not required for ICS generation).

### 3. Anniversaries tracker (future)

Custom lunar dates (name, lunar month, lunar day) repeated across a year range.

- Use `Lunar.fromYmd()` for exact solar offsets.
- **Leap-month rule:** anniversaries use the **normal** month only (`isLeap: false`), not the trailing 闰月.
- **Short-month rule:** if the target day is 30 but the month has 29 days, fall back to day 29 for that year.

## Edge cases (still apply)

### 1. The 30th day drop — anniversaries only

Applies when building Script A. Ritual tracker (days 1 & 15) is unaffected.

### 2. Leap months

| Tracker | Rule | Status |
|---------|------|--------|
| Ritual (1st & 15th) | Include **both** normal and 闰月 | Done |
| Anniversaries | **Normal month only** | Not built |

### 3. All-day event timezone bleed

When exporting with `ts-ics`, use `type: 'DATE'` — never midnight UTC timestamps — so events stay locked to the calendar day in any timezone.

## Out of scope (handled elsewhere)

- Repo init, Bun/TS setup, `lunar-javascript` types
- Ritual tracker engine, solar-month input, constants, unit tests
- See `AGENTS.md` for coding standards and `src/lib/lunar-dates/` for the public API
