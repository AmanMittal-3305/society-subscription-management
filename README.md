<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind.css" />
  <img src="https://img.shields.io/badge/Node.js-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-black?style=for-the-badge&logo=express" alt="Express.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

<br/>

# 🏢 Society Subscription Management System

## 📖 Project Overview

The **Society Subscription Management System** is a robust, production-ready web application designed to streamline residential society operations. Built with modern, scalable web technologies, it bridges the gap between society administrators and residents. 

Administrators are empowered with comprehensive tools to manage flats, onboard residents, track subscriptions and payments, and broadcast critical notifications. Conversely, residents benefit from an intuitive portal to access their subscription plans, securely clear dues, maintain payment histories, and stay updated with real-time society announcements.

Designed considering architectural best practices, this project showcases a decoupled client-server architecture, modular MVC-inspired backend patterns, robust role-based access control (RBAC), and responsive UI components.

---

## ✨ Core Features

### 👨‍💼 Admin Portal
- **Dashboard Analytics:** High-level summary statistics and analytical insights.
- **Flat Management:** Complete CRUD lifecycle for society flats, including soft-delete and restore capabilities.
- **Resident Onboarding:** Create user profiles and securely map residents to designated flats.
- **Subscription Engine:** Define, allocate, and manage subscription plans.
- **Financial Tracking:** Monitor clearance and pending payments centrally.
- **Notification Broadcasting:** Push real-time updates and alerts to resident portals.
- **Secure Authentication:** JWT-based login/logout mechanics and profile management.

### 🏠 Resident Portal
- **Personalized Dashboard:** Immediate overview of assigned flat details and active plans.
- **Billing & Payments:** Review outstanding invoices and clear bills via integrated payment gateways natively.
- **Payment History:** Chronological audit trail of past transactions and digital receipts.
- **Alerts & Messages:** Receive crucial communications securely from society admins.
- **Profile Maintenance:** Self-service profile updates and secure login sessions.

---

## 🛠 Tech Stack & Architecture

### Frontend (Client-Side)
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS, Framer Motion
- **Data Fetching:** Axios
- **State & UI:** Radix UI, Recharts, Lucide Icons

### Backend (Server-Side)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Architecture:** Modular Controller-Service-Route structure
- **Authentication:** JWT (JSON Web Tokens), Passport.js
- **Security:** Helmet, CORS, Role-based authorization middleware
- **Business Logic:** Soft delete mechanics, error boundary handling, scalable routing

### Database & DevOps
- **Database:** PostgreSQL (pg)
- **Third-Party Services:** Firebase (Notifications)
- **Task Scheduling:** Node-cron for background jobs

---

## 📂 Folder Structure

The repository is organized into a monorepo setup containing both frontend and backend directories to ensure clear separation of concerns.

```text
society-subscription/
├── backend/                   # Node.js + Express API server
│   ├── config/                # Environment variables & DB 
│   ├── controllers/           # API handlers processing 
│   ├── middleware/            # Auth, validation, and error-handling
│   ├── routes/                # Express route declarations
│   ├── services/              # Core business logic and database 
│   ├── server.js              # Application entry point
│   └── package.json           # Backend dependencies
│
└── frontend/                  # Next.js web application
    ├── app/                   # Next.js App Router (pages & layouts)
    │   ├── (auth)/            # Shared login interfaces
    │   ├── admin/             # Admin-protected routes
    │   └── (resident)/        # Resident-protected routes
    ├── components/            # Reusable React UI components
    ├── services/              # API abstraction over Axios
    ├── utils/                 # Utility helpers and formatting 
    └── package.json           # Frontend dependencies
```

---

## 🔌 API Overview

The backend exposes a RESTful API communicating via robust HTTP methods. All endpoints are categorized by their access roles and secured using JWT.

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Authenticate an existing user |
| `GET` | `/google`, `/google/callback` | OAuth 2.0 Google authentication |

### 👨‍💼 Admin Actions (`/api/admin`)
*Requires `authMiddleware` and `adminOnly` authorization.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET/PUT` | `/profile` | View and edit admin profile |
| `GET` | `/dashboard` | Retrieve admin dashboard analytics |
| `GET/POST` | `/flats` | List or create society flats |
| `GET/PUT/DEL` | `/flats/:id` | Read, update, or soft-delete specific flat |
| `PUT` | `/flats/:id/restore` | Restore a soft-deleted flat |
| `GET` | `/flats/available-residents` | Fetch residents not yet assigned to a flat |
| `PUT` | `/flats/:id/assign-resident` | Assign an existing resident to a flat |
| `POST` | `/flats/:id/register-resident` | Register and assign a new resident |
| `GET/POST` | `/subscriptions` | View and create subscription plans |
| `GET/PUT/DEL` | `/subscriptions/:id` | Manage specific subscription plans |
| `GET` | `/monthly-records` | Retrieve monthly payment records |
| `PUT` | `/monthly-records/:record_id/mark-paid`| Mark a specific record as paid |
| `GET/POST` | `/payment-entry` | View or create specific payment entries |
| `GET` | `/reports/monthly` | Generate comprehensive monthly reports |
| `GET/POST` | `/notifications` | View sent or broadcast new notifications |
| `GET` | `/residents` | List all registered residents |

### 🏠 Resident Actions (`/api/resident`)
*Requires `authMiddleware` and `residentOnly` authorization.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET/PUT` | `/profile` | View and edit resident profile |
| `GET` | `/dashboard` | Retrieve assigned flats and active summary |
| `GET` | `/subscriptions`, `.../:id` | View active plans and explicit descriptions |
| `POST` | `/pay-now` | Formulate a new active payment context |
| `GET` | `/pending-payments` | View outstanding pending payments |
| `GET` | `/notifications` | View all assigned alerts and messages |
| `GET` | `/notifications/unread` | Quickly fetch unread notifications count |
| `PUT` | `/notifications/read` | Mark notifications as completely read |
| `PUT` | `/save-token` | Submit localized FCM token for pushes |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing purposes.

### Prerequisites
- **Node.js**: `v20.x` or higher
- **PostgreSQL**: Running instance locally or remotely
- **NPM** or **Yarn** package manager

### 1. Clone the repository
```bash
git clone https://github.com/AmanMittal-3305/society-subscription-management.git
```

### 2. Setup the Backend

Navigate to the `backend` directory, install dependencies, and configure your environment.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory referencing local configs:
```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/society_db
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend development server:
```bash
npm run dev
```

### 3. Setup the Frontend

Open a new terminal session, navigate to the `frontend` directory, and install the required modules.

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the Next.js development server:
```bash
npm run dev
```

The application should now be running cleanly on `http://localhost:3000`.

---

## 🛡 Security & Best Practices
- **Middleware-Based Authentication:** Utilizing robust JWT inspection preventing unauthorized access at the application edge.
- **SQL Injection Prevention:** Parameterized queries rigorously strictly enforced via the underlying PostgreSQL `pg` implementation.
- **Modular Controller-Service Architecture:** High cohesion and loose coupling between API handling routes and direct business logic. 
- **Soft Deletion Mechanism:** Preventing accidental data purging while maintaining active referential integrities.

---

