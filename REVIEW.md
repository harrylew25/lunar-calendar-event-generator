---
title: Review
description: What a reviewer checks before reading a diff in this repo.
creation-time: 2026-11-06
updated-time: 2026-11-06
tags:
  - review
type: guide
---

# Review

Failure in this repo is a wrong Gregorian day in the export, or a rule applied in the wrong year.

## What to check

- The wizard start year is a lunar year for lunar rows. Solar terms use that same number as a Gregorian year. Do not remap 1 January back to the previous lunar year.
- A leap month applies only in the start year, when that year has one. Later years use the regular month.
- Lunar day 30 clamps to the last day of a short month.
- Cart expansion order stays custom and catalog, then solar terms, then monthly 初一/十五. An empty cart does not expand.
- ICS `DATE` values use the calendar day the tests expect. Run tests with `TZ=Asia/Kuala_Lumpur`.

## Skip

- Catalog titles and other locale strings, unless the change also selects a different date.
- Formatting and lint. Biome already covers those.

## Findings

Cap nits. Each finding names a file and a line. A guess from a function name is not a finding.

Start the summary with the count. If there is nothing to fix, the summary is: `0 findings.`
