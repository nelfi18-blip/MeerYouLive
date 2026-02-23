# MeetYouLive

Live streaming platform — [meetyoulive.net](https://meetyoulive.net)

## What is MeetYouLive?

MeetYouLive is a live video and content platform where creators can stream live, publish private videos, accept gifts, and monetise their audience via one-time payments and subscriptions.

## Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | Next.js (App Router), TypeScript, React |
| Backend  | Node.js, Express, Mongoose |
| Database | MongoDB Atlas       |
| Payments | Stripe              |
| Auth     | JWT + Google OAuth  |
| Deploy   | Vercel (frontend), Render (backend) |

## Repository structure

```
meetyoulive-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── config/
│   │   └── app.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── app/           # Next.js App Router
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
├── render.yaml
└── README.md
```

## Architecture

| Layer    | Service       | URL                          |
|----------|---------------|------------------------------|
| Frontend | Vercel        | https://meetyoulive.net      |
| Backend  | Render        | https://api.meetyoulive.net  |
| Database | MongoDB Atlas | —                            |
| DNS      | GoDaddy       | meetyoulive.net              |

## Local development

### Backend

```bash
cd backend
cp .env.example .env
# fill in your values
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
# fill in your values
npm install
npm run dev
```

### Docker (optional)

```bash
# copy and fill both env files first
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up
```

## Deployment

### 1. Frontend → Vercel

1. Import the repo in [Vercel](https://vercel.com) and set the **Root Directory** to `frontend`.
2. Add environment variables from `frontend/.env.example`.
3. In **Project → Settings → Domains** add `meetyoulive.net` and `www.meetyoulive.net`.
4. In GoDaddy DNS set:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`

Vercel will activate HTTPS automatically.

### 2. Backend → Render

A `render.yaml` is included so Render can auto-configure the service.

1. Connect the repo in [Render](https://render.com).
2. Set the secret environment variables in **Environment** (see table below).
3. In **Settings → Custom Domains** add `api.meetyoulive.net`.
4. In GoDaddy DNS add a `CNAME` record: `api` → `<your-service>.onrender.com`.

Render will activate SSL automatically.

### 3. Google OAuth

In [Google Cloud Console](https://console.cloud.google.com) → **OAuth Client**:

- **Authorized Redirect URIs**: `https://api.meetyoulive.net/api/auth/google/callback`
- **Authorized JavaScript origins**: `https://meetyoulive.net`

## Environment variables

### Backend (`backend/.env.example`)

| Variable                      | Description                                              |
|-------------------------------|----------------------------------------------------------|
| `PORT`                        | Server port (default 5000)                               |
| `MONGO_URI`                   | MongoDB connection string                                |
| `JWT_SECRET`                  | Secret for signing JWT tokens                            |
| `GOOGLE_CLIENT_ID`            | Google OAuth client ID                                   |
| `GOOGLE_CLIENT_SECRET`        | Google OAuth client secret                               |
| `GOOGLE_CALLBACK_URL`         | `https://api.meetyoulive.net/api/auth/google/callback`   |
| `STRIPE_SECRET_KEY`           | Stripe secret key (`sk_test_…` for dev)                  |
| `STRIPE_WEBHOOK_SECRET`       | Stripe webhook signing secret (`whsec_…`)                |
| `STRIPE_SUBSCRIPTION_PRICE_ID`| Stripe price ID for monthly subscription plan           |
| `FRONTEND_URL`                | `https://meetyoulive.net`                                |

### Frontend (`frontend/.env.example`)

| Variable                       | Description                              |
|--------------------------------|------------------------------------------|
| `NEXT_PUBLIC_API_URL`          | `https://api.meetyoulive.net`            |
| `NEXT_PUBLIC_GOOGLE_URL`       | `https://api.meetyoulive.net/api/auth/google` |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`| Stripe publishable key (`pk_test_…`)     |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID (for frontend)    |
| `NEXT_PUBLIC_LIVE_PROVIDER_KEY`| Live streaming provider API key          |
