# Easy Planner — Backend

> Express.js REST API powering the Easy Planner travel app. Handles authentication, trip management, AI chatbot, city data, and dynamic hotel/restaurant discovery.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Database Schema & Models](#database-schema--models)
4. [API Endpoints](#api-endpoints)
5. [Environment Variables](#environment-variables)
6. [Local Installation & Setup](#local-installation--setup)
7. [How Key Features Work](#how-key-features-work)
8. [Deployment to Render](#deployment-to-render)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 5.x | Web framework |
| MongoDB | Atlas | Database |
| Mongoose | 9.x | ODM / schema layer |
| bcryptjs | 3.x | Password hashing |
| jsonwebtoken | 9.x | JWT authentication |
| dotenv | 17.x | Environment variables |
| cors | 2.x | Cross-origin requests |

AI integrations (optional — fallbacks built in):

- **Groq API** (`llama-3.1-8b-instant`) — primary AI provider, free tier, very fast 
- **OpenAI API** (`gpt-3.5-turbo`) — secondary AI provider, free tier, slower

---

## Project Structure

```
backend/
├── config/
│   ├── db.js            # MongoDB connection via Mongoose
│   └── data.js          # Static data: city costs, nearby places, activities
├── middleware/
│   └── auth.js          # JWT protect middleware
├── models/
│   ├── User.js          # User schema
│   ├── Trip.js          # Trip schema
│   └── Review.js        # Review schema
├── routes/
│   ├── auth.js          # /api/auth — register, login, Google login
│   ├── cities.js        # /api/cities — city list, travel costs, city images
│   ├── trips.js         # /api/trips — CRUD + AI explore endpoint
│   ├── chat.js          # /api/chat — AI chatbot
│   └── reviews.js       # /api/reviews — community reviews
├── .env                 # Environment variables (never commit this)
├── package.json
└── server.js            # Entry point
```

---

## Database Schema & Models

### User

```
users collection
┌─────────────────────────────────────────────────┐
│  Field       │  Type    │  Constraints           │
├──────────────┼──────────┼────────────────────────┤
│  _id         │ ObjectId │ auto-generated          │
│  name        │ String   │ required, trimmed       │
│  email       │ String   │ required, unique, lower │
│  password    │ String   │ required (bcrypt hash)  │
│  createdAt   │ Date     │ auto (timestamps)       │
│  updatedAt   │ Date     │ auto (timestamps)       │
└─────────────────────────────────────────────────┘
```

### Trip

```
trips collection
┌──────────────────────────────────────────────────────────────┐
│  Field        │  Type      │  Constraints                    │
├───────────────┼────────────┼─────────────────────────────────┤
│  _id          │ ObjectId   │ auto-generated                  │
│  userId       │ ObjectId   │ required, ref: 'User'           │
│  source       │ String     │ required                        │
│  destination  │ String     │ required                        │
│  days         │ Number     │ required, min: 1                │
│  startDate    │ Date       │ optional                        │
│  endDate      │ Date       │ optional                        │
│  tripType     │ String     │ enum: Solo/Friends/Family/Prof  │
│  cost.flight  │ Mixed      │ Number or 'N/A'                 │
│  cost.train   │ Mixed      │ Number or 'N/A'                 │
│  cost.bus     │ Mixed      │ Number or 'N/A'                 │
│  places       │ [String]   │ array of attraction names       │
│  activities   │ [String]   │ array of day-wise activities    │
│  createdAt    │ Date       │ auto (timestamps)               │
│  updatedAt    │ Date       │ auto (timestamps)               │
└──────────────────────────────────────────────────────────────┘
```

### Review

```
reviews collection
┌────────────────────────────────────────────────────┐
│  Field        │  Type    │  Constraints            │
├───────────────┼──────────┼─────────────────────────┤
│  _id          │ ObjectId │ auto-generated           │
│  userName     │ String   │ required                 │
│  userInitial  │ String   │ optional                 │
│  rating       │ Number   │ required, min:1, max:5   │
│  text         │ String   │ required                 │
│  tripType     │ String   │ default: 'Traveller'     │
│  createdAt    │ Date     │ auto (timestamps)        │
└────────────────────────────────────────────────────┘
```

### Entity Relationship Diagram

```
┌──────────────┐           ┌──────────────────────┐
│    User      │           │        Trip           │
│──────────────│           │──────────────────────│
│ _id (PK)     │ 1 ──── * │ _id (PK)              │
│ name         │           │ userId (FK → User)    │
│ email        │           │ source                │
│ password     │           │ destination           │
└──────────────┘           │ days                  │
                           │ cost { flight,        │
                           │        train, bus }   │
                           │ places []             │
                           │ activities []         │
                           └──────────────────────┘

┌──────────────┐
│    Review    │   (standalone — not linked to User/Trip)
│──────────────│
│ _id (PK)     │
│ userName     │
│ rating       │
│ text         │
└──────────────┘
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/register` | None | `{ name, email, password }` | `{ token, user }` |
| POST | `/login` | None | `{ email, password }` | `{ token, user }` |
| POST | `/google` | None | `{ name, email }` | `{ token, user }` |

### Cities — `/api/cities`

| Method | Endpoint | Auth | Query Params | Response |
|--------|----------|------|--------------|----------|
| GET | `/` | None | — | `["Mumbai", "Delhi", ...]` |
| GET | `/costs` | None | `from=X&to=Y` | `{ flight, train }` |
| GET | `/image` | None | `city=X` | `{ imageUrl }` |

### Trips — `/api/trips`

All trip routes require Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a new trip (calculates costs + activities) |
| GET | `/` | Get all trips for logged-in user |
| GET | `/:id` | Get a single trip |
| GET | `/:id/explore` | AI-generated hotels & restaurants for trip's destination |
| DELETE | `/:id` | Delete a trip |

### Chat — `/api/chat`

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/` | None | `{ message, history[] }` | `{ reply }` |

### Reviews — `/api/reviews`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | None | Get all reviews |
| POST | `/` | Bearer | Submit a review |

---

## Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/easy_planner
JWT_SECRET=your_long_random_secret_string_here
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxx    


---

## Local Development

### Step 1 — Clone the repository

```bash
git clone https://github.com/yourusername/easy-planner.git
cd easy-planner/backend
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Create your `.env` file

```bash
cp .env.example .env   # or create it manually
```

Fill in your `MONGO_URI` and `JWT_SECRET` at minimum. See Environment Variables section above.

### Step 4 — Start the development server

```bash
npm run dev
```

The server starts on `http://localhost:5000`.

You should see:

```
✅ MongoDB connected: cluster0.xxxxx.mongodb.net
Server running on http://localhost:5000
```

### Step 5 — Test the API

```bash
curl http://localhost:5000/
# → {"message":"Easy Planner API running"}

curl http://localhost:5000/api/cities
# → ["Mumbai","Delhi","Jaipur",...]
```

---

## How Key Features Work

### JWT Authentication Flow

```
Client                          Server
  │                               │
  │── POST /api/auth/login ───────▶│
  │   { email, password }         │ 1. Find user by email
  │                               │ 2. bcrypt.compare(password, hash)
  │◀── { token, user } ───────────│ 3. jwt.sign({ id }, JWT_SECRET, 7d)
  │                               │
  │── GET /api/trips ─────────────▶│
  │   Authorization: Bearer <tok> │ 4. jwt.verify(token)
  │                               │ 5. User.findById(decoded.id)
  │◀── [ trips array ] ───────────│ 6. Attach req.user, call next()
```

### Cost Calculation Logic

```
1. Look up costs['Mumbai-Delhi'] in data.js → { flight: 5000, train: 3000 }
2. If route not found → use costs.default → { flight: 6500, train: 3800 }
3. variance = Math.floor(Math.random() * 400) - 200   // ±200
4. Final: { flight: base + (variance*2), train: base + variance, bus: train*0.7 + variance }
```

### AI Hotel/Restaurant Discovery

```
GET /api/trips/:id/explore

1. Find trip by ID + verify ownership
2. Build system prompt asking for 5 hotels + 5 restaurants as JSON
3. Call Groq/OpenAI with response_format: { type: "json_object" }
4. Parse JSON → return to frontend
5. If no API key → return generateDynamicFallback(city) with template names
6. If API call fails → catch block returns same fallback
```

### Day-wise Activity Generation

```
calculatedDays = date diff OR days field

For day 0 to calculatedDays:
  if day < baseActivities[destination].length:
    use predefined activity (e.g. "Visit the Red Fort")
  else:
    cycle through extraActivities pool
    (e.g. "Explore local markets in {destination}")

Same logic for places[] array.
```

---

## Deployment to Render

### Step 1 — Push code to GitHub

Make sure your backend is in a GitHub repo. Ensure `.env` is in `.gitignore`.

### Step 2 — Create a Render account

Go to https://render.com and sign up (free tier available).

### Step 3 — Create a new Web Service

1. Click **New** → **Web Service**
2. Connect your GitHub account and select your repository
3. Set the following configuration:

| Setting | Value |
|---------|-------|
| Name | `easy-planner-backend` |
| Region | Singapore (closest to India) |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |

### Step 4 — Add Environment Variables

In the Render dashboard → **Environment** tab, add all your `.env` variables:

```
PORT          = (leave blank — Render sets this automatically)
MONGO_URI     = mongodb+srv://...
JWT_SECRET    = your_secret_here
GROQ_API_KEY  = gsk_...
```

> Do NOT set PORT manually. Render injects its own PORT value.

### Step 5 — Fix CORS for production

Before deploying, update `server.js` CORS config:

```js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'   // add your Vercel URL here
  ],
  credentials: true
}))
```

### Step 6 — Deploy

Click **Create Web Service**. Render will:
1. Pull your code from GitHub
2. Run `npm install`
3. Start the server with `node server.js`

Your backend will be live at: `https://easy-planner-backend.onrender.com`

### Step 7 — Verify deployment

```bash
curl https://easy-planner-backend.onrender.com/
# → {"message":"Easy Planner API running"}

curl https://easy-planner-backend.onrender.com/api/cities
# → ["Mumbai","Delhi",...]
```

### Important Render Notes

- **Free tier spins down after 15 minutes of inactivity.** The first request after sleep takes ~30 seconds. Upgrade to a paid plan to avoid this.
- **Auto-deploy is on by default** — every push to `main` triggers a new deployment.
- MongoDB Atlas must allow connections from `0.0.0.0/0` (all IPs) since Render uses dynamic IPs. Go to Atlas → Network Access → Add IP Address → Allow from Anywhere.

---

## Live Backend URL

```
https://easy-planner-backend.onrender.com
```