---
description: Loomixx studio site — architecture, stack, patterns and agent rules
alwaysApply: true
---

# Loomixx — Stack (Studio Website)

## Product

Loomixx — публичный сайт продуктовой студии: лендинг, услуги, портфолио концептов, «О студии», контакт.
Язык UI — **русский**. Позиционирование: под задачу клиента, сайты / веб-приложения / мини-приложения (мессенджеры).

Это **не** Beauty+ mini-app/CRM. Beauty+ описан отдельно в `stack_app.md` и живёт в другом контуре/репо-плане.

На старте сайт — маркетинговый SPA с локальными данными. Контактная форма **демо**: не отправляет на сервер (только локальный success-state). API минимальный (`/api/healthz`). БД-схема пустая — задел под будущие сущности (лиды, проекты и т.п.).

## Architecture

- **Монорепо:** `pnpm` workspaces (`artifacts/*`, `lib/*`, `scripts`). Каталог версий — `pnpm-workspace.yaml` → `catalog:`.
- **Contract-first API:** `lib/api-spec/openapi.yaml` → Orval → `@workspace/api-zod` + `@workspace/api-client-react`.
- **Frontend SPA** обслуживается Vite; API — отдельный Express-процесс, префикс `/api`.
- **БД:** PostgreSQL + Drizzle (`@workspace/db`); пока без таблиц — подключать только когда появляется реальная модель.

### Apps / packages

| Path | Package | Role |
| ---- | ------- | ---- |
| `artifacts/loomixx` | `@workspace/loomixx` | Публичный сайт студии (основной продукт этого репо) |
| `artifacts/api-server` | `@workspace/api-server` | Express API (`/api/*`) |
| `artifacts/mockup-sandbox` | `@workspace/mockup-sandbox` | Песочница мокапов (dev); **не билдить и не отдавать на прод** |
| `lib/api-spec` | `@workspace/api-spec` | OpenAPI + Orval codegen (задел под API) |
| `lib/api-zod` | `@workspace/api-zod` | Zod-схемы/типы с сервера (generated) |
| `lib/api-client-react` | `@workspace/api-client-react` | TanStack Query hooks + `customFetch` (generated) |
| `lib/db` | `@workspace/db` | Drizzle schema + `db` pool (пока пустая схема) |
| `scripts` | — | Утилиты воркспейса (не runtime прода) |
| `deploy.sh` | — | Прод-деплой на VPS (см. Infra) |

### Routing (frontend)

| Path | Page |
| ---- | ---- |
| `/` | Главная |
| `/services` | Услуги |
| `/projects` | Список проектов (+ фильтр категорий) |
| `/projects/:slug` | Карточка концепта |
| `/about` | Студия |
| `/contact` | Контакт (демо-форма) |
| `*` | 404 |

Роутер: **wouter** (`WouterRouter` + `base` из `import.meta.env.BASE_URL` + `hook={useViewTransitionLocation}`). Layout: **один** `Shell` над `Switch` = Header + outlet (`main` страницы) + Footer (+ `AiDock` всегда); страницы рендерят только `<main>`, без собственного `Shell`. На `/` — `Shell home={true}` без Footer (`location === '/'`).

**Page transitions:** View Transitions API (`document.startViewTransition` + `flushSync`) через [`src/hooks/use-view-transition-location.ts`](artifacts/loomixx/src/hooks/use-view-transition-location.ts). Soft cross-fade контента (~240ms); chrome изолирован `view-transition-name` на `.topbar` / `.footer` / `.ai-dock`. Нет API или `prefers-reduced-motion` → мгновенная смена (chrome всё равно без remount). Не подключать React canary `<ViewTransition>`. Не вешать `transform`/`filter` на `.site-shell` ради анимации роута (ломает sticky). Scroll-to-top на смене `location` в `Router`.

**Sticky header (все страницы):** `Header` рендерится из `Shell` → sticky на всём сайте.
- Разметка: `.topbar` (full-bleed, `position:sticky; top:0`) + `.topbar-inner.container-wide` (flex-ряд brand / nav / actions).
- Фон: `hsl(var(--background) / .88)` + `backdrop-filter: blur(14px)` — контент читаем при прокрутке под шапкой.
- Высота in-flow: **82px** desktop / **70px** ≤620px — `home-main` по-прежнему `calc(100dvh - …)`; не переводить шапку на `position:fixed` без пересчёта.
- Критично: у `.site-shell` только `overflow-x:clip` (не `overflow:hidden`) — иначе sticky отвязывается от viewport. У `.site-shell--home` `overflow:hidden` остаётся (страница без скролла).
- z-index: `.topbar` = 30 (ниже `AiDock` = 40); мобильное меню — absolute внутри `.topbar-inner`.

### API

| Method | Path | Notes |
| ------ | ---- | ----- |
| GET | `/api/healthz` | Health; ответ валидируется Zod (`HealthCheckResponse`) |
| POST | `/api/ai/chat` | DeepSeek chat; body `AiChatRequest`, ответ `AiChatAnswer`; rate limit; без ключа → soft fallback |

Новые эндпоинты: сначала OpenAPI → `pnpm --filter @workspace/api-spec run codegen` → реализация в `artifacts/api-server/src/routes/*` + подключение в `routes/index.ts`.

**AI (DeepSeek):**
- Контракт: `lib/api-spec/openapi.yaml` → schemas `AiChatRequest` / `AiChatAnswer` / `ApiErrorBody`.
- Сервер: `artifacts/api-server/src/routes/ai.ts` + `src/ai/{system-prompt,knowledge}.ts` + `src/lib/{deepseek,rate-limit}.ts`.
- Ключ **только на сервере**: `DEEPSEEK_API_KEY` (опц. `DEEPSEEK_MODEL`, default `deepseek-flash` / V4.1-Flash; `thinking: disabled` для быстрых ответов). Без ключа API отвечает fallback-текстом, фронт не падает.
- Тон: пользователь = «босс»; при нехватке данных — «напишите моему боссу» + контакты (`src/ai/system-prompt.ts`).
- Клиент: `aiChat` из `@workspace/api-client-react` в `AiPanel` (`ai-assistant.tsx`); при сетевой/5xx ошибке — локальный fallback с контактами.
- Dev proxy: Vite `server.proxy["/api"]` → `API_PROXY_TARGET` (default `http://127.0.0.1:3001`). См. корневой `.env.example`.

## Stack

### Frontend (`artifacts/loomixx`)

| Area | Choice |
| ---- | ------ |
| Framework | React 19 + TypeScript 5.9 |
| Bundler | Vite 7 (`PORT` и `BASE_PATH` **обязательны** даже для `build`; на проде: `PORT=4173`, `BASE_PATH=/`) |
| Routing | wouter |
| Styles | Tailwind CSS v4 + кастомный бренд-CSS в `src/index.css` |
| UI kit | shadcn/ui (style `new-york`, Radix) в `src/components/ui/*` |
| Server state | TanStack Query (`QueryClientProvider` уже в `App`) |
| Forms | React Hook Form + Zod (готово в deps; контакт пока нативный form) |
| Icons | lucide-react |
| Motion | framer-motion — `HeroRotatingPhrase`; **SplashScreen** (вход); **BlurText** (react-bits); AI dock open/close; AI placeholder typewriter (`useTypewriterPlaceholder`: старт с пустой строки, печать только после open/`enabled`); `useReducedMotion` везде; **route transitions** — View Transitions API (`useViewTransitionLocation`), не AnimatePresence на страницах; прочие UI — CSS transitions |
| Theme | class `dark` на `<html>`, ключ `localStorage`: `loomixx-theme` |

**Шрифты:** Unbounded (display/brand), Manrope (body), DM Mono (eyebrows/meta).  
**Алиасы:** `@` → `src`, `@assets` → `attached_assets`.

### Backend (`artifacts/api-server`)

| Area | Choice |
| ---- | ------ |
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| Logging | pino + pino-http |
| Validation | Zod из `@workspace/api-zod` (не дублировать схемы вручную) |
| Build | esbuild → CJS/ESM bundle (`build.mjs` → `dist/index.mjs`) |
| CORS | `cors()` (на старте открытый; ужесточать при выносе в прод) |

### Data / contracts

- **OpenAPI 3.1** — единственный source of truth для публичных контрактов (`title` должен оставаться `Api` — иначе ломаются пути Orval).
- **Zod:** catalog `zod` ^3; Orval zod output pinned to v3.
- **PostgreSQL + Drizzle** — когда появятся таблицы: модели в `lib/db/src/schema/*`, реэкспорт из `schema/index.ts`, apply через `pnpm --filter @workspace/db run push` (dev).
- Env: `DATABASE_URL` (db), `PORT` (оба процесса), `BASE_PATH` (frontend Vite), `API_PROXY_TARGET` (Vite → API), `DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL` (api-server).

### Tooling / supply chain

- Только **pnpm** (`preinstall` блокирует npm/yarn).
- `minimumReleaseAge: 1440` в `pnpm-workspace.yaml` — не отключать.
- Typecheck: `pnpm run typecheck` (libs project refs + artifacts).
- Корень Replit-ориентирован; артефакты описаны в `artifacts/*/.replit-artifact/artifact.toml`.

### Deploy / local run

- **Прод** (`/var/www/loomixx`): `./deploy.sh` — git pull, build SPA + api-server, `systemctl restart loomixx-api`, nginx reload.
- **Один раз на сервере:** `/etc/loomixx/api.env` (`DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL=deepseek-flash`, chmod 600); unit `deploy/loomixx-api.service` → `/etc/systemd/system/`; nginx `location /api/` из `deploy/nginx-api.snippet.conf`.
- **Локально:** скопируй `.env.example` → `.env`, заполни ключ; `./build_local.sh` (в `.gitignore`, не в git) поднимает API `:3001` + Vite с proxy.
- SPA ходит на относительный `/api/*`; в prod nginx проксирует на `127.0.0.1:3001`.

## UI / brand patterns

- Бренд-сигнал: слово **loomixx** + mark `l` (lime, скошенный круг) — hero-level, не только nav.
- **Favicon / tab icon:** `artifacts/loomixx/public/favicon.svg` — SVG mark бренда (`#b8e35e` slime + ink `l`, rotate −10°, как `.brand-mark` / `.ai-brand-mark`). Подключение в `index.html`: `rel="icon"` (`sizes="any"`) + `apple-touch-icon`. Не возвращать оранжевую Replit-заглушку; буква в SVG — path (без внешних шрифтов).
- Hero на `/`: **без** eyebrow-текста («Независимая продуктовая студия» убрана). Отступ header → «Цифровые вещи» держит пустой слот `.hero-eyebrow-slot` (та же in-flow высота, что у `.eyebrow` + status-dot), не сжимать margin/padding взамен без пересчёта.
- Hero headline: фиксированное «Цифровые вещи» + автосмена хвоста через `HeroRotatingPhrase` (`src/components/hero-rotating-phrase.tsx`):
  - фразы: «со смыслом», «с душой», «для бизнеса», «с характером», «без лишнего»;
  - слот `.hero-rotate` / `.hero-rotate-measure` = ширина самой длинной фразы — стабильные переносы, без прыжка вёрстки;
  - анимация: framer-motion `AnimatePresence mode="wait"`, уважает `prefers-reduced-motion` / `useReducedMotion`.
- Hero copy (`.hero-copy`): «От идеи до готового продукта» + обязательный `<br />` + «— проектируем и создаём цифровые продукты, которыми действительно удобно пользоваться.»
- Hero note (`.hero-note`): «ПОД ВАШУ ЗАДАЧУ · ВНИМАНИЕ К КАЖДОМУ ШАГУ» — клиентоориентированный сигнал, не про размер команды.
- **Главная `/` — только hero-экран:** `Shell home` → `.site-shell--home` + `.home-main` + `.hero.hero-screen`. Без нижних секций, без Footer. Страница **не скроллится** (`overflow:hidden` на html/body при `:has(.site-shell--home)`).
- Правый блок hero: `HeroOrbitScene` (`src/components/hero-orbit-scene.tsx`) — ноутбук + орбита сателлитов (`</>`, code editor, slime-mark, phone, post) + lime rings/spheres на framer-motion; `useReducedMotion` → статика; стили `.hero-orbit*`. About по-прежнему использует старый `.orbit` / `.art-core`.
- **Splash / loading** (`SplashScreen` в `App`, поверх роутера, `src/components/splash-screen.tsx`):
  - на **каждый hard load** документа (нет sessionStorage-skip); SPA-переходы (в т.ч. на `/`) splash не показывают — `App`/`SplashScreen` не remount;
  - сценарий: fade-in → slime-mark (`.splash .splash-mark.ai-brand-mark` ~120–168px; специфичность поверх `.ai-brand-mark` 28px) → **BlurText** «loomixx» (`delay={150}`, `animateBy="letters"`, `direction="top"`) → hold → **exit**: 1) reverse BlurText → 2) logo последним → 3) fade оверлея → 4) reveal `.site-shell` (`html.splash-reveal`, opacity ~0.7s, без transform);
  - **`/`:** reverse только после `videoReady` (`canplaythrough` / cache blob → `markHeroMediaReady`, событие `loomixx:hero-media-ready`) **и** enter BlurText; safety timeout 15с; сайт под `splash-active` скрыт — пустой слот видео не виден;
  - **не `/`:** splash без ожидания видео; фоновый `preloadHeroVideo`; страница после анимации;
  - **кэш видео:** `src/lib/hero-video-cache.ts` — Cache Storage `loomixx-hero-v1` → blob URL; `HeroOrbitScene` берёт src из кэша, кадр `opacity:0` до `.is-ready` / `--active`; reduced-motion — постер + `onLoad`;
  - `html.splash-active` блокирует scroll + `.site-shell` невидим; `data-splash=pending|done` + `loomixx:splash-done`;
  - `AiDock` авто-open на `/` после splash-done;
  - `BlurText` — `src/components/BlurText.tsx`; стили `.splash*` / `.blur-text` в `index.css`.
- **AI-ассистент** (`AiDock` в `Shell` на всех страницах, `src/components/ai-assistant.tsx`):
  - старт: анимированный logo (`.ai-fab` + slime) **по центру снизу**;
  - авто-раскрытие панели **только на `/`** (через 3с **после** splash); на остальных — каждые 5с nudge «тык-тык» (`.ai-fab.is-nudge`), пока закрыт;
  - клик **вне** блока → схлапывание в logo; клик по logo → открыть;
  - **header панели** (`.ai-panel-header`, непрозрачный): slime-mark + «Люмик» + `(на связи)` (mono, слегка зелёный);
  - **история сессии:** `sessionStorage` ключ `loomixx-ai-history` (до закрытия вкладки); закрытие панели / смена страницы не сбрасывает диалог; при reopen — полный тред; лимит 40 сообщений; `.ai-thread-scroll` max-height `min(48vh, 420px)`;
  - chips через `suggestionsForPath`; поле + кастомный скролл + slime send — как раньше;
  - кастомный скролл: нативный скрыт; **proximity** ~14px у правого края (`is-scroll-near`) → thumb 3→8px; **drag** thumb/rail без text-selection (`body.ai-scroll-dragging`, `preventDefault` + clear selection); колесо над сообщениями крутит **тред** (без вложенного scroll в `.ai-msg-body`);
  - placeholder typewriter: при открытии панели текст **пустой**, затем печатается (`useState('')` + reset при `!enabled`); не инициализировать `phrases[0]` — иначе полный плейсхолдер мелькает до старта анимации; `prefers-reduced-motion` → сразу первая фраза;
  - user-msg `max-width:75%`, assistant = ширина строки; текст сообщений растёт, скролл — у треда;
  - **выделение:** `/` (`.site-shell--home`) — `user-select:none`, исключение только `.ai-msg` / `.ai-input`; SelectionBrush на home сбрасывает selection вне AI; chips/header/rail — без select;
  - тон Люмика: пользователя называет «босс»; контакты — «напишите моему боссу…» (`system-prompt.ts` + fallback);
  - loading: `AI_LOADING_PHRASES` (14 шт.), `useLoadingPhrase` — shuffle-колода на каждый busy, ротация без сразу-повтора на стыке;
  - SelectionBrush `z-index:50` + `mix-blend-mode`; ответы через `POST /api/ai/chat` (DeepSeek); fallback → `@alekseevich47` / `loomixx.dev@yandex.ru`; ссылки в ответе — `AiReplyText`.
- **Sticky header** — см. Routing; править только `.topbar` / `.topbar-inner` в `index.css` + разметку `Header` в `App.tsx`; не вешать sticky на отдельные страницы.
- **Shared Shell** — не возвращать `<Shell>` внутрь page-компонентов; иначе снова remount Header/AiDock и ломается бесшовный переход.
- Визуальный язык: тёплый paper (`--paper` / cream background), ink, lime accent (`--lime` / primary green), orange accent; display-типографика Unbounded с сильным negative tracking.
- Страницы — **кастомные классы** в `index.css` (`hero`, `project-card`, `cta-band`…), не обязательно через shadcn Card.
- shadcn — для интерактивных примитивов (dialog, form controls, toast), не для «карточек ради карточек» на маркетинге.
- Особенность UX: `SelectionBrush` (`App.tsx`) — кастомное выделение текста «мазок кисти»:
  - native `::selection` скрывается при активном brush (`html.selection-brush-active`);
  - подсветка = SVG overlay по `Range.getClientRects()` (линии мержатся);
  - геометрия: Catmull–Rom → cubic Bézier силуэт + мягкие tapered wisps на краях;
  - лёгкий `feTurbulence` + `feDisplacementMap` (`#selection-brush-soft`) для органической кромки;
  - классы: `.selection-brush-layer` (`z-index:50`, `mix-blend-mode:multiply` / dark `soft-light`), `.selection-brush-path`, `.selection-brush-path--wisp`;
  - для AI: `contenteditable` + `.ai-msg-body` — DOM Range; brush поверх оверлея.
- Тесты/e2e-хуки: стабильные `data-testid` на ключевых ссылках и форме (`link-brand`, `form-contact`, …).
- Контент портфолио сейчас **захардкожен** в `App.tsx` (`projects`, `serviceItems`) — при росте вынести в модуль данных / API, не размазывать по компонентам.
- `serviceItems` 03: **Мини-приложения** (не нативные iOS/Android) — заказы/записи/каталоги/ЛК в мессенджере; details: сценарии взаимодействия, дизайн мини-приложения, интеграции с CRM и сервисами.

## Security

- Секреты и connection strings только через env, не в репо.
- Весь ввод API — через Zod (generated или согласованные схемы).
- ORM (Drizzle) против SQL-injection; XSS — не рендерить сырой HTML из пользовательского ввода.
- Когда форма контакта станет реальной: rate limit, honeypot/CAPTCHA по необходимости, валидация на бэке, не доверять клиенту.
- CORS и cookie-auth — осознанно ужесточать перед публичным деплоем (сейчас scaffold).

## Optimization

- Один основной бандл страниц сайта пока компактный; при росте — lazy routes (`React.lazy` + wouter) для тяжёлых страниц.
- Изображения: WebP/AVIF, размеры под viewport; ассеты через `@assets` / CDN позже.
- Не тянуть Recharts/Embla/тяжёлые ui-компоненты на лендинг без использования.
- API: фоновые побочные эффекты (почта, CRM) — вне request path или через очередь, когда появятся.

## Infra (прод)

- **Домен:** `loomixx.ru` (+ `www.loomixx.ru`). Beauty+ хосты (`beauty.*` / `beautyadm.*` из `stack_app.md`) сюда не переносить.
- **Код на VPS:** `/var/www/loomixx` (git clone репозитория).
- **Прод сейчас — только статика:** nginx отдаёт `artifacts/loomixx/dist/public`. Node/`api-server` на проде **не обязателен**, пока нет реальных эндпоинтов кроме задела.
- **Nginx (паттерн VPS как у calc/shashlik):** HTTP `:80` → ACME + редирект HTTPS; HTTPS `listen 127.0.0.1:8443 ssl` (внешний TLS/терминация на хосте). SPA: `try_files $uri $uri/ /index.html`. Кэш: `/assets/` долго (хэши Vite), `index.html` — `no-cache`. Конфиг сайта: `/etc/nginx/sites-available/loomixx`.
- **Деплой:** корневой `./deploy.sh` на сервере — `git pull` → `pnpm install --frozen-lockfile` → `PORT=4173 BASE_PATH=/ pnpm --filter @workspace/loomixx run build` → `nginx -t` + reload. После ребута VPS билд заново не нужен: nginx + уже собранный `dist/` достаточны.
- **Локально:** Vite frontend (+ Express API при работе с API). Сборка без env упадёт — всегда передавать `PORT` и `BASE_PATH`.
- **Git:** `.gitignore` — `node_modules/`, `dist/`, `graphify-out/`, `*.tsbuildinfo`, `.env*`. Не коммитить сборки и зависимости.
- Observability: pino на API (когда подключён); клиентский error boundary + console.

## Agent workflow

1. UI-правки маркетинга → `artifacts/loomixx` (`App.tsx`, `src/index.css`, при необходимости компоненты).
2. Новый API → OpenAPI → codegen → route + Zod parse ответа/тела.
3. Новая таблица → `lib/db/src/schema/<name>.ts` → export → `db push` (dev).
4. Не смешивать с Beauty+ архитектурой (NestJS, Centrifugo, Telegram initData, entitlements) — это другой продукт.
5. После правок кода при наличии graphify: `graphify update .`.
6. Прод-обновление сайта → правки в репо → на сервере `./deploy.sh` (не собирать `mockup-sandbox`).

## Do / Don't

- ✅ Держать OpenAPI актуальным; после изменений спеки — codegen.
- ✅ Сохранять бренд-CSS и шрифты; новые секции в том же визуальном языке.
- ✅ Честно помечать демо-поведение (как у контактной формы), пока нет бэка.
- ✅ Использовать `@workspace/*` пакеты вместо копипасты типов/fetch.
- ✅ На проде собирать только `@workspace/loomixx`; env билда — в `deploy.sh`.
- ❌ Не подменять стек на Nest/Next/Turborepo «по привычке» из `stack_app.md`.
- ❌ Не коммитить секреты, `node_modules`, `dist`, `graphify-out`; не отключать `minimumReleaseAge`.
- ❌ Не выдавать концепты портфолио за клиентские кейсы в копирайте.
- ❌ Не подключать `@workspace/db` в API «на будущее» без реальных запросов — пустой импорт уронит процесс без `DATABASE_URL`.
- ❌ Не вешать заглушку `loomixx.ru` в `default` nginx — ломает ACME/Let's Encrypt.
