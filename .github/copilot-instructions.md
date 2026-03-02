# Copilot Instructions for MeetYouLive

## Project Overview

MeetYouLive is a live streaming platform available at [meetyoulive.net](https://meetyoulive.net). It supports user registration/login (JWT + Google OAuth), role-based access (user / creator / admin), video uploads (public & private with payment), live streaming, gifts, Stripe payments (one-time + subscriptions), moderation, and an admin panel.

## Architecture

| Layer    | Service       | URL                          |
|----------|---------------|------------------------------|
| Frontend | Vercel        | https://meetyoulive.net      |
| Backend  | Render        | https://api.meetyoulive.net  |
| Database | MongoDB Atlas | —                            |

## Tech Stack

### Backend (`/backend`)
- **Runtime**: Node.js 18 with ES Modules (`"type": "module"`)
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose
- **Auth**: JWT (`jsonwebtoken`), Google OAuth 2.0 via Passport.js
- **Payments**: Stripe (one-time payments + subscriptions)
- **Other**: `bcryptjs` for password hashing, `express-rate-limit` for rate limiting, `cors`

### Frontend (`/frontend`)
- **Framework**: Next.js (App Router, `/app` directory)
- **Language**: TypeScript
- **UI Library**: React 19
- **Linting**: ESLint with `eslint-config-next`

## Repository Structure

```
MeetYouLive/
├── backend/
│   ├── src/
│   │   ├── config/        # Passport, DB config
│   │   ├── controllers/   # Route handler logic
│   │   ├── middlewares/   # Auth, rate-limit middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routers
│   │   ├── services/      # Business logic / external service calls
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Entry point (connects to DB, starts server)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── app/               # Next.js App Router pages & layouts
│   ├── components/        # Reusable React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility/helper functions
│   ├── public/            # Static assets
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
├── render.yaml
└── README.md
```

## Development Guidelines

### Backend
- Use ES Module syntax (`import`/`export`) throughout — **do not** use `require()`.
- Place business logic in `src/services/`, route handlers in `src/controllers/`, and Express routers in `src/routes/`.
- Authenticate protected routes with the JWT middleware in `src/middlewares/`.
- All Mongoose models live in `src/models/`.
- Stripe webhook routes must be registered **before** `express.json()` so the raw body is preserved.

### Frontend
- Use the **App Router** (`/app` directory) — do not create pages under `/pages`.
- Write components in TypeScript (`.tsx`).
- Fetch data from the backend using `NEXT_PUBLIC_API_URL` (set in `.env.local`).
- Keep reusable UI pieces in `/components` and data-fetching/browser logic in `/hooks` or `/lib`.

## Local Development

```bash
# Backend
cd backend && cp .env.example .env   # fill in values
npm install && npm run dev

# Frontend
cd frontend && cp .env.example .env.local  # fill in values
npm install && npm run dev

# Or with Docker
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker-compose up --build
```

## Key Environment Variables

### Backend
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `https://meetyoulive.net`) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_SUBSCRIPTION_PRICE_ID` | Stripe Price ID for subscription plan |

### Frontend
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_GOOGLE_URL` | Google OAuth redirect URL |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_LIVE_PROVIDER_KEY` | Live streaming provider API key |
