# Copilot Instructions for MeetYouLive

## Project overview

MeetYouLive is a live-streaming platform with a Node.js/Express backend and a Next.js 15 frontend. The backend is deployed on Render, and the frontend is deployed on Vercel.

## Repository structure

```
MeetYouLive/
├── backend/           Node.js + Express API (CommonJS)
│   ├── index.js           Entry point (loads dotenv, connects to MongoDB, starts server)
│   └── src/
│       ├── app.js         Express app setup (CORS, routes, middleware)
│       ├── config/        db.js, passport.js
│       ├── controllers/   Route handler logic
│       ├── middlewares/   auth.middleware.js (JWT verification)
│       ├── models/        Mongoose models
│       ├── routes/        Express routers
│       └── services/      Business logic helpers
└── frontend/          Next.js 15 App Router (JSX, no TypeScript)
    ├── app/               Next.js App Router pages and layouts
    │   ├── layout.jsx     Root layout
    │   ├── page.jsx       Home page
    │   ├── api/           Next.js API routes (e.g. next-auth)
    │   └── <route>/       One folder per route (dashboard, live, profile, etc.)
    ├── components/        Shared React components
    ├── lib/               Shared helpers (e.g. payVideo.js)
    └── vercel.json        Vercel deployment config
```

## Tech stack

| Layer     | Technology                                                        |
|-----------|-------------------------------------------------------------------|
| Backend   | Node.js 18, Express, Mongoose, JWT, Passport (Google OAuth), Stripe |
| Frontend  | Next.js 15 (App Router), React 18, next-auth                     |
| Database  | MongoDB Atlas                                                     |
| Deploy    | Render (backend), Vercel (frontend)                              |

## Key conventions

- **Backend uses CommonJS** (`require`/`module.exports`). Never use `import`/`export` in backend files.
- **Frontend env vars** are prefixed with `NEXT_PUBLIC_` and accessed via `process.env.NEXT_PUBLIC_*`. `import.meta.env` is not used in Next.js. Server-side-only env vars (e.g. `NEXTAUTH_SECRET`) have no prefix.
- **Backend env vars** are accessed via `process.env.*` after `dotenv.config()` in `index.js`.
- **Authentication** on the frontend uses `next-auth` (v4) with `SessionProvider`. The backend uses JWT tokens validated by the `verifyToken` middleware in `middlewares/auth.middleware.js`.
- **Routing** uses Next.js file-system routing (App Router). Add new pages by creating a folder with a `page.jsx` inside `frontend/app/`.
- **CORS** — the backend allows origins listed in the `FRONTEND_URL` env var and any `*.vercel.app` domain. When deploying to a custom domain, set `FRONTEND_URL` in the backend environment.

## Adding a new feature (common pattern)

1. **Backend**: add a Mongoose model in `src/models/`, a route file in `src/routes/`, a controller in `src/controllers/`, then register the route in `src/app.js`.
2. **Frontend**: add a new folder under `frontend/app/` with a `page.jsx` file. Next.js picks it up automatically via file-system routing.

## Environment variables

### Backend
| Variable                       | Description                                  |
|--------------------------------|----------------------------------------------|
| `PORT`                         | Server port (default 10000)                  |
| `MONGO_URI`                    | MongoDB Atlas connection string              |
| `JWT_SECRET`                   | Secret for signing JWT tokens                |
| `GOOGLE_CLIENT_ID`             | Google OAuth client ID                       |
| `GOOGLE_CLIENT_SECRET`         | Google OAuth client secret                   |
| `GOOGLE_CALLBACK_URL`          | OAuth callback URL                           |
| `FRONTEND_URL`                 | Production frontend URL (for CORS)           |
| `STRIPE_SECRET_KEY`            | Stripe secret key                            |
| `STRIPE_WEBHOOK_SECRET`        | Stripe webhook signing secret                |
| `STRIPE_SUBSCRIPTION_PRICE_ID` | Stripe Price ID for the subscription plan    |
| `NEXTAUTH_SECRET`              | Must match the frontend `NEXTAUTH_SECRET` (used to verify next-auth session tokens) |

### Frontend
| Variable                  | Description                            |
|---------------------------|----------------------------------------|
| `NEXT_PUBLIC_API_URL`     | Backend API base URL                   |
| `NEXT_PUBLIC_LIVE_PROVIDER_KEY` | Live streaming provider API key  |
| `GOOGLE_CLIENT_ID`        | Google OAuth client ID (for next-auth) |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth client secret             |
| `NEXTAUTH_SECRET`         | Secret for next-auth session signing   |
| `NEXTAUTH_URL`            | Canonical URL of the frontend          |
