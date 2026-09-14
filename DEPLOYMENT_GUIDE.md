# Mariya Foundation — Full-Stack Deployment Guide

When deployed to production, this full-stack application consists of two parts:
1. **Frontend (React + Vite + Tailwind)**: Hosted on **Vercel**
2. **Backend (Node.js + Express + SQLite)**: Hosted on **Render.com** (or Railway / VPS)

---

## Why does login show "An error occurred" on Vercel?
On your local computer (`localhost:5173`), Vite proxies requests to `http://localhost:5000` where your Node.js backend is running.
When deployed on Vercel, Vercel only hosts the static frontend files. It needs to know the URL of your live backend API.

---

## 🚀 Quick 3-Step Setup Guide

### Step 1: Deploy the Backend API on Render.com (Free)
1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Connect your **Mariya Foundation** repository.
4. Configure the settings:
   - **Name**: `mariya-foundation-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `JWT_SECRET`: `mariya_foundation_secure_jwt_token_secret_key_2026`
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g. `https://mariya-foundation-api.onrender.com`).

---

### Step 2: Connect Frontend on Vercel to Your Backend
1. Go to your project on [vercel.com](https://vercel.com).
2. Go to **Settings** → **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://mariya-foundation-api.onrender.com/api` *(replace with your actual Render backend URL followed by `/api`)*
4. Go to the **Deployments** tab in Vercel, click the three dots `...` on your latest deployment, and click **Redeploy**.

---

### Step 3: Log In to Admin Dashboard
Once redeployed, navigate to `/admin/login` on your Vercel site:
- **Email**: `admin@mariyafoundation.org`
- **Password**: `AdminPassword123!`

---

## Summary of Environment Variables

| Variable | Location | Value |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | **Vercel** (Frontend) | `https://your-backend-api.onrender.com/api` |
| `JWT_SECRET` | **Render / Server** (Backend) | `mariya_foundation_secure_jwt_token_secret_key_2026` |
| `NODE_ENV` | **Render / Server** (Backend) | `production` |

