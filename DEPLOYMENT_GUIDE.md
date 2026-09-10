# Mariya Foundation — Vercel Deployment Guide

This project is configured for deployment on **Vercel**. You can deploy it using either **Option A (Recommended: 1-Click Unified Monorepo)** or **Option B (Separate Client & Server Projects)**.

---

## Option A: 1-Click Full-Stack Deployment (Recommended)

In this approach, Vercel deploys the React frontend and the Express REST API together in a single project from the root folder.

### Steps:
1. Push your repository to **GitHub** (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Keep the **Root Directory** as `./` (the repository root).
4. In **Environment Variables**, add:
   - `JWT_SECRET`: `your_secure_jwt_secret_key_here`
   - `NODE_ENV`: `production`
5. Click **Deploy**.

Vercel will build the frontend with Vite and host the backend REST API as serverless functions under `/api/*`.

---

## Option B: Deploying Client and Server Separately

If you prefer to maintain two distinct Vercel deployments:

### 1. Deploy the Backend (`server` folder):
1. Import the repository in Vercel.
2. In the project settings, set the **Root Directory** to `server`.
3. Add Environment Variables:
   - `JWT_SECRET`: `your_secure_jwt_secret_key_here`
   - `NODE_ENV`: `production`
4. Deploy the backend and copy the assigned domain URL (e.g. `https://mariya-api.vercel.app`).

### 2. Deploy the Frontend (`client` folder):
1. Import the repository in Vercel as a new project.
2. Set the **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://mariya-api.vercel.app/api` (replace with your backend URL from step 1).
5. Deploy the frontend.

---

## Default Administrator Credentials
Once deployed, log in to the management dashboard at `/admin/login`:
- **Email**: `admin@mariyafoundation.org`
- **Password**: `AdminPassword123!`

---

## Environment Variables Summary

| Variable | Scope | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `JWT_SECRET` | Server | Secret key for signing administrator JWT session tokens | `mariya_foundation_secure_jwt_token_secret_key_2026` |
| `NODE_ENV` | Server | Environment mode | `production` |
| `VITE_API_BASE_URL` | Client | Backend API Base URL (only needed if backend is hosted on a different domain) | `https://your-api.vercel.app/api` |
| `SMTP_HOST` | Server (Optional) | SMTP Host for email notifications | `smtp.ethereal.email` |
| `SMTP_USER` | Server (Optional) | SMTP User | `your_smtp_user` |
| `SMTP_PASS` | Server (Optional) | SMTP Password | `your_smtp_password` |
