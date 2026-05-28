# vkclient — веб

Браузерная версия просмотра экспорта VK: SQLite открывается **локально** через [sql.js](https://sql.js.org/) (SQLite → WebAssembly). Файл выбирается через `<input type="file">`, данные на сервер не уходят.

## Запуск

```bash
cd web
npm install
npm run dev
```

Откройте адрес из терминала (обычно http://localhost:5173) и загрузите `sqlite.db` (тот же файл, что кладётся в `front/sqlite.db` после `npm run db:prepare`).

## Медиа (фото, аудио, видео)

В базе хранятся только имена файлов. Для показа в интерфейсе есть два варианта:

1. **Локальная папка** — кнопка «Выбрать папку с медиа» (на стартовом экране или в шапке). Внутри должны быть каталоги `photos/`, `audios/`, `videos/` — как на HTTP-сервере. Браузер не читает путь вида `C:\…` напрямую, только выбранную через диалог папку.

2. **URL сервера** — поле «URL медиа-сервера» или переменная в `.env`:

```bash
cp .env.example .env
# VITE_MEDIA_URL=https://ваш-сервер-медиа
```

Локальные файлы имеют приоритет над URL. URL сохраняется в `localStorage`.

## Отличия от `front`

| | `front` (Expo) | `web` |
|---|---|---|
| SQLite | expo-sqlite, файл из assets | sql.js (WASM), файл с диска |
| UI | React Native | HTML + CSS |
| Навигация | React Navigation | react-router-dom |

Запросы (`queries.ts`) и типы скопированы из `front` и используют общий интерфейс `getAllAsync`.

## Сборка

```bash
npm run build
npm run preview
```

Артефакты — в `web/dist/`. Инструкция для пользователей готовой сборки лежит в [`public/README.md`](public/README.md) и копируется в `dist/README.md` при `npm run build`.

Кратко для билда:

1. Открыть `dist/index.html` в браузере.
2. Загрузить файл базы **`.db`** (экспорт VK / `sqlite.db`).
3. Выбрать папку, внутри которой есть каталоги **`photos`**, **`audios`**, **`videos`**.

Для разработки удобнее `npm run dev` или `npm run preview` (HTTP); сборка также рассчитана на открытие `index.html` напрямую (`file://`).
