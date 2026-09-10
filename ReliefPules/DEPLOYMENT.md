# ReliefPulse: Production Deployment Guide

This guide details steps for deploying the ReliefPulse application to production environments.

---

## 1. Architecture Overview
- **Frontend**: Deployed on **Vercel** or **Netlify** (Vite SPA with client-side routing).
- **Backend API**: Deployed on **Render**, **Railway**, or **AWS ECS/EC2** (Node.js/Express).
- **Database**: **MongoDB Atlas** (Managed Cloud Replica Set).
- **AI Service**: **Groq Cloud API** (`llama-3.1-8b-instant`).

---

## 2. Backend Deployment (Render / Railway)

### Using Render
1. Create a **New Web Service** connected to your repository.
2. Configure settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Add Environment Variables in Render Dashboard:
   ```env
   PORT=10000
   NODE_ENV=production
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<strong-random-secret>
   JWT_EXPIRE=7d
   GROQ_API_KEY=<your-groq-api-key>
   GROQ_MODEL=llama-3.1-8b-instant
   CLIENT_URL=https://your-frontend.vercel.app
   ```
4. Deploy the service and copy your public backend URL:
   `https://reliefpulse-api.onrender.com`

---

## 3. Frontend Deployment (Vercel)

### Using Vercel
1. Import your project repository into Vercel.
2. Set configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   ```env
   VITE_API_BASE_URL=https://reliefpulse-api.onrender.com/api
   ```
4. Add SPA Routing rewrite rule in `vercel.json` (inside `client/` if needed):
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
5. Deploy. Your application will be live at `https://reliefpulse.vercel.app`.

---

## 4. Production Checklist
- [x] CORS restricted to authorized frontend domains.
- [x] Rate limiting enabled on AI chat and authentication endpoints.
- [x] MongoDB connection string configured with SSL and retryWrites.
- [x] Password hashing using salt rounds in bcrypt.
- [x] Groq model fallback enabled for high-availability responses during crises.
- [x] Low-bandwidth UI states with loading skeletons and fallback helplines.
