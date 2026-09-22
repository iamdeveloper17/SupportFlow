# 🎫 SupportFlow — Multi-Tenant SaaS Helpdesk

A production-ready, multi-tenant helpdesk platform where companies can manage customer tickets, chat in real-time, and analyze performance — all with subscription-based billing.

![SupportFlow Banner](https://via.placeholder.com/1200x400/2563eb/ffffff?text=SupportFlow)

## 🚀 Live Demo

- **Frontend:** [https://supportflow.vercel.app](https://supportflow.vercel.app)
- **Backend API:** [https://supportflow-api.onrender.com](https://supportflow-api.onrender.com)

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@acme.com | password123 |
| Agent | agent@acme.com | password123 |
| Customer | customer@acme.com | password123 |

## ✨ Features

### Core
- 🏢 **Multi-tenant architecture** — isolated workspaces per company
- 🔐 **JWT auth** with refresh token rotation
- 👥 **Role-based access control** (Super Admin, Admin, Agent, Customer)
- 🎫 **Complete ticket lifecycle** — create, assign, update, resolve
- 💬 **Real-time chat** (Socket.io) with internal notes
- 📎 **File attachments** via Cloudinary
- 📧 **Email notifications** (ticket created, assigned, new reply)
- ⏰ **SLA tracking** with breach alerts (BullMQ + Redis)
- 📊 **Analytics dashboard** with charts (Recharts)
- 💳 **Stripe subscription billing** with plan limits
- 🔍 **Search, filter, pagination**
- 🐳 **Docker** + GitHub Actions CI/CD

## 🛠️ Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router, TailwindCSS, Recharts, Socket.io-client

**Backend:** Node.js, Express, MongoDB (Mongoose), Redis, BullMQ, Socket.io, JWT, Zod, Nodemailer, Stripe, Cloudinary

**DevOps:** Docker, GitHub Actions, Render, Vercel, MongoDB Atlas, Upstash Redis

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  React SPA  │────▶│  Express API │────▶│  MongoDB    │
│  (Vercel)   │◀────│  (Render)    │◀────│  (Atlas)    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌─────▼─────┐      ┌────▼────┐
   │  Redis  │       │  BullMQ   │      │ Socket  │
   │(Upstash)│       │  Workers  │      │   .io   │
   └─────────┘       └───────────┘      └─────────┘
```

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- Stripe account (test mode)
- Cloudinary account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/supportflow.git
cd supportflow
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

### 4. Open
- Client: http://localhost:5173
- API: http://localhost:5000/health

## 🐳 Docker

```bash
docker-compose up -d
```

## 🔑 Environment Variables

See `server/.env.example` and `client/.env.example` for the full list.

## 📁 Project Structure

```
supportflow/
├── server/
│   ├── src/
│   │   ├── config/        # DB, Redis, Cloudinary, Stripe
│   │   ├── models/        # Mongoose schemas
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # Express routers
│   │   ├── middlewares/   # Auth, RBAC, validation
│   │   ├── services/      # Email, business logic
│   │   ├── sockets/       # Socket.io setup
│   │   ├── jobs/          # BullMQ queues & workers
│   │   └── utils/         # Helpers
│   └── server.js
├── client/
│   └── src/
│       ├── api/           # Axios instance
│       ├── app/           # Redux store
│       ├── features/      # Slices (auth, tickets)
│       ├── components/    # Reusable UI
│       ├── pages/         # Route pages
│       ├── hooks/         # Custom hooks
│       └── routes/        # Guards
└── docker-compose.yml
```

## 🎯 Roadmap

- [x] Multi-tenancy
- [x] Auth + RBAC
- [x] Tickets CRUD
- [x] Real-time chat
- [x] Email notifications
- [x] SLA tracking
- [x] Analytics
- [x] Stripe billing
- [x] File uploads
- [ ] WhatsApp integration
- [ ] Mobile app (React Native)

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

## 📄 License

MIT © [Amit Kumar](https://github.com/your-username)

## 👨‍💻 Author

**Amit Kumar**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)
- Email: your_email@gmail.com

---

⭐ If you find this project useful, please give it a star!