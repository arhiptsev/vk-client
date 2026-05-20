# VK Client (React Native + SQLite)

Приложение читает данные **напрямую из SQLite**. Backend и локальные медиа в проект **не входят**.

## Что в проекте

| В bundle | Описание |
|----------|----------|
| `assets/sqlite.db` | База (копия `front/sqlite.db`, ~96 МБ) |
| Код приложения | UI, SQL-запросы |

Медиа (фото, аудио, видео) загружаются **с внешнего сервера** по URL из `EXPO_PUBLIC_MEDIA_URL`.

## Подготовка

```bash
cd front
npm install
npm run db:prepare
```

Скопируйте `.env.example` → `.env` и укажите URL медиа-сервера, когда он будет готов:

```
EXPO_PUBLIC_MEDIA_URL=https://media.example.com
```

Ожидаемые пути на сервере (как в старом Electron/static):

- `https://media.example.com/photos/{filename}`
- `https://media.example.com/audios/{filename}`
- `https://media.example.com/videos/{filename}`

Пока URL не задан, диалоги и текст сообщений работают; вложения показывают имя файла без загрузки.

## Запуск

```bash
npm start
```

## Сборка iOS (позже, на Mac)

См. `IOS-BUILD.md`.
