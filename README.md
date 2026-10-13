# GitHub Analytics Dashboard

Лабораторний dashboard на React + TypeScript для пошуку публічних репозиторіїв GitHub та перегляду їхніх KPI.

## Локальний запуск

Потрібні Node.js `^20.19.0 || ^22.13.0 || >=24` та npm.

```sh
npm ci
npm run dev
```

Відкрийте адресу Vite, зазвичай `http://localhost:5173`.

## Потік даних Lab 3

Форма `RepositoryFilters` використовує `react-hook-form` і керує трьома полями:

- `search` — текстовий пошук за назвою, описом і власником;
- `language` — фіксований список мов;
- `minStars` — ціле невід’ємне число мінімальної кількості зірок.

Після зміни форми застосовується debounce **400 мс** (`useDebounce`). Поки значення змінюються або не проходять валідацію, запит не запускається. `useRepositories` нормалізує параметри, будує GitHub Search API URL і скасовує застарілий запит через `AbortController`.

Запит використовує максимум 100 результатів:

```text
GET https://api.github.com/search/repositories?q=...&per_page=100&page=1
```

Порожні поля не додаються до `q`; мова та `stars:>=N` додаються лише після нормалізації. Відповідь перевіряється та перетворюється на внутрішню модель `GitHubRepository`.

## Поведінка dashboard

- **loading** — показується `LoadingState`, попередні результати не видаються за нові;
- **error** — `ErrorState` показує повторну спробу та час rate-limit, якщо GitHub надав `Retry-After` або `X-RateLimit-Reset`;
- **empty** — `EmptyState` повідомляє, що за заданими фільтрами репозиторіїв не знайдено;
- **success** — таблиця та KPI будуються з отриманої вибірки.

Кнопка Reset очищає всі поля й повертає базову вибірку. Retry повторює останній успішно нормалізований запит. Пізня відповідь після нового запиту не перезаписує актуальні результати.

Таблиця підтримує сортування за назвою та зірками. KPI рахують кількість репозиторіїв, суму зірок і суму fork-ів у повній отриманій вибірці, незалежно від локального сортування. `Counter` і `Toggle` залишаються незалежними демонстраційними компонентами попередньої лабораторної.

## Структура реалізації

- `src/features/repositories/components/filters/RepositoryFilters.tsx` — контрольована форма фільтрів;
- `src/features/repositories/hooks/useRepositoryFilters.ts` — стан форми, валідація і reset;
- `src/hooks/useDebounce.ts` — універсальна пауза 400 мс;
- `src/features/repositories/hooks/useRepositories.ts` — життєвий цикл запиту, retry і скасування;
- `src/features/repositories/api/buildRepositorySearchUrl.ts` — URL Search API;
- `src/features/repositories/api/fetchOrganizationRepositories.ts` — legacy-запит базової вибірки та нормалізація GitHub-відповіді;
- `src/pages/dashboard/DashboardPage.tsx` — зв’язує форму, debounce, API, стани, KPI й таблицю.

## Перевірка

```sh
node --experimental-strip-types --test tests/*.test.ts
npm run lint
npm run typecheck
npm run build
```

Тести покривають URL і валідацію фільтрів, нормалізацію відповіді, request states, retry/rate-limit, abort, сортування та KPI. Інтерактивні сценарії rapid typing/reset/stale, keyboard/focus, console та перевірка viewport потрібно підтвердити окремо у браузері.
