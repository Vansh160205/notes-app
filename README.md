# Multi-Tenant SaaS Notes Application

This is a multi-tenant SaaS Notes application built with **Express.js**, **Prisma**, **Supabase Postgres**, and **Next.js**. The application allows multiple tenants (companies) to securely manage their users and notes, while enforcing **role-based access** and **subscription limits**.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Tenants & Test Accounts](#tenants--test-accounts)
- [API Endpoints](#api-endpoints)
- [Subscription & Plan Limits](#subscription--plan-limits)
- [Deployment](#deployment)
- [Tenant Isolation Approach](#tenant-isolation-approach)
- [Frontend Usage](#frontend-usage)
- [Health Check](#health-check)

---

## Features

- Multi-Tenant support with strict isolation
- JWT-based authentication
- Role-based access control:
  - **Admin**: Invite users, upgrade subscription
  - **Member**: Create, view, edit, delete notes
- Free & Pro subscription plans
- Notes CRUD with tenant isolation
- Minimal frontend with Next.js

---

## Tech Stack

- **Backend**: Express.js + Prisma + Supabase Postgres
- **Frontend**: Next.js
- **Authentication**: JWT
- **Deployment**: Vercel

---

## Setup & Installation

1. **Clone the repo**
```bash
git clone https://github.com/Vansh160205/notes-app.git
cd notes-app
````

2. **Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Environment Variables**

Create `.env` files in **backend** and **frontend**:

**Backend `.env`**

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:5432/<database>
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
```

**Frontend `.env`**

```env
NEXT_PUBLIC_API_URL=https://your-vercel-backend.vercel.app
```

4. **Run migrations**

```bash
cd backend
npx prisma migrate dev
```

5. **Start servers**

```bash
# Backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

---

## Tenants & Test Accounts

| Tenant | Role   | Email                                         | Password |
| ------ | ------ | --------------------------------------------- | -------- |
| Acme   | Admin  | [admin@acme.test](mailto:admin@acme.test)     | password |
| Acme   | Member | [user@acme.test](mailto:user@acme.test)       | password |
| Globex | Admin  | [admin@globex.test](mailto:admin@globex.test) | password |
| Globex | Member | [user@globex.test](mailto:user@globex.test)   | password |

---

## API Endpoints

### Authentication

* `POST /auth/login` – Login with email/password

### Notes (CRUD)

* `POST /notes` – Create a note
* `GET /notes` – List all notes for current tenant
* `GET /notes/:id` – Get specific note
* `PUT /notes/:id` – Update a note
* `DELETE /notes/:id` – Delete a note

### Subscription

* `POST /tenants/:slug/upgrade` – Upgrade tenant plan (**Admin only**)

### Health Check

* `GET /health` → `{ "status": "ok" }`

---

## Subscription & Plan Limits

| Plan | Max Notes | Notes Limit Enforced |
| ---- | --------- | -------------------- |
| Free | 3         | Yes                  |
| Pro  | Unlimited | No                   |

* Upgrade endpoint lifts the note limit immediately.

---

## Deployment

* Backend and frontend hosted on **Vercel**
* CORS enabled for frontend to access backend API

---

## Tenant Isolation Approach

This project uses **schema-per-tenant** approach:

* Each tenant has a separate schema in Supabase Postgres.
* Ensures strict isolation — no tenant can access another tenant’s data.
* Prisma is configured to dynamically switch schemas based on the logged-in user’s tenant.

---

## Frontend Usage

* Login using predefined accounts
* Create, view, edit, delete notes
* When Free tenant reaches 3 notes, “Upgrade to Pro” button appears
* After upgrading, note limit is removed immediately

---

## Health Check

Test the health endpoint:

```bash
curl https://your-vercel-backend.vercel.app/health
# Expected response:
# { "status": "ok" }
```

---

## References

* [GitHub Repo](https://github.com/Vansh160205/notes-app)
* [Prisma Docs](https://www.prisma.io/docs)
* [Supabase Docs](https://supabase.com/docs)
* [Next.js Docs](https://nextjs.org/docs)

```
