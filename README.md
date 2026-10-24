# Лабораторна робота №4 — GitHub Analytics Dashboard

Багатосторінковий дашборд репозиторіїв GitHub на React + TypeScript.

## Завдання викладача

**Мета.** Навчитися будувати багатосторінковий інтерфейс за допомогою React Router, реалізувати дрілдаун (перехід зі списку до деталей елемента) та усунути prop drilling через React Context.


**Потрібно реалізувати:**

- налаштувати React Router v7 для головної та сторінки деталей;
- зробити дрілдаун зі списку на деталі через параметри маршруту й `useParams`;
- показати розширені дані елемента та посилання «Назад» до головної;
- створити `ThemeContext` зі світлою/темною темою та перемикачем на всіх сторінках;
- за потреби винести активні фільтри/пошук у власний Context;
- обробити випадок неіснуючого ідентифікатора.

**Вимоги:** навігація виконується через `Link`/`NavLink` або програмну навігацію без перезавантаження; ідентифікатор береться з параметра маршруту; тема й фільтри читаються через `useContext` без prop drilling; провайдери обгортають дерево через `children`.

**Критерії оцінювання:** налаштований Router і маршрути — 2 бали; дрілдаун — 1; сторінка деталей і «Назад» — 2; `ThemeContext` і перемикач — 2; обробка неіснуючого id — 1. Разом — 8 балів.

## Як виконано

### 1. Маршрутизація

Підключено точну залежність `react-router@7.18.4`.

`AppRouter` налаштовує три маршрути:

- `/` — головний дашборд;
- `/repository/:owner/:repo` — деталі репозиторію GitHub;
- `*` — сторінка «Не знайдено».

Спільний `DashboardLayout` залишається змонтованим під час навігації. Реалізація: [`AppRouter.tsx`](src/app/router/AppRouter.tsx), [`App.tsx`](src/app/App.tsx), [`DashboardLayout.tsx`](src/components/layout/DashboardLayout.tsx).

### 2. Дрілдаун і сторінка деталей

Назва репозиторію в таблиці є внутрішнім `Link` на `/repository/:owner/:repo`. `RepositoryDetailsPage` отримує `owner` і `repo` тільки через `useParams`, тому працює при прямому відкритті та перезавантаженні URL.

Сторінка деталей показує опис, власника, основну гілку, ліцензію, дати, зовнішнє посилання GitHub, відкриті issues і контриб’юторів. Посилання «Назад до дашборду» веде на `/`.

Реалізація: [`RepositoryTable.tsx`](src/features/repositories/components/table/RepositoryTable.tsx), [`RepositoryDetailsPage.tsx`](src/pages/repository-details/RepositoryDetailsPage.tsx), [`useRepositoryDetails.ts`](src/features/repositories/hooks/useRepositoryDetails.ts).

API використовує:

- `GET /repos/{owner}/{repo}`;
- `GET /repos/{owner}/{repo}/issues?state=open&sort=created&direction=desc&per_page=30&page=1`;
- `GET /repos/{owner}/{repo}/contributors?per_page=30&page=1&anon=false`.

URL-сегменти кодуються окремо, відповіді перевіряються під час виконання, pull requests із відповіді issues відкидаються. Помилка основного запиту показує «Репозиторій не знайдено» для HTTP 404; помилка issues або контриб’юторів не приховує успішну сусідню секцію.

### 3. ThemeContext

`ThemeProvider` з початковою світлою темою обгортає весь застосунок. `ThemeToggle` читає `theme` і викликає `toggleTheme()` через `useTheme`; клас `dark` застосовується до кореня документа. Темне оформлення охоплює layout, поля, таблицю, картки, повідомлення, сторінку деталей і 404.

Реалізація: [`ThemeProvider.tsx`](src/features/theme/context/ThemeProvider.tsx), [`themeContext.ts`](src/features/theme/context/themeContext.ts), [`useTheme.ts`](src/features/theme/context/useTheme.ts), [`ThemeToggle.tsx`](src/features/theme/components/ThemeToggle.tsx).

### 4. Context фільтрів

`RepositoryFiltersProvider` викликає `useRepositoryFilters` один раз і монтується над маршрутами. Dashboard і форма фільтрів отримують `control`, `errors`, `params` і `resetFilters` через `useRepositoryFiltersContext`, без передачі цих props через проміжні компоненти.

Збережено три контрольовані поля `react-hook-form`, валідацію, reset, debounce 400 мс, єдину вибірку для таблиці та KPI. `shouldUnregister: false` зберігає введення під час переходів між сторінками.

Реалізація: [`RepositoryFiltersProvider.tsx`](src/app/providers/RepositoryFiltersProvider.tsx), [`useRepositoryFiltersContext.ts`](src/app/providers/useRepositoryFiltersContext.ts), [`RepositoryFilters.tsx`](src/features/repositories/components/filters/RepositoryFilters.tsx).

### 5. Неіснуючі адреси та помилки

Невідомий маршрут показує сторінку «Сторінку не знайдено» з посиланням на `/`. Неіснуючий репозиторій показує зрозуміле повідомлення, окрему обробку 404, кнопку повторної спроби та не залишає застарілі дані після зміни URL.

Реалізація: [`NotFoundPage.tsx`](src/pages/not-found/NotFoundPage.tsx), [`repositoryDetailsApi.ts`](src/features/repositories/api/repositoryDetailsApi.ts).

## Запуск

Потрібні Node.js `^20.19.0 || ^22.13.0 || >=24` та npm.

```sh
npm ci
npm run dev
```

Відкрийте адресу Vite, зазвичай `http://localhost:5173`.

## Перевірка

```sh
node --experimental-strip-types --test tests/*.test.ts
npm run lint
npm run typecheck
npm run build
git diff --check
```

Результат локальної перевірки: 23/23 тестів пройшли, lint/typecheck/build/diff check успішні.

## Обмеження

Пошук залишається обмеженим організацією `github` і першими 100 результатами без пагінації. Деталі використовують першу сторінку до 30 issues і 30 контриб’юторів. Обране, централізований store, графіки, пагінація та дизайн-система не входять до ЛР4.

Коротко про виправлення: початкове завантаження деталей показує loading; адаптивність таблиці та перемикач теми виправлено.
