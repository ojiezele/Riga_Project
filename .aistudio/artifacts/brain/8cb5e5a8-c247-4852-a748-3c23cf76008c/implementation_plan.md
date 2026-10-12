# Riga Studio Plugin Architecture & Multi-Tenant Security Shield

Architect and implement an enterprise-grade **Plugin Architecture** and **Multi-Tenant Security Shield** for Riga Studio. This plan provides the extension ecosystem (custom widgets, compile-time transformations, runtime client hooks, and inspector panels) while establishing strict isolation barriers to ensure zero unauthorized access or data leakage to the central Neon PostgreSQL database across tenants, plugins, and compiled sites.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Multi-Tenant Security & Plugin Sandboxing Architecture Confirmation**:
> You raised a crucial security question: *"Won't hackers be able to intercept and hack Riga main backend server DB since this is a multi-tenancy app?"*
> 
> **The answer is an emphatic NO, provided we enforce 4 non-negotiable architectural security layers:**
> 1. **Zero Server-Side Plugin Execution**: Plugins execute **strictly client-side** (in the Studio browser and compiled edge HTML). Plugins **never** run Node.js code on the backend and **never** receive database credentials or connection strings (`DATABASE_URL`).
> 2. **Cryptographic Tenant Isolation (Zero-Trust Session Boundaries)**: Mutating backend routes (`/api/sites`, `/api/saas/state`, etc.) strictly enforce `req.user.id` from verified JWT / Better Auth cookies. Client-supplied `userId` query params or payload overrides are strictly rejected. All SQL queries use parameterized queries (`$1`, `$2`) scoped with `WHERE user_id = $1` to eliminate cross-tenant data leakage and SQL injection.
> 3. **Public Edge Token Scoping for Compiled Sites**: Form submissions and lead capture widgets from compiled static sites (served via Cloudflare R2 / Custom Domains) use **read-only/insert-only Public Site Tokens** (`riga_pk_site_xxx`). They can ONLY append leads to their own `site_id`, gated by Cloudflare Turnstile bot verification and strict IP rate limiting (preventing DB flooding).
> 4. **Plugin Execution Sandbox & CSP**: Custom developer plugins operate in sandboxed contexts without access to parent session cookies or admin tokens, protected by Content Security Policy (CSP).

- **Confirmed Decision (from Turn 1)**: Hybrid plugin model (Built-in catalog + custom JS/HTML plugin loader).
- **Confirmed Priority Hooks**: Widget injector, compile-time transformations (SEO, tags), runtime event hooks (forms, chat), and custom inspector controls.
- **Security Boundary**: Database connection pools are completely quarantined behind the private Express backend control plane; compiled sites and plugins only touch scoped, rate-limited public endpoints.

---

## 1. Overview & Core Concept

- **What It Does**: 
  - Gives Riga Studio users and developers an extensible plugin ecosystem to inject custom widgets, inject analytics/chat/leads at compile time, and intercept client events.
  - Implements an ironclad **Multi-Tenant Security Perimeter** protecting the Neon PostgreSQL database, ensuring complete tenant isolation, preventing privilege escalation, and safeguarding the builder control plane.
- **Target Audience / Persona**: SaaS site owners, web agencies managing multiple client sites under a single workspace, and third-party plugin authors.
- **Key Value**: Unlimited customizability without compromising multi-tenant security, performance, or database integrity.

---

## 2. Multi-Tenant Threat Model & Defense Matrix

| Threat Vector | Potential Vulnerability | Architectural Defense & Mitigation |
| :--- | :--- | :--- |
| **Malicious Plugin Execution** | Plugin attempts to execute backend code, read env vars, or dump Neon DB. | **Client-Side Only Isolation**: Plugins have no backend runtime. They run solely in the browser DOM. No access to `process.env`, `DATABASE_URL`, or DB drivers. |
| **Cross-Tenant Data Tampering** | Tenant A queries Tenant B's sites or mutates their database rows via forged `userId`. | **Enforced Session Identity**: All API requests require valid Better Auth / JWT Bearer tokens. All SQL queries enforce `WHERE user_id = req.user.id`. Spoofed parameters are dropped. |
| **Compiled Site Form Hijacking** | Attackers flood lead forms on compiled sites to exhaust Neon DB connections or inject SQL. | **Scoped Public Site Keys (`riga_pk_...`)**: Dedicated `/api/leads/capture` endpoint with insert-only permissions, Zod schema sanitization, and rate-limiting (10 req/min/IP). |
| **XSS & Token Theft via Plugin** | A rogue custom plugin tries to read `localStorage` auth tokens or session cookies. | **HttpOnly Session Cookies + Sandboxed Preview**: Better Auth cookies use `HttpOnly; SameSite=Lax; Secure`. Sandboxed canvas iframes prevent script access to the parent Studio session. |
| **SQL Injection in Control Plane** | Malicious payload in site JSON, custom widget properties, or domain names. | **Strict Parameterized Queries**: Every database query in `queries.ts` and `server.js` uses Neon/Drizzle prepared statements with strictly typed bindings (`$1`, `$2`). |

---

## 3. Visual Design & User Experience (Frontend Constitution Compliance)

- **Dedicated Sidebar Tab in Editor (`Widgets | Inspector | Plugins`)**:
  - Unboxed metadata (anti-pill discipline): plugin category, version, and author separated by clean typographic dots (`Analytics · v1.2.0 · Verified`).
  - Segmented control filter: `All Plugins`, `Installed`, `Developer Custom`.
  - Fluid toggles with instant reactive state persistence into the site's `jsonData.plugins`.
- **Plugin Configuration Drawer / Modal**:
  - Modal with contextual fields (e.g. GA4 Measurement ID, WhatsApp number, Webhook target).
  - Security badge indicating: *"Runs Client-Side Only · Zero DB Access · Verified Sandbox"*.
- **Developer Custom Plugin Studio**:
  - Code editor with live syntax checking, manifest validation, and instant sandbox preview.
  - Export/Import JSON plugin manifests.

---

## 4. Technical Architecture & Component Flow

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Riga Studio Frontend Client                                   │
│                                                                                                  │
│   ┌───────────────────────┐   ┌─────────────────────────────┐   ┌────────────────────────────┐   │
│   │   Widget Catalog      │   │     Editor Inspector        │   │    Plugin Manager          │   │
│   │   - Injects plugin    │   │     - Custom control tabs   │   │    - Manifest registry     │   │
│   │     widgets           │   │     - Per-widget settings   │   │    - Sandbox isolation     │   │
│   └───────────┬───────────┘   └──────────────┬──────────────┘   └─────────────┬──────────────┘   │
└───────────────┼──────────────────────────────┼────────────────────────────────┼──────────────────┘
                │                              │                                │
                ▼                              ▼                                ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Production Edge Compiler                                       │
│                                                                                                  │
│   ┌────────────────────────────────┐                 ┌───────────────────────────────────────┐   │
│   │  AST / DOM Compile Transforms  │                 │  Client Runtime Script Packager       │   │
│   │  - Injects GA4 / Meta Tags     │                 │  - WhatsApp widget, Cookie Banner     │   │
│   │  - Sanitizes inline HTML       │                 │  - Lead capture form interceptor      │   │
│   └───────────────┬────────────────┘                 └───────────────────┬───────────────────┘   │
└───────────────────┼──────────────────────────────────────────────────────┼───────────────────────┘
                    │                                                      │
                    ▼                                                      ▼
┌──────────────────────────────────────┐               ┌───────────────────────────────────────────┐
│ Cloudflare R2 / Custom Domain Edge   │               │ Public API Gateway (Rate-Limited)         │
│ Static HTML + Runtime Script Bundle  │               │ POST /api/leads/capture (Site Key Scoped) │
└──────────────────────────────────────┘               └───────────────────┬───────────────────────┘
                                                                           │
                                                ┌──────────────────────────┴───────────────────────┐
                                                ▼                                                  ▼
                         ┌─────────────────────────────────────────────┐ ┌─────────────────────────┐
                         │ Riga Backend Control Plane (Express + Auth) │ │ Neon PostgreSQL Private │
                         │ - Strict JWT / Better Auth Token Validation │ │ - Parameterized queries │
                         │ - Tenant ID enforced: WHERE user_id = $1   │ │ - Zero public internet  │
                         │ - DB credentials hidden in process.env     │ │   access / SSL encrypted│
                         └─────────────────────────────────────────────┘ └─────────────────────────┘
```

---

## 5. Implementation Steps & Deliverables

### Step 1: Core Plugin Architecture & Sandbox Engine (`includes/PluginEngine.js`)
- Implement `PluginManager` class:
  - `registerPlugin(manifest)`: Validates manifest schema (ID, name, hooks, settings schema).
  - `getActivePlugins(siteData)`: Reads enabled plugins and configuration from `siteData.jsonData.plugins`.
  - `injectWidgets(catalog)`: Dynamically inserts custom widgets into `MASTER_CATEGORIES`.
  - `applyCompileTransforms(html, siteData)`: Executes safe string/DOM transforms during build.
  - `generateClientRuntimeBundle(siteData)`: Bundles client JS hooks (forms, banners, chat) with error boundaries.

### Step 2: Essential Built-in Plugins
1. **Google Analytics & Tag Manager (GA4)**: Injects gtag script and tracks custom conversion events.
2. **WhatsApp Floating Live Chat**: Floating branded button and pre-filled chat dialog.
3. **Smart Lead Capture & Webhook**: Intercepts form submissions, securely submits to `/api/leads/capture`, and forwards to user webhooks.
4. **GDPR / Privacy Cookie Consent**: Configurable consent banner with localStorage preference storage.

### Step 3: Multi-Tenant Backend Security Hardening (`backend/server.js` & `src/db/queries.ts`)
- Enforce `protect` middleware on all state and site modification endpoints:
  - Eliminate unauthenticated or spoofable `req.query.userId` / `req.body.userId`.
  - Bind `req.user.id` to every query: `SELECT * FROM sites WHERE user_id = $1`.
- Add public, rate-limited `/api/leads/capture` endpoint:
  - Validates site existence and active status.
  - Inserts lead record exclusively associated with `site.user_id`.
  - Rejects malicious payloads with strict field length checks.

### Step 4: Editor Integration (`src/components/EditorView.jsx`)
- Add **Plugins** tab in sidebar navigation.
- Render plugin marketplace directory with live enable/disable toggles, configuration modal, and custom developer manifest editor.
- Connect plugin state seamlessly to site save and publication pipelines.

### Step 5: Compiler Integration (`src/utils/siteCompiler.js`)
- Pipe compiled site through active plugin transforms.
- Inject compiled runtime bundle into output HTML before pushing to Cloudflare R2 and Neon DB.

---

## 6. Verification & Security Testing Plan

1. **Compilation Check**: Run `compile_applet` to confirm clean JSX/TS build.
2. **Multi-Tenancy Verification**: Send API requests with mismatched `userId` headers to confirm the backend rejects cross-tenant reads or updates.
3. **Plugin Sandboxing Test**: Verify custom plugins run in the editor without accessing backend endpoints or unauthorized browser globals.
4. **End-to-End Compile Test**: Publish a site with GA4 and WhatsApp plugins enabled; verify output HTML contains correct scripts, responsive elements, and scoped form handling.
