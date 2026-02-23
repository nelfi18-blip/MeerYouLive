# MeetYouLive 🚀

MeetYouLive is a live streaming and exclusive content platform, designed for creators and fans, with integrated monetisation (subscriptions, gifts, live payments and premium content).

Inspired by live social + creator economy models.

🌐 Official domain: [https://meetyoulive.net](https://meetyoulive.net)

## ✨ Key features

- 🔐 Authentication (Email / Google OAuth)
- 👤 Roles (user, creator, admin)
- 🎥 Video upload
- 📡 Live streaming (public, private and by subscription)
- 💰 Payments with Stripe
- 🎁 Real-time gifts
- 🔁 Monthly subscriptions to creators
- 🛡️ Moderation and reports
- 🧑‍💼 Administration panel

## 🧱 Tech stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Google OAuth (Passport)
- Stripe API

### Frontend
- Next.js (App Router)
- React
- Fetch API
- Context / Hooks

### Infrastructure

| Layer    | Service       | URL                         |
|----------|---------------|-----------------------------|
| Frontend | Vercel        | https://meetyoulive.net     |
| Backend  | Render        | https://api.meetyoulive.net |
| Database | MongoDB Atlas | —                           |
| DNS      | GoDaddy       | meetyoulive.net             |

## 📂 Project structure

```
meetyoulive/
│
├── src/                        # Backend (Node.js / Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── config/
├── server.js
├── .env.example
│
├── frontend/                   # Frontend (Next.js)
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── public/
│   └── .env.example
│
├── render.yaml
└── README.md
```

## ⚙️ Environment variables

### Backend (`.env.example`)

| Variable                      | Description                                            |
|-------------------------------|--------------------------------------------------------|
| `PORT`                        | Server port (default 10000)                            |
| `MONGO_URI`                   | MongoDB connection string                              |
| `JWT_SECRET`                  | Secret for signing JWT tokens                          |
| `GOOGLE_CLIENT_ID`            | Google OAuth client ID                                 |
| `GOOGLE_CLIENT_SECRET`        | Google OAuth client secret                             |
| `GOOGLE_CALLBACK_URL`         | `https://api.meetyoulive.net/api/auth/google/callback` |
| `FRONTEND_URL`                | `https://meetyoulive.net`                              |
| `STRIPE_SECRET_KEY`           | Stripe secret key                                      |
| `STRIPE_WEBHOOK_SECRET`       | Stripe webhook signing secret                          |
| `STRIPE_SUBSCRIPTION_PRICE_ID`| Stripe price ID for monthly creator subscriptions      |

### Frontend (`frontend/.env.example`)

| Variable                       | Description                                          |
|--------------------------------|------------------------------------------------------|
| `NEXT_PUBLIC_API_URL`          | `https://api.meetyoulive.net`                        |
| `NEXT_PUBLIC_GOOGLE_URL`       | `https://api.meetyoulive.net/api/auth/google`        |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`| Stripe publishable key                               |
| `NEXT_PUBLIC_LIVE_PROVIDER_KEY`| Live streaming provider API key                      |

## 🧪 Local installation

### Backend

```bash
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

Local access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🚀 Deploy to production

### 1. Frontend → Vercel

1. Import the repo in [Vercel](https://vercel.com) and set the **Root Directory** to `frontend`.
2. Add environment variables (see Frontend table above).
3. In **Project → Settings → Domains** add `meetyoulive.net` and `www.meetyoulive.net`.
4. In GoDaddy DNS set:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`

Vercel activates HTTPS automatically.

### 2. Backend → Render

A `render.yaml` is included so Render can auto-configure the service.

1. Connect the repo in [Render](https://render.com).
2. Set the secret environment variables (`MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) in **Environment**.
3. In **Settings → Custom Domains** add `api.meetyoulive.net`.
4. In GoDaddy DNS add a `CNAME` record: `api` → `<your-service>.onrender.com`.

Render activates SSL automatically.

### 3. Google OAuth

In [Google Cloud Console](https://console.cloud.google.com) → **OAuth Client**:

- **Authorized Redirect URIs**: `https://api.meetyoulive.net/api/auth/google/callback`
- **Authorized JavaScript origins**: `https://meetyoulive.net`

## 🔐 Security

- JWT with expiration
- Roles and permissions
- Private route protection
- Validated webhooks
- Active moderation

## 📈 Roadmap

- 📱 Mobile apps (iOS / Android)
- 🤖 AI-assisted moderation
- 🎬 Short reels
- 🌍 Global scaling

## 📄 Licence

© MeetYouLive — All Rights Reserved.  
Proprietary software. Commercial use and redistribution are restricted without explicit written permission.
