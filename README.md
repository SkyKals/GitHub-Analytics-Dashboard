# Лабораторна робота №3 — GitHub Analytics Dashboard

Контрольована форма фільтрів і власні хуки в React + TypeScript.

## Запуск

Потрібні Node.js `^20.19.0 || ^22.13.0 || >=24` та npm.

```sh
npm ci
npm run dev
```

Відкрийте адресу Vite, зазвичай `http://localhost:5173`.

## 1. Контрольована форма фільтрів

Форма містить назву репозиторію, мову та мінімум зірок; приклад введення: `react`, `TypeScript`, `100` ([три поля](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/features/repositories/components/filters/RepositoryFilters.tsx#L30-L66)). `Controller` із `react-hook-form` передає через `{...field}` значення `value` й обробник `onChange`, тому джерелом істини є стан форми ([приклад із коду](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/features/repositories/components/filters/RepositoryFilters.tsx#L33-L38)):

```tsx
<Controller
  control={control}
  name="search"
  rules={{ validate: (value) => !/[:<>]/.test(value) || 'Не використовуйте qualifiers GitHub у назві.' }}
  render={({ field }) => <input {...field} id={searchId} type="search" autoComplete="off" className={fieldClassName} aria-invalid={errors.search ? 'true' : undefined} aria-describedby={errors.search ? `${searchId}-error` : undefined} />}
/>
```

## 2. Власний хук useDebounce

Нові параметри застосовуються після паузи **400 мс**, а cleanup скасовує попередній таймер ([виклик](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/pages/dashboard/DashboardPage.tsx#L34-L37), [хук і затримка](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/hooks/useDebounce.ts#L3-L11)):

```tsx
const debouncedQueryKey = useDebounce(queryKey)
```

```ts
useEffect(() => {
  const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay)
  return () => window.clearTimeout(timeoutId)
}, [delay, value])
```

## 3. Власний хук завантаження useRepositories

Фактична назва хука — `useRepositories`: він приймає параметри пошуку та повертає `data`, `loading`, `error`, а також повторну спробу й ознаку неповної вибірки ([виклик](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/pages/dashboard/DashboardPage.tsx#L35-L38)). Хук інкапсулює [запит і стани](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/features/repositories/hooks/useRepositories.ts#L37-L69), викликаючи [fetchRepositorySearch](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/features/repositories/api/fetchRepositorySearch.ts#L22-L50); компонент показує [loading / error / empty](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/pages/dashboard/DashboardPage.tsx#L53-L56).

```tsx
const debouncedParams = params !== null && queryKey === debouncedQueryKey ? params : null
const { data, loading, error, retry, incompleteResults } = useRepositories(debouncedParams)
```

## 4. Інтеграція

Ланцюжок: **форма → параметри → debounce → useRepositories → таблиця та KPI** ([з’єднання в DashboardPage](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/pages/dashboard/DashboardPage.tsx#L34-L45)). Із `data` обчислюються показники та відсортовані рядки таблиці; вони передаються в [RepositoryKpis](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/pages/dashboard/DashboardPage.tsx#L55) і [RepositoryTable](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/pages/dashboard/DashboardPage.tsx#L65).

```tsx
const visibleRepositories = sortRepositories(data, sort)
const totalStars = getTotalStars(data)
const totalForks = getTotalForks(data)
const repositoryCount = getRepositoryCount(data)
```

## 5. Скидання

Кнопка «Скинути фільтри» викликає `onReset`, якому сторінка передає `resetFilters` ([кнопка](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/features/repositories/components/filters/RepositoryFilters.tsx#L25-L27), [підключення](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/pages/dashboard/DashboardPage.tsx#L51)). Обробник `reset(defaultValues)` очищує поля, і після debounce завантажується базова вибірка ([початкові значення](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/features/repositories/hooks/useRepositoryFilters.ts#L5-L9), [обробник](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/features/repositories/hooks/useRepositoryFilters.ts#L27)).

```tsx
<button type="button" onClick={onReset} className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-800 hover:bg-slate-50">
  Скинути фільтри
</button>
```

```ts
const resetFilters = useCallback(() => reset(defaultValues), [reset])
```

## Перевірка

### Повторна перевірка після рев’ю (код `3fb1dd2`)

- `node --experimental-strip-types --test tests/*.test.ts`: 21/21; lint, typecheck, build і `git diff --check`: успішно.
- Chrome, 320/375/768/1280 px: документ 305/360/753/1265 px; контейнер таблиці 223/278/655/1038 px, вміст 640/640/655/1038 px. Форма та KPI не виходять за viewport.
- У браузері перевірено `minStars=-1` (помилка поля, без результатів), зміну пошуку під час debounce (loading без старих KPI й таблиці), підтверджений порожній пошук (KPI 0/0/0). Запізнілу відповідь старого запиту й error → retry з контрольованим API у браузері не відтворено; відсікання старої відповіді забезпечує ключ поточного запиту і cleanup effect.

```sh
node --experimental-strip-types --test tests/*.test.ts
npm run lint
npm run typecheck
npm run build
```

## Обмеження

Пошук обмежений організацією `github` і першими **100 результатами**, без пагінації ([побудова URL](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/features/repositories/api/buildRepositorySearchUrl.ts#L9-L16)). KPI обчислюються за отриманою вибіркою, а не за всіма репозиторіями організації; локальне сортування не змінює їх ([обчислення](https://github.com/SkyKals/GitHub-Analytics-Dashboard/blob/lab-03/src/pages/dashboard/DashboardPage.tsx#L42-L45)).
