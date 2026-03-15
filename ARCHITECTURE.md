# ALGO — AI-учитель Python | Архитектура

## Обзор

**ALGO** — персональный AI-учитель Python для детей 10–17 лет в школе Алгоритмика. AI собирает профиль ученика, строит персональную траекторию, генерирует задания, проверяет код и даёт code review. Демо / Proof of Concept для инвестора.

**Live:** https://algoai.duckdns.org

---

## Стек технологий

```
Frontend:   React 19 + TypeScript + Vite
Styling:    Tailwind CSS v4
State:      Zustand
Editor:     Monaco Editor (встроенный редактор кода)
Python:     Pyodide v0.27.0 (Python в браузере через WebAssembly)
Backend:    Node.js + Express 5
AI:         Claude CLI (`claude --print --model sonnet`)
Deploy:     Hetzner VPS, nginx, systemd, Let's Encrypt SSL
```

---

## Архитектура системы

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER                            │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │  React   │  │  Zustand  │  │     Pyodide        │   │
│  │   App    │──│  Store    │  │  (Python runtime)  │   │
│  └────┬─────┘  └──────────┘  └────────────────────┘   │
│       │                              ▲                  │
│       │  POST /api/claude            │ runCode()        │
│       ▼                              │                  │
└───────┼──────────────────────────────┼──────────────────┘
        │                              │
        │  HTTPS (nginx)               │ (local, no server)
        ▼                              │
┌───────────────────────┐              │
│     EXPRESS :4000     │              │
│                       │              │
│  POST /api/claude     │              │
│    ↓                  │              │
│  execFile('claude',   │              │
│   ['--print',         │              │
│    '--model','sonnet'])│             │
│    ↓                  │              │
│  stdin ← prompt       │              │
│  stdout → response    │              │
│    ↓                  │              │
│  { text: "..." }      │              │
│                       │              │
│  Static files:        │              │
│  client/dist/*        │              │
└───────────────────────┘
```

---

## Структура проекта

```
algoritmika-ai-teacher/
├── .env                          # PORT=4000
├── package.json                  # Monorepo scripts (concurrently)
│
├── server/
│   ├── index.js                  # Express сервер + static files
│   └── routes/
│       └── claude.js             # Claude CLI proxy (execFile)
│
└── client/
    ├── index.html                # Pyodide CDN, Montserrat font
    ├── vite.config.ts            # Vite + Tailwind + proxy /api → :4000
    │
    └── src/
        ├── App.tsx               # Phase router
        ├── main.tsx              # React entry
        ├── index.css             # Tailwind + CSS animations
        │
        ├── types/
        │   └── index.ts          # StudentProfile, Task, CodeReview, Phase
        │
        ├── api/
        │   └── claude.ts         # askClaude(), askClaudeJSON<T>()
        │
        ├── store/
        │   └── studentStore.ts   # Zustand: phase, student, trajectory, tasks
        │
        ├── hooks/
        │   ├── usePyodide.ts     # Python runtime в браузере
        │   └── useTypeWriter.ts  # Анимация печатания текста
        │
        ├── utils/
        │   └── pythonErrors.ts   # Дружелюбные ошибки Python на русском
        │
        └── components/
            ├── layout/
            │   ├── Header.tsx        # Шапка с логотипом + имя ученика
            │   └── ProgressBar.tsx   # Прогресс по модулям
            │
            ├── ai/
            │   ├── AIMessage.tsx     # Пузырь AI-сообщения (typewriter)
            │   └── AILoader.tsx      # Лоадер "ALGO думает..."
            │
            ├── onboarding/
            │   ├── WelcomeScreen.tsx  # Экран 1: Приветствие
            │   ├── ProfileForm.tsx    # Экран 2: Анкета ученика
            │   └── LevelQuiz.tsx      # Экран 3: Тест (5 вопросов)
            │
            ├── trajectory/
            │   └── TrajectoryScreen.tsx # Экран 4: AI-траектория
            │
            ├── lesson/
            │   ├── CodeEditor.tsx     # Экран 5: Monaco + Pyodide
            │   ├── TaskCard.tsx       # Карточка задания
            │   ├── OutputPanel.tsx    # Вывод программы
            │   └── ReviewPanel.tsx    # Экран 6: AI code review
            │
            └── shared/
                ├── Button.tsx         # Yellow pill CTA
                ├── Card.tsx           # Dark purple cards
                └── Badge.tsx          # Теги концептов
```

---

## User Flow (State Machine)

```
welcome ──→ profile ──→ quiz ──→ trajectory ──→ lesson ──→ review
                                                  ↑          │
                                                  └──────────┘
                                                 (next task)

Reset (header button) → welcome
```

### Экран 1: Welcome
- AI greeting через Claude CLI (typewriter animation)
- Fallback если Claude не ответил за 90с

### Экран 2: Profile
- Имя, возраст, опыт Python (none/some/confident)
- Цель: make_game | get_job | automate | learn_ml | school_project | just_curious
- Время: 1 / 2-3 / 4-5 часов / каждый день

### Экран 3: Quiz
- 5 hardcoded Python вопросов (от простого к сложному)
- Автопереход через 2с после ответа
- Уровень: ≤1 → beginner, 2-3 → intermediate, 4-5 → advanced
- AI-сообщение с персональным фидбэком

### Экран 4: Trajectory
- Claude генерирует 5-7 модулей (JSON)
- Адаптируется под уровень + цель + время
- Вертикальный timeline, первый модуль активный

### Экран 5: Lesson (split view)
- Левая панель (40%): задание, пример, подсказка, теги
- Правая панель (60%): Monaco Editor + кнопки Run/Submit + Output
- **Run**: Pyodide исполняет Python в браузере (без сервера)
- **Submit**: код отправляется в Claude для review

### Экран 6: Review
- Score ⭐ из 10
- Что хорошо (green) / Что улучшить (yellow)
- Исправленный код (collapsible)
- **Next task**: Claude генерирует адаптивно:
  - score < 6 → проще
  - score ≥ 6 → сложнее
  - score = 10 → challenge

---

## AI Integration

### Claude CLI Backend

```javascript
// server/routes/claude.js
const child = execFile('claude', ['--print', '--model', 'sonnet'],
  { timeout: 120000, maxBuffer: 1024 * 1024 });
child.stdin.write(prompt);
child.stdin.end();
// stdout → { text: response }
```

- **Не API Key** — используется Claude CLI с Pro Max OAuth
- Model: `sonnet` (быстрый, достаточный для задач)
- Timeout: 120с серверный, 90с клиентский (AbortController)

### AI вызовы (5 точек)

| Точка | Prompt | Response |
|-------|--------|----------|
| Welcome greeting | "Поприветствуй ученика" | plain text |
| Quiz feedback | "Ученик прошёл тест: X из 5" | plain text |
| Trajectory | "Сгенерируй траекторию" | JSON: steps[] |
| Task generation | "Сгенерируй задание" | JSON: Task |
| Code review | "Проверь код ученика" | JSON: CodeReview |

### JSON парсинг

```typescript
// api/claude.ts
export async function askClaudeJSON<T>(prompt: string): Promise<T> {
  const text = await askClaude(prompt);
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  return JSON.parse(jsonMatch[1]!.trim()) as T;
}
```

---

## Типы данных

```typescript
interface StudentProfile {
  name: string;
  age: number;
  pythonExperience: 'none' | 'some' | 'confident';
  goal: StudentGoal;
  weeklyHours: number;
  quizScore: number;        // 0–5
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface Task {
  id: string;
  title: string;
  description: string;
  exampleOutput?: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  conceptsTaught: string[];
  starterCode?: string;
}

interface CodeReview {
  score: number;             // 1–10
  summary: string;
  whatWasGreat: string[];
  whatToImprove: string[];
  correctedCode?: string;
  nextTaskHint: string;
}
```

---

## Деплой

```
VPS: Hetzner cpx32 (65.108.89.204)
Path: /opt/algoai/
Domain: algoai.duckdns.org
SSL: Let's Encrypt (auto-renew)

systemd: algoai.service
  WorkingDirectory=/opt/algoai
  ExecStart=/usr/bin/node server/index.js
  Environment=PORT=4000

nginx: /etc/nginx/sites-available/algoai
  server_name algoai.duckdns.org
  proxy_pass http://127.0.0.1:4000
  proxy_read_timeout 120s
  SSL managed by Certbot
```

### Deploy workflow

```bash
# Local
cd client && npm run build
tar czf /tmp/algoai.tar.gz dist/

# Upload
scp /tmp/algoai.tar.gz root@65.108.89.204:/tmp/

# VPS
cd /opt/algoai/client && rm -rf dist
tar xzf /tmp/algoai.tar.gz
systemctl restart algoai
```

---

## Дизайн-система

Вдохновение: **online.algoritmika.org**

```
Цвета:
  Purple (основной):    #632895
  Purple dark:          #3d1560
  Yellow (CTA):         #ffd84d
  Green (success):      #44d370
  Red (error):          #EF4444
  Background:           #f8f5fb

Типографика:
  Основной: Montserrat (600-800 weight)
  Код:      JetBrains Mono

Компоненты:
  Карточки:  rounded-[20px] — rounded-[28px], тёмно-фиолетовый фон
  Кнопки:    rounded-full (pill), жёлтый фон, фиолетовый текст
  Инпуты:    Белые на фиолетовом фоне, жёлтый border при фокусе
  AI bubble: Тёмно-фиолетовый фон + жёлтая полоска слева
  Тени:      rgba(99,40,149,0.3) — фиолетовые
```

---

## Ограничения (Demo)

- ❌ Нет авторизации и аккаунтов
- ❌ Нет базы данных (всё в React state, теряется при перезагрузке)
- ❌ Нет мобильной адаптации
- ❌ Нет реальной проверки правильности кода (только AI review)
- ❌ Нет интеграции с LMS Алгоритмики
- ❌ Нет `input()` в Pyodide (ограничение WebAssembly)
