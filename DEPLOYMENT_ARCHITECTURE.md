# Riga.com Enterprise SaaS Deployment Architecture Guide

Welcome to your production deployment blueprint! This guide walks you through deploying **Riga.com** across **Render (Backend API)**, **Cloudflare Pages (Frontend Dashboard & Builder)**, and **Cloudflare Workers (Edge Data Plane for `*.riga.site`)**.

---

## 🏗️ High-Level Architecture Overview

Riga.com is structured as a modern Shopify-grade multi-tenant SaaS platform:

1. **Database Layer: Neon DB (Serverless PostgreSQL)**
   - Powered by Drizzle ORM (`src/db/schema.ts`, `src/db/queries.ts`).
   - Handles merchants, users, hosted websites, custom domains, media assets, team RBAC, and form lead submissions.

2. **Storage & Edge Delivery Layer: Cloudflare R2 + Edge Workers**
   - **Cloudflare R2 Object Storage**: Stores all merchant media uploads and pre-compiled static HTML pages (`sites/{subdomain}/index.html`).
   - **Cloudflare Workers (Edge CDN)**: Intercepts incoming requests at `*.riga.site` subdomains at the edge (< 10ms response time), extracting the subdomain and serving the static HTML directly from R2 with zero origin server load.

3. **Backend API Layer: Node.js & Express (`backend/server.js`)**
   - Handles user authentication (JWT & bcrypt), API routing, domain mapping, and R2 synchronization.
   - **Deployment Target**: **Render** (configured as a pure API service `api.getriga.com`).

4. **Frontend Dashboard & Builder: React SPA (Vite + Tailwind CSS v4)**
   - Visual website builder, analytics dashboard, theme templates, and management console.
   - **Deployment Target**: **Cloudflare Pages** (`app.getriga.com`).

---

## 🚀 Complete Step-by-Step Deployment Instructions

### Step 1: Set Up Neon DB & Cloudflare R2
1. **Neon DB:** Create a free serverless PostgreSQL database at [Neon.tech](https://neon.tech) and copy your unified Connection String (`DATABASE_URL`).
2. **Cloudflare R2:** Create an R2 bucket named `riga-production-bucket` in your Cloudflare dashboard. Generate S3 credentials (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`).

---

### Step 2: Deploy Backend API to Render (`api.getriga.com`)
1. Push your repository to GitHub.
2. In [Render.com](https://render.com), click **New +** -> **Web Service** and connect your repo.
3. **Settings:**
   - **Name:** `riga-backend-api`
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `node backend/server.js`
4. **Environment Variables on Render:**
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DATABASE_URL` = `postgres://user:password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - `JWT_SECRET` = `your_super_secure_random_jwt_secret_key_here`
   - `R2_ACCOUNT_ID` = `your_cloudflare_account_id`
   - `R2_ACCESS_KEY_ID` = `your_r2_s3_access_key_id`
   - `R2_SECRET_ACCESS_KEY` = `your_r2_s3_secret_access_key`
   - `R2_BUCKET_NAME` = `riga-production-bucket`

---

### Step 3: Deploy Frontend Dashboard to Cloudflare Pages (`app.getriga.com`)
1. In Cloudflare Dashboard -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
2. Select your repository.
3. **Build Settings:**
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build:client`
   - **Build output directory:** `dist`
4. **Environment Variables on Cloudflare Pages:**
   - `VITE_API_URL` = `https://riga-backend-api.onrender.com` (Your live Render backend URL)

---

### Step 4: Deploy the Cloudflare Edge Worker (`*.riga.site`)
The Cloudflare Worker (`backend/workers/rigaWorker.js`) serves merchant websites globally from R2 in under 10ms.

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **Create `wrangler.toml` in your project root:**
   ```toml
   name = "riga-edge-worker"
   main = "backend/workers/rigaWorker.js"
   compatibility_date = "2026-03-01"

   [vars]
   ENVIRONMENT = "production"

   [[r2_buckets]]
   binding = "R2_BUCKET"
   bucket_name = "riga-production-bucket"
   ```

3. **Deploy the Worker to Cloudflare:**
   ```bash
   wrangler deploy
   ```

4. **Configure Custom Domain / Route on Cloudflare:**
   - In Cloudflare Dashboard -> **Workers & Pages** -> **riga-edge-worker** -> **Settings** -> **Triggers** -> **Custom Domains**.
   - Add `*.riga.site` (or your merchant wildcard domain).

---

## 🔑 Summary of Required Secrets & Environment Variables

| Component | Platform | Environment Variable / Secret Key | Description |
| :--- | :--- | :--- | :--- |
| **Backend API** | Render | `DATABASE_URL` | Neon PostgreSQL connection URI |
| **Backend API** | Render | `JWT_SECRET` | Secret key for signing merchant authentication tokens |
| **Backend API** | Render | `R2_ACCOUNT_ID` | Cloudflare Account ID for R2 storage sync |
| **Backend API** | Render | `R2_ACCESS_KEY_ID` | R2 S3-compatible Access Key ID |
| **Backend API** | Render | `R2_SECRET_ACCESS_KEY` | R2 S3-compatible Secret Access Key |
| **Backend API** | Render | `R2_BUCKET_NAME` | Name of your R2 bucket (`riga-production-bucket`) |
| **Frontend SPA** | Cloudflare Pages | `VITE_API_URL` | Public HTTPS URL of your Render backend API (`https://...`) |
| **Edge Worker** | Cloudflare Workers | `R2_BUCKET` | R2 Bucket binding in `wrangler.toml` pointing to `riga-production-bucket` |

---

## ✨ You're Ready to Launch!
With Neon DB handling relational data, Cloudflare R2 + Edge Workers serving lightning-fast storefronts globally in < 10ms, and Render hosting your Node.js API, Riga.com is fully enterprise-ready!
