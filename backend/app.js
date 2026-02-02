import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()


const allowedOrigins = ["https://picxy.netlify.app", "http://localhost:5173"];

app.use(cors({

  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman / server-to-server
    
    if(allowedOrigins.includes(origin)){
      return callback(null,true)
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.get('/isOnline', (req, res) => res.status(200).send('Hello From Backend!'))


//import routes
import userAuthRoutes from './routes/userAuth.routes.js'
import imageEditRoutes from './routes/imageEditRoute.js'
import dashboardRoutes from './routes/dashboard.Route.js'
import videoEditRoutes from './routes/videoEditRoute .js'
import longpollinRoutes from './routes/http-longpoling.js';

app.use("/api/auth/", userAuthRoutes)
app.use("/api/image/", imageEditRoutes)
app.use("/api/dashboard/", dashboardRoutes)
app.use("/api/video/", videoEditRoutes)
app.use("/api", longpollinRoutes)


export { app }