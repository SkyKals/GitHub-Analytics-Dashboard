# GitHub Analytics Dashboard — Лабораторна робота №2

Поточна гілка `lab-02` містить реалізацію лабораторної роботи №2 з компонентно-орієнтованого програмування. Дашборд завантажує публічні репозиторії організації `github` через GitHub REST API та показує їх у таблиці з фільтрацією, сортуванням і KPI.

## Запуск локально

Вимоги: Node.js `^20.19.0 || ^22.13.0 || >=24` та npm.

```sh
npm ci
npm run dev
```

Відкрийте Vite URL, показаний у терміналі, зазвичай `http://localhost:5173`.

## Відповідність завданню Lab 2

Цей розділ є коротким чеклістом для захисту й фіксує вимоги разом із файлами, де їх реалізовано.

### Завантаження даних

- На першому рендері `DashboardPage` ініціалізує `repositories` через `useState` і запускає запит усередині `useEffect` — [DashboardPage.tsx](src/pages/dashboard/DashboardPage.tsx:44).
- Effect викликає [fetchOrganizationRepositories.ts](src/features/repositories/api/fetchOrganizationRepositories.ts:108), а отриманий масив зберігається через `setRepositories`; presentation-компоненти самі API не викликають.
- Фактичний endpoint: `GET https://api.github.com/orgs/github/repos?type=public&sort=full_name&direction=asc&per_page=100&page=1`. Заголовки `Accept` і `X-GitHub-Api-Version` задані в [fetchOrganizationRepositories.ts](src/features/repositories/api/fetchOrganizationRepositories.ts:6).
- Network, HTTP та invalid-response помилки нормалізуються в API-модулі. Cleanup effect використовує `AbortController`, а скасовані й застарілі запити не оновлюють стан.

### Стани запиту

- `loading` — запит виконується; показується [LoadingState.tsx](src/components/feedback/LoadingState.tsx), без таблиці та числових KPI.
- `error` — запит завершився мережевою, HTTP або помилкою відповіді; показується [ErrorState.tsx](src/components/feedback/ErrorState.tsx) із ручним Retry.
- `empty` — успішна відповідь містить порожній масив; показується [EmptyState.tsx](src/components/feedback/EmptyState.tsx) і нульові KPI.
- `success` — отримано дані; показуються таблиця та KPI. Пріоритет станів обчислює `getRequestState` у `DashboardPage`.

### Таблиця та сортування

[RepositoryTable.tsx](src/features/repositories/components/table/RepositoryTable.tsx) показує рівно п’ять полів: повну назву репозиторію з посиланням на GitHub, мову, зірки, fork-и та числовий ID.

Сортування в [sortRepositories.ts](src/features/repositories/model/sortRepositories.ts) підтримує два поля — назву та зірки — і напрямки `asc`/`desc`. Під час рендера `DashboardPage` спочатку формує фільтровану вибірку, а потім отримує derived array через `sortRepositories`; функція працює з копією `[...repositories]` і не мутує вихідний масив або його записи.

### KPI з реальних API-даних

[RepositoryKpis.tsx](src/pages/dashboard/components/RepositoryKpis.tsx) та [KpiCard.tsx](src/components/widgets/KpiCard.tsx) відображають дані, обчислені з реальної відповіді GitHub: загальні зірки, загальні fork-и та кількість репозиторіїв. KPI рахуються по всій завантаженій вибірці, тому фільтр мови й сортування їх не змінюють.

## Потік роботи Lab 2

`DashboardPage` — контейнерний компонент. За допомогою `useState` він зберігає завантажені репозиторії, стани завантаження та помилки, вибрану мову, конфігурацію сортування і лічильник повторної спроби. Єдиним місцем виклику `fetchOrganizationRepositories` є його `useEffect`:

1. Effect запитує першу сторінку з максимум 100 публічних репозиторіїв організації `github`.
2. API-модуль перевіряє та нормалізує відповідь, зокрема перетворює `language: null` на `Не вказано`.
3. Сторінка показує один із чотирьох станів: завантаження, помилка, успішна порожня відповідь або успішне завантаження з таблицею та KPI.
4. Повторна спроба очищає помилку і змінює лічильник retry, що запускає effect повторно. Під час cleanup запит скасовується через `AbortController`; скасовані або застарілі запити не змінюють інтерфейс.

Запит:

```text
GET https://api.github.com/orgs/github/repos?type=public&sort=full_name&direction=asc&per_page=100&page=1
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2026-03-10
```

Токен, пагінація та вибір організації не використовуються. Окремо обробляються network, HTTP, некоректний JSON та невалідна відповідь. Якщо GitHub повертає коректні rate-limit заголовки, показується час наступної спроби. Звичайна HTTP 403 не вважається rate-limit помилкою автоматично.

## Поведінка дашборда

- Таблиця містить повну назву репозиторію з посиланням на GitHub, мову, кількість зірок, кількість fork-ів і числовий ID. Для кожного рядка використовується `repository.id` як React key.
- Dropdown мови відкривається вниз, підтримує Enter/Space, Arrow Up/Down та Escape і використовує `role="listbox"` та `role="option"`. Фільтрація виконується лише по вже завантаженій вибірці та не запускає нових запитів.
- Заголовки Назва та Зірки є клавіатурно доступними кнопками з `aria-sort`. Для активного поля напрямок перемикається між зростанням і спаданням; вибір іншого поля починається зі зростання. Назва сортується без врахування регістру та з числовим порівнянням, а при однакових значеннях використовується ID за зростанням. Сортування повертає копію і не змінює початкові записи.
- KPI показують загальну кількість зірок, загальну кількість fork-ів і кількість репозиторіїв у повній завантаженій вибірці. Фільтрація та сортування не змінюють KPI.
- Стани loading, error, empty і success відображаються окремо. Counter і Toggle залишаються незалежними компонентами лабораторної роботи №1.

## Файли для захисту

На захисті послідовно показати:

- `DashboardPage.tsx` — `useEffect`/`useState`, request states, retry, filter і derived sorting.
- `fetchOrganizationRepositories.ts` — URL, headers, нормалізацію GitHub-відповіді, помилки та `AbortController` signal.
- `RepositoryTable.tsx` — п’ять полів, links, `repository.id` як key та `aria-sort`.
- `sortRepositories.ts` — два поля, `asc/desc`, копію та незмінюваність.
- `RepositoryKpis.tsx` і `KpiCard.tsx` — три KPI з повної API-вибірки без демонстраційних відсотків.
- `LoadingState.tsx`, `ErrorState.tsx`, `EmptyState.tsx` — feedback-компоненти для `loading/error/empty`; success видно в `DashboardPage` разом із таблицею.
- Файли в [tests/](tests/) — API, стани запиту, сортування, незмінюваність і KPI.

Основні файли Lab 2:

- [DashboardPage](src/pages/dashboard/DashboardPage.tsx) — контейнер, state, effect, retry, інтеграція фільтра і сортування.
- [fetchOrganizationRepositories](src/features/repositories/api/fetchOrganizationRepositories.ts) — API-запит, перевірка, нормалізація, помилки та скасування.
- [GitHubRepository](src/features/repositories/model/GitHubRepository.ts) — тип даних репозиторію.
- [RepositoryTable](src/features/repositories/components/table/RepositoryTable.tsx) — доступна таблиця з п’ятьма колонками.
- [sortRepositories](src/features/repositories/model/sortRepositories.ts) — незмінюване сортування за назвою та зірками.
- [LanguageFilter](src/pages/dashboard/components/LanguageFilter.tsx) — доступний клієнтський dropdown.
- [RepositoryKpis](src/pages/dashboard/components/RepositoryKpis.tsx) — композиція KPI дашборда.
- [KpiCard](src/components/widgets/KpiCard.tsx) — перевикористовувана картка KPI з необов’язковим `change`.
- [LoadingState](src/components/feedback/LoadingState.tsx), [ErrorState](src/components/feedback/ErrorState.tsx), [EmptyState](src/components/feedback/EmptyState.tsx) — компоненти станів запиту.
- [Тести](tests/) — перевірки API, станів запиту, сортування, незмінюваності та KPI.

Відповідність критеріям:

- **C01** — контейнер і API: `DashboardPage` володіє state та API-потоком через `useEffect`.
- **C02** — таблиця: `RepositoryTable` відображає п’ять обов’язкових полів і посилання на репозиторії.
- **C03** — стани та KPI: feedback-компоненти й `RepositoryKpis` покривають loading/error/empty/success і підсумки повної вибірки.
- **C04** — сортування: `sortRepositories` підтримує обидва напрямки, числове порівняння назв без врахування регістру, tie-break і відсутність мутації.
- **C05** — розділення контейнера й представлення, TypeScript-контракти, стабільні ключі, readonly-входи та незмінювані похідні масиви.

Файл mock-даних `src/features/repositories/data/repositories.mock.ts` та старі list-компоненти залишені як історичні матеріали Lab 1. Вони вимкнені й не підключені до активного дашборда Lab 2.

## Перевірка

```sh
node --experimental-strip-types --test tests/*.test.ts
npm run lint
npm run typecheck
npm run build
git diff --check
```

Тести перевіряють API-заголовки та нормалізацію, `language: null`, HTTP/network/invalid-response/abort сценарії, пріоритет станів запиту, сортування в обох напрямках, tie-break, незмінюваність і KPI.

## Сценарій захисту

1. Запустити проєкт і показати стан завантаження, потім таблицю репозиторіїв і три KPI-картки.
2. Відкрити dropdown мови вниз; продемонструвати вибір мишкою, Arrow Up/Down, Enter/Space, Escape і видимий focus.
3. Застосувати фільтр і показати, що KPI залишаються розрахованими по повній вибірці, а новий API-запит не запускається.
4. Натиснути заголовки Назва та Зірки в обох напрямках; показати `aria-sort`, числове сортування назв без врахування регістру і стабільний порядок однакових значень.
5. Продемонструвати loading, network/HTTP error з Retry, empty та success стани на контрольованих відповідях.
6. На ширині 1280px і 375px перевірити адаптивність, горизонтальний scroll лише таблиці, відсутність overflow сторінки та помилок у консолі. Наприкінці показати незалежну роботу Counter і Toggle.

Клавіатурна, focus, консольна, візуальна, адаптивна та мережева перевірки є ручними доказами й не замінюються автоматичними тестами.
