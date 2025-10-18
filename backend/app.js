import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'

const app = express()

const isProd = process.env.NODE_ENV === 'production'

const allowedOrigins = isProd
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:5173"]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.get('/test', (req, res) => res.json('Hello From Backend!'))


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