# Lunar Calendar Event Generator

A Bun + React app that turns lunisolar dates into Gregorian calendar events and exports them as a downloadable `.ics` file for Google Calendar and other apps.

Build custom recurrence rules (for example 正月十五 or 五月初五), optional monthly events (每月初一 / 十五), catalog festivals, and solar terms in a three-step wizard. Preview the expanded dates by Gregorian year, then download the calendar. The interface is available in English, Simplified Chinese, and Traditional Chinese.

## Features

1. **Date selection** — Pick a lunar start year and how many years to repeat. The start year defaults to the current calendar year and can be set five years either side. Loop length defaults to **50** years, with presets of 5, 10, 25, 50, 100, 200, and 300. Add monthly 初一 / 十五, festivals, solar terms, or a custom rule (lunar month and day, or a Gregorian date resolved to a lunar month and day). A title is required. Continue stays disabled until the cart has at least one item.
2. **Cart** — Review the selection, edit custom rules, and delete rows. Confirm expands the cart.
3. **Preview** — Browse a 12-month grid by Gregorian year and download one `.ics` file for every generated event. Late lunar months can fall in the next civil year.

Choices stay in the browser session and are not saved.

## Calendar rules

- A loop of 50 years produces **51** occurrences. The range includes the start year.
- The start year is a lunar year. A leap month is used only in that year, and only when that year contains it. Later years use the regular month.
- Lunar day 30 in a 29-day month becomes day 29.
- Exported events are all-day. Each one has a default reminder one day before at 09:00 Asia/Kuala_Lumpur. The wizard does not expose alarm settings.

## Stack

| Layer | Choice |
| --- | --- |
| Runtime / package manager | [Bun](https://bun.com) |
| UI | React 19, Shadcn UI, Tailwind CSS v4 |
| State | Zustand |
| Calendar engine | `lunar-javascript` |
| ICS export | `ts-ics` |
| Language | TypeScript |
| Lint / format | Biome |

## Setup

Requires [Bun](https://bun.com).

```bash
bun install
```

## Scripts

```bash
bun run dev        # hot-reload app
bun run start      # production serve
bun run build      # production build
bun run test       # unit tests
bun run typecheck  # tsc --noEmit
```

Open the URL printed by `bun run dev`, then walk through **Date selection → Cart → Preview → Download ICS**.

Tests pin `TZ=Asia/Kuala_Lumpur` so lunar and Gregorian conversions stay stable. Use `bun run test`.

## Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org/). `bun install` installs [Lefthook](https://lefthook.dev/), which formats staged files on commit and runs the typecheck and tests before push. Pull requests run the same typecheck, tests, lint, and build. A scheduled workflow deletes merged pull-request branches after they have been idle.
