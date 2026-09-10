# ReliefPulse: Intelligent Disaster Victim Assistance & Shelter Management Platform

An intelligent, production-ready full-stack disaster response and shelter management ecosystem powered by **Groq LLaMA 3.1 AI** and built on the **MERN Stack** (MongoDB Atlas, Express.js, React 18, Node.js).

---

## Abstract

Natural disasters such as floods, cyclones, earthquakes, and landslides frequently disrupt communications, damage infrastructure, and isolate vulnerable communities from urgent shelter, food, potable water, and medical aid. Existing disaster management workflows often suffer from fragmented communication between victims, voluntary responders, and shelter administrators, leading to response delays, resource bottlenecks, and inefficient rescue operations.

**ReliefPulse** addresses these challenges by uniting modern web architecture with artificial intelligence into a unified, high-speed disaster management platform. Victims can transmit emergency distress calls with automatic GPS coordinates, query **ReliefPulse AI** for immediate survival actions, and locate authorized safe shelters with real-time bed occupancy meters. Relief agencies and shelter directors can triage incoming distress calls by automated AI priority scores (1-100), adjust shelter vacancies, and broadcast official disaster warnings.

---

## 🚀 Core Tech Stack

- **Frontend**: React 18 + Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Router DOM, Axios, Context API, Dark/Light Mode.
- **Backend**: Node.js, Express.js (MVC Pattern), Mongoose, JWT Authentication, bcryptjs, Express Rate Limiting, CORS, Morgan.
- **AI Integration**: Groq Cloud API with `llama-3.1-8b-instant` / `openai/gpt-oss-20b` fallback, sub-second inference, conversation persistence in MongoDB.
- **Database**: MongoDB Atlas cloud cluster with Mongoose schemas and geospatial indices.

---

## 📁 Project Structure

```
intelligent-disaster-platform/
 ├── client/                         # React 18 + Vite Frontend Application
 │    ├── public/                    # Static public assets
 │    ├── src/
 │    │    ├── components/           # UI Components (Navbar, Footer, AlertBanner, SkeletonLoader, ProtectedRoute)
 │    │    ├── context/              # State Providers (AuthContext, ThemeContext, ChatContext)
 │    │    ├── pages/                # Application Views
 │    │    │    ├── LandingPage.jsx  # 8-section SaaS Landing Page + Interactive AI Demo
 │    │    │    ├── ChatPage.jsx     # ReliefPulse AI Chatbot with History Sidebar
 │    │    │    ├── EmergencyPage.jsx# Victim SOS distress portal with GPS auto-detection
 │    │    │    ├── SheltersPage.jsx # Safe shelter directory with capacity meters
 │    │    │    ├── DashboardPage.jsx# Operations Command Center for Responders
 │    │    │    ├── LoginPage.jsx    # Authentication with quick-fill demo accounts
 │    │    │    └── RegisterPage.jsx # Multi-role registration (Citizen, Volunteer, Shelter Agency)
 │    │    ├── services/             # Axios API Services (auth, chat, emergency, shelter, alert)
 │    │    ├── App.jsx               # Routes & Layout
 │    │    ├── main.jsx              # Application Entry Point
 │    │    └── index.css             # Tailwind Directives & Glassmorphic styling
 │    ├── .env                       # Frontend Environment Configuration
 │    ├── index.html                 # SEO Meta Tags & Google Fonts
 │    ├── package.json
 │    ├── postcss.config.js
 │    ├── tailwind.config.js
 │    └── vite.config.js
 │
 ├── server/                         # Express.js REST API Backend
 │    ├── config/
 │    │    └── db.js                 # MongoDB Atlas Connection
 │    ├── controllers/
 │    │    ├── authController.js     # User registration, login, profile
 │    │    ├── chatController.js     # AI messaging, session history, deletion
 │    │    ├── emergencyController.js# SOS distress creation, AI triage scoring
 │    │    ├── shelterController.js  # Safe shelter locator, capacity manager
 │    │    └── alertController.js    # Warning broadcast & aggregate KPI stats
 │    ├── middleware/
 │    │    ├── authMiddleware.js     # JWT protection & role-based authorization
 │    │    ├── errorMiddleware.js    # Centralized error handler
 │    │    └── rateLimiter.js        # Express rate limiting
 │    ├── models/
 │    │    ├── User.js               # Citizen, Volunteer, Shelter Manager, Admin
 │    │    ├── Chat.js               # Persistent conversation threads
 │    │    ├── EmergencyRequest.js   # Victim distress tickets with AI priority score
 │    │    ├── Shelter.js            # Safe shelters with occupancy and relief stock
 │    │    └── DisasterAlert.js      # Broadcasted early warning notifications
 │    ├── routes/
 │    │    ├── authRoutes.js         # /api/auth
 │    │    ├── chatRoutes.js         # /api/chat
 │    │    ├── emergencyRoutes.js    # /api/emergency
 │    │    ├── shelterRoutes.js      # /api/shelters
 │    │    └── alertRoutes.js        # /api/alerts
 │    ├── services/
 │    │    └── groqService.js        # Groq LLaMA 3.1 client with model resilience
 │    ├── utils/
 │    │    └── seedData.js           # Database seeder with realistic disaster data
 │    ├── .env                       # Server Environment Secrets
 │    ├── package.json
 │    └── server.js                  # Express Server Entry Point
 │
 ├── DEPLOYMENT.md                   # Production deployment guide
 └── README.md                       # Documentation & Setup Instructions
```

---

## 🔑 Environment Configuration

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRE=7d
GROQ_API_KEY=<your-groq-api-key>
GROQ_MODEL=llama-3.1-8b-instant
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🛠️ Local Setup & Run Commands

### 1. Prerequisites
- Node.js (v18 or higher, tested on v24.19.0)
- npm (v9 or higher)

### 2. Backend Setup
```bash
cd server
npm install
node utils/seedData.js    # Seeds demo shelters, users, alerts, and distress records
npm start                # Starts API server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev              # Launches Vite dev server on http://localhost:5173
```

---

## 👥 Demo Credentials for Testing

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin Responder** | `admin@reliefpulse.org` | `Password123!` | Full access to command center, alert broadcasts, triage updates |
| **Volunteer Medic** | `volunteer@reliefpulse.org` | `Password123!` | Access to rescue triage queue, dispatch updates |
| **Citizen / Victim** | `victim@reliefpulse.org` | `Password123!` | Submit SOS distress tickets, chat with AI, track requests |

*(Quick-fill buttons are provided on the Login page for one-click testing).*

---

## 📡 API Reference Overview

- **Auth**:
  - `POST /api/auth/register` - Create account
  - `POST /api/auth/login` - Authenticate user & get JWT
  - `GET /api/user/profile` - Current user profile
- **ReliefPulse AI**:
  - `POST /api/chat/message` - Send disaster question to Groq LLaMA 3.1
  - `GET /api/chat/history` - Retrieve conversation sessions list
  - `GET /api/chat/session/:sessionId` - Retrieve full thread
  - `DELETE /api/chat/session/:sessionId` - Clear session
- **Emergency Distress**:
  - `POST /api/emergency/create` - Submit SOS request with GPS & AI Triage
  - `GET /api/emergency/all` - List requests for response dashboard
  - `GET /api/emergency/my` - List victim's submitted tickets
  - `PUT /api/emergency/:id/status` - Update status (Dispatched, Rescued, Resolved)
- **Shelters**:
  - `GET /api/shelters` - List shelters with search and status filters
  - `GET /api/shelters/nearby?lat=..&lng=..` - Calculate proximity distances
  - `PATCH /api/shelters/:id/occupancy` - Update live capacity
- **Alerts & Analytics**:
  - `GET /api/alerts/active` - Active disaster broadcasts
  - `GET /api/alerts/stats` - Platform-wide KPI metrics
