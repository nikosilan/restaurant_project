# Restaurant ordering system

## Database setup

The backend connects to the shared MariaDB database provided by Metropolia.

1. Make sure you can access Metropolia's MySQL/phpMyAdmin service through the required Metropolia network or VPN.
2. Copy `backend/.env.example` to `backend/.env`.
3. Fill in the shared database host, database name, username, and password provided by the team. Keep `.env` private.

## Run locally

In one terminal:

```text
cd backend
npm install
npm run dev
```

In another terminal:

```text
cd frontend
npm install
npm run dev
```

The API is available at `http://localhost:3001`. Check the connection at `http://localhost:3001/api/health`.

The frontend proxies `/api` requests to the backend during Vite development.

## API checks

Start the backend, then open `backend/test.http` with the VS Code REST Client extension. It contains requests for the database health check, menu lookup, order creation, and validation errors. The frontend should also display the menu from the database when opened.

## Before production

The health-check endpoint is currently development/testing support for confirming that the backend can connect. Before production we should delete it:

- `backend/src/api/models/health-model.js`
- `backend/src/api/controllers/health-controller.js`
- `backend/src/api/routes/health-router.js`
- The `healthRouter` import and `router.use("/health", healthRouter)` line from `backend/src/api/index.js`
- The `GET /api/health` request from `backend/test.http`

Do not remove only one of the health files, because the remaining imports would break the backend startup.

same for the test.http and possibly the fallbackMenu
