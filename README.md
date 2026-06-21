# ServiceHub BD — Multi-Vendor Service Marketplace

A full-stack service marketplace platform built with a separated frontend and backend architecture. Inspired by Sheba.xyz — enabling users to browse, book, and pay for household services while vendors manage listings and track jobs.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, TypeScript |
| **Backend** | Express.js, TypeScript, Prisma ORM, SQLite |
| **Authentication** | JWT (JSON Web Tokens) with Role-Based Access Control (RBAC) |
| **Styling** | Tailwind CSS with glassmorphism design, dark gradient theme |

---

## Table of Contents

1. [Local Setup & Installation](#local-setup--installation)
2. [Database Schema & Entity Relationships](#database-schema--entity-relationships)
3. [JWT Authentication, RBAC & Route Protection](#jwt-authentication-rbac--route-protection)
4. [Seed Data & Login Credentials](#seed-data--login-credentials)
5. [Project Structure](#project-structure)
6. [API Endpoints](#api-endpoints)
7. [Features by Role](#features-by-role)
8. [Environment Variables](#environment-variables)

---

## 1. Local Setup & Installation

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Option A: Quick Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/ShirinMahbuba/service-marketplace-project.git
cd service-marketplace-project

# Run the automated setup script
# (installs all dependencies, generates Prisma client, creates the database, and seeds demo data)
bash setup.sh
```

### Option B: Manual Setup

#### Backend Installation

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client from schema
npx prisma generate

# Create the SQLite database and apply schema
npx prisma db push

# Seed the database with demo users, vendor profiles, and services
npm run db:seed
```

#### Frontend Installation

```bash
cd frontend

# Install dependencies
npm install
```

### Running the Application

You need **two terminal windows** — one for the backend API server and one for the frontend dev server.

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✓ Backend server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# ✓ Ready on http://localhost:3000
```

**Open the app:** Navigate to [http://localhost:3000/login](http://localhost:3000/login) in your browser.

> **Note:** The frontend proxies all `/api/*` requests to the backend at `http://localhost:5000` via Next.js rewrites configured in `next.config.js`. Both servers must be running simultaneously.

### Build Verification

```bash
# Verify backend compiles without errors
cd backend && npx tsc --noEmit

# Verify frontend builds successfully
cd frontend && npx next build
```

---

## 2. Database Schema & Entity Relationships

The application uses **SQLite** with **Prisma ORM**. The schema is defined in `backend/prisma/schema.prisma`.

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ENTITY RELATIONSHIPS                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐         ┌───────────────────┐        ┌─────────────┐ │
│  │     User     │ 1 ── 1  │  VendorProfile    │ 1 ── * │   Service   │ │
│  │──────────────│         │───────────────────│        │─────────────│ │
│  │ id (PK)      │         │ id (PK)           │        │ id (PK)     │ │
│  │ name         │         │ userId (FK→User)  │        │ vendorProf  │ │
│  │ email (UQ)   │         │ bio               │        │  ileId (FK) │ │
│  │ role         │         │ phone             │        │ name        │ │
│  │ createdAt    │         │ createdAt         │        │ description │ │
│  └──────┬───────┘         └───────────────────┘        │ price       │ │
│         │                                               │ category    │ │
│         │                                               │ isActive    │ │
│         │ 1                                             │ createdAt   │ │
│         │                                               └──────┬──────┘ │
│         │                                                      │        │
│         │ *                                                  1 │        │
│         ▼                                                      ▼        │
│  ┌─────────────────┐                                                    │
│  │  Transaction     │────────────────────────────────────────────       │
│  │─────────────────│                                                    │
│  │ id (PK)         │   A Transaction links an End-User (buyer)         │
│  │ userId (FK→User)│   to a Service (offered by a Vendor).             │
│  │ serviceId (FK)  │   It records the payment amount, status,          │
│  │ amount          │   and payment method used.                        │
│  │ status          │                                                    │
│  │ paymentMethod   │                                                    │
│  │ createdAt       │                                                    │
│  └─────────────────┘                                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Entities

#### User
The central entity. Every person in the system is a User with one of three roles.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String | Full name |
| `email` | String (Unique) | Login identifier |
| `role` | String | One of: `ADMIN`, `VENDOR`, `END_USER` |
| `createdAt` | DateTime | Account creation timestamp |

**Relationships:**
- A User with role `VENDOR` has **one** `VendorProfile` (1:1)
- A User with role `END_USER` has **many** `Transactions` (1:N)

#### VendorProfile
Extended profile for vendor users, containing business details and linked services.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `userId` | String (FK → User) | Owner of this vendor profile |
| `bio` | String | Vendor business description |
| `phone` | String | Contact number |
| `createdAt` | DateTime | Profile creation timestamp |

**Relationships:**
- Belongs to **one** `User` (1:1 via `userId`)
- Has **many** `Services` (1:N)

#### Service
A service listing offered by a vendor (e.g., "Home Deep Cleaning", "Pipe Repair").

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `vendorProfileId` | String (FK → VendorProfile) | Vendor offering this service |
| `name` | String | Service title |
| `description` | String | Detailed description |
| `price` | Float | Price in BDT |
| `category` | String | e.g., Cleaning, Plumbing, AC Repair |
| `isActive` | Boolean | Whether the service is currently listed |
| `createdAt` | DateTime | Listing creation timestamp |

**Relationships:**
- Belongs to **one** `VendorProfile` (N:1 via `vendorProfileId`)
- Has **many** `Transactions` (1:N — each booking creates a transaction)

#### Transaction (Booking)
Records a completed service booking/payment by an end-user.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (CUID) | Primary key |
| `userId` | String (FK → User) | The end-user who booked |
| `serviceId` | String (FK → Service) | The service that was booked |
| `amount` | Float | Payment amount in BDT |
| `status` | String | Transaction status: `Paid` |
| `paymentMethod` | String | Payment method: `bKash`, `Nagad`, or `Card` |
| `createdAt` | DateTime | Booking timestamp |

**Relationships:**
- Belongs to **one** `User` (N:1 — the buyer)
- Belongs to **one** `Service` (N:1 — the booked service)

### Data Flow Example

```
End-User (Fatema) ──browses──▶ Service ("Home Deep Cleaning" by Rahim)
         │                                │
         └──── checkout (bKash) ──────────┘
                    │
                    ▼
            Transaction {
              userId: "user-001",
              serviceId: "service-xxx",
              amount: 1500,
              status: "Paid",
              paymentMethod: "bKash"
            }
                    │
                    ▼
         Appears in:
           • End-User's /orders page
           • Vendor's /vendor/dashboard → Job History
           • Admin's /admin/dashboard → stats
```

---

## 3. JWT Authentication, RBAC & Route Protection

### Overview

The application implements a complete authentication and authorization system with **three layers of security**:

1. **Backend JWT Middleware** — Validates tokens and enforces role permissions on API endpoints
2. **Frontend Edge Middleware** — Intercepts navigation requests and redirects unauthorized users
3. **Page-Level Role Guards** — Defense-in-depth checks inside each server component

### Authentication Flow

```
┌─────────────┐     POST /api/auth/login        ┌─────────────┐
│   Browser    │  ──── { email, password } ────▶ │   Backend   │
│   (Client)   │                                 │   Server    │
│              │  ◀── { token, user } ────────── │             │
└──────┬───────┘                                 └─────────────┘
       │
       │  Stores:
       │   • localStorage('token')     → for client components
       │   • cookie('auth_token')      → for server components
       │   • cookie('session_user')    → for middleware route guards
       │
       ▼
┌─────────────────────────────────────────────┐
│  Subsequent API Requests                     │
│  Headers: { Authorization: "Bearer <JWT>" }  │
└─────────────────────────────────────────────┘
```

### Backend: JWT Middleware (`authenticate.ts`)

Located at `backend/src/middleware/authenticate.ts`:

- **`signToken(payload)`** — Signs a JWT with 24-hour expiry using `jwt.sign()`
- **`verifyToken(token)`** — Decodes and validates the JWT using `jwt.verify()`
- **`authenticate()`** — Express middleware that:
  1. Extracts the `Bearer` token from the `Authorization` header
  2. Verifies the token signature and expiry
  3. Populates `req.user` with the decoded payload (`{ id, name, email, role }`)
  4. Returns **401 Unauthorized** if the token is missing, malformed, or expired

### Backend: RBAC Middleware (`authorize.ts`)

Located at `backend/src/middleware/authorize.ts`:

- **`authorize(...allowedRoles)`** — Express middleware that:
  1. Checks if `req.user` exists (set by `authenticate()`)
  2. Verifies `req.user.role` is included in the `allowedRoles` array
  3. Returns **403 Forbidden** if the user's role is not permitted

### Backend: Middleware Chain in `server.ts`

```typescript
// Public — no authentication required
app.use('/api/auth', authRoutes);
app.get('/api/health', ...);

// Protected — authenticate first, then check role
app.use('/api/services',     authenticate, authorize('END_USER', 'ADMIN'),  servicesRoutes);
app.use('/api/checkout',     authenticate, authorize('END_USER'),           checkoutRoutes);
app.use('/api/vendor',       authenticate, authorize('VENDOR'),             vendorRoutes);
app.use('/api/admin',        authenticate, authorize('ADMIN'),              adminRoutes);
app.use('/api/transactions', authenticate, authorize('END_USER'),           transactionRoutes);
```

**Example: A Vendor trying to access `/api/admin/stats`**
```
Request → authenticate() → ✓ valid token → authorize('ADMIN') → ✗ user.role is 'VENDOR'
Response: 403 { error: "Forbidden. You do not have permission to access this resource." }
```

### Frontend: Edge Middleware (`middleware.ts`)

Located at `frontend/middleware.ts`. Runs on every navigation request before the page loads:

| Route Pattern | Allowed Roles | Unauthorized Redirect |
|--------------|---------------|----------------------|
| `/admin/*` | ADMIN | → Role's home page |
| `/vendor/*` | VENDOR | → Role's home page |
| `/marketplace` | END_USER, ADMIN | → Role's home page |
| `/checkout`, `/orders` | END_USER | → Role's home page |
| `/login`, `/signup` | Public (all) | — |

**How it works:**
1. Reads the `session_user` cookie (set during login)
2. Parses the user's role from the cookie
3. Checks if the role is allowed for the requested route
4. Redirects unauthorized users to their role's home page:
   - ADMIN → `/admin/dashboard`
   - VENDOR → `/vendor/dashboard`
   - END_USER → `/marketplace`

### Frontend: Page-Level Role Guards

Every protected server component includes an explicit role check as a defense-in-depth measure:

```typescript
// Example: vendor/dashboard/page.tsx
const user = JSON.parse(decodeURIComponent(sessionCookie.value));
if (user.role !== 'VENDOR') redirect('/login');
```

This ensures that even if the middleware is bypassed, the page itself rejects unauthorized access.

### Error Response Summary

| HTTP Status | Meaning | When |
|-------------|---------|------|
| **401 Unauthorized** | Authentication failed | Missing token, expired token, invalid token |
| **403 Forbidden** | Authorization failed | Valid token but wrong role for the endpoint |

---

## 4. Seed Data & Login Credentials

The database is seeded with demo accounts when you run `bash setup.sh` or `npm run db:seed` in the backend directory. These accounts can be used to log in and navigate all areas of the application.

### Demo Accounts for Examiner Login

| # | Role | Name | Email | Password | Dashboard Route |
|---|------|------|-------|----------|-----------------|
| 1 | **Admin** | Admin User | `admin@marketplace.com` | `admin123` | `/admin/dashboard` |
| 2 | **Vendor** | Rahim Cleaning Services | `rahim@vendor.com` | `vendor123` | `/vendor/dashboard` |
| 3 | **Vendor** | Karim Plumbing Co. | `karim@vendor.com` | `vendor123` | `/vendor/dashboard` |
| 4 | **Vendor** | Jamal AC & Appliance | `jamal@vendor.com` | `vendor123` | `/vendor/dashboard` |
| 5 | **End-User** | Fatema Begum | `fatema@user.com` | `user123` | `/marketplace` |

### How to Log In

There are **two ways** to log in on the Login page (`/login`):

1. **Demo Login Shortcuts** (left panel) — Click any role card to instantly log in without typing. Each card shows the email and password for reference.

2. **Standard Credentials Form** (right panel) — Type the email and password from the table above, then click **Sign In**.

### What to Test per Role

| Role | What You Can Do |
|------|----------------|
| **Admin** (`admin@marketplace.com`) | View platform stats, see all registered users, monitor all transactions |
| **Vendor** (`rahim@vendor.com`) | View vendor dashboard with earnings/orders, see Job History, create new service listings |
| **End-User** (`fatema@user.com`) | Browse marketplace, filter by category, checkout a service with mock payment (bKash/Nagad/Card), view order history |

### Signup

New accounts can be created at `/signup`. Choose between **End-User** or **Vendor** role. Vendor signups automatically create a VendorProfile.

---

## Project Structure

```
service-marketplace/
├── frontend/                # Next.js client application
│   ├── app/
│   │   ├── login/           # Unified login page (demo shortcuts + credentials form)
│   │   ├── signup/          # User registration page
│   │   ├── marketplace/     # Service catalog (End-User & Admin)
│   │   ├── checkout/        # Payment & checkout (End-User)
│   │   ├── orders/          # Order history (End-User)
│   │   ├── vendor/
│   │   │   ├── dashboard/   # Vendor dashboard with stats & Job History
│   │   │   └── services/    # Vendor service management
│   │   └── admin/
│   │       ├── dashboard/   # Admin platform overview
│   │       └── users/       # Admin user management
│   ├── components/          # Shared UI components (Navbar)
│   ├── lib/                 # API helpers (apiUrl, authHeaders)
│   ├── middleware.ts         # Route protection & role-based redirects
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── server.ts         # Express entry point with middleware chain
│   │   ├── routes/
│   │   │   ├── auth.ts       # Login, signup, logout endpoints
│   │   │   ├── services.ts   # Service catalog queries
│   │   │   ├── checkout.ts   # Transaction creation (status: "Paid")
│   │   │   ├── vendor.ts     # Vendor profile & service management
│   │   │   ├── admin.ts      # Admin stats & user management
│   │   │   └── transactions.ts # User transaction history
│   │   ├── middleware/
│   │   │   ├── authenticate.ts # JWT sign/verify & Bearer token extraction
│   │   │   └── authorize.ts    # RBAC role enforcement (403 Forbidden)
│   │   └── lib/
│   │       ├── auth.ts        # Mock users with passwords, roles, session config
│   │       └── prisma.ts      # Prisma client singleton
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema (4 models)
│   │   └── seed.ts            # Seed data script
│   └── package.json
├── setup.sh                   # One-command project setup
└── package.json               # Root workspace scripts
```

---

## API Endpoints

### Public (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate with email & password, returns JWT token |
| POST | `/api/auth/signup` | Register a new user account, returns JWT token |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/health` | Health check |

### Protected (Require `Authorization: Bearer <JWT>` Header)

| Method | Endpoint | Allowed Roles | Description |
|--------|----------|---------------|-------------|
| GET | `/api/services` | END_USER, ADMIN | List all active services |
| GET | `/api/services/:id` | END_USER, ADMIN | Get single service details |
| POST | `/api/checkout` | END_USER | Create a transaction (book a service) |
| GET | `/api/transactions` | END_USER | Get user's transaction history |
| GET | `/api/vendor/profile` | VENDOR | Get vendor profile + services |
| GET | `/api/vendor/services-list` | VENDOR | Get vendor's services list |
| POST | `/api/vendor/services` | VENDOR | Create a new service listing |
| GET | `/api/admin/stats` | ADMIN | Dashboard statistics |
| GET | `/api/admin/users` | ADMIN | List all registered users |

---

## Features by Role

### End-User
- Browse searchable service catalog at `/marketplace`
- Filter services by category (Cleaning, Plumbing, AC Repair)
- Checkout with mock payment gateway (bKash / Nagad / Card)
- Transaction status shows as **"Paid"** upon completion
- View personal order history at `/orders`

### Vendor
- Dashboard at `/vendor/dashboard` with summary stats (total orders, total earnings)
- **Job History** section showing all completed transactions with green "Paid" status badges
- List and manage services at `/vendor/services`
- Create new service listings with name, description, price, and category

### Admin
- Platform overview dashboard at `/admin/dashboard` with aggregated statistics
- View and manage all registered users at `/admin/users`
- Monitor all transactions across the platform

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `DATABASE_URL` | `file:./dev.db` | SQLite database file path |
| `JWT_SECRET` | `servicehub-jwt-secret-key` | Secret key for signing JWT tokens |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Backend API URL used by the frontend |

---

## License

This project is built for educational and assessment purposes.
