
## 🚀 Live Demo

- **Frontend:** [https://support-flow-gamma.vercel.app](https://support-flow-gamma.vercel.app)
- **Backend API:** [https://supportflow-7avd.onrender.com/health](https://supportflow-7avd.onrender.com/health)

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | ramit5752@gmail.com | 123456 |


# 🎫 SupportFlow — Multi-Tenant SaaS Helpdesk

A production-ready, multi-tenant helpdesk platform where companies can manage customer tickets, chat in real-time, and analyze performance — all with subscription-based billing.

![SupportFlow Banner](./screenshots/dashboard.png)

[![GitHub](https://img.shields.io/badge/GitHub-Source-black?logo=github)](https://github.com/iamdeveloper17/SupportFlow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-green?logo=mongodb)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)](https://redis.io)

## 📖 About

SupportFlow is a **multi-tenant SaaS helpdesk** built with the MERN stack. Companies can sign up, create their own isolated workspace, invite agents, and manage customer support tickets — all in real time.

Every workspace is fully isolated: users, tickets, messages, and analytics are scoped to the workspace, ensuring enterprise-grade data privacy.

## ✨ Features

### Core
- 🏢 **Multi-tenant architecture** — isolated workspaces per company
- 🔐 **JWT authentication** with refresh token rotation
- 👥 **Role-based access control** (Admin, Agent, Customer)
- 🎫 **Complete ticket lifecycle** — create, assign, update, resolve
- 💬 **Real-time chat** with Socket.io (public replies + internal notes)
- 📧 **Email notifications** via Nodemailer (ticket created, assigned, new reply)
- ⏰ **SLA tracking** with breach alerts (BullMQ + Redis)
- 📊 **Analytics dashboard** with charts (Recharts)
- 💳 **Stripe subscription billing** with plan-based limits
- 📎 **File uploads** via Cloudinary
- 🔍 **Search, filter, pagination**
- 🎨 **Modern UI** with TailwindCSS
- 🐳 **Docker** + GitHub Actions CI/CD

## 📸 Screenshots

### 🔐 Login & Register — Multi-tenant signup
| Login | Register |
|-------|----------|
| ![Login](./screenshots/login.png) | ![Register](./screenshots/register.png) |

### 📊 Dashboard — Overview of tickets and stats
![Dashboard](./screenshots/dashboard.png)

### 🎫 New Ticket — Create and assign
![New Ticket](./screenshots/new-ticket.png)

### 💬 Ticket Detail — Real-time chat + internal notes
![Ticket Detail](./screenshots/ticket-detail.png)

### 📈 Analytics — Performance insights
![Analytics](./screenshots/analytics.png)

### 👥 Agents — Team management
![Agents](./screenshots/agents.png)

### 💳 Billing — Subscription plans
![Billing](./screenshots/billing.png)

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite
- **Redux Toolkit** for state
- **React Router v6** for routing
- **TailwindCSS** for styling
- **Recharts** for charts
- **Socket.io Client** for real-time
- **Axios** with interceptors for auto-refresh tokens

### Backend
- **Node.js** + Express
- **MongoDB** + Mongoose (multi-tenant data model)
- **Redis** + BullMQ for job queues
- **Socket.io** for real-time messaging
- **JWT** with refresh token rotation
- **Zod** for request validation
- **Nodemailer** for emails
- **Stripe** for billing
- **Cloudinary** for file uploads
- **Helmet, CORS, Rate-limit** for security

### DevOps
- **Docker** + docker-compose
- **GitHub Actions** for CI
- **Render** for backend deployment
- **Vercel** for frontend deployment
- **MongoDB Atlas** for cloud database
- **Upstash Redis** for cloud cache

## 🏗️ Architecture

```
┌──────────────┐      ┌───────────────┐      ┌──────────────┐
│  React SPA   │─────▶│  Express API  │─────▶│   MongoDB    │
│  (Vercel)    │◀─────│   (Render)    │◀─────│   (Atlas)    │
└──────────────┘      └───────┬───────┘      └──────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         ┌────▼─────┐   ┌─────▼─────┐   ┌────▼─────┐
         │  Redis   │   │  BullMQ   │   │Socket.io │
         │(Upstash) │   │  Workers  │   │          │
         └──────────┘   └───────────┘   └──────────┘
```

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://cloud.mongodb.com))
- Redis (local, [Memurai](https://memurai.com), or [Upstash](https://upstash.com))
- Gmail account (for SMTP) — optional
- Stripe test account — optional
- Cloudinary account — optional

### 1. Clone the repository
```bash
git clone https://github.com/iamdeveloper17/SupportFlow.git
cd SupportFlow
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend setup
```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

Client will run on `http://localhost:5173`

### 4. Open the app
Navigate to `http://localhost:5173/register` and create your first workspace.

## 🔑 Environment Variables

See `server/.env.example` and `client/.env.example` for the full list. Key variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ |
| `REDIS_URL` | Redis connection string | ✅ |
| `JWT_ACCESS_SECRET` | JWT signing secret (32+ chars) | ✅ |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | ✅ |
| `CLIENT_URL` | Frontend URL for CORS | ✅ |
| `SMTP_*` | Gmail SMTP credentials | Optional |
| `STRIPE_*` | Stripe keys | Optional |
| `CLOUDINARY_*` | Cloudinary keys | Optional |

## 📁 Project Structure

```
SupportFlow/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/                # Axios config
│   │   ├── app/                # Redux store
│   │   ├── features/           # Redux slices
│   │   ├── components/         # UI components
│   │   ├── pages/              # Route pages
│   │   ├── hooks/              # Custom hooks
│   │   └── routes/             # Route guards
│   └── package.json
├── server/                     # Node backend
│   ├── src/
│   │   ├── config/             # DB, Redis, Stripe, Cloudinary
│   │   ├── models/             # Mongoose schemas
│   │   ├── controllers/        # Route handlers
│   │   ├── routes/             # Express routers
│   │   ├── middlewares/        # Auth, RBAC, validation
│   │   ├── services/           # Business logic
│   │   ├── sockets/            # Socket.io setup
│   │   ├── jobs/               # BullMQ queues
│   │   ├── validators/         # Zod schemas
│   │   └── utils/              # Helpers
│   └── server.js
├── screenshots/                # README images
├── docker-compose.yml
└── README.md
```

## 🎯 Roadmap

- [x] Multi-tenancy
- [x] JWT auth + RBAC
- [x] Ticket CRUD
- [x] Real-time chat
- [x] Email notifications
- [x] SLA tracking
- [x] Analytics dashboard
- [x] Stripe billing
- [x] File uploads
- [ ] WhatsApp integration
- [ ] Mobile app (React Native)
- [ ] AI-powered ticket categorization

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a PR.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

## 👨‍💻 Author

**Amit Kumar**

- GitHub: [@iamdeveloper17](https://github.com/iamdeveloper17)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/amit-kumar-9193b0216?utm_source=share_via&utm_content=profile&utm_medium=member_android)
- Email: ramit5752@gmail.com

---

⭐ **If you find this project useful, please give it a star!**