# ServiceHub BD — Multi-Vendor Service Marketplace

A full-stack service marketplace platform with a separated frontend and backend architecture. Inspired by Sheba.xyz.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Backend:** Express.js, Prisma ORM + SQLite
- **Auth:** JWT Authentication with Role-Based Access Control (RBAC)

---

## Project Structure

```
service-marketplace/
├── frontend/          # Next.js client application
│   ├── app/           # App Router pages & layouts
│   ├── components/    # Shared UI components
│   ├── lib/           # Client-side utilities
│   ├── middleware.ts   # Route protection middleware
│   └── package.json   # Frontend dependencies
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── server.ts       # Express entry point
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # JWT auth & RBAC authorization
│   │   └── lib/            # Prisma client & auth utilities
│   ├── prisma/             # Schema & seed data
│   └── package.json        # Backend dependencies
├── setup.sh           # One-command project setup
└── package.json       # Root workspace scripts
```

---

## Quick Setup

```bash
# 1. Clone and enter the project
cd service-marketplace

# 2. Run setup (installs deps for both, creates DB, seeds data)
bash setup.sh

# 3. Start backend (Terminal 1)
cd backend && npm run dev

# 4. Start frontend (Terminal 2)
cd frontend && npm run dev

# 5. Open the app
# http://localhost:3000/login
```

---

## Running Independently

### Backend only
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev          # runs on http://localhost:5000
```

### Frontend only
```bash
cd frontend
npm install
npm run dev          # runs on http://localhost:3000
```

> The frontend proxies `/api/*` requests to the backend at `http://localhost:5000`.

---

## Demo Accounts

| Role     | Name                    | Email                     |
|----------|-------------------------|---------------------------|
| Admin    | Admin User              | admin@marketplace.com     |
| Vendor   | Rahim Cleaning Services | rahim@vendor.com          |
| Vendor   | Karim Plumbing Co.      | karim@vendor.com          |
| Vendor   | Jamal AC & Appliance    | jamal@vendor.com          |
| User     | Fatema Begum            | fatema@user.com           |

---

## API Endpoints (Backend)

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/api/auth/login`           | Login and set session cookie   |
| POST   | `/api/auth/logout`          | Logout and clear cookie        |
| GET    | `/api/services`             | List all active services       |
| GET    | `/api/services/:id`         | Get single service             |
| POST   | `/api/checkout`             | Create a transaction           |
| POST   | `/api/vendor/services`      | Create a new service           |
| GET    | `/api/vendor/profile`       | Get vendor profile + services  |
| GET    | `/api/vendor/services-list` | Get vendor services list       |
| GET    | `/api/admin/stats`          | Admin dashboard statistics     |
| GET    | `/api/admin/users`          | List all users                 |
| GET    | `/api/transactions`         | Get user transactions          |
| GET    | `/api/health`               | Health check                   |

---

## Features

### JWT Authentication & RBAC
- JWT-based authentication: login returns a signed token, all protected endpoints require `Authorization: Bearer <token>`
- Role-Based Access Control (RBAC) enforced via Express middleware
- 3 distinct roles: **Admin**, **Vendor**, **End-User**
- Unauthorized role access returns **403 Forbidden**
- Unauthenticated requests return **401 Unauthorized**
- Route permissions:
  - `/api/admin/*` — Admin only
  - `/api/vendor/*` — Vendor only
  - `/api/checkout`, `/api/transactions` — End-User only
  - `/api/services` — End-User and Admin
  - `/api/auth/*`, `/api/health` — Public (no auth required)

### End-User
- Browse searchable service catalog at `/marketplace`
- Filter by category (Cleaning, Plumbing, AC Repair)
- Checkout with mock payment gateway (bKash / Nagad / Card)
- View personal order history at `/orders`

### Vendor
- Dashboard at `/vendor/dashboard` with stats (orders, earnings)
- List and manage services at `/vendor/services`
- View all received orders from customers

### Admin
- Platform overview dashboard at `/admin/dashboard`
- View all registered users at `/admin/users`
- See all transactions across vendors

---

## Database Schema

```
User (id, name, email, role)
  │
  ├──[VENDOR]── VendorProfile (id, userId, bio, phone)
  │                  │
  │                  └── Service (id, vendorProfileId, name, description, price, category)
  │                             │
  └──[END_USER]── Transaction (id, userId, serviceId, amount, status, paymentMethod)
```
