# Task Tracker

A small full-stack task tracker: React 18 + Vite 5 frontend, Spring Boot 3.2 (Java 17) backend, H2 in-memory database.

See [NOTES.md](NOTES.md) for what was fixed and why. Handwritten explanations are in [`handwritten/`](handwritten/).

## Prerequisites

- Java 17+
- Node.js 18+

No Docker or external database needed.

## Run locally

Start the backend first (http://localhost:8080):

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

Then the frontend (http://localhost:5173):

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to the backend. Stop either service with `Ctrl+C`.

## API

`GET /api/tasks` with optional query parameters:

| Param      | Description                                   | Default |
| ---------- | --------------------------------------------- | ------- |
| `q`        | Search term (title or description)            | empty   |
| `status`   | `OPEN`, `IN_PROGRESS` or `DONE` (else 400)    | all     |
| `page`     | Page number, starting at 1                    | 1       |
| `pageSize` | Items per page (1-100)                        | 10      |

Example: `curl "http://localhost:8080/api/tasks?q=api&status=OPEN&page=1&pageSize=5"`

## Useful URLs

| URL                                | Description    |
| ---------------------------------- | -------------- |
| http://localhost:5173              | App UI         |
| http://localhost:8080/api/tasks    | API            |
| http://localhost:8080/h2-console   | H2 console     |

H2 console: JDBC URL `jdbc:h2:mem:taskdb`, user `sa`, no password.

## Project layout

```
backend/    Spring Boot API (controller, repository, schema.sql, data.sql)
frontend/   React app (components, hooks, api.js)
db/         H2 query reference and Oracle PL/SQL reference package (not run locally)
```
