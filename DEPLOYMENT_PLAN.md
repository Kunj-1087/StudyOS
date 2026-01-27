# Deployment Plan

## 1. Hosting Architecture
We will use a **Modern Cloud Stack** designed for ease of use, scalability, and free-tier availability.

*   **Frontend**: **Vercel** (Best for React/Vite, Global CDN).
*   **Backend**: **Render** (Auto-deploys from Git, simpler than AWS).
*   **Database**: **Neon** or **Supabase** (Serverless PostgreSQL, creates branch per env).

---

## 2. Infrastructure Setup (Order Matters)

### Step 1: Database (Neon / Supabase)
*   **Action**: Create a new project.
*   **Network**: Allow connections from `0.0.0.0/0` (or specifically Render's IPs if using static IPs).
*   **Output**: Get the `DATABASE_URL`.
    *   Format: `postgres://user:pass@host:5432/db?sslmode=require`

### Step 2: Backend (Render)
*   **Type**: Web Service.
*   **Repo**: Connect to your GitHub repo.
*   **Root Directory**: `backend`.
*   **Build Command**: `npm install && npm run build`
*   **Start Command**: `npm start`
*   **Environment Variables**:
    *   `NODE_ENV`: `production`
    *   `DATABASE_URL`: *(From Step 1)*
    *   `JWT_SECRET`: *(Generate a strong 32+ char string)*
    *   `REFRESH_SECRET`: *(Generate a strong 32+ char string)*
    *   `FRONTEND_URL`: `https://your-app.vercel.app` (Add this AFTER Step 3).
*   **Health Check Path**: `/health`.

### Step 3: Frontend (Vercel)
*   **Type**: Vite Project.
*   **Repo**: Connect to your GitHub repo.
*   **Root Directory**: `frontend`.
*   **Build Command**: `npm run build`.
*   **Output Directory**: `dist`.
*   **Environment Variables**:
    *   `VITE_API_URL`: `https://studyos-backend.onrender.com/api` (URL from Step 2).

---

## 3. Secrets & Environment Variables

| Variable | Scope | Description | Value Hint |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Backend | Connection string to Postgres | Check "Connection Details" in Neon dash |
| `JWT_SECRET` | Backend | Signs access tokens | `openssl rand -hex 32` |
| `REFRESH_SECRET` | Backend | Signs refresh tokens | `openssl rand -hex 32` |
| `VITE_API_URL` | Frontend | Base URL for API calls | Backend Domain + `/api` |

**Security Note**:
*   Never commit `.env` files to Git.
*   Use the hosting provider's "Environment" or "Secrets" dashboard.

---

## 4. Domain & HTTPS configuration

### HTTPS
*   **Status**: **Automatic**.
*   Both Vercel and Render handle SSL/TLS certificates (Let's Encrypt) automatically.
*   Ensure your Backend `app.use(cors(...))` allows the HTTPS frontend origin.

### Custom Domains (Optional)
1.  **Buy Domain**: Namecheap, GoDaddy, etc.
2.  **Frontend**: Add domain in Vercel settings. Update DNS (CNAME records) as instructed.
3.  **Backend**: Add specific subdomain (e.g., `api.yourdomain.com`) in Render settings.
4.  **Update Env**: Update `VITE_API_URL` and `FRONTEND_URL` to match new custom domains.

---

## 5. Verification Steps
1.  **DB Connectivity**: Check Render logs (`Connect success` or similar).
2.  **Health Check**: Visit `https://your-backend.onrender.com/health`.
3.  **Frontend Load**: Visit Vercel URL.
4.  **Full Flow**: Register a new user on the live site.
