# MeetYouLive

Live streaming platform — [meetyoulive.net](https://meetyoulive.net)

## Architecture

| Layer    | Service       | URL                          |
|----------|---------------|------------------------------|
| Frontend | Vercel        | https://meetyoulive.net      |
| Backend  | Render        | https://api.meetyoulive.net  |
| Database | MongoDB Atlas | —                            |
| DNS      | GoDaddy       | meetyoulive.net              |

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
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── app/          (Next.js App Router)
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
├── render.yaml
├── README.md
└── .gitignore
```

## Features

- ✅ Register / Login (JWT)
- ✅ Google OAuth login
- ✅ Roles (user / creator / admin)
- ✅ Videos (public & private with payment)
- ✅ Live streaming
- ✅ Gifts / Regalos
- ✅ Stripe payments (one-time + subscriptions)
- ✅ Moderation & reporting
- ✅ Admin panel

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

## Deployment

### 1. Frontend → Vercel

1. Import the repo in [Vercel](https://vercel.com) and set the **Root Directory** to `frontend`.
2. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.meetyoulive.net
   NEXT_PUBLIC_GOOGLE_URL=https://api.meetyoulive.net/api/auth/google
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxx
   NEXT_PUBLIC_LIVE_PROVIDER_KEY=xxxx
   ```
3. In **Project → Settings → Domains** add `meetyoulive.net` and `www.meetyoulive.net`.
4. In GoDaddy DNS set:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`

### 2. Backend → Render

A `render.yaml` is included so Render can auto-configure the service.

1. Connect the repo in [Render](https://render.com).
2. Set the secret environment variables in **Environment**:
   - `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SUBSCRIPTION_PRICE_ID`
3. In **Settings → Custom Domains** add `api.meetyoulive.net`.
4. In GoDaddy DNS add a `CNAME` record: `api` → `<your-service>.onrender.com`.

### 3. Google OAuth

In [Google Cloud Console](https://console.cloud.google.com) → **OAuth Client**:

- **Authorized Redirect URIs**: `https://api.meetyoulive.net/api/auth/google/callback`
- **Authorized JavaScript origins**: `https://meetyoulive.net`

### 4. Docker (local)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# fill in your values
docker-compose up --build
```

## Environment variables

### Backend (`backend/.env.example`)

| Variable                      | Description                                              |
|-------------------------------|----------------------------------------------------------|
| `PORT`                        | Server port (default 10000)                             |
| `MONGO_URI`                   | MongoDB connection string                               |
| `JWT_SECRET`                  | Secret for signing JWT tokens                           |
| `GOOGLE_CLIENT_ID`            | Google OAuth client ID                                  |
| `GOOGLE_CLIENT_SECRET`        | Google OAuth client secret                              |
| `GOOGLE_CALLBACK_URL`         | `https://api.meetyoulive.net/api/auth/google/callback`  |
| `FRONTEND_URL`                | `https://meetyoulive.net`                               |
| `STRIPE_SECRET_KEY`           | Stripe secret key (`sk_test_…` or `sk_live_…`)          |
| `STRIPE_WEBHOOK_SECRET`       | Stripe webhook signing secret                           |
| `STRIPE_SUBSCRIPTION_PRICE_ID`| Stripe Price ID for the subscription plan               |

### Frontend (`frontend/.env.example`)

| Variable                      | Description                                             |
|-------------------------------|---------------------------------------------------------|
| `NEXT_PUBLIC_API_URL`         | `https://api.meetyoulive.net`                           |
| `NEXT_PUBLIC_GOOGLE_URL`      | `https://api.meetyoulive.net/api/auth/google`           |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key (`pk_test_…` or `pk_live_…`)   |
| `NEXT_PUBLIC_LIVE_PROVIDER_KEY` | Live streaming provider API key                       |
