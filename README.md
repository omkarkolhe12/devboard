# DevBoard — Advanced (UI + Go + Postgres)

The DevBoard front end wired up to a real backend. This is the `advanced`
branch: the **same React UI** as `fundamentals`, but its data now comes from a
**Go (Gin) REST API** backed by **PostgreSQL** instead of an in-memory mock.

```
browser ─▶ frontend (nginx) ──/api──▶ backend (Go/Gin) ──▶ postgres
```

No auth, no queues, no tracing — deliberately minimal. The lesson is the
wiring: how the UI, an API gateway, a Go service, and a database fit together.

## Run it (Docker)

```bash
docker compose up --build
# open http://localhost:8080
```

| Service  | URL                          | Notes                              |
| -------- | ---------------------------- | ---------------------------------- |
| Frontend | http://localhost:8080        | nginx serves the SPA, proxies /api |
| Backend  | http://localhost:8081/health | Go API (also reachable via /api)   |
| Postgres | localhost:5432               | devboard / devboard                |

## Run it (local dev, no Docker)

```bash
# 1. Postgres (any local instance), then load the schema + seed:
psql "$POSTGRES_URL" -f init/postgres/01_schema.sql
psql "$POSTGRES_URL" -f init/postgres/02_seed.sql

# 2. Backend
cd backend && go run .            # :8080

# 3. Frontend (proxies /api → :8080)
cd frontend && npm install && npm run dev   # :5173
```

## API

Routes are mounted at the root in Go; the gateway exposes them under `/api`.

| Method | Path                            | Body                                      |
| ------ | ------------------------------- | ----------------------------------------- |
| GET    | `/projects`                     | → `{ projects: [...] }`                   |
| POST   | `/projects`                     | `{ name, description }`                    |
| GET    | `/tasks?project_id=N`           | → `{ tasks: [...], source: "database" }`  |
| POST   | `/tasks`                        | `{ title, description, status, priority, project_id }` |
| PATCH  | `/tasks/:id`                    | `{ status? title? priority? description? }` |
| GET    | `/search?q=&project_id=N`       | → `{ results: [...] }` (ILIKE on title)   |
| GET    | `/health`                       | → `{ status, service }`                   |

## Layout

```
advanced/
├── docker-compose.yml      frontend + backend + postgres
├── frontend/               React UI (Vite) + nginx gateway
├── backend/                Go (Gin) REST API
│   ├── main.go
│   ├── go.mod
│   └── Dockerfile
└── init/postgres/          schema + seed (auto-loaded on first boot)
```
