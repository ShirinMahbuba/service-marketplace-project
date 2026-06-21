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

## Project Structure

```
service-marketplace/
├── frontend/                # Next.js client application
│   ├── app/
│   │   ├── login/           # Unified login page (demo shortcuts + credentials)
│   │   ├── signup/          # User registration page
│   │   ├── marketplace/     # Service catalog (End-User)
│   │   ├── checkout/        # Payment & checkout (End-User)
│   │   ├── orders/          # Order history (End-User)
│   │   ├── vendor/          # Vendor dashboard & service management
│   │   └── admin/           # Admin dashboard & user management
│   ├── components/          # Shared UI components (Navbar)
│   ├── lib/                 # API helpers (apiUrl, authHeaders)
│   ├── middleware.ts         # Route protection & role-based redirects
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── server.ts         # Express entry point with middleware chain
│   │   ├── routes/
│   │   │   ├── auth.ts       # Login, signup, logout endpoints
│   │   │   ├── services.ts   # Service catalog CRUD
│   │   │   ├── checkout.ts   # Transaction creation
│   │   │   ├── vendor.ts     # Vendor profile & service management
│   │   │   ├── admin.ts      # Admin stats & user management
│   │   │   └── transactions.ts # User transaction history
│   │   ├── middleware/
│   │   │   ├── authenticate.ts # JWT sign/verify & Bearer token extraction
│   │   │   └── authorize.ts    # RBAC role enforcement (403 Forbidden)
│   │   └── lib/
│   │       ├── auth.ts        # Mock users, roles, session config
│   │       └── prisma.ts      # Prisma client singleton
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data script
│   └── package.json
├── setup.sh                   # One-command project setup
└── package.json               # Root workspace scripts
```

---

## Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/ShirinMahbuba/service-marketplace-project.git
cd service-marketplace-project

# 2. Run the setup script (installs deps, creates DB, seeds data)
bash setup.sh

# 3. Start backend (Terminal 1)
cd backend && npm run dev       # http://localhost:5000

# 4. Start frontend (Terminal 2)
cd frontend && npm run dev      # http://localhost:3000

# 5. Open the app
# http://localhost:3000/login
```

---

## Running Independently

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev                     # Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                     # Runs on http://localhost:3000
```

> The frontend proxies `/api/*` requests to the backend at `http://localhost:5000` via Next.js rewrites.

---

## Authentication Pages

### Login Page (`/login`)

The login page features a modern dark-themed two-column layout:

1. **Demo Login Shortcuts** (left panel) — One-click login cards for each role. Clicking instantly authenticates and redirects to the role's dashboard.
2. **Standard Credentials Form** (right panel) — Email and password input fields with validation. Includes a link to the signup page.

### Signup Page (`/signup`)

Registration form with:
- Full Name, Email, and Password fields
- Account Type selector: **End-User** or **Vendor**
- Vendor signups automatically create a VendorProfile
- On success, issues a JWT and redirects to the appropriate dashboard

---

## Demo Accounts (Seed Data Credentials)

The database is seeded with demo accounts via `bash setup.sh` or `npm run db:seed`. Use these credentials to log in and navigate the app:

| Role | Name | Email | Password | Dashboard |
|------|------|-------|----------|-----------|
| Admin | Admin User | `admin@marketplace.com` | `admin123` | `/admin/dashboard` |
| Vendor | Rahim Cleaning Services | `rahim@vendor.com` | `vendor123` | `/vendor/dashboard` |
| Vendor | Karim Plumbing Co. | `karim@vendor.com` | `vendor123` | `/vendor/dashboard` |
| Vendor | Jamal AC & Appliance | `jamal@vendor.com` | `vendor123` | `/vendor/dashboard` |
| End-User | Fatema Begum | `fatema@user.com` | `user123` | `/marketplace` |

> Demo shortcut cards on the login page allow instant login without typing credentials.

---

## API Endpoints

### Public (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate with email & password, returns JWT |
| POST | `/api/auth/signup` | Register a new user account |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/health` | Health check |

### Protected (Require JWT Bearer Token)

| Method | Endpoint | Allowed Roles | Description |
|--------|----------|---------------|-------------|
| GET | `/api/services` | END_USER, ADMIN | List all active services |
| GET | `/api/services/:id` | END_USER, ADMIN | Get single service details |
| POST | `/api/checkout` | END_USER | Create a transaction (checkout) |
| GET | `/api/transactions` | END_USER | Get user's transaction history |
| GET | `/api/vendor/profile` | VENDOR | Get vendor profile + services |
| GET | `/api/vendor/services-list` | VENDOR | Get vendor's services list |
| POST | `/api/vendor/services` | VENDOR | Create a new service listing |
| GET | `/api/admin/stats` | ADMIN | Dashboard statistics |
| GET | `/api/admin/users` | ADMIN | List all registered users |

---

## JWT Authentication & RBAC

### How It Works

1. **Login** — User submits email + password to `/api/auth/login`. Backend validates credentials, generates a signed JWT token, and sets a session cookie.
2. **Token Storage** — JWT stored in `localStorage` (client components) and `auth_token` cookie (server components).
3. **API Requests** — All protected API calls include `Authorization: Bearer <token>` header.
4. **Backend Middleware Chain** — `authenticate()` extracts and verifies the JWT, then `authorize(...roles)` checks the user's role.
5. **Frontend Route Guards** — Two layers of protection:
   - `middleware.ts` — Intercepts requests at the edge, redirects unauthorized users
   - Page-level checks — Each server component verifies the user's role before rendering

### Role Permissions

| Route Pattern | Allowed Roles |
|--------------|---------------|
| `/admin/*` | ADMIN |
| `/vendor/*` | VENDOR |
| `/marketplace` | END_USER, ADMIN |
| `/checkout`, `/orders` | END_USER |
| `/login`, `/signup` | Public |

### Error Responses

- **401 Unauthorized** — Missing or invalid JWT token
- **403 Forbidden** — Valid token but insufficient role permissions

---

## Features

### End-User
- Browse searchable service catalog at `/marketplace`
- Filter by category (Cleaning, Plumbing, AC Repair)
- Checkout with mock payment gateway (bKash / Nagad / Card)
- Transaction status shows as **"Paid"** upon completion
- View personal order history at `/orders`

### Vendor
- Dashboard at `/vendor/dashboard` with stats (total orders, earnings)
- **Job History** section showing completed transactions with "Paid" status
- List and manage services at `/vendor/services`
- Create new service listings with name, description, price, and category

### Admin
- Platform overview dashboard at `/admin/dashboard`
- View all registered users at `/admin/users`
- Access aggregated transaction data across all vendors

---

## Database Schema / Entity Relationships

The application uses **SQLite** with **Prisma ORM**. The schema is defined in `backend/prisma/schema.prisma`.

### Entities & Relationships

```
User (id, name, email, role, createdAt)
  │
  ├──[VENDOR]── VendorProfile (id, userId, bio, phone)
  │                  │
  │                  └── Service (id, vendorProfileId, name, description, price, category, isActive)
  │                             │
  └──[END_USER]── Transaction (id, userId, serviceId, amount, status, paymentMethod, createdAt)
```

- **User** — Central entity with role: `ADMIN`, `VENDOR`, or `END_USER`
- **VendorProfile** — 1:1 with User (only for VENDOR role). Stores bio, phone, and links to services.
- **Service** — Many:1 with VendorProfile. A vendor can list multiple services (e.g., "Home Deep Cleaning", "Pipe Repair"). Each service has a name, description, price, and category.
- **Transaction (Booking)** — Links an End-User to a Service. Created when an End-User completes checkout. Records the payment amount, status (`Paid`), and payment method (`bKash`, `Nagad`, or `Card`).

### Relationships Summary

| Relationship | Type | Description |
|-------------|------|-------------|
| User → VendorProfile | One-to-One | A vendor user has one profile |
| VendorProfile → Service | One-to-Many | A vendor can list multiple services |
| User → Transaction | One-to-Many | An end-user can have multiple bookings |
| Service → Transaction | One-to-Many | A service can be booked multiple times |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `DATABASE_URL` | `file:./dev.db` | SQLite database path |
| `JWT_SECRET` | `servicehub-jwt-secret-key` | JWT signing secret |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Backend API URL for frontend |

---

## License

This project is built for educational and assessment purposes.

---
## Demo Vedio Link
https://drive.google.com/file/d/1zrv7fPnckFZtpprC2dtO3ylRpxwBooNu/view?usp=sharing
