# Easy Planner — Voyara 🗺️

> An intelligent Indian travel planning web app that helps users discover destinations, estimate travel costs, build day-wise itineraries, and find hotels and restaurants — all powered by an AI assistant.

---

## What is Easy Planner?

Easy Planner (branded **Voyara**) is a full-stack travel planning application built for Indian domestic travel. Users can:

- **Explore** Indian cities on an interactive map with real landmark descriptions
- **Plan trips** with source, destination, travel dates, and trip type (Solo / Friends / Family / Professional)
- **Get instant cost estimates** for flights, trains, and buses between city pairs
- **Generate day-wise itineraries** automatically based on how many days you're travelling
- **Discover hotels and restaurants** at the destination, powered by AI
- **Chat with Voyara**, an AI travel assistant, for personalized city suggestions and advice
- **Save and manage** all trip itineraries in one place
- **Review** other travellers' experiences

---

## Live Application

| Service | URL |
|---------|-----|
| Frontend (Vercel) | *Pending Deployment* |
| Backend API (Render) | https://travel-itinerary-401f.onrender.com |

> **Note:** The backend is on Render's free tier and may take ~30 seconds to respond on the first request after a period of inactivity (cold start). Subsequent requests are fast.

---

## Full Stack Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│   React 18 + Vite + Tailwind CSS + React Router v6             │
│   └── Leaflet.js (map)  └── Axios (HTTP)  └── AuthContext      │
└──────────────────────────────┬──────────────────────────────────┘
                               │  HTTPS / REST API
                               │  Authorization: Bearer <JWT>
┌──────────────────────────────▼──────────────────────────────────┐
│                    BACKEND (Node.js / Express)                   │
│                    Deployed on Render                            │
│                                                                 │
│   Routes:  /auth  /cities  /trips  /chat  /reviews             │
│   Middleware: JWT protect, CORS, JSON body parser               │
└──────┬──────────────────────────────────────┬───────────────────┘
       │                                      │
       ▼                                      ▼
┌─────────────┐                    ┌──────────────────────┐
│  MongoDB    │                    │   Groq / OpenAI API  │
│  Atlas      │                    │                      │
│             │                    │  • AI Chatbot        │
│  • users    │                    │  • Hotel/Restaurant  │
│  • trips    │                    │    Discovery         │
│  • reviews  │                    └──────────────────────┘
└─────────────┘
```

---

## Features in Detail

### Interactive Map
A Leaflet.js map centered on India showing 37 cities as clickable markers. Each marker popup shows the city image, top attractions, and a direct "Plan a trip →" button that pre-fills the Planner form.

### Live Travel Cost Estimation
When a user picks source and destination cities, the app instantly fetches transport costs (flight, train, bus) from the backend, adds a small random variance to simulate live pricing, and displays the three options side by side in Indian Rupees.

### AI-Powered Hotel & Restaurant Discovery
When viewing a saved trip, the app calls the backend which asks an AI model (Groq's Llama 3.1 or OpenAI's GPT-3.5) to return 5 real popular hotels and 5 restaurants in the destination city as structured JSON. A fallback system with template-generated names ensures the feature works even without API keys.

### Day-wise Itinerary Generation
Based on the trip duration, the backend assembles a list of activities and nearby places. Predefined curated activities are used first; for longer trips, a pool of 10 generic travel activities fills in the remaining days. The hotel cost calculator dynamically adjusts as users change their stay duration and guest count.

### Voyara AI Chatbot
A floating chat widget available on every page. Backed by Groq (Llama 3.1) or OpenAI, with a system prompt that keeps it focused on Indian travel. Keyword-based fallback responses ensure the chatbot still works without API keys.

### Authentication
Email/password auth with bcrypt password hashing and 7-day JWT sessions. Google OAuth is also supported via a one-click modal.

---

## Project Structure

```
easy-planner/
├── easy_planner/
│   ├── backend/               # Express.js REST API
│   │   ├── config/
│   │   │   ├── db.js          # MongoDB connection
│   │   │   └── data.js        # City costs, places, activities data
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT protect middleware
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Express route handlers
│   │   └── server.js          # Entry point
│   │
│   └── frontend/              # React + Vite SPA
│       ├── src/
│       │   ├── api/           # Axios instance
│       │   ├── components/    # Chatbot, Navbar, Footer
│       │   ├── context/       # AuthContext
│       │   └── pages/         # All page components
│       └── vite.config.js
│
└── README.md              # This file
```

---

## Technology Choices

| Choice | Why |
|--------|-----|
| **Express 5** | Minimal, flexible Node framework; async error handling built in |
| **MongoDB Atlas** | Schema-flexible NoSQL; free tier; hosted with no infrastructure to manage |
| **JWT** | Stateless auth — no session storage needed on the server |
| **Groq API** | Extremely fast inference (100+ tok/sec) on the free tier |
| **Leaflet.js** | Free, no API key required, works perfectly for a static city-pin map |
| **Vite** | Near-instant hot reload; much faster than Create React App |
| **Tailwind CSS 4** | Utility classes keep styling co-located with components |
| **Render + Vercel** | Both have free tiers; Render for Node backends, Vercel for static React |

---

## Setup — Run Locally (Full Stack)

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (free tier at mongodb.com/atlas)
- A Groq API key (free at console.groq.com)

### 1 — Clone the repository

```bash
git clone https://github.com/Mahitha-Allani/Travel-Itinerary.git
cd Travel-Itinerary
```

### 2 — Start the backend

```bash
cd easy_planner/backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/easy_planner
JWT_SECRET=some_long_random_string
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
```

```bash
npm run dev
# ✅ MongoDB connected
# Server running on http://localhost:5000
```

### 3 — Start the frontend

Open a second terminal:

```bash
cd ../frontend
npm install
```

```bash
npm run dev
# App running on http://localhost:5173
```

Open http://localhost:5173 in your browser.

---

## Deployment

### Backend → Render

1. Push `backend/` code to GitHub
2. Go to https://render.com → New Web Service
3. Connect GitHub repo
4. Configure:

| Setting | Value |
|---------|-------|
| Root Directory | `easy_planner/backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |

5. Add environment variables (MONGO_URI, JWT_SECRET, GROQ_API_KEY, GOOGLE_API_KEY, GOOGLE_CX_ID)
6. **Important:** In MongoDB Atlas → Network Access → Add `0.0.0.0/0` (allow all IPs, since Render uses dynamic IPs)
7. Deploy → your API will be at `https://travel-itinerary-401f.onrender.com`

### Frontend → Vercel

1. Push `frontend/` code to GitHub
2. Go to https://vercel.com → Add New Project
3. Connect GitHub repo
4. Configure:

| Setting | Value |
|---------|-------|
| Root Directory | `easy_planner/frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

5. The API URL is hardcoded in `axios.js`, so you do not need to add `VITE_API_URL` to Vercel environment variables anymore!
6. Create `frontend/vercel.json` for React Router:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
7. Deploy → your app will be at `https://easy-planner.vercel.app`

### After Both Are Deployed

Update `easy_planner/backend/server.js` CORS to allow your Vercel domain:

```js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-vercel-app-url.vercel.app'
  ],
  credentials: true
}))
```

Commit and push — Render auto-redeploys.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Defaults to 5000 (Render sets automatically) |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens |
| `GROQ_API_KEY` | Optional | Groq API key for AI features |
| `OPENAI_API_KEY` | Optional | OpenAI fallback if no Groq key |
| `GOOGLE_API_KEY` | Optional | Google Custom Search API key for city images |
| `GOOGLE_CX_ID` | Optional | Google Custom Search Engine ID |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Full URL to the backend API |

---

## API Reference (Quick)

```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login
POST   /api/auth/google       Google OAuth login

GET    /api/cities            List all supported cities
GET    /api/cities/costs      Get travel cost between two cities
GET    /api/cities/image      Get city image URL

POST   /api/trips             Create a new trip
GET    /api/trips             Get all trips for logged-in user
GET    /api/trips/:id         Get single trip details
GET    /api/trips/:id/explore AI hotels & restaurants for trip
DELETE /api/trips/:id         Delete a trip

POST   /api/chat              Send message to AI chatbot

GET    /api/reviews           Get all community reviews
POST   /api/reviews           Submit a review
```

---

## Detailed Documentation

- [Backend README](./backend/README.md) — schemas, all endpoints, auth flow, Render deployment steps
- [Frontend README](./frontend/README.md) — component tree, routing, state management, Vercel deployment steps

---

## Live Deployment Links

| Service | URL |
|---------|-----|
| Frontend | *Pending Deployment* |
| Backend | https://travel-itinerary-401f.onrender.com |
