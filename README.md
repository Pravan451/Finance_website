# FinFlow — Finance Dashboard (Frontend Demo)

A React + Vite + Tailwind CSS dashboard for tracking income, expenses, and simple analytics. Uses **mock data** and **Zustand** with **localStorage** persistence — no backend required.

## Setup

```bash
cd finanace_web
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

```bash
npm run build   # production build
npm run preview # preview production build
npm run lint    # ESLint
```

## Features (assignment coverage)

| Area | What’s included |
|------|------------------|
| **Dashboard** | Summary cards (balance, income, expenses), **cash flow** area chart, **net balance trend** line chart, **spending by category** (donut + horizontal bars), quick stats (savings rate, avg daily spend, top category, tx count). |
| **Transactions** | Table with date, title, category, amount, type; **search**; **category + type filters**; **sort** by date; **CSV + JSON export**; **admin**: edit, delete. |
| **Viewer vs Admin** | **Viewer** is read-only for actions; **Admin** can add transactions (dashboard), edit/delete transactions, and use the “Add transaction” control. Switch role in the **navbar** or **Settings**. |
| **Insights** | Cards: **top spending category**, **month-over-month expense change**, **net position**; optional **chat-style demo** that answers using **local** transaction math (no API keys). |
| **Budget** | Progress bars per expense category vs **defaults** stored in Zustand (persisted). |
| **Settings** | Role demo, **dark / light** shell, **reset data** to sample set, **CSV + JSON export**. |
| **UX** | Responsive layout, **collapsible sidebar** (desktop), **mobile drawer** nav, empty states, INR formatting, Framer Motion on key surfaces. |

## State management

- **Zustand** (`src/store/useFinanceStore.js`): transactions, role, dark mode, sidebar collapse, category budget defaults, CRUD helpers.
- **Persist**: `transactions`, `role`, `darkMode`, `sidebarCollapsed`, `categoryBudgets` → `localStorage` key `finance-storage`.

## Project structure (high level)

```
src/
  components/layout/   # Shell, sidebar, navbar
  components/ui/       # Modals, cards, guards, toasts
  data/mockData.js     # Sample INR transactions
  pages/               # Dashboard, Transactions, Insights, Budget, Settings
  store/               # Zustand store
  utils/helpers.js     # INR, CSV/JSON export, aggregations
```

## Assumptions

- Currency is **INR**; dates are ISO strings (`YYYY-MM-DD`).
- “AI” chat on Insights is **deterministic mock logic** over your data — suitable for demos and interviews without backend keys.

## License

MIT (or your choice) — demo / evaluation use.
