# GitHub Analytics Dashboard

This React and TypeScript dashboard loads public repositories from the `github` organization through the GitHub REST API. It is the Lab 2 implementation for the component-oriented programming course.

## Run locally

Requirements: Node.js `^20.19.0 || ^22.13.0 || >=24` and npm.

```sh
npm ci
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Lab 2 behavior

The dashboard makes one unauthenticated request for the first page of up to 100 public repositories:

```text
GET https://api.github.com/orgs/github/repos?type=public&sort=full_name&direction=asc&per_page=100&page=1
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2026-03-10
```

No token or organization selector is used. The label above the repository section is:

`Організація github · до 100 публічних репозиторіїв · KPI за завантаженою вибіркою`

The page presents loading, network/HTTP/invalid-response error, empty, and success states. Errors offer `Спробувати ще раз`; retry timing is shown when GitHub provides a valid rate-limit header. An aborted request is silent.

The success table shows five fields: linked full repository name, language, stars, forks, and numeric ID. The language filter has an `Усі` option and uses only the loaded sample. Name and star headers are keyboard-accessible buttons with `aria-sort`; clicking the active header reverses direction, while switching fields starts ascending. Sorting uses a numeric, case-insensitive name comparison and never mutates the source records.

The three KPI cards show total stars, total forks, and the count of the complete loaded sample. Filtering and sorting do not change these values. A `KpiCard` may still receive a `change` prop for a future real comparison; when omitted, no percentage or demonstration label is rendered. Counter and Toggle remain independent Lab 1 widgets. The old mock data and list components remain in the repository as historical materials and are not connected to the active dashboard.

## Architecture

`DashboardPage` is the container. It owns request state, the repository array, retry counter, language selection, and sort configuration. Its `useEffect` is the only caller of `fetchOrganizationRepositories`; `AbortController` cleanup prevents stale updates. `RepositoryTable`, the feedback states, `KpiCard`, Counter, and Toggle are presentational or self-contained components. Pure selectors calculate KPI values and `sortRepositories` returns a sorted copy.

The current local architecture record is [.ai/Architecture.md](.ai/Architecture.md). The approved Lab 2 specification and task evidence are in [.ai/Labs/Lab-02](.ai/Labs/Lab-02); `.ai/` is local documentation and is excluded from Git publication.

## Verification

```sh
npm run lint
npm run typecheck
npm run build
node --experimental-strip-types --test tests/*.test.ts
```

The focused tests cover API normalization and failures, cancellation, sorting, immutable inputs, request-state precedence, and KPI totals. Browser-specific keyboard, focus, console, and responsive checks still require manual or browser-enabled review at 1280px and 375px.
