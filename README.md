# Rototuna Alumni Connect & Digital Archive

Full-stack starter application:

- Frontend: React + Vite + JavaScript
- Backend: Python FastAPI
- Database: PostgreSQL
- Authentication: JWT access tokens + bcrypt password hashing
- ORM: SQLAlchemy 2
- Local development: Docker Compose

## Project structure

rototuna-alumni-fullstack/
  backend/
    app/
      main.py
      core/config.py
      db.py
      models.py
      schemas.py
      security.py
      routers/auth.py
      routers/alumni.py
      routers/archive.py
      routers/events.py
      routers/connections.py
    requirements.txt
    .env.example
    Dockerfile
  frontend/
    src/
      api.js
      App.jsx
      main.jsx
      styles.css
    package.json
    vite.config.js
    .env.example
    Dockerfile
  docker-compose.yml

## Option A: Run everything with Docker

Install Docker Desktop for Mac first.

From this folder:

```bash
docker compose up --build
```

Frontend:
http://localhost:5173

Backend Swagger:
http://localhost:8000/docs

Backend health:
http://localhost:8000/health

PostgreSQL:
localhost:5432

## Option B: Run PostgreSQL with Docker, backend/frontend locally

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Frontend, in another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

## Default database

Database: rototuna_alumni
User: postgres
Password: postgres
Port: 5432

Change these values before production.

## First use

1. Open the React app.
2. Register an account.
3. Login.
4. Add alumni, archive items, and events.
5. Use Swagger at /docs to test the API directly.

This is a development-ready project scaffold. Before public deployment, use HTTPS, a strong secret key, secure cookies/token storage strategy, migrations, object storage for files, rate limiting, email verification, password reset, audit logging, and production database credentials.
# Rototuna-
