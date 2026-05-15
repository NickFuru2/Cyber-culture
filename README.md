# 🛡️ CYBER_OPS://CORE

**Gamified Cybersecurity Training Platform**

> Интерактивная платформа для изучения кибербезопасности через геймификацию в стиле MMO-RPG.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Tech Stack](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)
![Tech Stack](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📋 О проекте

CYBER_OPS — это веб-платформа, превращающая обучение кибербезопасности в захватывающий игровой опыт. Пользователи создают аккаунт «агента», выбирают фракцию (White Hat / Black Hat), и прокачиваются через выполнение миссий, изучение учебников и участие в PvP/рейдах.

### 🎯 Основные возможности

| Модуль | Описание |
|--------|----------|
| **Dashboard** | Главная панель агента с обзором прогресса, статистики и быстрого доступа |
| **Skill Tree** | Дерево навыков с 3 ветками: Offensive, Defensive, Intelligence |
| **Missions** | Терминальные задания с реальными командами (nmap, decrypt и др.) |
| **Textbooks** | Библиотека книг по кибербезопасности с отслеживанием прогресса |
| **PvP Arena** | Система рейтинга ELO, матчмейкинг, история боёв, лидерборд |
| **Global Raids** | Интерактивный 3D-глобус с мировыми угрозами и рейд-боссами |
| **Armory** | Чёрный рынок с динамическим ценообразованием и аукционами |
| **Inventory** | Система снаряжения: процессор, файрвол, нейролинк, сетевой адаптер |
| **Syndicate** | Гильдии с зашифрованным чатом и совместными операциями |
| **Factions** | Войны фракций с территориальным контролем |

### 💰 Экономика

- **Game Credits** — зарабатываются в игре
- **Premium Credits** — донат-валюта с симуляцией оплаты
- **Skill Points** — получаются при повышении уровня (+2 SP за level up)
- **XP** — за миссии, рейды, PvP, изучение книг

---

## 🏗️ Архитектура

```
Cyber-culture/
├── backend/              # Express.js API Server
│   ├── server.js         # API routes, auth, database
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── components/   # TopNav, SideNav, Registration, etc.
│   │   ├── pages/        # Dashboard, Academy, Missions, PvP, etc.
│   │   ├── store/        # Zustand global state
│   │   ├── App.jsx       # Router & main layout
│   │   └── index.css     # Global styles & animations
│   ├── public/           # Static assets (videos, icons)
│   └── package.json
└── README.md
```

---

## 🚀 Быстрый старт

### Требования

- **Node.js** >= 18
- **npm** >= 9

### Установка

```bash
# Клонирование
git clone https://github.com/your-username/cyber-culture.git
cd cyber-culture

# Backend
cd backend
npm install
npm run dev

# Frontend (в новом терминале)
cd frontend
npm install
npm run dev
```

### Запуск

| Сервис | URL | Порт |
|--------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| Backend API | http://localhost:4000 | 4000 |

---

## 🛠️ Технологический стек

### Frontend
- **React 19** — UI-фреймворк
- **Vite 8** — сборка и HMR
- **Zustand** — управление состоянием
- **React Router 7** — маршрутизация
- **TailwindCSS 3** — стилизация
- **Lucide React** — иконки
- **Globe.gl** — 3D-визуализация глобуса
- **Google Fonts** — Inter, JetBrains Mono, Space Grotesk

### Backend
- **Express 5** — HTTP-сервер
- **better-sqlite3** — база данных
- **JWT** — аутентификация
- **bcryptjs** — хеширование паролей

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Регистрация агента |
| POST | `/api/auth/login` | Авторизация |

### Agent
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agent/me` | Профиль агента |
| PATCH | `/api/agent/me` | Обновить профиль |

### Skills & XP
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | Список навыков |
| POST | `/api/skills/unlock` | Разблокировать навык |
| POST | `/api/xp/add` | Добавить XP |

### PvP
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pvp/stats` | PvP статистика |
| POST | `/api/pvp/toggle` | Вкл/выкл PvP |
| GET | `/api/pvp/leaderboard` | Топ игроков |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/status` | Статус сервера |
| GET | `/api/inventory` | Инвентарь |
| GET/POST | `/api/chat/:channel` | Чат |
| POST | `/api/credits/add` | Добавить кредиты |

---

## 🎨 Дизайн-система

- **Цвета**: Cyberpunk тёмная тема (#10141a фон) с акцентами Cyan, Red, Fuchsia
- **Шрифты**: Space Grotesk (заголовки), Inter (текст), JetBrains Mono (код/UI)
- **Эффекты**: Glass-morphism, glow shadows, scan-line overlays, pulse animations
- **Сетка**: CSS Grid фон в стиле терминала

---

## 👥 Авторы

Разработано в рамках курсового проекта по дисциплине "Кибер-культура".

---

## 📄 Лицензия

MIT License
