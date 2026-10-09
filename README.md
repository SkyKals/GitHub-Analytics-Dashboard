# Панель аналітики GitHub

Навчальний проєкт з компонентно-орієнтованого програмування. Лабораторна робота №1, варіант 10 — GitHub.

## Мета ЛР1

Створити каркас майбутньої панелі аналітики GitHub і відпрацювати декомпозицію інтерфейсу на компоненти, передавання даних через props, локальний стан `useState` та обробку подій.

## Вимоги та запуск

Потрібні Node.js версії `^20.19.0 || ^22.13.0 || >=24` і npm. Версії залежностей зафіксовано в `package-lock.json`.

```sh
npm ci
npm run dev
```

Після запуску відкрийте адресу, яку виведе Vite (зазвичай `http://localhost:5173`). На Windows перед повторним `npm ci` зупиніть сервер розробки через `Ctrl+C`, щоб звільнити файли залежностей.

## Перевірка

```sh
npm run lint
npm run typecheck
npm run build
```

- `lint` запускає ESLint;
- `typecheck` виконує перевірку TypeScript;
- `build` перевіряє типи та створює production-збірку в `dist/`.

Окремого тестового фреймворку або скрипту `test` у ЛР1 немає.

## Реалізовані віджети

- **[KPI Card](src/components/widgets/KpiCard.tsx)** — a reusable card that receives `title`, `value`, and `change`; [RepositoryKpis](src/pages/dashboard/components/RepositoryKpis.tsx) uses it three times with distinct props for stars, forks, and repositories.
- **[Counter](src/components/widgets/Counter.tsx)** — uses local `useState` with `+`, `−`, and reset controls.
- **[Toggle](src/components/widgets/Toggle.tsx)** — uses local state and conditionally renders the section in light or dark mode.
- **[Filtered List](src/features/repositories/components/FilteredList.tsx)** — selects a category and filters the local repository array; choosing `Усі` returns the full list. The fixture is [repositories.mock.ts](src/features/repositories/data/repositories.mock.ts).

Дані — локальний незмінний mock-масив у `src/features/repositories/data/repositories.mock.ts`: по два репозиторії для TypeScript, JavaScript і Python. KPI обчислюються з цього набору й дорівнюють **330 / 60 / 6**: зірки, форки, репозиторії відповідно. Фільтр не впливає на KPI; стан кожного інтерактивного віджета є незалежним і локальним. Після перезавантаження сторінки відновлюється початковий стан.

## Структура відповідальностей

- `DashboardPage` з’єднує mock-дані, селектори KPI та компоненти сторінки.
- `DashboardLayout` забезпечує спільне компонування через `children`.
- `KpiCard`, `Counter` і `Toggle` є окремими віджетами.
- feature `repositories` містить контракт репозиторію, mock-дані, селектори, `FilteredList` і елемент списку репозиторію.

## Ручна перевірка для захисту

1. Запустіть застосунок, перевірте вигляд приблизно за ширин 1280px і 375px: текст має лишатися читабельним без горизонтального прокручування сторінки.
2. Перейдіть клавішею `Tab` до всіх кнопок і списку вибору; для кнопок використайте `Enter` або `Space`, для списку — клавіші зі стрілками.
3. Натисніть у лічильнику `+`, `+`, `−`: має бути `1`; скиньте — `0`; після `−` має бути `−1`.
4. Двічі активуйте Toggle: секція має повернутися до світлого режиму.
5. Перевірте кожну мову: відображаються два відповідні репозиторії; `Усі` повертає всі шість у початковому порядку.
6. Переконайтеся, що взаємодії Counter, Toggle і фільтра незалежні, KPI залишаються `330 / 60 / 6`, а в консолі браузера немає помилок застосунку.

## Межі ЛР1

ЛР1 не містить GitHub API, облікових даних, реальних даних, роутингу, графіків, Zustand або можливостей наступних лабораторних робіт.

## Файлова структура та призначення

```text
.
├── .gitignore                     # Виключає локальні документи, залежності та збірку з Git.
├── AGENTS.md                      # Правила роботи агентів у репозиторії.
├── README.md                      # Публічний опис ЛР1, запуску та архітектури.
├── eslint.config.js               # Правила ESLint для TypeScript і React.
├── index.html                     # HTML-точка входу Vite.
├── package.json                   # Залежності, вимоги до Node.js і команди npm.
├── package-lock.json              # Точно зафіксовані версії npm-залежностей.
├── tsconfig.json                  # Базова конфігурація TypeScript.
├── tsconfig.app.json              # Налаштування TypeScript для коду застосунку.
├── tsconfig.node.json             # Налаштування TypeScript для Vite-конфігурації.
├── vite.config.ts                 # Конфігурація Vite, React і Tailwind CSS.
└── src/
    ├── main.tsx                   # Монтує React-застосунок у DOM та підключає глобальні стилі.
    ├── app/
    │   ├── App.tsx                # Кореневий React-компонент; зараз відображає DashboardPage.
    │   ├── styles.css             # Глобальні стилі та базові правила доступності.
    │   ├── providers/
    │   │   └── .gitkeep           # Резерв для глобальних провайдерів майбутніх ЛР; поки не використовується.
    │   └── router/
    │       └── .gitkeep           # Резерв для маршрутизації майбутніх ЛР; у ЛР1 роутингу немає.
    ├── assets/
    │   └── .gitkeep               # Резерв для статичних зображень, іконок або інших ресурсів.
    ├── components/
    │   ├── feedback/
    │   │   └── .gitkeep           # Резерв для Loading, Error та Empty компонентів наступних ЛР.
    │   ├── layout/
    │   │   └── DashboardLayout.tsx # Спільний каркас сторінки; розміщує передані через children блоки.
    │   └── widgets/
    │       ├── Counter.tsx         # Локальний лічильник із кнопками збільшення, зменшення та скидання.
    │       ├── KpiCard.tsx         # Повторно використовувана картка одного KPI-показника.
    │       └── Toggle.tsx          # Локальний перемикач світлого й темного режиму секції.
    ├── features/
    │   ├── analytics/
    │   │   ├── components/.gitkeep # Резерв для компонентів аналітики та графіків майбутніх ЛР.
    │   │   └── model/.gitkeep      # Резерв для моделей і обчислень аналітики.
    │   ├── favorites/
    │   │   └── components/.gitkeep # Резерв для механізму обраних репозиторіїв.
    │   ├── repositories/
    │   │   ├── api/.gitkeep        # Резерв для GitHub API; у ЛР1 зовнішніх запитів немає.
    │   │   ├── components/
    │   │   │   ├── details/.gitkeep # Резерв для сторінки або блоку деталей репозиторію.
    │   │   │   ├── filters/.gitkeep # Резерв для розширених фільтрів наступних ЛР.
    │   │   │   ├── table/.gitkeep   # Резерв для таблиці репозиторіїв і сортування.
    │   │   │   ├── FilteredList.tsx # Віджет локально фільтрує репозиторії за мовою.
    │   │   │   └── RepositoryListItem.tsx # Відображає один репозиторій, отриманий через props.
    │   │   ├── data/
    │   │   │   └── repositories.mock.ts # Незмінні локальні mock-дані шести репозиторіїв.
    │   │   ├── hooks/
    │   │   │   └── .gitkeep        # Резерв для feature-specific hooks, наприклад useRepositories.
    │   │   └── model/
    │   │       ├── Repository.ts   # TypeScript-контракт даних одного репозиторію.
    │   │       └── selectors.ts    # Чисті функції обчислення суми зірок, форків і кількості репозиторіїв.
    │   └── theme/
    │       ├── components/.gitkeep # Резерв для глобального перемикача теми.
    │       └── context/.gitkeep    # Резерв для ThemeContext; у ЛР1 тема лише локальна в Toggle.
    ├── hooks/
    │   └── .gitkeep                # Резерв для загальних hooks, що не належать одній feature.
    ├── lib/
    │   └── http/.gitkeep           # Резерв для спільних HTTP-утиліт; у ЛР1 HTTP-запитів немає.
    ├── pages/
    │   ├── dashboard/
    │   │   ├── components/
    │   │   │   ├── DashboardHeader.tsx # Заголовок і короткий опис дашборду.
    │   │   │   └── RepositoryKpis.tsx  # Збирає три KpiCard з переданих сумарних значень.
    │   │   └── DashboardPage.tsx    # Координує дані, селектори, layout та віджети головної сторінки.
    │   ├── not-found/
    │   │   └── .gitkeep             # Резерв для сторінки 404 після додавання роутингу.
    │   └── repository-details/
    │       └── .gitkeep             # Резерв для майбутньої сторінки деталей репозиторію.
    └── store/
        └── .gitkeep                 # Резерв для глобального стану; Zustand у ЛР1 не використовується.
```

> Файли `.gitkeep` зберігають порожні каталоги в Git. Вони показують заплановане місце для функцій наступних лабораторних робіт, але не означають, що ці функції вже реалізовані. Каталоги `.ai/`, `node_modules/` і `dist/` не показано: це відповідно локальна документація, встановлені залежності та генерована збірка.
