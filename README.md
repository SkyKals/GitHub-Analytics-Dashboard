# GitHub Analytics Dashboard

An educational project for component-oriented programming, variant 10 — GitHub.

The Lab 01 dashboard uses React, Vite, strict TypeScript, and Tailwind CSS. Its Ukrainian interface demonstrates four independent widgets composed through `DashboardLayout` and its `children` prop:

- Three reusable KPI cards show 330 stars, 60 forks, and 6 repositories. Percentage changes are fixed demonstration values.
- A counter starts at 0, supports increment/decrement (including negative values), and resets to its initial value.
- A toggle switches only its own section between light and dark modes.
- A language filter shows two repositories for each of TypeScript, JavaScript, and Python; `Усі` restores all six in their original order.

All repository records are fictional local mock data in `src/features/repositories/data/repositories.mock.ts`, passed to widgets through props. Interactive state stays inside each widget; filtering does not change the KPI totals. There are no GitHub API requests, credentials, or live data. Reloading the page restores the initial widget state.

The dashboard uses `lucide-react` for imported GitHub, repository, and control icons. Decorative icons are hidden from assistive technology; button names and Ukrainian labels remain available to keyboard and screen-reader users.

## Installation and startup

Use npm and a Node.js version matching `package.json`: `^20.19.0 || ^22.13.0 || >=24`. Dependency versions are locked in `package-lock.json`. Run these commands from the repository root:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Stop the development server with `Ctrl+C` before rerunning `npm ci`, so Windows can release native dependency files.

## Verification

```sh
npm run lint
npm run typecheck
npm run build
```

`lint` runs ESLint, `typecheck` runs the TypeScript project checks, and `build` checks types and produces the production bundle in `dist/`. There is no automated test suite or `test` script.

With the development server running, check the page at desktop (approximately 1280px) and narrow (375px) widths. Content should remain readable without horizontal page scrolling, and `Tab` should reveal focus on all buttons and the select. Use `Enter` or `Space` for buttons and the arrow keys for the language select.

Verify the counter sequence `+`, `+`, `−` produces 1, reset produces 0, and decrement afterward produces −1. Two toggle activations should restore light mode. Each language should show its two matching records; `Усі` should restore all six. Counter, toggle, and filter interactions should remain independent, with KPI totals fixed at 330/60/6 and no application console errors.

Generated files and local `.ai/` documents are excluded from Git.
