import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'

const app = express()

const isProd = process.env.NODE_ENV === 'production'

const allowedOrigins = process.env.FRONTEND_URL?.split(',') || []

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true) // allow non-browser requests like Postman
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error(`CORS not allowed for origin: ${origin}`))
  },
  credentials: true,
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.get('/isOnline', (req, res) => res.send('Hello From Backend!').status(200))


//import routes
import userAuthRoutes from './routes/userAuth.routes.js'
import imageEditRoutes from './routes/imageEditRoute.js'
import dashboardRoutes from './routes/dashboard.Route.js'
import videoEditRoutes from './routes/videoEditRoute .js'

app.use("/api/auth/", userAuthRoutes)
app.use("/api/image/", imageEditRoutes)
app.use("/api/dashboard/", dashboardRoutes)
app.use("/api/video/", videoEditRoutes)

export { app }