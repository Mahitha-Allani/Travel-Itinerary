# Easy Planner — Frontend

> React + Vite frontend for the Easy Planner travel application. A responsive single-page app for planning Indian trips with interactive maps, AI chatbot, cost estimates, and itinerary management.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Pages & Components](#pages--components)
4. [Routing Structure](#routing-structure)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Environment Variables](#environment-variables)
8. [Local Installation & Setup](#local-installation--setup)
9. [How Key Features Work](#how-key-features-work)
10. [Deployment to Vercel](#deployment-to-vercel)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI library |
| Vite | 5.x | Build tool & dev server |
| React Router | 6.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Tailwind CSS | 4.x | Utility-first styling |
| Leaflet.js | 1.9.4 | Interactive map (CDN loaded) |

---

## Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── axios.js          # Axios instance with base URL + auth interceptor
│   ├── components/
│   │   ├── Chatbot.jsx        # Floating AI chatbot widget (global)
│   │   ├── Navbar.jsx         # Top navigation bar
│   │   ├── Footer.jsx         # Page footer
│   │   └── GoogleAuthModal.jsx# Google OAuth popup modal
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state (user, token, login, logout)
│   ├── pages/
│   │   ├── Landing.jsx        # Public home page with hero + reviews
│   │   ├── Login.jsx          # Email login form
│   │   ├── Register.jsx       # Registration form
│   │   ├── Home.jsx           # Dashboard after login
│   │   ├── Planner.jsx        # Trip planning form with live pricing
│   │   ├── Map.jsx            # Interactive India map with city markers
│   │   ├── Itinerary.jsx      # List of all saved trips
│   │   ├── TripDetail.jsx     # Full trip detail + hotels/restaurants
│   │   └── Profile.jsx        # User profile page
│   ├── App.jsx                # Root component with routes
│   ├── main.jsx               # React DOM entry point
│   └── index.css              # Global styles + Tailwind directives
├── index.html                 # HTML shell
├── vite.config.js             # Vite configuration
└── package.json
```

---

## Pages & Components

### Pages

| Page | Route | Auth Required | Description |
|------|-------|---------------|-------------|
| Landing | `/` | No | Hero section, feature highlights, community reviews |
| Login | `/login` | No | Email + password login form |
| Register | `/register` | No | New user registration |
| Home | `/home` | Yes | Dashboard with recent trips and quick actions |
| Planner | `/planner` | Yes | Trip planning form — source/dest, dates, trip type, live pricing |
| Map | `/map` | Yes | Leaflet map with 37 Indian city markers and popups |
| Itinerary | `/itinerary` | Yes | Grid of all saved trips with delete option |
| TripDetail | `/trip/:id` | Yes | Full itinerary, day-wise activities, hotels, restaurants |
| Profile | `/profile` | Yes | User profile and account info |

### Components

| Component | Where Used | Description |
|-----------|-----------|-------------|
| `Chatbot.jsx` | Global (App.jsx) | Fixed floating chat widget, always visible |
| `Navbar.jsx` | All pages | Navigation links + logout button |
| `Footer.jsx` | Most pages | Simple footer with copyright |
| `GoogleAuthModal.jsx` | Login / Register | Google OAuth sign-in popup |

---

## Routing Structure

```
App.jsx
│
├── / ──────────────── Landing       (public)
├── /login ─────────── Login         (public)
├── /register ──────── Register      (public)
│
├── /home ──────────── Home          (PrivateRoute)
├── /planner ───────── Planner       (PrivateRoute)
├── /map ───────────── Map           (PrivateRoute)
├── /itinerary ─────── Itinerary     (PrivateRoute)
├── /trip/:id ──────── TripDetail    (PrivateRoute)
├── /profile ───────── Profile       (PrivateRoute)
│
└── * ──────────────── Redirect to /
│
└── <Chatbot />  ──── rendered outside Routes (always visible)
```

`PrivateRoute` checks `isLoggedIn` from `AuthContext`. If not logged in, redirects to `/`.

---

## State Management

The app uses React's built-in tools — no Redux or Zustand needed.

### AuthContext

Provides global auth state to the entire app:

```
AuthContext
├── user         { id, name, email } or null
├── token        JWT string or null
├── isLoggedIn   boolean
├── login(user, token)   → saves to state + localStorage
└── logout()             → clears state + localStorage
```

Usage in any component:

```jsx
import { useAuth } from '../context/AuthContext'
const { user, isLoggedIn, login, logout } = useAuth()
```

### Local State (per-page)

Each page manages its own state with `useState` and `useEffect`. Examples:

- `Planner.jsx` — `form`, `cost`, `loading`, `error`, `fetchingPrice`
- `TripDetail.jsx` — `trip`, `exploreData`, `stayDays`, `guestsCount`, `roomsCount`, `activeTab`
- `Chatbot.jsx` — `messages`, `input`, `typing`, `open`

---

## API Integration

### Axios Instance (`src/api/axios.js`)

```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

// Automatically attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

Every page imports this `api` instance instead of raw axios. This means:
- The base URL is configured in one place
- Auth headers are attached automatically — no manual header setting needed

### API Calls by Feature

| Feature | Call | Method |
|---------|------|--------|
| Live pricing | `/cities/costs?from=X&to=Y` | GET |
| City list | `/cities` | GET |
| Create trip | `/trips` | POST |
| All trips | `/trips` | GET |
| Trip detail | `/trips/:id` | GET |
| Hotels & restaurants | `/trips/:id/explore` | GET |
| Delete trip | `/trips/:id` | DELETE |
| Chatbot | `/chat` | POST |
| Reviews | `/reviews` | GET/POST |

---

## Environment Variables

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

For production (Vercel), set:

```env
VITE_API_URL=https://easy-planner-backend.onrender.com/api
```

**Important:** All Vite environment variables must start with `VITE_` to be accessible in the browser.

---

## Local Installation & Setup

### Prerequisites

- Node.js 18 or higher — https://nodejs.org
- The backend server must be running locally (see backend README)

### Step 1 — Navigate to frontend folder

```bash
cd easy-planner/frontend
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Create `.env` file

```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Step 4 — Start the dev server

```bash
npm run dev
```

The app opens at `http://localhost:5173`.

### Step 5 — Build for production

```bash
npm run build
```

This creates a `dist/` folder with the optimized static build.

### Step 6 — Preview production build locally

```bash
npm run preview
```

---

## How Key Features Work

### Live Pricing on Planner Page

```
User selects source + destination
         ↓
useEffect watches [form.source, form.destination]
         ↓
GET /api/cities/costs?from=Mumbai&to=Delhi
         ↓
Backend returns { flight: 5000, train: 3000 }
         ↓
Frontend adds client-side variance:
  variance = Math.floor(Math.random() * 400) - 200
  cost = { flight: data.flight + (variance*2),
           train: data.train + variance,
           bus: Math.floor(data.train * 0.7) + variance }
         ↓
Displayed as ₹4,800  ₹2,900  ₹1,900
(updates every time city selection changes)
```

### Interactive Map (Leaflet)

```
Map.jsx mounts
    ↓
useEffect runs once
    ↓
<link> for Leaflet CSS injected into document.head
<script> for Leaflet JS injected into document.head
    ↓
script.onload fires
    ↓
L.map(mapRef.current).setView([22, 80], 5)
L.tileLayer(OpenStreetMap URL).addTo(map)
    ↓
For each of 37 cities:
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(HTML with city image + "Plan a trip →" link)
    ↓
City grid buttons below map:
  onClick → navigate(`/planner?dest=${city.name}`)
```

### Chatbot Widget

```
User opens chat → setOpen(true)
User types message → handleSend()
    ↓
1. Append user message to messages[] (optimistic UI)
2. setTyping(true) → shows animated dots
3. POST /api/chat { message, history: messages }
4. Backend returns { reply }
5. Append assistant reply to messages[]
6. setTyping(false)

Auto-scroll: useEffect on [messages, typing]
  → endRef.current.scrollIntoView({ behavior: 'smooth' })
```

### Hotel Cost Calculator in TripDetail

```
exploreData.hotels loaded from GET /trips/:id/explore
    ↓
Each hotel card shows:
  basePrice × stayDays × roomsCount = estimated total

State:
  stayDays    → initialized to trip.days, user can adjust
  guestsCount → user adjusts slider
  roomsCount  → auto-calculated: Math.ceil(guests / 2)

useEffect watches guestsCount → updates roomsCount
useEffect watches stayDays / roomsCount → recalculates total per hotel
```

---

## Deployment to Vercel

### Step 1 — Push frontend code to GitHub

Make sure the `frontend/` folder is in your GitHub repository.

### Step 2 — Create a Vercel account

Go to https://vercel.com and sign up (free tier is sufficient).

### Step 3 — Import your project

1. Click **Add New Project**
2. Connect GitHub and select your repository
3. Set the configuration:

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Step 4 — Add Environment Variables

In the Vercel dashboard → **Settings** → **Environment Variables**, add:

```
VITE_API_URL = https://easy-planner-backend.onrender.com/api
```

Make sure to add it for all three environments: Production, Preview, Development.

### Step 5 — Deploy

Click **Deploy**. Vercel will:
1. Pull your code
2. Run `npm install`
3. Run `npm run build` (creates `dist/`)
4. Serve the static files globally via Vercel's CDN

Your frontend will be live at: `https://easy-planner.vercel.app`

### Step 6 — Fix React Router on Vercel

React Router uses client-side routing. Vercel needs to redirect all routes to `index.html`. Create a `vercel.json` file inside the `frontend/` folder:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Commit and push this file. Without it, refreshing a page like `/itinerary` will return a 404.

### Step 7 — Update backend CORS

After you get your Vercel URL, go back to `backend/server.js` and add it to the CORS origin:

```js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://easy-planner.vercel.app'
  ],
  credentials: true
}))
```

Redeploy the backend on Render after this change.

### Step 8 — Verify end-to-end

Open your Vercel URL → register a new account → create a trip → everything should work via the Render backend.

---

## Live Frontend URL

```
https://easy-planner.vercel.app
```