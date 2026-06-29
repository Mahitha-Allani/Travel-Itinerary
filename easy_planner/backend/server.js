import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import cityRoutes from './routes/cities.js'
import tripRoutes from './routes/trips.js'
import chatRoutes from './routes/chat.js'
import reviewRoutes from './routes/reviews.js'
import imageRoutes from './routes/images.js'
import usersRoutes from './routes/users.js'

const app  = express()
const PORT = process.env.PORT || 5000

connectDB()

const allowedOrigins = [
  'http://localhost:5173',
  'https://travel-itinerary-flame.vercel.app'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app') || 
                      origin.startsWith('http://localhost')
    if (isAllowed) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))

app.use('/api/auth',    authRoutes)
app.use('/api/users',   usersRoutes)
app.use('/api/cities',  cityRoutes)
app.use('/api/trips',   tripRoutes)
app.use('/api/chat',    chatRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/images',  imageRoutes)

app.get('/', (req, res) => res.json({ message: 'Easy Planner API running' }))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
