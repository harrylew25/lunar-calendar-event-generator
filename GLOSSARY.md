---
title: Lunar Calendar Event Generator
description: Domain language for lunar events and the wording the app supplies.
creation-time: 2026-10-16
updated-time: 2026-10-21
type: glossary
---

# Lunar Calendar Event Generator

A tool that turns chosen lunar dates into events on a Gregorian calendar.

## Language

**Locale**:
English, Simplified Chinese, or Traditional Chinese, as the wording the app supplies. Simplified Chinese and Traditional Chinese are separate locales.
_Avoid_: Language

**Typed value**:
A title, description, or location the user wrote. A locale does not change it.
_Avoid_: Custom string, user content

**Catalog title**:
The name the app supplies for a festival, a solar term, or a monthly day. It follows the active locale. English names the monthly days 1st and 15th. Simplified Chinese and Traditional Chinese keep 初一 and 十五.
_Avoid_: Label, display name
