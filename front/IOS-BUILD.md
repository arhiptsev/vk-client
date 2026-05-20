# Сборка и установка на iPhone (без App Store)

Только для личного использования на своём устройстве.

## Перед сборкой на Mac

```bash
cd front
npm install
npm run db:prepare   # только sqlite.db → assets/
```

В проект **не** кладём медиа — только база (~96 МБ).

Опционально создайте `.env` с URL медиа-сервера (можно позже):

```
EXPO_PUBLIC_MEDIA_URL=https://your-server.example
```

## Генерация Xcode-проекта

На Mac:

```bash
npx expo prebuild --platform ios --clean
cd ios && pod install && cd ..
open ios/*.xcworkspace
```

Если папка `ios-capacitor-legacy/` мешает — она от старого Capacitor, `prebuild` создаёт новую `ios/`.

## Установка на iPhone

1. Подключите iPhone по USB.
2. В Xcode: **Signing & Capabilities** → Team (ваш Apple ID).
3. На iPhone: **Настройки → Конфиденциальность → Режим разработчика** (если iOS просит).
4. Выберите iPhone как target → **Run (▶)**.

Приложение установится без App Store (development-подпись, обычно до 7 дней на бесплатном Apple ID или дольше на платном Developer).

## IPA для установки без кабеля (опционально)

**Product → Archive → Distribute App → Development** или **Ad Hoc** (нужен платный Apple Developer и UDID устройства).

## Размер

IPA будет ~100+ МБ из‑за `sqlite.db` в bundle.
