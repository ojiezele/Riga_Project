# 🚀 Complete MERN Stack SaaS Boilerplate (WordPress.com-style Site Hosting & Builder)

This is a production-ready, highly scalable **MERN Stack (MongoDB, Express.js, React, Node.js)** SaaS boilerplate specifically engineered for website builders, multi-tenant hosting platforms, and team collaboration.

---

## 🏗️ Architecture Overview

```text
├── backend/
│   ├── models/
│   │   ├── User.js       # Mongoose User Model with bcrypt hashing & JWT
│   │   ├── Site.js       # Multi-tenant Website Hosting & Project Data schema
│   │   └── Team.js       # Team Collaboration & RBAC roles
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT Protected route verification
│   │   └── rbacMiddleware.js # Role-Based Access Control (Owner, Admin, Editor)
│   └── server.js         # Express REST API Server
├── src/                  # Modular React Frontend SPA
│   ├── components/       # Dashboard, Sites Manager, Team RBAC, Hosting Manager
│   └── App.jsx           # Main React Router application wrapper
└── package.json          # Monorepo configuration
```

---

## 🛠️ Getting Started & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/riga-mern-saas.git
cd riga-mern-saas
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/riga_saas?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here
```

### 3. Run Development Servers
- **Start Backend (Express + MongoDB):**
  ```bash
  node backend/server.js
  ```
- **Start Frontend (Vite + React SPA):**
  ```bash
  npm run dev
  ```

---

## 🔑 Key Features Included

1. **Authentication (JWT & Bcrypt):** Secure user signup, login, password hashing, and token-based protected API routes.
2. **Multi-Tenant Site Hosting & Subdomain Management:** Create, update, preview, and delete website projects assigned to unique subdomains (`*.riga.site`).
3. **Team Collaboration & RBAC (Role-Based Access Control):** Granular permissions for `Owner`, `Administrator`, `Editor`, `Author`, and `Subscriber`.
4. **Visual Builder Integration:** Seamlessly embeds drag-and-drop website builder blocks and themes.
5. **Production Ready:** Scalable folder structure with clean controllers, middleware guards, and robust error handling.
