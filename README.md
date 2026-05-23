# Домас — сервис обслуживания частных домов

Премиальный веб-сервис для управления обслуживанием загородных домов в Москве и МО.

## Стек

| Технология | Назначение |
|---|---|
| **Next.js 14** (App Router) | Фреймворк |
| **TypeScript** | Типизация |
| **Tailwind CSS** | Стили |
| **Prisma ORM** | Работа с БД |
| **PostgreSQL** | База данных |
| **NextAuth.js** | Авторизация |

## Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
```bash
cp .env.example .env.local
# Отредактируй .env.local — заполни DATABASE_URL и NEXTAUTH_SECRET
```

### 3. Создание базы данных
```bash
# Применить схему к БД
npm run db:push

# Или с миграциями (рекомендуется для продакшена)
npm run db:migrate

# Заполнить тестовыми данными
npm run db:seed
```

### 4. Запуск
```bash
npm run dev
# → http://localhost:3000
```

### Тестовые аккаунты (после seed)
| Роль | Email | Пароль |
|---|---|---|
| Администратор | admin@domas.ru | admin123 |
| Клиент | ivan@example.com | user123 |

---

## Структура проекта

```
/app                    — Страницы (Next.js App Router)
  /api                  — API Routes
    /auth               — Авторизация (NextAuth + регистрация)
    /orders             — CRUD заказов
    /subscriptions      — Управление подписками
    /payments/yukassa   — Интеграция ЮKassa
    /reviews            — Отзывы
    /admin              — Эндпоинты для админа
  /(auth)               — Страницы входа и регистрации
  /dashboard            — Личный кабинет
  /admin                — Панель администратора

/components
  /ui                   — Атомарные компоненты (Button, Input, Modal...)
  /layout               — Структурные (Header, Footer, MobileMenu)
  /sections             — Секции страниц (Hero, Services, Pricing...)

/constants              — Все тексты, цены, списки
/types                  — TypeScript типы
/lib                    — Утилиты (db, auth, utils, validations)
/hooks                  — Кастомные React хуки
/prisma                 — Схема БД и seed
/public/video           — Видео для Hero секции
```

---

## Как добавить новую услугу

1. Добавь в `constants/services.ts` новый объект в массив `SERVICES`
2. Добавь маппинг в `SERVICE_LABELS`
3. Добавь тип в `ServiceType` в `types/index.ts`
4. Обнови enum `serviceType` в `lib/validations.ts`
5. Готово — карточка появится автоматически

---

## Как добавить новую страницу

1. Создай файл `app/your-page/page.tsx`
2. Добавь ссылку в `constants/navigation.ts`
3. Если страница защищённая — добавь путь в `middleware.ts`

---

## Деплой на Timeweb Cloud

### Подготовка
```bash
# Сборка проекта
npm run build

# Проверка, что сборка не упала
npm start
```

### Настройка Timeweb
1. Создайте App в панели Timeweb → выберите Node.js
2. Подключите Git репозиторий
3. Укажите команду сборки: `npm install && npm run build`
4. Укажите команду запуска: `npm start`
5. Добавьте переменные окружения из `.env.example`
6. Создайте PostgreSQL сервис → скопируйте `DATABASE_URL`

### База данных на продакшене
```bash
# Выполните после деплоя в терминале Timeweb
npx prisma migrate deploy
```

---

## Подключение внешних сервисов

### ЮKassa (платежи)
Смотрите инструкцию в `app/api/payments/yukassa/route.ts`

### UniSender (рассылки)
Смотрите инструкцию в `app/api/admin/send-email/route.ts`

### Видео для Hero секции
Поместите файл `hero.mp4` в папку `public/video/`.
Рекомендуемые параметры: H.264, 1920×1080, ~5–10 МБ (оптимизируйте через HandBrake).
