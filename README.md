# MeetYouLive

Live streaming platform — [meetyoulive.net](https://meetyoulive.net)

## Architecture

| Layer    | Service | URL                          |
|----------|---------|------------------------------|
| Frontend | Vercel  | https://meetyoulive.net      |
| Backend  | Render  | https://api.meetyoulive.net  |
| DNS      | GoDaddy | meetyoulive.net              |

## Local development

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

## Deployment

### 1. Frontend → Vercel

1. Import the repo in [Vercel](https://vercel.com) and set the **Root Directory** to `frontend`.
2. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.meetyoulive.net
   NEXT_PUBLIC_GOOGLE_URL=https://api.meetyoulive.net/api/auth/google
   ```
3. In **Project → Settings → Domains** add `meetyoulive.net` and `www.meetyoulive.net`.
4. In GoDaddy DNS set:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`

Vercel will activate HTTPS automatically.

### 2. Backend → Render

A `render.yaml` is included so Render can auto-configure the service.

1. Connect the repo in [Render](https://render.com).
2. Set the secret environment variables (`MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) in **Environment**.
3. In **Settings → Custom Domains** add `api.meetyoulive.net`.
4. In GoDaddy DNS add a `CNAME` record: `api` → `<your-service>.onrender.com`.

Render will activate SSL automatically.

### 3. Google OAuth

In [Google Cloud Console](https://console.cloud.google.com) → **OAuth Client**:

- **Authorized Redirect URIs**: `https://api.meetyoulive.net/api/auth/google/callback`
- **Authorized JavaScript origins**: `https://meetyoulive.net`

## Environment variables

### Backend (`.env.example`)

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| `PORT`                | Server port (default 10000)          |
| `MONGO_URI`           | MongoDB connection string            |
| `JWT_SECRET`          | Secret for signing JWT tokens        |
| `GOOGLE_CLIENT_ID`    | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret           |
| `GOOGLE_CALLBACK_URL` | `https://api.meetyoulive.net/api/auth/google/callback` |
| `FRONTEND_URL`        | `https://meetyoulive.net`            |

### Frontend (`frontend/.env.example`)

| Variable                  | Description              |
|---------------------------|--------------------------|
| `NEXT_PUBLIC_API_URL`     | `https://api.meetyoulive.net` |
| `NEXT_PUBLIC_GOOGLE_URL`  | `https://api.meetyoulive.net/api/auth/google` |
