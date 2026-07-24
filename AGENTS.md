# AGENTS.md

You are an expert full-stack engineer operating inside this repository. You write highly type-safe, performant, and self-documenting code. You must read and strictly adhere to the guidelines below before executing any task.

## Project Overview

Project Name: Lunar Calendar Event Generator
Goal: A simple calendar application converter that Gregorian calendar dates into lunisolar calendar dates, and create `.ics` file for download and use.

## Development Environment & Tooling

### Setup and Running

The agent must use `bun` as the package manager

Language: Typescript, React
Runtime: bun
UI Component: Shadcn UI

## Code and TypeScript Principles

- **Biome:** Code is automatically formatted using **Biome**. The agent should never make manual formatting changes.


The agent must strictly adhere to the following principles when writing or refactoring code:

- **TypeScript (TS):** Always use **explicit typing** for function arguments, return values, and complex object states. There should always be **no** usage of the `any` type in the codebase. If a type is not known, you must use the `unknown` type instead.
- **KISS (Keep It Simple, Stupid):** Functions and components must be small, focused, and easy to understand. Prioritize clear, minimal implementations over complex or clever ones.
- **DRY (Don't Repeat Yourself):** Identify and abstract repeated logic, types, or component structures into reusable utility functions (`src/utils/`), interfaces, or generic components.
- **Tailwind CSS:** Use Tailwind utility classes for styling. Avoid custom CSS unless absolutely necessary. Follow the existing design system and spacing conventions. Never use dynamic class interpolation (e.g. `col-span-${span}`); use a static class lookup map to ensure compatibility with Tailwind CSS v4 compilation.
- **File Lines & Component Size:** Keep all files and components within the /src folder under **150 lines** where possible. If a component or file must exceed this limit, the agent **MUST halt execution and prompt the user** with a clear explanation of the reason and seek a manual exception/approval before proceeding.

In the case of the `if/else` case, always include the bracket in all case.
For a singular line of the `if` case, please include bracket as well. Snippet below

```typescript
// no
if (value === 'new_line') return '\n';

// yes
if (value === 'new_line') {
  return '\n';
}
```


## PR instructions

All commit messages must follow the **[Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/)**.

**Format**: `<type>([optional scope]): <description>`

**Types**: Use a standardized type:

- `feature`: A new feature (e.g., adding a new section/feature)
- `fix`: A bug fix (e.g., correcting layout issue)
- `docs`: Documentation only changes (e.g., adding documentation, updating a README, AGENTS, PLAN)
- `style`: Changes that do not affect the code logic (e.g., formatting, semi-colons, adding spaces)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A change that improves the performance (e.g., loading speed, render speed)
- `test`: Adding missing tests or correcting existing tests

Scopes (Optional): Use the feature name or file path for scope (e.g., feature(contact-form), fix(button))
Breaking Changes: Must include `BREAKING CHANGE:` in the footer or append an exclamation mark (`!`) after the type/scope (e.g., `feature!:`).

**Example commit message**:

- `feature: add project showcase section`
- `fix(navigation): correct hide mobile menu after click`
- `refactor(utils): convert all helper functions to arrow functions`